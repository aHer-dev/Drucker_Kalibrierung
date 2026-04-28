import { useState, useEffect } from 'react';
import { MASSNAHMEN, DEFAULTS } from './constants/massnahmen';
import { useKalibrierung } from './hooks/useKalibrierung';
import { useProfil } from './hooks/useProfil';
import { useScan } from './hooks/useScan';
import Header from './components/Header';
import VerordnungPanel from './components/VerordnungPanel';
import PreviewPanel from './components/PreviewPanel';
import KalibrierungPanel from './components/KalibrierungPanel';
import HelpModal from './components/HelpModal';

export default function App() {
  const [art, setArt] = useState('ERGO');
  const [massnahme, setMassnahme] = useState(MASSNAHMEN.ERGO[0]);
  const [massnahmeCustom, setMassnahmeCustom] = useState(false);
  const [zusatz, setZusatz] = useState('');
  const [zusatzCustom, setZusatzCustom] = useState(false);
  const [anzahl, setAnzahl] = useState(10);
  const [individuell, setIndividuell] = useState(false);
  const [zeilen, setZeilen] = useState(
    Array.from({ length: 20 }, () => ({ massnahme: MASSNAHMEN.ERGO[0], zusatz: '' }))
  );
  const [showRaster, setShowRaster] = useState(true);
  const [showHelp, setShowHelp] = useState(false);

  const { kal, setKal, reset } = useKalibrierung();
  const scan = useScan();
  const { saveProfile, loadProfile } = useProfil({
    kal, art, massnahme, zusatz, anzahl, individuell, zeilen,
    setKal, setArt, setMassnahme, setZusatz, setAnzahl, setIndividuell, setZeilen,
  });

  useEffect(() => {
    setMassnahme(MASSNAHMEN[art][0]);
    setMassnahmeCustom(false);
  }, [art]);

  const updateZeile = (i, key, val) => {
    setZeilen((z) => { const next = [...z]; next[i] = { ...next[i], [key]: val }; return next; });
  };

  const getZeilenText = (i) => {
    if (i >= anzahl) return '';
    if (individuell) {
      const z = zeilen[i] || {};
      const m = z.massnahme === '__custom__' ? (z.massnahmeText || '') : (z.massnahme || '');
      return z.zusatz ? `${m} ${z.zusatz}` : m;
    }
    return zusatz ? `${massnahme} ${zusatz}` : massnahme;
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        body, html, #root { font-family: 'Outfit', system-ui, -apple-system, sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', ui-monospace, monospace !important; }
        .font-display { font-family: 'Outfit', sans-serif; letter-spacing: -0.01em; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #d6d3d1; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #a8a29e; }
        input[type=range] { -webkit-appearance: none; height: 4px; background: #e7e5e4; border-radius: 2px; outline: none; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; background: #1c1917; border-radius: 50%; cursor: pointer; }
        input[type=range]::-moz-range-thumb { width: 16px; height: 16px; background: #1c1917; border-radius: 50%; cursor: pointer; border: none; }
        @media print {
          @page { size: A5 portrait; margin: 0; }
          body, html, #root { margin: 0 !important; padding: 0 !important; background: white !important; width: 148mm !important; height: 210mm !important; }
          .no-print { display: none !important; }
          .preview-wrapper { position: absolute !important; top: 0 !important; left: 0 !important; width: 148mm !important; height: 210mm !important; margin: 0 !important; padding: 0 !important; background: white !important; transform: none !important; overflow: visible !important; display: block !important; }
          .a5-page { position: absolute !important; top: 0 !important; left: 0 !important; width: 148mm !important; height: 210mm !important; transform: none !important; margin: 0 !important; padding: 0 !important; box-shadow: none !important; border: none !important; background: white !important; overflow: visible !important; }
          .scan-bg, .raster-line, .raster-num { display: none !important; }
          .print-line { color: black !important; background: transparent !important; }
        }
      `}</style>

      <Header
        onPrint={() => window.print()}
        onSave={saveProfile}
        onLoad={loadProfile}
        onHelp={() => setShowHelp(true)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 max-w-screen-2xl mx-auto">
        <VerordnungPanel
          art={art} setArt={setArt}
          massnahme={massnahme} setMassnahme={setMassnahme}
          massnahmeCustom={massnahmeCustom} setMassnahmeCustom={setMassnahmeCustom}
          zusatz={zusatz} setZusatz={setZusatz}
          zusatzCustom={zusatzCustom} setZusatzCustom={setZusatzCustom}
          anzahl={anzahl} setAnzahl={setAnzahl}
          individuell={individuell} setIndividuell={setIndividuell}
          zeilen={zeilen} updateZeile={updateZeile}
          scanUrl={scan.scanUrl} setScanUrl={scan.setScanUrl} scanOpacity={scan.scanOpacity} setScanOpacity={scan.setScanOpacity}
          dragOver={scan.dragOver}
          uploadScan={scan.uploadScan}
          handleDrop={scan.handleDrop}
          handleDragOver={scan.handleDragOver}
          handleDragLeave={scan.handleDragLeave}
          removeScan={scan.removeScan}
          showRaster={showRaster} setShowRaster={setShowRaster}
        />
        <PreviewPanel
          kal={kal}
          scanUrl={scan.scanUrl}
          scanOpacity={scan.scanOpacity}
          showRaster={showRaster}
          getZeilenText={getZeilenText}
        />
        <KalibrierungPanel kal={kal} setKal={setKal} reset={reset} />
      </div>

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </div>
  );
}
