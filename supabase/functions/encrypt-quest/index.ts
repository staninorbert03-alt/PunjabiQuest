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