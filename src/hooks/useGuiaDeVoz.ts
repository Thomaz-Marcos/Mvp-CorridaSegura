import { useEffect, useRef } from "react";
import { Vibration } from "react-native";
import * as Speech from "expo-speech";
import type { Coordenada } from "../data/coordenada";
import { distanciaAoTrajeto } from "../utils/seguranca";
import useNavegacao from "./useNavegacao";
import type { RotaReal } from "./useRotasReais";

// Avisa a curva com antecedência, vibra ao chegar nela e alerta quando o corredor sai da rota.
const AVISO_CURVA_M = 80;
const VIBRA_CURVA_M = 25;
const FORA_DA_ROTA_M = 40;
// Só conta como desvio depois de ficar fora por este tempo (o GPS dá saltos), e repete o alerta a cada tanto.
const TEMPO_FORA_MS = 5000;
const REPETIR_DESVIO_MS = 30000;

const falar = (texto: string) => {
  Speech.stop();
  Speech.speak(texto, { language: "pt-BR" });
};

const arredondar = (metros: number) => Math.max(10, Math.round(metros / 10) * 10);

export default function useGuiaDeVoz(rota: RotaReal | null, posicao: Coordenada | null, metros: number, ligado: boolean) {
  const { atual, ateCurva } = useNavegacao(rota, posicao, metros);
  const avisadas = useRef(new Set<string>());
  const foraDesde = useRef<number | null>(null);
  const ultimoDesvio = useRef(0);
  const desviou = useRef(false);

  useEffect(() => {
    if (!rota || !posicao) return;

    const agora = Date.now();
    const fora = rota.coords.length > 1 && distanciaAoTrajeto(posicao, rota.coords) > FORA_DA_ROTA_M;
    if (fora) {
      foraDesde.current ??= agora;
      if (agora - foraDesde.current >= TEMPO_FORA_MS && agora - ultimoDesvio.current >= REPETIR_DESVIO_MS) {
        ultimoDesvio.current = agora;
        desviou.current = true;
        Vibration.vibrate([0, 400, 200, 400]);
        if (ligado) falar("Você saiu da rota.");
      }
      return;
    }
    foraDesde.current = null;
    if (desviou.current) {
      desviou.current = false;
      ultimoDesvio.current = 0;
      if (ligado) falar("De volta à rota.");
    }

    if (!atual) return;
    const curva = `${atual.fim.latitude},${atual.fim.longitude}`;
    if (ateCurva <= AVISO_CURVA_M && !avisadas.current.has(`antes:${curva}`)) {
      avisadas.current.add(`antes:${curva}`);
      if (ligado && atual.instrucao) falar(`Em ${arredondar(ateCurva)} metros, ${atual.instrucao}`);
    }
    if (ateCurva <= VIBRA_CURVA_M && !avisadas.current.has(`agora:${curva}`)) {
      avisadas.current.add(`agora:${curva}`);
      Vibration.vibrate([0, 150, 100, 150]);
    }
  }, [rota, posicao, atual, ateCurva, ligado]);

  // Ao sair da corrida, para a fala que estiver em andamento.
  useEffect(() => () => void Speech.stop(), []);
}
