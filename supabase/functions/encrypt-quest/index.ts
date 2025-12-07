import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const runtime = "edge";

export async function GET() {
  const supabase = createServerSupabase();
  try {
    const { data } = await supabase.from('events').select('user_id, created_at');
    // compute unique users per day
    const map: Record<string, Set<string>> = {};
    (data||[]).forEach((r:any) => {
      const day = r.created_at.slice(0,10);
      map[day] = map[day] ?? new Set();
      map[day].add(r.user_id);
    });
    const arr = Object.keys(map).sort().map(d => ({ day: d, dau: map[d].size }));
    return NextResponse.json({ dau: arr });
  } catch (e:any) {
    return NextResponse.json({ error: e.message ?? String(e) }, { status: 500 });
  }
}import OpenPGP from 'openpgp';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function handler(req: Request) {
  const userId = req.headers.get('x-user-id');
  if (!userId) return new Response('Unauthorized', { status: 401 });

  const { data: quests } = await supabase
    .from('quests')
    .select('*')
    .limit(3);

  const publicKeyArmored = process.env.NEXT_PUBLIC_GPG_PUBLIC_KEY!;
  const publicKey = await OpenPGP.readKey({ armoredKey: publicKeyArmored });

  const encryptedQuests = [];
  for (const q of quests) {
    const message = await OpenPGP.createMessage({ text: JSON.stringify(q) });
    const encrypted = await OpenPGP.encrypt({ message, encryptionKeys: publicKey });
    encryptedQuests.push(encrypted);
  }

  return new Response(JSON.stringify({ quests: encryptedQuests }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const runtime = "edge";

export async function GET() {
  const supabase = createServerSupabase();
  try {
    const { data } = await supabase.from('analytics_weekly_cohort').select('*').order('cohort_week', {ascending:false}).limit(200);
    return NextResponse.json({ cohorts: data });
  } catch (e:any) {
    return NextResponse.json({ error: e.message ?? String(e) }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const runtime = "edge";

export async function GET() {
  const supabase = createServerSupabase();
  try {
    const { data } = await supabase.from('profiles').select('id, username, xp, current_streak, last_learning_date').order('xp', { ascending: false }).limit(100);
    return NextResponse.json({ top: data });
  } catch (e:any) {
    return NextResponse.json({ error: e.message ?? String(e) }, { status: 500 });
  }
}
// Beispiel: beim Quest Complete (Edge function)
await supabase.from('events').insert([
  { user_id: user.id, event_type: 'quest_completed', meta: { quest_id, xp_gain }, created_at: new Date().toISOString() }
]);
ALTER TABLE profiles ADD COLUMN role TEXT DEFAULT 'user';
'use client';
import { useEffect, useState } from 'react';
import { useSupabase } from '../lib/supabase-client';

export default function DailyQuests() {
  const { supabase, user } = useSupabase();
  const [quests, setQuests] = useState<string[]>([]);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    async function fetchQuests() {
      const res = await fetch('/api/encrypt-quest', {
        headers: { 'x-user-id': user?.id! }
      });
      const data = await res.json();
      setQuests(data.quests);
    }
    if (user) fetchQuests();
  }, [user]);

  const completeQuest = async (index: number) => {
    await supabase.from('profiles').update({
      xp: xp + 10,
      current_streak: streak + 1,
      last_learning_date: new Date()
    }).eq('id', user?.id);

    setQuests(prev => prev.filter((_, i) => i !== index));
    setXp(xp + 10);
    setStreak(streak + 1);
  };

  return (
    <div className="p-4">
      <div className="flex justify-end mb-4">Streak: {streak} | XP: {xp}</div>
      {quests.map((q, i) => (
        <div key={i} className="p-4 mb-2 border rounded flex justify-between items-center">
          <span>Quest {i + 1}</span>
          <button onClick={() => completeQuest(i)} className="bg-blue-500 text-white px-3 py-1 rounded">
            Complete
          </button>
        </div>
      ))}
      {quests.length === 0 && <p>Alle Quests abgeschlossen!</p>}
    </div>
  );
}