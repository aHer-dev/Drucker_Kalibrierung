export function useProfil({ kal, art, massnahme, zusatz, anzahl, individuell, zeilen, setKal, setArt, setMassnahme, setZusatz, setAnzahl, setIndividuell, setZeilen }) {

  const saveProfile = () => {
    const data = {
      version: 1,
      datum: new Date().toISOString(),
      art, massnahme, zusatz, anzahl, individuell, zeilen, kal,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kalibrierung-${art.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadProfile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = (ev) => {
      try {
        const d = JSON.parse(ev.target.result);
        if (d.kal) setKal(d.kal);
        if (d.art) setArt(d.art);
        setTimeout(() => { if (d.massnahme) setMassnahme(d.massnahme); }, 10);
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

  return { saveProfile, loadProfile };
}
