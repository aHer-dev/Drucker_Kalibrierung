export default function ArrowBtn({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="p-2 bg-stone-100 hover:bg-stone-300 active:bg-stone-400 rounded text-stone-700 flex items-center justify-center text-xs font-medium font-mono transition"
    >
      {children}
    </button>
  );
}
