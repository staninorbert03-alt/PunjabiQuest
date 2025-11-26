import { NextRequest, NextResponse } from "next/server";
export const runtime = "edge";

type ReqBody = { text: string; from?: string; to?: string };

const OPENAI_URL = "https://api.openai.com/v1/responses";
const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

async function callOpenAI(prompt: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY fehlt in env");

  const body = { model: OPENAI_MODEL, input: [{ role: "system", content: "Du bist ein präziser Übersetzer. Antworte nur mit einem validen JSON-Objekt." }, { role: "user", content: prompt }], temperature: 0.0, max_output_tokens: 800 };

  const res = await fetch(OPENAI_URL, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` }, body: JSON.stringify(body) });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`OpenAI Fehler ${res.status}: ${txt}`);
  }
  return res.json();
}

function buildPrompt(text: string, from: string, to: string) {
  return `
Übersetze den folgenden Text von ${from} nach ${to}.

Text: """${text}"""

Wenn Ziel Punjabi (pa): gib genau das folgende JSON zurück:
{
  "translatedText": "<Übersetzung in Punjabi (Gurmukhi empfohlen)>",
  "gurmukhi": "<Gurmukhi>",
  "transliteration": "<lateinische Transliteration>",
  "confidence": 0.0
}

Wenn anderes Ziel: gib:
{
  "translatedText": "<Übersetzung>",
  "gurmukhi": null,
  "transliteration": null,
  "confidence": 0.0
}

Antwort: NUR das JSON-Objekt.
`;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ReqBody;
    if (!body?.text) return NextResponse.json({ error: "Missing text" }, { status: 400 });
    const from = body.from ?? "de";
    const to = body.to ?? "pa";

    const prompt = buildPrompt(body.text, from, to);
    const openai = await callOpenAI(prompt);

    // extract candidate text
    let assistantText = "";
    if (openai.output_text) assistantText = openai.output_text;
    else if (Array.isArray(openai.output) && openai.output.length) {
      const out = openai.output[0];
      if (typeof out === "string") assistantText = out;
      else if (Array.isArray(out.content)) {
        const block = out.content.find((c:any)=>c.type === "output_text" || c.type === "message" || c.type === "text");
        assistantText = block?.text ?? JSON.stringify(out);
      } else assistantText = JSON.stringify(out);
    } else if (Array.isArray(openai.items) && openai.items.length) {
      assistantText = openai.items[0].text ?? JSON.stringify(openai.items[0]);
    } else {
      assistantText = JSON.stringify(openai);
    }

    const cleaned = assistantText.trim().replace(/^```(?:json)?\\n?/, "").replace(/\\n?```$/, "");
    let parsed;
    try { parsed = JSON.parse(cleaned); } catch (e) {
      const first = cleaned.indexOf("{"); const last = cleaned.lastIndexOf("}");
      if (first >=0 && last > first) parsed = JSON.parse(cleaned.slice(first, last+1));
      else throw new Error("Failed to parse model output as JSON: " + cleaned);
    }

    const out = {
      sourceText: body.text,
      sourceLanguage: from,
      targetLanguage: to,
      translatedText: parsed.translatedText ?? null,
      gurmukhi: parsed.gurmukhi ?? null,
      transliteration: parsed.transliteration ?? null,
      confidence: typeof parsed.confidence === "number" ? parsed.confidence : null
    };

    return NextResponse.json(out);
  } catch (err:any) {
    console.error("translate error:", err);
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}