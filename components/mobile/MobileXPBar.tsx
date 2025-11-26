export function MobileXPBar({ xp, nextLevel }: { xp: number; nextLevel: number }) {
  const pct = Math.min(100, Math.round((xp / nextLevel) * 100));

  return (
    <div className="w-full mt-4">
      <div className="flex justify-between text-xs text-gray-300 mb-1">
        <span>XP</span>
        <span>{xp} / {nextLevel}</span>
      </div>

      <div className="xp-bar">
        <div className="xp-bar-fill" style={{ width: pct + "%" }} />
      </div>
    </div>
  );
}