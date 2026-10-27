import type { Coordenada } from "../data/coordenada";

// Como a câmera acompanha o corredor: "seguir" gira para onde ele corre (primeira pessoa), "norte" deixa o norte para cima
// e "rota" enquadra a rota inteira.
export type ModoMapa = "seguir" | "norte" | "rota";

// Câmera em primeira pessoa: inclinada, mas pouco (acima disso o mapa gira demais em cada curva e enjoa).
export const INCLINACAO_PRIMEIRA_PESSOA = 45;
export const ZOOM_PRIMEIRA_PESSOA = 18;
export const ZOOM_NORTE_FIXO = 17.5;
// O centro do mapa fica este tanto à frente do corredor, para ele aparecer na parte de baixo e o caminho à frente ocupar a tela.
const ADIANTE_M = 25;

// Ponto a `metros` de distância de `origem` na direção `rumo` (graus, 0 = norte).
export function pontoAdiante(origem: Coordenada, rumo: number, metros = ADIANTE_M): Coordenada {
  const R = 6371000;
  const rad = (g: number) => (g * Math.PI) / 180;
  const d = metros / R;
  const lat1 = rad(origem.latitude);
  const lon1 = rad(origem.longitude);
  const b = rad(rumo);
  const lat2 = Math.asin(Math.sin(lat1) * Math.cos(d) + Math.cos(lat1) * Math.sin(d) * Math.cos(b));
  const lon2 = lon1 + Math.atan2(Math.sin(b) * Math.sin(d) * Math.cos(lat1), Math.cos(d) - Math.sin(lat1) * Math.sin(lat2));
  return { latitude: (lat2 * 180) / Math.PI, longitude: (lon2 * 180) / Math.PI };
}

// Direção de a para b em graus (0 = norte, 90 = leste).
export function direcaoEmGraus(a: Coordenada, b: Coordenada) {
  const rad = (g: number) => (g * Math.PI) / 180;
  const dLon = rad(b.longitude - a.longitude);
  const y = Math.sin(dLon) * Math.cos(rad(b.latitude));
  const x = Math.cos(rad(a.latitude)) * Math.sin(rad(b.latitude)) - Math.sin(rad(a.latitude)) * Math.cos(rad(b.latitude)) * Math.cos(dLon);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

// Sem GPS ainda, a câmera começa no início da rota olhando para o caminho à frente.
// O rumo vem de um ponto uns 40 m adiante: os primeiros pontos da rota são colados e dão uma direção torta.
const OLHAR_ADIANTE_M = 40;

export function cameraDaRota(rota: Coordenada[]): { posicao: Coordenada; rumo: number } | null {
  if (rota.length < 2) return null;
  const metrosPorGrau = 111320;
  let alvo = rota[rota.length - 1];
  for (const ponto of rota.slice(1)) {
    const dx = (ponto.longitude - rota[0].longitude) * metrosPorGrau * Math.cos((rota[0].latitude * Math.PI) / 180);
    const dy = (ponto.latitude - rota[0].latitude) * metrosPorGrau;
    if (Math.hypot(dx, dy) >= OLHAR_ADIANTE_M) {
      alvo = ponto;
      break;
    }
  }
  return { posicao: rota[0], rumo: direcaoEmGraus(rota[0], alvo) };
}
