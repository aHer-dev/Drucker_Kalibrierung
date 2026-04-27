import { RotateCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import CalRow from './CalRow';
import ArrowBtn from './ArrowBtn';

const round1 = (n) => Math.round(n * 10) / 10;

export default function KalibrierungPanel({ kal, setKal, reset }) {
  return (
    <section className="no-print lg:col-span-3 bg-white border border-stone-200 rounded-lg p-5 space-y-5 self-start">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-[11px] uppercase tracking-[0.15em] text-stone-500 font-semibold">
            Kalibrierung
          </h2>
          <button
            onClick={reset}
            className="text-[11px] text-stone-500 hover:text-stone-900 flex items-center gap-1 transition"
          >
            <RotateCcw size={11} /> Reset
          </button>
        </div>

        <div className="space-y-3">
          <CalRow label="Linker Rand" unit="mm" value={kal.offsetX} step={0.5} onChange={(v) => setKal({ ...kal, offsetX: v })} />
          <CalRow label="Erste Zeile von oben" unit="mm" value={kal.offsetY} step={0.5} onChange={(v) => setKal({ ...kal, offsetY: v })} />
          <CalRow label="Zeilenabstand" unit="mm" value={kal.zeilenhoehe} step={0.1} onChange={(v) => setKal({ ...kal, zeilenhoehe: v })} />
          <CalRow label="Schriftgröße" unit="pt" value={kal.schriftgroesse} step={0.5} onChange={(v) => setKal({ ...kal, schriftgroesse: v })} />

          <div>
            <label className="text-xs text-stone-600 mb-1 block">Schriftart</label>
            <select
              value={kal.schriftart}
              onChange={(e) => setKal({ ...kal, schriftart: e.target.value })}
              className="w-full p-2 border border-stone-300 rounded text-sm bg-white"
            >
              {['Arial', 'Helvetica', 'Calibri', 'Times New Roman', 'Courier New', 'Verdana'].map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Schnell-Verschieben */}
      <div className="border-t border-stone-200 pt-4">
        <h3 className="text-[11px] uppercase tracking-[0.15em] text-stone-500 font-semibold mb-2">
          Schnell-Verschieben
        </h3>
        <div className="grid grid-cols-3 gap-1 mb-2">
          <div />
          <ArrowBtn onClick={() => setKal((k) => ({ ...k, offsetY: round1(k.offsetY - 0.5) }))}><ArrowUp size={14} /></ArrowBtn>
          <div />
          <ArrowBtn onClick={() => setKal((k) => ({ ...k, offsetX: round1(k.offsetX - 0.5) }))}><ArrowLeft size={14} /></ArrowBtn>
          <div className="text-[10px] text-stone-400 text-center self-center font-mono">±0.5</div>
          <ArrowBtn onClick={() => setKal((k) => ({ ...k, offsetX: round1(k.offsetX + 0.5) }))}><ArrowRight size={14} /></ArrowBtn>
          <div />
          <ArrowBtn onClick={() => setKal((k) => ({ ...k, offsetY: round1(k.offsetY + 0.5) }))}><ArrowDown size={14} /></ArrowBtn>
          <div />
        </div>
        <div className="grid grid-cols-3 gap-1">
          <div />
          <ArrowBtn onClick={() => setKal((k) => ({ ...k, offsetY: round1(k.offsetY - 5) }))}>−5</ArrowBtn>
          <div />
          <ArrowBtn onClick={() => setKal((k) => ({ ...k, offsetX: round1(k.offsetX - 5) }))}>−5</ArrowBtn>
          <div className="text-[10px] text-stone-400 text-center self-center font-mono">±5</div>
          <ArrowBtn onClick={() => setKal((k) => ({ ...k, offsetX: round1(k.offsetX + 5) }))}>+5</ArrowBtn>
          <div />
          <ArrowBtn onClick={() => setKal((k) => ({ ...k, offsetY: round1(k.offsetY + 5) }))}>+5</ArrowBtn>
          <div />
        </div>
      </div>

      {/* Status-Anzeige */}
      <div className="border-t border-stone-200 pt-4 text-[11px] text-stone-500 space-y-1.5 font-mono">
        <div className="flex justify-between">
          <span className="text-stone-600">X-Offset</span>
          <span className="text-stone-900 font-medium">{kal.offsetX} mm</span>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-600">Y-Offset (Zeile 1)</span>
          <span className="text-stone-900 font-medium">{kal.offsetY} mm</span>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-600">Zeilenhöhe</span>
          <span className="text-stone-900 font-medium">{kal.zeilenhoehe} mm</span>
        </div>
        <div className="flex justify-between border-t border-stone-200 pt-1.5 mt-1.5">
          <span className="text-stone-600">Letzte Zeile (20)</span>
          <span className="text-stone-900 font-medium">{round1(kal.offsetY + 19 * kal.zeilenhoehe)} mm</span>
        </div>
      </div>
    </section>
  );
}
