import { useState, useEffect } from 'react';
import { DEFAULTS } from '../constants/massnahmen';

const round1 = (n) => Math.round(n * 10) / 10;

export function useKalibrierung() {
  const [kal, setKal] = useState(DEFAULTS);

  useEffect(() => {
    const handler = (e) => {
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      const step = e.shiftKey ? 5 : e.altKey ? 0.1 : 0.5;
      let handled = false;

      if (e.key === 'ArrowLeft') { setKal((k) => ({ ...k, offsetX: round1(k.offsetX - step) })); handled = true; }
      if (e.key === 'ArrowRight') { setKal((k) => ({ ...k, offsetX: round1(k.offsetX + step) })); handled = true; }
      if (e.key === 'ArrowUp') { setKal((k) => ({ ...k, offsetY: round1(k.offsetY - step) })); handled = true; }
      if (e.key === 'ArrowDown') { setKal((k) => ({ ...k, offsetY: round1(k.offsetY + step) })); handled = true; }
      if (handled) e.preventDefault();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const reset = () => setKal(DEFAULTS);

  return { kal, setKal, reset, round1 };
}
