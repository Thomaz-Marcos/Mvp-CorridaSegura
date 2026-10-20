import { useCallback, useEffect, useRef, useState } from "react";
import * as Location from "expo-location";
import type { Coordenada } from "../data/rotas";

// Ignora leituras com precisão pior que isso e saltos menores que o ruído do GPS.
const PRECISAO_MAXIMA_M = 30;
const PASSO_MINIMO_M = 3;

// Grava a corrida: pede permissão, acompanha o GPS e soma a distância percorrida.
// Enquanto estiver pausada o tempo para e as leituras do GPS são descartadas.
export default function useCorrida() {
  const [permitido, setPermitido] = useState<boolean | null>(null);
  const [pausada, setPausada] = useState(false);
  const [metros, setMetros] = useState(0);
  const [segundos, setSegundos] = useState(0);
  const [posicao, setPosicao] = useState<Coordenada | null>(null);
  const [trajeto, setTrajeto] = useState<Coordenada[]>([]);

  const pausadaRef = useRef(false);
  const ultimo = useRef<Coordenada | null>(null);

  useEffect(() => {
    let ativo = true;
    let assinatura: Location.LocationSubscription | undefined;
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
    })().catch((e) => console.warn("GPS indisponível:", e?.message ?? e));
    return () => {
      ativo = false;
      assinatura?.remove();
    };
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

  return { permitido, pausada, metros, segundos, posicao, trajeto, alternarPausa };
}

// Fórmula de haversine: distância em metros entre dois pontos da superfície.
function distanciaEmMetros(a: Coordenada, b: Coordenada) {
  const R = 6371000;
  const rad = (g: number) => (g * Math.PI) / 180;
  const dLat = rad(b.latitude - a.latitude);
  const dLon = rad(b.longitude - a.longitude);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.latitude)) * Math.cos(rad(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
