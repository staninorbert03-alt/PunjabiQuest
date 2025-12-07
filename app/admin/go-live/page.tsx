"use client";

import { useEffect, useState } from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

export default function AnalyticsPage() {
  const [overview, setOverview] = useState<any>(null);
  const [dau, setDau] = useState<any[]>([]);
  const [topUsers, setTopUsers] = useState<any[]>([]);
  const [streaks, setStreaks] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/analytics/overview");
      const json = await res.json();
      setOverview(json);
      // if dau returned as object
      if (json?.dau) {
        const arr = Object.keys(json.dau).sort().map(k => ({ day: k, dau: json.dau[k] }));
        setDau(arr);
      }
      setTopUsers(json?.topUsers ?? []);
      setStreaks(json?.streaks ?? []);
    }
    load();
  }, []);

  // DAU chart
  const dauLabels = dau.map(d => d.day);
  const dauData = dau.map(d => d.dau);

  // XP chart (if overview.xp available)
  const xpLabels = (overview?.xp ?? []).map((r:any) => r.day).reverse();
  const xpData = (overview?.xp ?? []).map((r:any) => r.total_xp).reverse();

  // Streak pie
  const streakLabels = streaks.map((s:any)=> String(s.streak));
  const streakValues = streaks.map((s:any)=> s.users);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-white rounded shadow">
          <h2 className="font-semibold mb-2">DAU (letzte Tage)</h2>
          <Line data={{
            labels: dauLabels,
            datasets: [{ label: 'DAU', data: dauData, fill: true }]
          }} />
        </div>

        <div className="p-4 bg-white rounded shadow">
          <h2 className="font-semibold mb-2">XP (letzte 30 Tage)</h2>
          <Bar data={{
            labels: xpLabels,
            datasets: [{ label: 'Total XP', data: xpData }]
          }} />
        </div>

        <div className="p-4 bg-white rounded shadow">
          <h2 className="font-semibold mb-2">Streak Verteilung</h2>
          <Pie data={{ labels: streakLabels, datasets: [{ data: streakValues }] }} />
        </div>

        <div className="p-4 bg-white rounded shadow">
          <h2 className="font-semibold mb-2">Top Nutzer</h2>
          <div className="space-y-2">
            {topUsers.map((u:any,i:number)=>(
              <div key={u.id} className="flex justify-between border-b pb-2">
                <div>
                  <div className="font-semibold">{i+1}. {u.username ?? '—'}</div>
                  <div className="text-sm text-gray-500">Streak: {u.current_streak} • Letzte Aktivität: {u.last_learning_date ?? '—'}</div>
                </div>
                <div className="font-bold">{u.xp} XP</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Retention / Cohorts (simple table) */}
      <div className="mt-6 bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-2">Retention (Weekly cohorts)</h2>
        <pre className="text-xs">{JSON.stringify(overview?.cohorts?.slice(0,20), null, 2)}</pre>
      </div>
    </div>
  );
}use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function GoLivePage() {
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const r = await fetch("/api/system-check");
      const data = await r.json();
      setChecks(data);
      setLoading(false);
    }
    load();
  }, []);

  const allOk = Object.values(checks).every(Boolean);

  return (
    <div className="p-4 max-w-xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-4 text-center">
        PunjabiQuest Go-Live Status
      </h1>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-blue-400" size={48} />
        </div>
      ) : (
        <div className="space-y-3">
          {Object.entries(checks).map(([id, ok]) => (
            <div
              key={id}
              className={clsx(
                "p-4 rounded-lg flex justify-between items-center",
                ok ? "bg-green-800" : "bg-red-800"
              )}
            >
              <span className="text-lg">{id.replace(/_/g, " ")}</span>
              {ok ? (
                <CheckCircle className="text-green-300" />
              ) : (
                <XCircle className="text-red-300" />
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 text-center rounded-lg bg-gray-900 border border-gray-700">
        {allOk ? (
          <p className="text-green-400 text-xl font-bold">
            🔥 PunjabiQuest ist bereit für den GO-LIVE!
          </p>
        ) : (
          <p className="text-yellow-400 text-xl font-bold">
            ⚠️ Einige Komponenten müssen noch geprüft werden.
          </p>
        )}
      </div>
    </div>
  );
}
export default function Denied() {
  return (
    <div className="p-10 text-center text-red-400 text-2xl">
      ❌ Zugriff verweigert – Admin Rechte erforderlich.
    </div>
  );
}