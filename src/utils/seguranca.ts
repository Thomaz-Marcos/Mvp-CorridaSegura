import type { Alerta, TipoAlerta } from "../data/alertas";
import type { Coordenada } from "../data/coordenada";
import { cores } from "../theme";

// Nota de uma rota (0–100) a partir dos alertas da comunidade perto do trajeto, separada nos
// 4 critérios do Pace: segurança, trânsito, limpeza e conservação.
//
// Cada critério tem a sua própria nota, calculada como antes: cada alerta pesa pelo tipo, perde
// metade do peso a cada MEIA_VIDA_DIAS e ganha reforço com curtidas (curtir = confirmar).
// A nota final é a média ponderada dos 4 critérios (PESO_DO_CRITERIO). Segurança pesa mais e tem
// uma trava: se a nota de segurança cair em "Evite", a rota não pode ter nota final maior que ela,
// para uma rua limpa e sem buracos não esconder um trecho perigoso.
//
// Sem alertas por perto o critério fica em 100: ausência de relato não prova que a rota é boa,
// por isso a interface mostra também quantos alertas entraram na conta.
//
// Alertas antigos, criados antes do campo "criterio", contam como segurança.

export const RAIO_METROS = 60;
const MEIA_VIDA_DIAS = 10;
const PESO: Record<TipoAlerta, number> = { danger: 20, warn: 8, ok: -5 };
const BONUS_MAXIMO = 10;
const LIMITE_EVITE = 55;
const LIMITE_SEGURA = 80;

export type Criterio = "seguranca" | "transito" | "limpeza" | "conservacao";

export const CRITERIOS: Criterio[] = ["seguranca", "transito", "limpeza", "conservacao"];

export const NOME_DO_CRITERIO: Record<Criterio, string> = {
  seguranca: "Segurança",
  transito: "Trânsito",
  limpeza: "Limpeza",
  conservacao: "Conservação",
};

// Peso de cada critério na nota final (soma 1). Ajustar aqui durante os testes com corredores.
export const PESO_DO_CRITERIO: Record<Criterio, number> = {
  seguranca: 0.4,
  transito: 0.25,
  conservacao: 0.2,
  limpeza: 0.15,
};

export type NotaDaRota = {
  nota: number;
  criterios: Record<Criterio, number>;
  perigos: number;
  atencoes: number;
  positivos: number;
};

// Enquanto o tipo Alerta não tiver o campo, ele é lido como opcional.
type AlertaComCriterio = Alerta & { criterio?: Criterio | null };

const criterioDoAlerta = (a: AlertaComCriterio): Criterio =>
  a.criterio && CRITERIOS.includes(a.criterio) ? a.criterio : "seguranca";

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

const limitar = (n: number) => Math.max(0, Math.min(100, n));

const notasCheias = (): Record<Criterio, number> => ({ seguranca: 100, transito: 100, limpeza: 100, conservacao: 100 });

export function notaDaRota(trajeto: Coordenada[], alertas: AlertaComCriterio[], agora = Date.now()): NotaDaRota {
  const resultado: NotaDaRota = { nota: 100, criterios: notasCheias(), perigos: 0, atencoes: 0, positivos: 0 };
  if (trajeto.length === 0) return resultado;

  const penalidade: Record<Criterio, number> = { seguranca: 0, transito: 0, limpeza: 0, conservacao: 0 };
  const bonus: Record<Criterio, number> = { seguranca: 0, transito: 0, limpeza: 0, conservacao: 0 };

  for (const a of alertas) {
    if (!a.posicao || distanciaAoTrajeto(a.posicao, trajeto) > RAIO_METROS) continue;
    const criterio = criterioDoAlerta(a);
    const dias = Math.max(0, (agora - a.criadoEm) / (24 * 3600 * 1000));
    const peso = PESO[a.tipo] * 0.5 ** (dias / MEIA_VIDA_DIAS) * (1 + 0.25 * Math.min(a.curtidas, 4));
    if (a.tipo === "ok") {
      bonus[criterio] += -peso;
      resultado.positivos++;
    } else {
      penalidade[criterio] += peso;
      if (a.tipo === "danger") resultado.perigos++;
      else resultado.atencoes++;
    }
  }

  let media = 0;
  for (const c of CRITERIOS) {
    const nota = limitar(100 - penalidade[c] + Math.min(bonus[c], BONUS_MAXIMO));
    resultado.criterios[c] = Math.round(nota);
    media += nota * PESO_DO_CRITERIO[c];
  }

  // Trava de segurança: um trecho perigoso não é compensado pelos outros critérios.
  const seguranca = resultado.criterios.seguranca;
  const final = seguranca < LIMITE_EVITE ? Math.min(media, seguranca) : media;
  resultado.nota = Math.round(limitar(final));
  return resultado;
}

export function rotuloDaNota(nota: number) {
  return nota >= LIMITE_SEGURA ? "Segura" : nota >= LIMITE_EVITE ? "Atenção" : "Evite";
}

export const corDoAlerta = (tipo: TipoAlerta) => (tipo === "danger" ? cores.danger : tipo === "warn" ? cores.warn : cores.safety);

export const corDaNota = (nota: number) => (nota >= LIMITE_SEGURA ? cores.safety : nota >= LIMITE_EVITE ? cores.warn : cores.danger);

export function resumoDosAlertas(n: NotaDaRota) {
  const partes = [
    n.perigos > 0 ? `${n.perigos} ${n.perigos === 1 ? "perigo" : "perigos"}` : null,
    n.atencoes > 0 ? `${n.atencoes} ${n.atencoes === 1 ? "atenção" : "atenções"}` : null,
    n.positivos > 0 ? `${n.positivos} ${n.positivos === 1 ? "positivo" : "positivos"}` : null,
  ].filter(Boolean);
  return partes.length ? partes.join(" · ") : "Sem alertas no trajeto";
}

// O critério mais fraco da rota, para a tela mostrar "ponto de atenção: Conservação".
export function piorCriterio(n: NotaDaRota): Criterio {
  return CRITERIOS.reduce((pior, c) => (n.criterios[c] < n.criterios[pior] ? c : pior), "seguranca" as Criterio);
}
