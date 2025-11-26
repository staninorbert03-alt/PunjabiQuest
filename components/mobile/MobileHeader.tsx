export function MobileHeader({ streak }: { streak: number }) {
  return (
    <div className="w-full h-14 bg-neutral-900 text-white flex justify-between items-center px-4 shadow-lg">
      <h1 className="font-bold text-xl">PunjabiQuest</h1>
      <div className="flex items-center gap-2 text-yellow-400">
        <span className="font-bold text-lg">{streak}</span>
        <span className="text-xl">🔥</span>
      </div>
    </div>
  );
}