import { Printer, Save, FolderOpen, HelpCircle } from 'lucide-react';

export default function Header({ onPrint, onSave, onLoad, onHelp }) {
  return (
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
            onClick={onHelp}
            className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-stone-900 rounded text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <HelpCircle size={14} /> Anleitung
          </button>
          <label className="px-3 py-1.5 bg-stone-700 hover:bg-stone-600 cursor-pointer rounded text-xs flex items-center gap-1.5 transition">
            <FolderOpen size={14} /> Profil laden
            <input type="file" accept="application/json,.json" onChange={onLoad} className="hidden" />
          </label>
          <button
            onClick={onSave}
            className="px-3 py-1.5 bg-stone-700 hover:bg-stone-600 rounded text-xs flex items-center gap-1.5 transition"
          >
            <Save size={14} /> Profil speichern
          </button>
          <button
            onClick={onPrint}
            className="px-4 py-1.5 bg-amber-400 hover:bg-amber-300 text-stone-900 rounded text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Printer size={14} /> Drucken
          </button>
        </div>
      </div>
    </header>
  );
}
