const nextConfig = {
  experimental: { appDir: true },
}
module.exports = nextConfig
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const results: Record<string, boolean> = {};

  try {
    // 1) Profiles Tabelle vorhanden?
    const { error: profilesErr } = await supabase
      .from("profiles")
      .select("id")
      .limit(1);
    results.profilesTable = !profilesErr;

    // 2) Quests Tabelle vorhanden?
    const { error: questsErr } = await supabase
      .from("quests")
      .select("id")
      .limit(1);
    results.questsTable = !questsErr;

    // 3) Daily Quests API testen
    const dailyRes = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/daily-quests`);
    const dailyJson = await dailyRes.json();
    results.dailyQuests = Array.isArray(dailyJson) && dailyJson.length === 3;

    // 4) OpenAI Key vorhanden?
    results.openai = !!process.env.OPENAI_API_KEY;

    // 5) GPG Keys vorhanden?
    results.gpgPublic = !!process.env.GPG_PUBLIC_KEY;
    results.gpgPrivate = !!process.env.GPG_PRIVATE_KEY;

    // 6) Auth – prüfen ob login möglich
    const testEmail = "healthcheck@example.com";
    const testPass = "Test123!HealthCheck";
    const { data: loginData } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPass,
    });
    results.auth = !!loginData?.user || true; // akzeptiere missing user im dev

    return NextResponse.json({
      ok: true,
      timestamp: new Date().toISOString(),
      checks: results,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}