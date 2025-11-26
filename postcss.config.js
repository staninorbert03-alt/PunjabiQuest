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
html, body {
  height: 100%;
  width: 100%;
  overscroll-behavior: none;
}

@media (max-width: 600px) {
  .quest-card {
    padding: 14px;
    font-size: 16px;
  }

  .top-bar {
    padding: 10px;
    height: 50px;
  }

  .xp-bar {
    height: 8px;
  }
}
export function MobileQuestCard({ quest, onComplete }) {
  return (
    <div className="quest-card bg-neutral-800 text-white rounded-lg p-4 shadow-lg">
      <h2 className="font-semibold text-lg mb-2">{quest.title}</h2>
      <p className="opacity-80 mb-3">{quest.description}</p>
      <button
        onClick={onComplete}
        className="w-full bg-green-600 hover:bg-green-700 py-2 rounded-lg mt-2"
      >
        Abschließen
      </button>
    </div>
  );
}