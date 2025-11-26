import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const results: Record<string, boolean> = {};

  // Check 1: Supabase DB erreichbar?
  try {
    const { data, error } = await supabase.from("profiles").select("id").limit(1);
    results.supabase = !error;
  } catch {
    results.supabase = false;
  }

  // Check 2: Tabellen existieren?
  const requiredTables = ["profiles", "daily_quests", "quest_completions"];
  for (const table of requiredTables) {
    try {
      const { error } = await supabase.from(table).select("id").limit(1);
      results[`table_${table}`] = !error;
    } catch {
      results[`table_${table}`] = false;
    }
  }

  // Check 3: Daily-Quests API
  try {
    const r = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/daily-quests`);
    const json = await r.json();
    results.daily_quests_api = json.quests?.length === 3;
  } catch {
    results.daily_quests_api = false;
  }

  // Check 4: Complete-Quest API
  try {
    const r = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/complete-quest`, {
      method: "POST",
    });
    results.complete_quest_api = r.status === 200;
  } catch {
    results.complete_quest_api = false;
  }

  // Check 5: Encryption aktiv?
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/encrypt-quest`);
    const data = await res.json();
    const sample = data.quests?.[0] ?? "";
    results.encryption = sample.includes("BEGIN PGP MESSAGE");
  } catch {
    results.encryption = false;
  }

  // Check 6: OpenAI erreichbar?
  try {
    const r = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/translate`, {
      method: "POST",
      body: JSON.stringify({ text: "Hallo", target: "pa" }),
    });
    results.openai = r.status === 200;
  } catch {
    results.openai = false;
  }

  return NextResponse.json(results);
}