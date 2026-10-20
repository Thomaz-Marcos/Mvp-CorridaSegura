import { useEffect, useMemo, useRef, useState } from "react";
import { ROTAS, type Coordenada, type Rota } from "../data/rotas";
import { CENTRO_INICIAL, ZOOM_INICIAL } from "./centroInicial";
import MapaGoogleWebView, { type Camera, type Linha, type Margem, type Ponto } from "./MapaGoogleWebView";

// Mapa de rotas (Google Maps JavaScript num WebView). Na web usa MapaRotas.web.tsx.
const MARGEM: Margem = { top: 60, right: 90, bottom: 40, left: 40 };
const TODOS_OS_PONTOS = ROTAS.flatMap((r) => r.coords);

type Props = { selected: Rota; posicao: Coordenada | null; permitido: boolean | null };

export default function MapaRotas({ selected, posicao, permitido }: Props) {
  const [camera, setCamera] = useState<Camera>();
  const contador = useRef(0);
  const primeiraRota = useRef(true);
  const mover = (c: Omit<Camera, "id">) => setCamera({ id: String(++contador.current), ...c });

  // Centraliza o mapa na posição atual do celular.
  useEffect(() => {
    if (posicao) mover({ centro: posicao, zoom: 15 });
  }, [posicao]);

  // Sem permissão de localização, o mapa enquadra as rotas de exemplo.
  useEffect(() => {
    if (permitido === false) mover({ ajustar: TODOS_OS_PONTOS, margem: MARGEM });
  }, [permitido]);

  // Enquadra a rota quando o usuário toca num card (na abertura o foco é a posição dele).
  useEffect(() => {
    if (primeiraRota.current) {
      primeiraRota.current = false;
      return;
    }
    mover({ ajustar: selected.coords, margem: MARGEM });
  }, [selected]);

  const linhas = useMemo<Linha[]>(
    () =>
      ROTAS.map((r) => {
        const ativa = r.id === selected.id;
        return {
          id: `rota${r.id}`,
          path: r.coords,
          cor: r.color,
          opacidade: ativa ? 1 : 0.4,
          largura: ativa ? 5 : 3,
          tracejada: r.id !== 1,
          z: ativa ? 2 : 1,
        };
      }),
    [selected],
  );

  const pontos = useMemo<Ponto[]>(() => {
    const alertas = ROTAS.flatMap((r) => (r.alerta ? [{ id: `alerta${r.id}`, pos: r.alerta.coord, cor: r.alerta.cor, raio: 7 }] : []));
    return posicao ? [...alertas, { id: "voce", pos: posicao, cor: "#4c8dff", raio: 8, z: 3 }] : alertas;
  }, [posicao]);

  return <MapaGoogleWebView linhas={linhas} pontos={pontos} camera={camera} centroInicial={CENTRO_INICIAL} zoomInicial={ZOOM_INICIAL} />;
}
