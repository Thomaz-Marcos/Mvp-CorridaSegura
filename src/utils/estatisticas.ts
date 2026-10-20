import type { Corrida } from "../data/corridas";

const DIA_MS = 24 * 60 * 60 * 1000;
const DIAS_CURTOS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const INICIAIS = ["D", "S", "T", "Q", "Q", "S", "S"];

const inicioDoDia = (ms: number) => {
  const d = new Date(ms);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

const hora = (d: Date) => `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;

// "Hoje, 07:15", "Ontem, 18:30", "Seg, 06:45" (últimos 7 dias) ou "03/10, 08:00".
export function rotuloDaData(ms: number, agora = Date.now()) {
  const d = new Date(ms);
  const dias = Math.round((inicioDoDia(agora) - inicioDoDia(ms)) / DIA_MS);
  if (dias === 0) return `Hoje, ${hora(d)}`;
  if (dias === 1) return `Ontem, ${hora(d)}`;
  if (dias < 7) return `${DIAS_CURTOS[d.getDay()]}, ${hora(d)}`;
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}, ${hora(d)}`;
}

// Os 7 dias terminando hoje, com os km corridos em cada um.
export function ultimosSeteDias(corridas: Corrida[], agora = Date.now()) {
  const hoje = inicioDoDia(agora);
  return Array.from({ length: 7 }, (_, i) => {
    const inicio = hoje - (6 - i) * DIA_MS;
    const metros = corridas
      .filter((c) => c.iniciadaEm >= inicio && c.iniciadaEm < inicio + DIA_MS)
      .reduce((soma, c) => soma + c.metros, 0);
    return { dia: INICIAIS[new Date(inicio).getDay()], km: metros / 1000 };
  });
}

// Dias seguidos com corrida, contando até hoje (ou até ontem, se hoje ainda não correu).
export function sequenciaDeDias(corridas: Corrida[], agora = Date.now()) {
  const dias = new Set(corridas.map((c) => inicioDoDia(c.iniciadaEm)));
  let dia = inicioDoDia(agora);
  if (!dias.has(dia)) dia -= DIA_MS;
  let total = 0;
  while (dias.has(dia)) {
    total++;
    dia -= DIA_MS;
  }
  return total;
}

// Maior sequência de dias seguidos já alcançada.
export function melhorSequencia(corridas: Corrida[]) {
  const dias = [...new Set(corridas.map((c) => inicioDoDia(c.iniciadaEm)))].sort((a, b) => a - b);
  let melhor = 0;
  let atual = 0;
  dias.forEach((dia, i) => {
    atual = i > 0 && Math.round((dia - dias[i - 1]) / DIA_MS) === 1 ? atual + 1 : 1;
    melhor = Math.max(melhor, atual);
  });
  return melhor;
}

// Corrida noturna: começou entre 20h e 5h.
export const foiNoturna = (c: Corrida) => {
  const h = new Date(c.iniciadaEm).getHours();
  return h >= 20 || h < 5;
};
