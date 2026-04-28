import { Image as ImageIcon, X, FileText } from 'lucide-react';
import { MASSNAHMEN, ZUSATZ_OPTIONEN } from '../constants/massnahmen';

const rueckseiteImg = '/heilmittelverordnung_rueckseite.jpg';

export default function VerordnungPanel({
  art, setArt,
  massnahme, setMassnahme,
  massnahmeCustom, setMassnahmeCustom,
  zusatz, setZusatz,
  zusatzCustom, setZusatzCustom,
  anzahl, setAnzahl,
  individuell, setIndividuell,
  zeilen, updateZeile,
  scanUrl, setScanUrl, scanOpacity, setScanOpacity,
  dragOver, uploadScan, handleDrop, handleDragOver, handleDragLeave, removeScan,
  showRaster, setShowRaster,
}) {
  return (
    <section className="no-print lg:col-span-3 bg-white border border-stone-200 rounded-lg p-5 space-y-5 self-start">
      {/* Verordnung */}
      <div>
        <h2 className="font-display text-[11px] uppercase tracking-[0.15em] text-stone-500 font-semibold mb-3">
          Verordnung
        </h2>

        <label className="block text-xs font-medium mb-1.5 text-stone-700">Art</label>
        <div className="grid grid-cols-3 gap-1 bg-stone-100 p-1 rounded">
          {['ERGO', 'PHYSIO', 'LOGO'].map((a) => (
            <button
              key={a}
              onClick={() => setArt(a)}
              className={`py-1.5 text-xs font-semibold rounded transition ${
                art === a ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {a}
            </button>
          ))}
        </div>

        <label className="block text-xs font-medium mb-1.5 mt-4 text-stone-700">Maßnahme</label>
        <select
          value={massnahmeCustom ? '__custom__' : massnahme}
          onChange={(e) => {
            if (e.target.value === '__custom__') {
              setMassnahmeCustom(true);
              setMassnahme('');
            } else {
              setMassnahmeCustom(false);
              setMassnahme(e.target.value);
            }
          }}
          className="w-full p-2 border border-stone-300 rounded text-sm bg-white"
        >
          {MASSNAHMEN[art].map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
          <option value="__custom__">Eigener Text…</option>
        </select>
        {massnahmeCustom && (
          <input
            value={massnahme}
            onChange={(e) => setMassnahme(e.target.value)}
            placeholder="z.B. Vojta-Therapie Erwachsene"
            className="w-full p-2 border border-amber-400 rounded text-sm mt-2 focus:outline-none focus:ring-2 focus:ring-amber-300"
            autoFocus
          />
        )}

        <label className="block text-xs font-medium mb-1.5 mt-4 text-stone-700">Zusatz / Kombination</label>
        <select
          value={zusatzCustom ? '__custom__' : zusatz}
          onChange={(e) => {
            if (e.target.value === '__custom__') {
              setZusatzCustom(true);
            } else {
              setZusatzCustom(false);
              setZusatz(e.target.value);
            }
          }}
          className="w-full p-2 border border-stone-300 rounded text-sm bg-white mb-2"
        >
          {ZUSATZ_OPTIONEN.map((z, i) => (
            <option key={i} value={z}>{z || '(kein Zusatz)'}</option>
          ))}
          <option value="__custom__">Eigener Text…</option>
        </select>
        {zusatzCustom && (
          <input
            value={zusatz}
            onChange={(e) => setZusatz(e.target.value)}
            placeholder="z.B. mit thermischer Anwendung"
            className="w-full p-2 border border-stone-300 rounded text-sm"
          />
        )}

        <label className="block text-xs font-medium mb-1.5 mt-4 text-stone-700">
          Anzahl Behandlungen
          <span className="font-mono ml-2 text-stone-500 font-normal">{anzahl} / 20</span>
        </label>
        <input
          type="range" min="1" max="20" value={anzahl}
          onChange={(e) => setAnzahl(parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex gap-1 mt-2">
          {[1, 6, 10, 15, 20].map((n) => (
            <button
              key={n}
              onClick={() => setAnzahl(n)}
              className="flex-1 px-2 py-1 text-xs font-mono bg-stone-100 hover:bg-stone-200 rounded transition"
            >
              {n}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 mt-4 cursor-pointer">
          <input
            type="checkbox"
            checked={individuell}
            onChange={(e) => setIndividuell(e.target.checked)}
            className="rounded"
          />
          <span className="text-xs text-stone-700">Pro Zeile individuell</span>
        </label>
      </div>

      {/* Zeilen-Details */}
      {individuell && (
        <div className="border-t border-stone-200 pt-4">
          <h3 className="text-[11px] uppercase tracking-[0.15em] text-stone-500 font-semibold mb-2">
            Zeilen-Details
          </h3>
          <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
            {Array.from({ length: anzahl }, (_, i) => {
              const zeile = zeilen[i] || {};
              const isCustom = zeile.massnahme === '__custom__';
              return (
                <div key={i} className="flex gap-1.5 items-start">
                  <span className="text-xs font-mono text-stone-400 w-5 text-right mt-1.5">{i + 1}</span>
                  <div className="flex-1 min-w-0 space-y-1">
                    <select
                      value={isCustom ? '__custom__' : (zeile.massnahme || '')}
                      onChange={(e) => {
                        if (e.target.value === '__custom__') {
                          updateZeile(i, 'massnahme', '__custom__');
                          updateZeile(i, 'massnahmeText', '');
                        } else {
                          updateZeile(i, 'massnahme', e.target.value);
                          updateZeile(i, 'massnahmeText', '');
                        }
                      }}
                      className="w-full p-1 border border-stone-300 rounded text-[11px] bg-white"
                    >
                      {MASSNAHMEN[art].map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                      <option value="__custom__">Eigener Text…</option>
                    </select>
                    {isCustom && (
                      <input
                        value={zeile.massnahmeText || ''}
                        onChange={(e) => updateZeile(i, 'massnahmeText', e.target.value)}
                        placeholder="Freitext…"
                        className="w-full p-1 border border-amber-400 rounded text-[11px] focus:outline-none focus:ring-1 focus:ring-amber-300"
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Hintergrund / Scan */}
      <div className="border-t border-stone-200 pt-4">
        <h2 className="font-display text-[11px] uppercase tracking-[0.15em] text-stone-500 font-semibold mb-3">
          Hintergrund
        </h2>

        <button
          onClick={() => setScanUrl(rueckseiteImg)}
          className="w-full flex items-center gap-2 px-3 py-2 mb-3 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded text-xs font-medium text-stone-700 transition"
        >
          <FileText size={14} className="text-stone-500 shrink-0" />
          Heilmittelverordnung – Rückseite
        </button>

        <label
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`block w-full p-4 border-2 border-dashed rounded text-center cursor-pointer transition select-none ${
            dragOver ? 'border-amber-400 bg-amber-50' : 'border-stone-300 hover:border-stone-500 hover:bg-stone-50'
          }`}
        >
          <ImageIcon size={22} className={`mx-auto mb-1.5 transition ${dragOver ? 'text-amber-500' : 'text-stone-400'}`} />
          <span className="text-xs text-stone-600 block font-medium">
            {dragOver ? 'Loslassen zum Hochladen' : scanUrl ? 'Scan ersetzen' : 'Bild hierher ziehen'}
          </span>
          <span className="text-[10px] text-stone-400 mt-0.5 block">oder klicken · PNG / JPG · A5</span>
          <input type="file" accept="image/*" onChange={uploadScan} className="hidden" />
        </label>

        {scanUrl && (
          <div className="mt-3 space-y-2">
            <div>
              <label className="text-xs text-stone-600 flex justify-between mb-0.5">
                <span>Sichtbarkeit</span>
                <span className="font-mono">{scanOpacity}%</span>
              </label>
              <input
                type="range" min="0" max="100" value={scanOpacity}
                onChange={(e) => setScanOpacity(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <button
              onClick={removeScan}
              className="text-xs text-stone-500 hover:text-red-700 flex items-center gap-1"
            >
              <X size={12} /> Scan entfernen
            </button>
          </div>
        )}

        <label className="flex items-center gap-2 mt-3 cursor-pointer">
          <input
            type="checkbox"
            checked={showRaster}
            onChange={(e) => setShowRaster(e.target.checked)}
            className="rounded"
          />
          <span className="text-xs text-stone-700">Hilfsraster anzeigen</span>
        </label>
      </div>
    </section>
  );
}
