import { useState, useEffect } from 'react';
import {
  Printer, Upload, RotateCcw, FileText, Save, FolderOpen,
  X, ArrowUp, ArrowDown, ArrowLeft, ArrowRight,
  Image as ImageIcon, Info, HelpCircle, CheckCircle2, AlertCircle
} from 'lucide-react';

// ============================================================
// Maßnahmen-Kataloge (GKV-Heilmittelkatalog)
// ============================================================
const MASSNAHMEN = {
  ERGO: [
    'Motorisch-funktionelle Behandlung',
    'Sensomotorisch-perzeptive Behandlung',
    'Hirnleistungstraining',
    'Psychisch-funktionelle Behandlung',
    'Thermische Anwendung',
    'Beratung zur Alltagsintegration',
    'Schienenherstellung/-anpassung',
    'Gruppentherapie',
    'Hausbesuch',
    'Verlaufsdokumentation',
  ],
  PHYSIO: [
    'Krankengymnastik (KG)',
    'KG-ZNS Erwachsene (Bobath/Vojta/PNF)',
    'KG-ZNS Kinder',
    'KG-Atemtherapie',
    'KG am Gerät (KGG)',
    'Manuelle Therapie (MT)',
    'Klassische Massagetherapie',
    'Bindegewebsmassage',
    'Periostmassage',
    'Kolonbehandlung',
    'Manuelle Lymphdrainage 30 Min',
    'Manuelle Lymphdrainage 45 Min',
    'Manuelle Lymphdrainage 60 Min',
    'Wärmetherapie (Heiße Rolle/Fango)',
    'Kältetherapie',
    'Elektrotherapie',
    'Elektrostimulation',
    'Iontophorese',
    'Ultraschall-Wärmetherapie',
    'Hydroelektrisches Vollbad',
    'Bewegungsbad/Wassergymnastik',
    'Inhalation',
    'Hausbesuch',
  ],
  LOGO: [
    'Sprachtherapie 30 Min',
    'Sprachtherapie 45 Min',
    'Sprachtherapie 60 Min',
    'Sprechtherapie 30 Min',
    'Sprechtherapie 45 Min',
    'Sprechtherapie 60 Min',
    'Stimmtherapie 30 Min',
    'Stimmtherapie 45 Min',
    'Stimmtherapie 60 Min',
    'Schlucktherapie 30 Min',
    'Schlucktherapie 45 Min',
    'Schlucktherapie 60 Min',
    'Standardisierter Eingangsbefund',
    'Therapiebericht',
    'Beratung Eltern/Bezugspersonen',
    'Beratung Schluckstörung',
    'Gruppentherapie',
    'Hausbesuch',
  ],
};

const ZUSATZ_OPTIONEN = [
  '',
  'als Hausbesuch',
  'als Doppelbehandlung',
  'in der Gruppe',
  'mit Wärmetherapie',
  'mit Kältetherapie',
];

const DEFAULTS = {
  offsetX: 12,
  offsetY: 55,
  zeilenhoehe: 7,
  schriftgroesse: 9,
  schriftart: 'Arial',
};

const round1 = (n) => Math.round(n * 10) / 10;

// ============================================================
// HAUPTKOMPONENTE
// ============================================================
export default function App() {
  // Verordnungsdaten
  const [art, setArt] = useState('ERGO');
  const [massnahme, setMassnahme] = useState(MASSNAHMEN.ERGO[0]);
  const [zusatz, setZusatz] = useState('');
  const [zusatzCustom, setZusatzCustom] = useState(false);
  const [anzahl, setAnzahl] = useState(10);

  // Pro-Zeile-Modus
  const [individuell, setIndividuell] = useState(false);
  const [zeilen, setZeilen] = useState(
    Array.from({ length: 20 }, () => ({
      massnahme: MASSNAHMEN.ERGO[0],
      zusatz: '',
    }))
  );

  // Kalibrierung
  const [kal, setKal] = useState(DEFAULTS);

  // Anzeige
  const [scanUrl, setScanUrl] = useState(null);
  const [scanOpacity, setScanOpacity] = useState(50);
  const [showRaster, setShowRaster] = useState(true);
  const [previewScale, setPreviewScale] = useState(0.85);

  // Bei Art-Wechsel: erste Maßnahme der neuen Liste setzen
  useEffect(() => {
    setMassnahme(MASSNAHMEN[art][0]);
  }, [art]);

  // Pfeil-Tasten zur Feinjustierung
  useEffect(() => {
    const handler = (e) => {
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      const step = e.shiftKey ? 5 : (e.altKey ? 0.1 : 0.5);
      let handled = false;

      if (e.key === 'ArrowLeft') {
        setKal((k) => ({ ...k, offsetX: round1(k.offsetX - step) }));
        handled = true;
      }
      if (e.key === 'ArrowRight') {
        setKal((k) => ({ ...k, offsetX: round1(k.offsetX + step) }));
        handled = true;
      }
      if (e.key === 'ArrowUp') {
        setKal((k) => ({ ...k, offsetY: round1(k.offsetY - step) }));
        handled = true;
      }
      if (e.key === 'ArrowDown') {
        setKal((k) => ({ ...k, offsetY: round1(k.offsetY + step) }));
        handled = true;
      }
      if (handled) e.preventDefault();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Drucken
  const handlePrint = () => {
    window.print();
  };

  // Profil speichern
  const saveProfile = () => {
    const data = {
      version: 1,
      datum: new Date().toISOString(),
      art, massnahme, zusatz, anzahl, individuell, zeilen, kal,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kalibrierung-${art.toLowerCase()}-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Profil laden
  const loadProfile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = (ev) => {
      try {
        const d = JSON.parse(ev.target.result);
        if (d.kal) setKal(d.kal);
        if (d.art) setArt(d.art);
        // setMassnahme nach Art-Effect setzen
        setTimeout(() => {
          if (d.massnahme) setMassnahme(d.massnahme);
        }, 10);
        if (d.zusatz !== undefined) setZusatz(d.zusatz);
        if (d.anzahl) setAnzahl(d.anzahl);
        if (d.individuell !== undefined) setIndividuell(d.individuell);
        if (d.zeilen) setZeilen(d.zeilen);
        e.target.value = '';
      } catch (err) {
        alert('Profil konnte nicht geladen werden: ' + err.message);
      }
    };
    r.readAsText(file);
  };

  const [showHelp, setShowHelp] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const loadImageFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const r = new FileReader();
    r.onload = (ev) => setScanUrl(ev.target.result);
    r.readAsDataURL(file);
  };

  // Scan hochladen
  const uploadScan = (e) => loadImageFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    loadImageFile(e.dataTransfer.files[0]);
  };

  // Text für Zeile i
  const getZeilenText = (i) => {
    if (i >= anzahl) return '';
    if (individuell) {
      const z = zeilen[i] || {};
      const m = z.massnahme || '';
      const zu = z.zusatz || '';
      return zu ? `${m} ${zu}` : m;
    }
    return zusatz ? `${massnahme} ${zusatz}` : massnahme;
  };

  const updateZeile = (i, key, val) => {
    setZeilen((z) => {
      const next = [...z];
      next[i] = { ...next[i], [key]: val };
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      {/* Globale Styles & Print-CSS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        body, html, #root {
          font-family: 'Outfit', system-ui, -apple-system, sans-serif;
        }
        .font-mono { font-family: 'JetBrains Mono', ui-monospace, monospace !important; }
        .font-display { font-family: 'Outfit', sans-serif; letter-spacing: -0.01em; }

        /* Custom Scrollbar */
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #d6d3d1; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #a8a29e; }

        /* Range slider styling */
        input[type=range] {
          -webkit-appearance: none;
          height: 4px;
          background: #e7e5e4;
          border-radius: 2px;
          outline: none;
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px; height: 16px;
          background: #1c1917;
          border-radius: 50%;
          cursor: pointer;
        }
        input[type=range]::-moz-range-thumb {
          width: 16px; height: 16px;
          background: #1c1917;
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }

        /* DRUCK-STYLES */
        @media print {
          @page {
            size: A5 portrait;
            margin: 0;
          }
          body, html, #root {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            width: 148mm !important;
            height: 210mm !important;
          }
          .no-print { display: none !important; }
          .preview-wrapper {
            position: absolute !important;
            top: 0 !important; left: 0 !important;
            width: 148mm !important; height: 210mm !important;
            margin: 0 !important; padding: 0 !important;
            background: white !important;
            transform: none !important;
            overflow: visible !important;
            display: block !important;
          }
          .a5-page {
            position: absolute !important;
            top: 0 !important; left: 0 !important;
            width: 148mm !important; height: 210mm !important;
            transform: none !important;
            margin: 0 !important; padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            background: white !important;
            overflow: visible !important;
          }
          .scan-bg, .raster-line, .raster-num { display: none !important; }
          .print-line {
            color: black !important;
            background: transparent !important;
          }
        }
      `}</style>

      {/* HEADER */}
      <header className="no-print bg-stone-900 text-stone-50 px-5 py-3.5 sticky top-0 z-50 border-b border-stone-800">
        <div className="flex items-center justify-between flex-wrap gap-3 max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 bg-amber-400 text-stone-900 rounded flex items-center justify-center font-bold">
              <Printer size={18} />
            </div>
            <div>
              <h1 className="font-display text-base font-semibold leading-tight">
                Heilmittelverordnung – Druckkalibrierung
              </h1>
              <p className="text-stone-400 text-xs leading-tight mt-0.5">
                Muster 13 Rückseite · A5 Hochformat · 1:1 Direktdruck
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHelp(true)}
              className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-stone-900 rounded text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <HelpCircle size={14} /> Anleitung
            </button>
            <label className="px-3 py-1.5 bg-stone-700 hover:bg-stone-600 cursor-pointer rounded text-xs flex items-center gap-1.5 transition">
              <FolderOpen size={14} /> Profil laden
              <input
                type="file"
                accept="application/json,.json"
                onChange={loadProfile}
                className="hidden"
              />
            </label>
            <button
              onClick={saveProfile}
              className="px-3 py-1.5 bg-stone-700 hover:bg-stone-600 rounded text-xs flex items-center gap-1.5 transition"
            >
              <Save size={14} /> Profil speichern
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-amber-400 hover:bg-amber-300 text-stone-900 rounded text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Printer size={14} /> Drucken
            </button>
          </div>
        </div>
      </header>

      {/* HAUPT-GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 max-w-screen-2xl mx-auto">

        {/* SETUP - LINKS */}
        <section className="no-print lg:col-span-3 bg-white border border-stone-200 rounded-lg p-5 space-y-5 self-start">
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
                    art === a
                      ? 'bg-stone-900 text-white shadow-sm'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>

            <label className="block text-xs font-medium mb-1.5 mt-4 text-stone-700">
              Maßnahme
            </label>
            <select
              value={massnahme}
              onChange={(e) => setMassnahme(e.target.value)}
              className="w-full p-2 border border-stone-300 rounded text-sm bg-white"
            >
              {MASSNAHMEN[art].map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <label className="block text-xs font-medium mb-1.5 mt-4 text-stone-700">
              Zusatz / Kombination
            </label>
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
                <option key={i} value={z}>
                  {z || '(kein Zusatz)'}
                </option>
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
              <span className="font-mono ml-2 text-stone-500 font-normal">
                {anzahl} / 20
              </span>
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={anzahl}
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

          {individuell && (
            <div className="border-t border-stone-200 pt-4">
              <h3 className="text-[11px] uppercase tracking-[0.15em] text-stone-500 font-semibold mb-2">
                Zeilen-Details
              </h3>
              <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
                {Array.from({ length: anzahl }, (_, i) => (
                  <div key={i} className="flex gap-1.5 items-center">
                    <span className="text-xs font-mono text-stone-400 w-5 text-right">
                      {i + 1}
                    </span>
                    <select
                      value={(zeilen[i] && zeilen[i].massnahme) || ''}
                      onChange={(e) => updateZeile(i, 'massnahme', e.target.value)}
                      className="flex-1 p-1 border border-stone-300 rounded text-[11px] bg-white min-w-0"
                    >
                      {MASSNAHMEN[art].map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-stone-200 pt-4">
            <h2 className="font-display text-[11px] uppercase tracking-[0.15em] text-stone-500 font-semibold mb-3">
              Hintergrund
            </h2>

            <label
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`block w-full p-4 border-2 border-dashed rounded text-center cursor-pointer transition select-none ${
                dragOver
                  ? 'border-amber-400 bg-amber-50'
                  : 'border-stone-300 hover:border-stone-500 hover:bg-stone-50'
              }`}
            >
              <ImageIcon
                size={22}
                className={`mx-auto mb-1.5 transition ${dragOver ? 'text-amber-500' : 'text-stone-400'}`}
              />
              <span className="text-xs text-stone-600 block font-medium">
                {dragOver
                  ? 'Loslassen zum Hochladen'
                  : scanUrl
                  ? 'Scan ersetzen'
                  : 'Bild hierher ziehen'}
              </span>
              <span className="text-[10px] text-stone-400 mt-0.5 block">
                oder klicken · PNG / JPG · A5
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={uploadScan}
                className="hidden"
              />
            </label>

            {scanUrl && (
              <div className="mt-3 space-y-2">
                <div>
                  <label className="text-xs text-stone-600 flex justify-between mb-0.5">
                    <span>Sichtbarkeit</span>
                    <span className="font-mono">{scanOpacity}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={scanOpacity}
                    onChange={(e) => setScanOpacity(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                <button
                  onClick={() => setScanUrl(null)}
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

        {/* PREVIEW - MITTE */}
        <section className="lg:col-span-6">
          <div className="no-print mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-stone-600">
              <FileText size={14} /> A5 Vorschau · 148 × 210 mm · echte Größe
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-stone-500 font-mono w-10 text-right">
                {Math.round(previewScale * 100)}%
              </span>
              <input
                type="range"
                min="0.5"
                max="1.2"
                step="0.05"
                value={previewScale}
                onChange={(e) => setPreviewScale(parseFloat(e.target.value))}
                className="w-24"
              />
            </div>
          </div>

          <div
            className="preview-wrapper bg-stone-200 rounded p-4 overflow-auto"
            tabIndex={0}
            style={{
              minHeight: '600px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}
          >
            <div
              className="a5-page bg-white shadow-2xl relative"
              style={{
                width: '148mm',
                height: '210mm',
                transform: `scale(${previewScale})`,
                transformOrigin: 'top center',
                flexShrink: 0,
                marginBottom: `${(1 - previewScale) * 794 * -1}px`,
              }}
            >
              {/* Scan-Hintergrund */}
              {scanUrl && (
                <img
                  src={scanUrl}
                  alt="Verordnungs-Scan"
                  className="scan-bg absolute inset-0 w-full h-full"
                  style={{
                    opacity: scanOpacity / 100,
                    objectFit: 'fill',
                  }}
                />
              )}

              {/* Hilfsraster (ohne Scan) */}
              {showRaster && !scanUrl && (
                <div className="absolute inset-0 pointer-events-none">
                  {Array.from({ length: 20 }, (_, i) => (
                    <div
                      key={i}
                      className="raster-line absolute border-b border-stone-300"
                      style={{
                        left: '8mm',
                        right: '8mm',
                        top: `${
                          kal.offsetY + i * kal.zeilenhoehe + kal.zeilenhoehe * 0.7
                        }mm`,
                      }}
                    >
                      <span
                        className="raster-num absolute font-mono text-stone-400"
                        style={{
                          left: '-8mm',
                          top: '-3mm',
                          fontSize: '7pt',
                        }}
                      >
                        {i + 1}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Hilfsraster (mit Scan, als Overlay) */}
              {showRaster && scanUrl && (
                <div className="absolute inset-0 pointer-events-none">
                  {Array.from({ length: 20 }, (_, i) => (
                    <div
                      key={i}
                      className="raster-line absolute border-t border-emerald-500 border-dashed"
                      style={{
                        left: '0mm',
                        right: '0mm',
                        top: `${kal.offsetY + i * kal.zeilenhoehe}mm`,
                        opacity: 0.4,
                      }}
                    />
                  ))}
                </div>
              )}

              {/* DRUCK-ZEILEN */}
              {Array.from({ length: 20 }, (_, i) => {
                const text = getZeilenText(i);
                if (!text) return null;
                return (
                  <div
                    key={i}
                    className="print-line absolute"
                    style={{
                      left: `${kal.offsetX}mm`,
                      top: `${kal.offsetY + i * kal.zeilenhoehe}mm`,
                      fontSize: `${kal.schriftgroesse}pt`,
                      fontFamily: kal.schriftart,
                      color: 'black',
                      whiteSpace: 'nowrap',
                      lineHeight: 1,
                    }}
                  >
                    {text}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="no-print mt-3 text-[11px] text-stone-500 bg-stone-100 rounded px-3 py-2 flex items-center gap-2 flex-wrap">
            <Info size={12} className="text-stone-400 flex-shrink-0" />
            <span>
              Klick in die Vorschau, dann Pfeiltasten:{' '}
              <code className="font-mono bg-white px-1 py-0.5 rounded text-stone-700">↑↓←→</code> 0,5 mm ·{' '}
              <code className="font-mono bg-white px-1 py-0.5 rounded text-stone-700">Shift+Pfeil</code> 5 mm ·{' '}
              <code className="font-mono bg-white px-1 py-0.5 rounded text-stone-700">Alt+Pfeil</code> 0,1 mm
            </span>
          </div>
        </section>

        {/* KALIBRIERUNG - RECHTS */}
        <section className="no-print lg:col-span-3 bg-white border border-stone-200 rounded-lg p-5 space-y-5 self-start">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-[11px] uppercase tracking-[0.15em] text-stone-500 font-semibold">
                Kalibrierung
              </h2>
              <button
                onClick={() => setKal(DEFAULTS)}
                className="text-[11px] text-stone-500 hover:text-stone-900 flex items-center gap-1 transition"
              >
                <RotateCcw size={11} /> Reset
              </button>
            </div>

            <div className="space-y-3">
              <CalRow
                label="Linker Rand"
                unit="mm"
                value={kal.offsetX}
                step={0.5}
                onChange={(v) => setKal({ ...kal, offsetX: v })}
              />
              <CalRow
                label="Erste Zeile von oben"
                unit="mm"
                value={kal.offsetY}
                step={0.5}
                onChange={(v) => setKal({ ...kal, offsetY: v })}
              />
              <CalRow
                label="Zeilenabstand"
                unit="mm"
                value={kal.zeilenhoehe}
                step={0.1}
                onChange={(v) => setKal({ ...kal, zeilenhoehe: v })}
              />
              <CalRow
                label="Schriftgröße"
                unit="pt"
                value={kal.schriftgroesse}
                step={0.5}
                onChange={(v) => setKal({ ...kal, schriftgroesse: v })}
              />

              <div>
                <label className="text-xs text-stone-600 mb-1 block">Schriftart</label>
                <select
                  value={kal.schriftart}
                  onChange={(e) => setKal({ ...kal, schriftart: e.target.value })}
                  className="w-full p-2 border border-stone-300 rounded text-sm bg-white"
                >
                  <option>Arial</option>
                  <option>Helvetica</option>
                  <option>Calibri</option>
                  <option>Times New Roman</option>
                  <option>Courier New</option>
                  <option>Verdana</option>
                </select>
              </div>
            </div>
          </div>

          <div className="border-t border-stone-200 pt-4">
            <h3 className="text-[11px] uppercase tracking-[0.15em] text-stone-500 font-semibold mb-2">
              Schnell-Verschieben
            </h3>
            <div className="grid grid-cols-3 gap-1 mb-2">
              <div></div>
              <ArrowBtn
                onClick={() =>
                  setKal((k) => ({ ...k, offsetY: round1(k.offsetY - 0.5) }))
                }
              >
                <ArrowUp size={14} />
              </ArrowBtn>
              <div></div>
              <ArrowBtn
                onClick={() =>
                  setKal((k) => ({ ...k, offsetX: round1(k.offsetX - 0.5) }))
                }
              >
                <ArrowLeft size={14} />
              </ArrowBtn>
              <div className="text-[10px] text-stone-400 text-center self-center font-mono">
                ±0.5
              </div>
              <ArrowBtn
                onClick={() =>
                  setKal((k) => ({ ...k, offsetX: round1(k.offsetX + 0.5) }))
                }
              >
                <ArrowRight size={14} />
              </ArrowBtn>
              <div></div>
              <ArrowBtn
                onClick={() =>
                  setKal((k) => ({ ...k, offsetY: round1(k.offsetY + 0.5) }))
                }
              >
                <ArrowDown size={14} />
              </ArrowBtn>
              <div></div>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <div></div>
              <ArrowBtn
                onClick={() =>
                  setKal((k) => ({ ...k, offsetY: round1(k.offsetY - 5) }))
                }
              >
                −5
              </ArrowBtn>
              <div></div>
              <ArrowBtn
                onClick={() =>
                  setKal((k) => ({ ...k, offsetX: round1(k.offsetX - 5) }))
                }
              >
                −5
              </ArrowBtn>
              <div className="text-[10px] text-stone-400 text-center self-center font-mono">
                ±5
              </div>
              <ArrowBtn
                onClick={() =>
                  setKal((k) => ({ ...k, offsetX: round1(k.offsetX + 5) }))
                }
              >
                +5
              </ArrowBtn>
              <div></div>
              <ArrowBtn
                onClick={() =>
                  setKal((k) => ({ ...k, offsetY: round1(k.offsetY + 5) }))
                }
              >
                +5
              </ArrowBtn>
              <div></div>
            </div>
          </div>

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
              <span className="text-stone-900 font-medium">
                {round1(kal.offsetY + 19 * kal.zeilenhoehe)} mm
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* HILFE-MODAL */}
      {showHelp && (
        <div
          className="no-print fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowHelp(false); }}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 sticky top-0 bg-white rounded-t-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-400 rounded flex items-center justify-center">
                  <HelpCircle size={16} className="text-stone-900" />
                </div>
                <h2 className="font-semibold text-stone-900">So benutzt du die App</h2>
              </div>
              <button
                onClick={() => setShowHelp(false)}
                className="p-1.5 hover:bg-stone-100 rounded transition text-stone-500"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-6">

              {/* Alltag */}
              <div>
                <h3 className="font-semibold text-stone-900 mb-3 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  Täglich benutzen – so geht's
                </h3>
                <ol className="space-y-3">
                  {[
                    { n: '1', text: 'Oben links auf "Profil laden" klicken und die JSON-Datei deines Standorts auswählen (z.B. berlin-mitte.json).' },
                    { n: '2', text: 'Links die Therapieart wählen: ERGO, PHYSIO oder LOGO.' },
                    { n: '3', text: 'Die passende Maßnahme aus der Liste auswählen.' },
                    { n: '4', text: 'Die Anzahl der Behandlungen einstellen (z.B. 10).' },
                    { n: '5', text: 'Die Original-Verordnung in den Drucker legen – Rückseite nach oben.' },
                    { n: '6', text: 'Oben rechts auf den gelben "Drucken"-Button klicken.' },
                  ].map(({ n, text }) => (
                    <li key={n} className="flex gap-3 items-start">
                      <span className="w-6 h-6 rounded-full bg-stone-900 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{n}</span>
                      <span className="text-sm text-stone-700">{text}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Druckeinstellungen */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                  <AlertCircle size={15} className="text-amber-600" />
                  Wichtig beim Drucken!
                </h3>
                <p className="text-sm text-amber-800 mb-2">Im Browser-Druckfenster unbedingt so einstellen:</p>
                <ul className="space-y-1.5 text-sm text-amber-900">
                  {[
                    ['Papierformat', 'A5 Hochformat'],
                    ['Skalierung', '100% – nicht "An Seite anpassen"'],
                    ['Ränder', 'Keine'],
                    ['Kopf-/Fußzeilen', 'Aus'],
                  ].map(([label, val]) => (
                    <li key={label} className="flex gap-2">
                      <span className="text-amber-600">→</span>
                      <span><strong>{label}:</strong> {val}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Erstkalibrierung */}
              <div>
                <h3 className="font-semibold text-stone-900 mb-3 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-blue-500" />
                  Erstkalibrierung – einmalig pro Drucker
                </h3>
                <p className="text-sm text-stone-600 mb-3">
                  Das macht normalerweise die Praxisleitung. Danach wird das Ergebnis als Datei gespeichert und muss nie wieder gemacht werden.
                </p>
                <ol className="space-y-3">
                  {[
                    { n: '1', text: 'Eine leere Verordnungsrückseite (Muster 13) einscannen und das Bild hochladen (per Drag & Drop oder Klick im Bereich "Hintergrund").' },
                    { n: '2', text: 'Jetzt siehst du den Scan im Hintergrund. Die grünen Hilfslinien müssen auf die vorgedruckten Zeilen des Formulars.' },
                    { n: '3', text: 'Mit den Pfeil-Buttons rechts (oder den Pfeiltasten auf der Tastatur) die Zeilen verschieben bis alles passt.' },
                    { n: '4', text: 'Oben auf "Profil speichern" klicken und die Datei mit einem verständlichen Namen speichern, z.B. "berlin-mitte.json".' },
                  ].map(({ n, text }) => (
                    <li key={n} className="flex gap-3 items-start">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{n}</span>
                      <span className="text-sm text-stone-700">{text}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Mehrere Standorte */}
              <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 text-sm text-stone-700">
                <strong className="block mb-1 text-stone-900">Mehrere Standorte / Drucker</strong>
                Pro Drucker gibt es eine eigene Profil-Datei. Einfach die passende laden – fertig. Die Dateien können per E-Mail oder geteiltem Ordner (z.B. Google Drive) ans Team weitergegeben werden.
              </div>

            </div>

            <div className="px-6 py-4 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setShowHelp(false)}
                className="px-5 py-2 bg-stone-900 hover:bg-stone-700 text-white rounded text-sm font-medium transition"
              >
                Verstanden, schließen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// SUBKOMPONENTEN
// ============================================================
function CalRow({ label, unit, value, step, onChange }) {
  return (
    <div>
      <label className="text-xs text-stone-600 mb-1 flex justify-between">
        <span>{label}</span>
        <span className="font-mono text-stone-900 font-medium">
          {value} {unit}
        </span>
      </label>
      <div className="flex gap-1">
        <button
          onClick={() => onChange(round1(value - step))}
          className="px-2.5 bg-stone-100 hover:bg-stone-200 rounded text-sm transition font-medium text-stone-600"
        >
          −
        </button>
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
        >
          +
        </button>
      </div>
    </div>
  );
}

function ArrowBtn({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="p-2 bg-stone-100 hover:bg-stone-300 active:bg-stone-400 rounded text-stone-700 flex items-center justify-center text-xs font-medium font-mono transition"
    >
      {children}
    </button>
  );
}
