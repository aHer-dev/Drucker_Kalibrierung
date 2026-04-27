import { X, HelpCircle, CheckCircle2, AlertCircle } from 'lucide-react';

export default function HelpModal({ onClose }) {
  return (
    <div
      className="no-print fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 sticky top-0 bg-white rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-400 rounded flex items-center justify-center">
              <HelpCircle size={16} className="text-stone-900" />
            </div>
            <h2 className="font-semibold text-stone-900">So benutzt du die App</h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-stone-100 rounded transition text-stone-500">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Täglich */}
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
            onClick={onClose}
            className="px-5 py-2 bg-stone-900 hover:bg-stone-700 text-white rounded text-sm font-medium transition"
          >
            Verstanden, schließen
          </button>
        </div>
      </div>
    </div>
  );
}
