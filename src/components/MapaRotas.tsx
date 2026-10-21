import { useEffect, useMemo, useRef, useState } from "react";
import type { Coordenada } from "../data/coordenada";
import { CENTRO_INICIAL, ZOOM_INICIAL } from "./centroInicial";
import MapaGoogleWebView, { type Camera, type Linha, type Margem, type Ponto } from "./MapaGoogleWebView";

// Mapa da aba Mapa (Google Maps JavaScript num WebView): sua posição e a rota escolhida, se houver. Na web usa MapaRotas.web.tsx.
const MARGEM: Margem = { top: 60, right: 40, bottom: 40, left: 40 };

type Props = { rota: Coordenada[] | null; posicao: Coordenada | null };

export default function MapaRotas({ rota, posicao }: Props) {
  const [camera, setCamera] = useState<Camera>();
  const contador = useRef(0);
  const mover = (c: Omit<Camera, "id">) => setCamera({ id: String(++contador.current), ...c });

  // Centraliza o mapa na posição atual do celular.
  useEffect(() => {
    if (posicao) mover({ centro: posicao, zoom: 15 });
  }, [posicao]);

  // Quando há rota escolhida, o foco passa a ser ela.
  useEffect(() => {
    if (rota && rota.length > 1) mover({ ajustar: rota, margem: MARGEM });
  }, [rota]);

  const linhas = useMemo<Linha[]>(() => (rota ? [{ id: "rota", path: rota, cor: "#4c8dff", largura: 5, z: 1 }] : []), [rota]);

  const pontos = useMemo<Ponto[]>(() => (posicao ? [{ id: "voce", pos: posicao, cor: "#4c8dff", raio: 8, z: 3 }] : []), [posicao]);

  return <MapaGoogleWebView linhas={linhas} pontos={pontos} camera={camera} centroInicial={CENTRO_INICIAL} zoomInicial={ZOOM_INICIAL} />;
}
