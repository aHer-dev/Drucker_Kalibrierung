import { useState } from 'react';
import { FileText, Info } from 'lucide-react';

export default function PreviewPanel({ kal, scanUrl, scanOpacity, showRaster, getZeilenText }) {
  const [previewScale, setPreviewScale] = useState(0.85);

  return (
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
            type="range" min="0.5" max="1.2" step="0.05" value={previewScale}
            onChange={(e) => setPreviewScale(parseFloat(e.target.value))}
            className="w-24"
          />
        </div>
      </div>

      <div
        className="preview-wrapper bg-stone-200 rounded p-4 overflow-auto"
        tabIndex={0}
        style={{ minHeight: '600px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}
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
              style={{ opacity: scanOpacity / 100, objectFit: 'fill' }}
            />
          )}

          {/* Hilfsraster ohne Scan */}
          {showRaster && !scanUrl && (
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 20 }, (_, i) => (
                <div
                  key={i}
                  className="raster-line absolute border-b border-stone-300"
                  style={{ left: '8mm', right: '8mm', top: `${kal.offsetY + i * kal.zeilenhoehe + kal.zeilenhoehe * 0.7}mm` }}
                >
                  <span
                    className="raster-num absolute font-mono text-stone-400"
                    style={{ left: '-8mm', top: '-3mm', fontSize: '7pt' }}
                  >
                    {i + 1}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Hilfsraster mit Scan */}
          {showRaster && scanUrl && (
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 20 }, (_, i) => (
                <div
                  key={i}
                  className="raster-line absolute border-t border-emerald-500 border-dashed"
                  style={{ left: '0mm', right: '0mm', top: `${kal.offsetY + i * kal.zeilenhoehe}mm`, opacity: 0.4 }}
                />
              ))}
            </div>
          )}

          {/* Druckzeilen */}
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
  );
}
