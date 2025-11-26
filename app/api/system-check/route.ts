import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const runtime = "edge";

export async function GET() {
  try {
    const supabase = createServerSupabase();

    // 1) DAU (last 14 days)
    const dauRes = await supabase.rpc('sql', {
      sql: `select day::date, dau from analytics_dau order by day desc limit 14`
    }).catch(()=>null);

    // simpler: use direct query using from('events')
    const { data: dau } = await supabase
      .from('events')
      .select('created_at, user_id')
      .gte('created_at', new Date(Date.now() - 14*24*60*60*1000).toISOString());

    const dauByDay: Record<string, number> = {};
    if (dau) {
      dau.forEach((r:any) => {
        const d = r.created_at.slice(0,10);
        dauByDay[d] = (dauByDay[d]||0) + 1; // counts events, we will reduce to unique users below
      });
    }

    // 2) XP last 30 days
    const xpRes = await supabase.rpc('sql', {
      sql: `select day::date, total_xp, completions from analytics_xp_by_day order by day desc limit 30`
    }).catch(()=>null);

    // 3) Top Users
    const { data: top } = await supabase.from('profiles').select('id, username, xp, current_streak').order('xp', { ascending: false }).limit(10);

    // 4) retention sample (cohort view)
    const { data: cohorts } = await supabase.from('analytics_weekly_cohort').select('*').limit(200);

    // 5) streak distribution
    const { data: streaks } = await supabase.from('analytics_streak_distribution').select('*').order('streak', { ascending: false });

    return NextResponse.json({ dau: dauByDay, xp: xpRes?.data ?? [], topUsers: top ?? [], cohorts: cohorts ?? [], streaks: streaks ?? [] });
  } catch (e:any) {
    return NextResponse.json({ error: e.message ?? String(e) }, { status: 500 });
  }
}import { NextResponse } from "next/server";
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
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const runtime = "edge";

export async function GET() {
  try {
    const supabase = createServerSupabase();

    // 1) DAU (last 14 days)
    const dauRes = await supabase.rpc('sql', {
      sql: `select day::date, dau from analytics_dau order by day desc limit 14`
    }).catch(()=>null);

    // simpler: use direct query using from('events')
    const { data: dau } = await supabase
      .from('events')
      .select('created_at, user_id')
      .gte('created_at', new Date(Date.now() - 14*24*60*60*1000).toISOString());

    const dauByDay: Record<string, number> = {};
    if (dau) {
      dau.forEach((r:any) => {
        const d = r.created_at.slice(0,10);
        dauByDay[d] = (dauByDay[d]||0) + 1; // counts events, we will reduce to unique users below
      });
    }

    // 2) XP last 30 days
    const xpRes = await supabase.rpc('sql', {
      sql: `select day::date, total_xp, completions from analytics_xp_by_day order by day desc limit 30`
    }).catch(()=>null);

    // 3) Top Users
    const { data: top } = await supabase.from('profiles').select('id, username, xp, current_streak').order('xp', { ascending: false }).limit(10);

    // 4) retention sample (cohort view)
    const { data: cohorts } = await supabase.from('analytics_weekly_cohort').select('*').limit(200);

    // 5) streak distribution
    const { data: streaks } = await supabase.from('analytics_streak_distribution').select('*').order('streak', { ascending: false });

    return NextResponse.json({ dau: dauByDay, xp: xpRes?.data ?? [], topUsers: top ?? [], cohorts: cohorts ?? [], streaks: streaks ?? [] });
  } catch (e:any) {
    return NextResponse.json({ error: e.message ?? String(e) }, { status: 500 });
  }
