module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
export function MobileHeader({ streak }: { streak: number }) {
  return (
    <div className="top-bar flex justify-between items-center bg-neutral-900 text-white px-4 py-3 shadow-md">
      <h1 className="font-bold text-xl">PunjabiQuest</h1>
      <div className="flex items-center gap-2">
        <span className="text-yellow-400 font-bold">{streak}🔥</span>
      </div>
    </div>
  );
}
