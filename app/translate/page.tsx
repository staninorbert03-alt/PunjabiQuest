"use client";

import { useState } from "react";

export default function TranslatorPage() {
  const [input, setInput] = useState("");
  const [out, setOut] = useState<any>(null);

  async function translate() {
    const r = await fetch("/api/translate", {
      method: "POST",
      body: JSON.stringify({ text: input, target: "pa" }),
    });
    const json = await r.json();
    setOut(json);
  }

  return (
    <div className="p-4 pb-20 text-white">
      <h2 className="text-2xl mb-4 font-bold">Dolmetscher</h2>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full bg-neutral-800 p-3 rounded-lg h-28"
        placeholder="Text eingeben…"
      />

      <button
        onClick={translate}
        className="w-full bg-green-600 py-3 rounded-lg mt-3"
      >
        Übersetzen
      </button>

      {out && (
        <div className="mt-6 p-4 bg-neutral-900 rounded-lg">
          <p className="text-gray-300 mb-1">Gurmukhi:</p>
          <p className="text-xl mb-3">{out.gurmukhi}</p>

          <p className="text-gray-300 mb-1">Transliteration:</p>
          <p className="text-lg mb-3 opacity-80">{out.translit}</p>

          <p className="text-gray-300 mb-1">Deutsch/Punjabi:</p>
          <p className="text-lg">{out.output}</p>
        </div>
      )}
    </div>
  );
}