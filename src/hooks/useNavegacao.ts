import { useState } from "react";
import type { Coordenada } from "../data/rotas";
import type { Passo, RotaReal } from "./useRotasReais";
import { distanciaEmMetros } from "./useCorrida";

// Considera a curva "feita" quando o corredor chega a esta distância do fim do passo.
const RAIO_CURVA_M = 20;

// Acompanha a rota planejada: qual é a próxima curva, a distância até ela e o que falta para chegar.
export default function useNavegacao(rota: RotaReal | null, posicao: Coordenada | null, metrosPercorridos: number) {
  const [indice, setIndice] = useState(0);
  const passos = rota?.passos ?? [];

  // Só avança: depois de passar de uma curva, ela não volta a ser a atual.
  if (posicao && indice < passos.length - 1 && distanciaEmMetros(posicao, passos[indice].fim) < RAIO_CURVA_M) {
    setIndice(indice + 1);
  }

  const atual: Passo | undefined = passos[indice];
  const seguinte: Passo | undefined = passos[indice + 1];
  const ateCurva = atual && posicao ? distanciaEmMetros(posicao, atual.fim) : atual?.metros ?? 0;

  const restanteM = rota ? Math.max(rota.metros - metrosPercorridos, 0) : 0;
  const restanteS = rota && rota.metros > 0 ? Math.round(rota.segundos * (restanteM / rota.metros)) : 0;

  return { atual, seguinte, ateCurva, restanteM, restanteS };
}
