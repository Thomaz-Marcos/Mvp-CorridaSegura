import { useEffect, useState } from "react";
import { Platform } from "react-native";
import * as Location from "expo-location";
import type { Coordenada } from "../data/coordenada";

// Pede a permissão uma vez e devolve a posição atual do aparelho.
// permitido: null enquanto espera a resposta, depois true/false.
export default function usePosicao() {
  const [posicao, setPosicao] = useState<Coordenada | null>(null);
  const [permitido, setPermitido] = useState<boolean | null>(null);

  useEffect(() => {
    let ativo = true;
    (async () => {
      const { granted } = await Location.requestForegroundPermissionsAsync();
      if (!ativo) return;
      setPermitido(granted);
      if (!granted) return;

      // A última posição conhecida chega na hora; a do GPS pode levar alguns segundos.
      const ultima = await Location.getLastKnownPositionAsync();
      if (ultima && ativo) setPosicao(coordenada(ultima.coords));
      // No computador não há GPS: lá a alta precisão pode demorar ou falhar.
      const precisao = Platform.OS === "web" ? Location.Accuracy.Balanced : Location.Accuracy.High;
      const atual = await Location.getCurrentPositionAsync({ accuracy: precisao });
      if (ativo) setPosicao(coordenada(atual.coords));
    })().catch((e) => console.warn("Localização indisponível:", e?.message ?? e));
    return () => {
      ativo = false;
    };
  }, []);

  return { posicao, permitido };
}

const coordenada = ({ latitude, longitude }: Coordenada): Coordenada => ({ latitude, longitude });
