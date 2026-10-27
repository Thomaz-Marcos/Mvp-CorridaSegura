import { useCallback, useEffect, useRef, useState } from "react";
import * as Location from "expo-location";
import type { Coordenada } from "../data/coordenada";
import { direcaoEmGraus } from "../utils/camera";

// Ignora leituras com precisão pior que isso e saltos menores que o ruído do GPS.
const PRECISAO_MAXIMA_M = 30;
const PASSO_MINIMO_M = 3;
// Acima desta velocidade (m/s) a direção vem do GPS; abaixo, parado ou andando devagar, vem da bússola.
const VELOCIDADE_CORRENDO = 1.5;
// Quanto tempo depois da última leitura "correndo" a bússola volta a valer.
const ESPERA_BUSSOLA_MS = 3000;
// A bússola oscila: cada leitura pesa só esta fração no valor suavizado (menor = mais estável, mais lento)...
const SUAVIZACAO_BUSSOLA = 0.12;
// ...e o rumo só muda quando o valor suavizado se afasta dele por mais que isto (graus).
const RUIDO_BUSSOLA_GRAUS = 12;
// Intervalo mínimo entre leituras da bússola usadas.
const INTERVALO_BUSSOLA_MS = 150;

// Grava a corrida: pede permissão, acompanha o GPS e soma a distância percorrida.
// Enquanto estiver pausada o tempo para e as leituras do GPS são descartadas.
export default function useCorrida() {
  const [permitido, setPermitido] = useState<boolean | null>(null);
  const [pausada, setPausada] = useState(false);
  const [metros, setMetros] = useState(0);
  const [segundos, setSegundos] = useState(0);
  const [posicao, setPosicao] = useState<Coordenada | null>(null);
  const [trajeto, setTrajeto] = useState<Coordenada[]>([]);
  // Direção em que o corredor está indo (graus, 0 = norte); null até o GPS conseguir calcular.
  const [rumo, setRumo] = useState<number | null>(null);

  const pausadaRef = useRef(false);
  const ultimo = useRef<Coordenada | null>(null);
  const ultimoCorrendo = useRef(0);
  const rumoRef = useRef<number | null>(null);

  useEffect(() => {
    let ativo = true;
    let assinatura: Location.LocationSubscription | undefined;
    let bussola: Location.LocationSubscription | undefined;
    (async () => {
      const { granted } = await Location.requestForegroundPermissionsAsync();
      if (!ativo) return;
      setPermitido(granted);
      if (!granted) return;
      assinatura = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.BestForNavigation, distanceInterval: PASSO_MINIMO_M },
        ({ coords }) => {
          if (pausadaRef.current) return;
          if (coords.accuracy != null && coords.accuracy > PRECISAO_MAXIMA_M) return;
          const atual = { latitude: coords.latitude, longitude: coords.longitude };
          const anterior = ultimo.current;
          ultimo.current = atual;
          setPosicao(atual);
          // heading vem como -1 ou null quando o aparelho está parado ou sem bússola; nesse caso mantém o último.
          if (coords.speed != null && coords.speed >= VELOCIDADE_CORRENDO) ultimoCorrendo.current = Date.now();
          if (coords.heading != null && coords.heading >= 0) definirRumo(coords.heading);
          else if (anterior && distanciaEmMetros(anterior, atual) >= PASSO_MINIMO_M) definirRumo(direcaoEmGraus(anterior, atual));
          if (!anterior) {
            setTrajeto((t) => [...t, atual]);
            return;
          }
          const passo = distanciaEmMetros(anterior, atual);
          if (passo >= PASSO_MINIMO_M) {
            setMetros((m) => m + passo);
            setTrajeto((t) => [...t, atual]);
          }
        },
      );
      // Se a tela saiu antes de a assinatura ficar pronta, solta na hora.
      if (!ativo) assinatura.remove();

      // Parado ou devagar o GPS não sabe para onde você aponta: aí vale a bússola do celular.
      let suave: number | null = null;
      let ultimaLeitura = 0;
      bussola = await Location.watchHeadingAsync(({ trueHeading, magHeading, accuracy }) => {
        const agora = Date.now();
        if (pausadaRef.current || agora - ultimoCorrendo.current < ESPERA_BUSSOLA_MS) {
          suave = null; // ao voltar a valer, recomeça da leitura atual
          return;
        }
        // accuracy 0 = bússola sem calibração; a leitura não é confiável.
        if (accuracy === 0 || agora - ultimaLeitura < INTERVALO_BUSSOLA_MS) return;
        ultimaLeitura = agora;
        const graus = trueHeading >= 0 ? trueHeading : magHeading;
        // Média móvel pelo caminho mais curto do círculo (359° e 1° estão a 2° um do outro).
        suave = suave == null ? graus : (suave + SUAVIZACAO_BUSSOLA * (((graus - suave + 540) % 360) - 180) + 360) % 360;
        const atual = rumoRef.current;
        const diferenca = atual == null ? 360 : Math.abs(((suave - atual + 540) % 360) - 180);
        if (diferenca >= RUIDO_BUSSOLA_GRAUS) definirRumo(suave);
      });
      if (!ativo) bussola.remove();
    })().catch((e) => console.warn("GPS indisponível:", e?.message ?? e));
    return () => {
      ativo = false;
      assinatura?.remove();
      bussola?.remove();
    };

    function definirRumo(graus: number) {
      rumoRef.current = graus;
      setRumo(graus);
    }
  }, []);

  useEffect(() => {
    if (pausada) return;
    const id = setInterval(() => setSegundos((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [pausada]);

  const alternarPausa = useCallback(() => {
    pausadaRef.current = !pausadaRef.current;
    // Ao retomar, o trecho andado durante a pausa não entra na conta.
    if (!pausadaRef.current) ultimo.current = null;
    setPausada(pausadaRef.current);
  }, []);

  return { permitido, pausada, metros, segundos, posicao, trajeto, rumo, alternarPausa };
}

// Fórmula de haversine: distância em metros entre dois pontos da superfície.
export function distanciaEmMetros(a: Coordenada, b: Coordenada) {
  const R = 6371000;
  const rad = (g: number) => (g * Math.PI) / 180;
  const dLat = rad(b.latitude - a.latitude);
  const dLon = rad(b.longitude - a.longitude);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.latitude)) * Math.cos(rad(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
