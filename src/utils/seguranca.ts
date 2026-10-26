import type { Alerta, TipoAlerta } from "../data/alertas";
import type { Coordenada } from "../data/coordenada";
import { cores } from "../theme";

// Nota de segurança de uma rota (0–100) a partir dos alertas da comunidade perto do trajeto.
// Cada alerta pesa pelo tipo, perde metade do peso a cada MEIA_VIDA_DIAS e ganha reforço com curtidas
// (curtir = confirmar). Sem alertas por perto a nota é 100: ausência de relato não prova segurança,
// por isso a interface mostra também quantos alertas entraram na conta.

export const RAIO_METROS = 60;
const MEIA_VIDA_DIAS = 10;
const PESO: Record<TipoAlerta, number> = { danger: 20, warn: 8, ok: -5 };
const BONUS_MAXIMO = 10;

export type NotaDaRota = { nota: number; perigos: number; atencoes: number; positivos: number };

const METROS_POR_GRAU = 111_320;

// Distância em metros de um ponto a um segmento, numa projeção plana (basta para dezenas de metros).
function distanciaAoSegmento(p: Coordenada, a: Coordenada, b: Coordenada) {
  const kx = Math.cos((p.latitude * Math.PI) / 180) * METROS_POR_GRAU;
  const ky = METROS_POR_GRAU;
  const ax = (a.longitude - p.longitude) * kx;
  const ay = (a.latitude - p.latitude) * ky;
  const bx = (b.longitude - p.longitude) * kx;
  const by = (b.latitude - p.latitude) * ky;
  const dx = bx - ax;
  const dy = by - ay;
  const quadrado = dx * dx + dy * dy;
  const t = quadrado === 0 ? 0 : Math.max(0, Math.min(1, -(ax * dx + ay * dy) / quadrado));
  return Math.hypot(ax + t * dx, ay + t * dy);
}

export function distanciaAoTrajeto(p: Coordenada, trajeto: Coordenada[]) {
  if (trajeto.length === 1) return distanciaAoSegmento(p, trajeto[0], trajeto[0]);
  let menor = Infinity;
  for (let i = 1; i < trajeto.length; i++) menor = Math.min(menor, distanciaAoSegmento(p, trajeto[i - 1], trajeto[i]));
  return menor;
}

export function notaDaRota(trajeto: Coordenada[], alertas: Alerta[], agora = Date.now()): NotaDaRota {
  const resultado: NotaDaRota = { nota: 100, perigos: 0, atencoes: 0, positivos: 0 };
  if (trajeto.length === 0) return resultado;

  let penalidade = 0;
  let bonus = 0;
  for (const a of alertas) {
    if (!a.posicao || distanciaAoTrajeto(a.posicao, trajeto) > RAIO_METROS) continue;
    const dias = Math.max(0, (agora - a.criadoEm) / (24 * 3600 * 1000));
    const peso = PESO[a.tipo] * 0.5 ** (dias / MEIA_VIDA_DIAS) * (1 + 0.25 * Math.min(a.curtidas, 4));
    if (a.tipo === "ok") {
      bonus += -peso;
      resultado.positivos++;
    } else {
      penalidade += peso;
      if (a.tipo === "danger") resultado.perigos++;
      else resultado.atencoes++;
    }
  }
  resultado.nota = Math.round(Math.max(0, Math.min(100, 100 - penalidade + Math.min(bonus, BONUS_MAXIMO))));
  return resultado;
}

export function rotuloDaNota(nota: number) {
  return nota >= 80 ? "Segura" : nota >= 55 ? "Atenção" : "Evite";
}

export const corDoAlerta = (tipo: TipoAlerta) => (tipo === "danger" ? cores.danger : tipo === "warn" ? cores.warn : cores.safety);

export const corDaNota = (nota: number) => (nota >= 80 ? cores.safety : nota >= 55 ? cores.warn : cores.danger);

export function resumoDosAlertas(n: NotaDaRota) {
  const partes = [
    n.perigos > 0 ? `${n.perigos} ${n.perigos === 1 ? "perigo" : "perigos"}` : null,
    n.atencoes > 0 ? `${n.atencoes} ${n.atencoes === 1 ? "atenção" : "atenções"}` : null,
    n.positivos > 0 ? `${n.positivos} ${n.positivos === 1 ? "positivo" : "positivos"}` : null,
  ].filter(Boolean);
  return partes.length ? partes.join(" · ") : "Sem alertas no trajeto";
}
