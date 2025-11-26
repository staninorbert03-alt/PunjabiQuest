"use client";

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