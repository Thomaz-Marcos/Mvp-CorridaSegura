import { useMemo } from "react";
import type { Coordenada } from "../data/rotas";
import { cores } from "../theme";
import MapaGoogleWebView, { type Camera, type Linha, type Ponto } from "./MapaGoogleWebView";

// Mapa da corrida: segue o corredor e desenha o trajeto percorrido. Na web usa MapaCorrida.web.tsx.
type Props = { posicao: Coordenada | null; trajeto: Coordenada[]; permitido: boolean | null };

const CENTRO_INICIAL = { latitude: -23.578, longitude: -46.675 };

export default function MapaCorrida({ posicao, trajeto }: Props) {
  const linhas = useMemo<Linha[]>(() => [{ id: "trajeto", path: trajeto, cor: cores.accent, largura: 5 }], [trajeto]);
  const pontos = useMemo<Ponto[]>(
    () => (posicao ? [{ id: "voce", pos: posicao, cor: cores.accent, raio: 8, z: 3 }] : []),
    [posicao],
  );
  const camera = useMemo<Camera | undefined>(
    () => (posicao ? { id: `${posicao.latitude},${posicao.longitude}`, centro: posicao, zoom: 16 } : undefined),
    [posicao],
  );

  return (
    <MapaGoogleWebView linhas={linhas} pontos={pontos} camera={camera} centroInicial={CENTRO_INICIAL} zoomInicial={16} />
  );
}
