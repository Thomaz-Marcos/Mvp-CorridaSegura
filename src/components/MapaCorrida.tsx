import { useMemo } from "react";
import type { Coordenada } from "../data/coordenada";
import { cores } from "../theme";
import { ICONE_CORREDOR, TAMANHO_ICONE_CORREDOR } from "./iconeCorredor";
import { cameraDaRota, INCLINACAO_PRIMEIRA_PESSOA, pontoAdiante, ZOOM_NORTE_FIXO, ZOOM_PRIMEIRA_PESSOA, type ModoMapa } from "../utils/camera";
import { CENTRO_INICIAL, ZOOM_INICIAL } from "./centroInicial";
import MapaGoogleWebView, { type Camera, type Linha, type Ponto } from "./MapaGoogleWebView";

// Mapa da corrida: segue o corredor (zoom de navegação, visão em primeira pessoa: girado para onde ele corre e bem inclinado), desenha a rota planejada e o trajeto percorrido.
// Na visão geral enquadra a rota inteira. Na web usa MapaCorrida.web.tsx.
type Props = { posicao: Coordenada | null; rumo: number | null; trajeto: Coordenada[]; rota: Coordenada[]; modo: ModoMapa; permitido: boolean | null };

export default function MapaCorrida({ posicao, rumo, trajeto, rota, modo }: Props) {
  const linhas = useMemo<Linha[]>(
    () => [
      { id: "rota", path: rota, cor: "#4c8dff", largura: 9, opacidade: 0.9, z: 1 },
      { id: "trajeto", path: trajeto, cor: cores.accent, largura: 6, z: 2 },
    ],
    [rota, trajeto],
  );
  // Sem GPS ainda, o corredor aparece no início da rota.
  const inicio = useMemo(() => cameraDaRota(rota), [rota]);
  const ondeEstou = posicao ?? inicio?.posicao;
  const pontos = useMemo<Ponto[]>(
    () => (ondeEstou ? [{ id: "voce", pos: ondeEstou, cor: cores.accent, z: 3, icone: { url: ICONE_CORREDOR, tamanho: TAMANHO_ICONE_CORREDOR } }] : []),
    [ondeEstou],
  );
  const camera = useMemo<Camera | undefined>(() => {
    if (modo === "rota" && rota.length > 1) return { id: "geral", ajustar: rota, margem: { top: 150, right: 30, bottom: 220, left: 30 } };
    // Sem GPS ainda, usa o início da rota para a câmera já mostrar o caminho à frente.
    const base = ondeEstou;
    if (!base) return undefined;
    if (modo === "norte") return { id: `norte:${base.latitude},${base.longitude}`, centro: base, zoom: ZOOM_NORTE_FIXO, rumo: 0, inclinacao: 0 };
    const graus = Math.round(rumo ?? inicio?.rumo ?? 0);
    return { id: `${base.latitude},${base.longitude},${graus}`, centro: pontoAdiante(base, graus), zoom: ZOOM_PRIMEIRA_PESSOA, rumo: graus, inclinacao: INCLINACAO_PRIMEIRA_PESSOA };
  }, [ondeEstou, inicio, rumo, rota, modo]);

  return (
    <MapaGoogleWebView linhas={linhas} pontos={pontos} camera={camera} centroInicial={CENTRO_INICIAL} zoomInicial={ZOOM_INICIAL} inclinavel />
  );
}
