const round1 = (n) => Math.round(n * 10) / 10;

export default function CalRow({ label, unit, value, step, onChange }) {
  return (
    <div>
      <label className="text-xs text-stone-600 mb-1 flex justify-between">
        <span>{label}</span>
        <span className="font-mono text-stone-900 font-medium">{value} {unit}</span>
      </label>
      <div className="flex gap-1">
        <button
          onClick={() => onChange(round1(value - step))}
          className="px-2.5 bg-stone-100 hover:bg-stone-200 rounded text-sm transition font-medium text-stone-600"
        >−</button>
        <input
          type="number"
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="flex-1 p-1.5 border border-stone-300 rounded text-sm font-mono text-center w-full"
        />
        <button
          onClick={() => onChange(round1(value + step))}
          className="px-2.5 bg-stone-100 hover:bg-stone-200 rounded text-sm transition font-medium text-stone-600"
        >+</button>
      </div>
    </div>
  );
}
