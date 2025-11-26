export function MobileQuestCard({ quest, onComplete }) {
  return (
    <div className="quest-card mb-4 shadow-lg">
      <h2 className="text-lg font-semibold">{quest.title}</h2>
      <p className="text-sm opacity-70 mb-3">{quest.description}</p>

      <button
        onClick={onComplete}
        className="w-full bg-green-600 hover:bg-green-700 py-2 rounded-lg mt-2"
      >
        Abschließen
      </button>
    </div>
  );
}