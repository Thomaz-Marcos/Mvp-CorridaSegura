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

export function formatarDistancia(metros: number) {
  return metros < 1000 ? `${Math.round(metros)} m` : `${(metros / 1000).toFixed(1).replace(".", ",")} km`;
}

export function formatarDuracao(segundos: number) {
  const min = Math.max(1, Math.round(segundos / 60));
  return min < 60 ? `${min} min` : `${Math.floor(min / 60)} h ${min % 60 ? `${min % 60} min` : ""}`.trim();
}

export const formatarKm = (metros: number) => (metros / 1000).toFixed(1).replace(".", ",");

// "agora", "há 12 min", "há 3 h", "há 2 d".
export function tempoRelativo(ms: number, agora = Date.now()) {
  const min = Math.max(0, Math.floor((agora - ms) / 60000));
  if (min < 1) return "agora";
  if (min < 60) return `há ${min} min`;
  if (min < 1440) return `há ${Math.floor(min / 60)} h`;
  return `há ${Math.floor(min / 1440)} d`;
}
