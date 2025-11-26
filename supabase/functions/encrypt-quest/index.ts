import OpenPGP from 'openpgp';
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