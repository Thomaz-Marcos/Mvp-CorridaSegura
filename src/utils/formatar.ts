const doisDigitos = (n: number) => String(n).padStart(2, "0");

export function formatarTempo(total: number) {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return h ? `${h}:${doisDigitos(m)}:${doisDigitos(s)}` : `${doisDigitos(m)}:${doisDigitos(s)}`;
}

// Pace em min'seg"/km; "--" quando a distância ainda é pequena demais para calcular.
export function formatarPace(segundos: number, km: number) {
  if (km < 0.05) return "--";
  const porKm = Math.round(segundos / km);
  return `${Math.floor(porKm / 60)}'${doisDigitos(porKm % 60)}"`;
}

export const formatarKm = (metros: number) => (metros / 1000).toFixed(1).replace(".", ",");
