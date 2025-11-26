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