import { useState } from 'react';

export function useScan() {
  const [scanUrl, setScanUrl] = useState(null);
  const [scanOpacity, setScanOpacity] = useState(50);
  const [dragOver, setDragOver] = useState(false);

  const loadImageFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const r = new FileReader();
    r.onload = (ev) => setScanUrl(ev.target.result);
    r.readAsDataURL(file);
  };

  const uploadScan = (e) => loadImageFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    loadImageFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);
  const removeScan = () => setScanUrl(null);

  return { scanUrl, setScanUrl, scanOpacity, setScanOpacity, dragOver, uploadScan, handleDrop, handleDragOver, handleDragLeave, removeScan };
}
