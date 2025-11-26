"use client";

import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import clsx from "clsx";

const checklist = [
  { id: "auth", label: "Supabase Auth funktioniert" },
  { id: "rls", label: "Row Level Security aktiv" },
  { id: "profiles", label: "Profiles Tabelle korrekt" },
  { id: "quests", label: "Quests Tabelle korrekt" },
  { id: "daily-api", label: "/api/daily-quests gibt 3 Quests zurück" },
  { id: "complete-api", label: "/api/complete-quest aktualisiert XP & Streak" },
  { id: "encrypt", label: "PGP-Verschlüsselung aktiv" },
  { id: "frontend", label: "Daily Quests rendern im Frontend" },
  { id: "streak", label: "Streak oben rechts wird angezeigt" },
  { id: "xp", label: "XP-Bar animiert korrekt" },
  { id: "translate", label: "/api/translate funktioniert" },
  { id: "env", label: ".env Keys vollständig" },
  { id: "deployment", label: "Vercel Deployment OK" },
];

export default function GoLiveAdminPage() {
  const [status, setStatus] = useState<Record<string, boolean>>({});

  const toggle = (id: string) =>
    setStatus((s) => ({ ...s, [id]: !s[id] }));

  const allCompleted = Object.keys(status).length === checklist.length &&
                       Object.values(status).every(Boolean);

  return (
    <div className="p-6 max-w-2xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-4">Go-Live Dashboard</h1>

      <div className="space-y-3">
        {checklist.map((item) => {
          const done = status[item.id];
          return (
            <div
              key={item.id}
              className={clsx(
                "flex items-center justify-between p-4 rounded-md cursor-pointer",
                done ? "bg-green-700" : "bg-gray-800"
              )}
              onClick={() => toggle(item.id)}
            >
              <span className="text-lg">{item.label}</span>
              {done ? (
                <CheckCircle className="text-green-300" />
              ) : (
                <XCircle className="text-red-300" />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 rounded-md text-center text-xl font-bold 
        bg-gray-900 border border-gray-700">
        {allCompleted ? (
          <span className="text-green-400">🔥 PunjabiQuest ist bereit für den Go-Live!</span>
        ) : (
          <span className="text-yellow-400">🔍 Noch nicht vollständig. Bitte alle Punkte prüfen.</span>
        )}
      </div>
    </div>
  );
}