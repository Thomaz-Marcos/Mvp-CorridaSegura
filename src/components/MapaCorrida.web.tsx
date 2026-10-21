/// <reference types="google.maps" />
import { useEffect, useMemo } from "react";
import { APIProvider, Map, Marker, Polyline, useMap } from "@vis.gl/react-google-maps";
import type { Coordenada } from "../data/coordenada";
import { cores } from "../theme";
import { cameraDaRota, INCLINACAO_PRIMEIRA_PESSOA, pontoAdiante, ZOOM_PRIMEIRA_PESSOA } from "../utils/camera";
import { CENTRO_INICIAL, ZOOM_INICIAL } from "./centroInicial";
import { ICONE_CORREDOR, TAMANHO_ICONE_CORREDOR } from "./iconeCorredor";

const CHAVE = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
// Girar e inclinar o mapa exige o mapa vetorial (Map ID); ver MapaGoogleWebView.tsx.
const MAP_ID = process.env.EXPO_PUBLIC_GOOGLE_MAPS_MAP_ID ?? "DEMO_MAP_ID";

const latLng = ({ latitude, longitude }: Coordenada) => ({ lat: latitude, lng: longitude });

type Props = { posicao: Coordenada | null; rumo: number | null; trajeto: Coordenada[]; rota: Coordenada[]; visaoGeral: boolean; permitido: boolean | null };

export default function MapaCorrida({ posicao, rumo, trajeto, rota, visaoGeral }: Props) {
  return (
    <APIProvider apiKey={CHAVE}>
      <Map
        style={{ position: "absolute", inset: 0 }}
        defaultCenter={latLng(CENTRO_INICIAL)}
        defaultZoom={ZOOM_INICIAL}
        mapId={MAP_ID}
        renderingType={"VECTOR" as google.maps.RenderingType}
        colorScheme="DARK"
        backgroundColor={cores.bg}
        disableDefaultUI
        gestureHandling="greedy"
      >
        <Conteudo posicao={posicao} rumo={rumo} trajeto={trajeto} rota={rota} visaoGeral={visaoGeral} />
      </Map>
    </APIProvider>
  );
}

function Conteudo({ posicao, rumo, trajeto, rota, visaoGeral }: { posicao: Coordenada | null; rumo: number | null; trajeto: Coordenada[]; rota: Coordenada[]; visaoGeral: boolean }) {
  const mapa = useMap();
  const inicio = useMemo(() => cameraDaRota(rota), [rota]);
  const ondeEstou = posicao ?? inicio?.posicao;

  // Visão geral enquadra a rota toda; fora dela a câmera fica em primeira pessoa (sem GPS, no início da rota).
  useEffect(() => {
    if (!mapa) return;
    if (visaoGeral && rota.length > 1) {
      const limites = new google.maps.LatLngBounds();
      rota.forEach((c) => limites.extend(latLng(c)));
      if (mapa.getHeading() || mapa.getTilt()) mapa.moveCamera({ heading: 0, tilt: 0 });
      mapa.fitBounds(limites, { top: 150, right: 30, bottom: 220, left: 30 });
      return;
    }
    const base = ondeEstou;
    if (!base) return;
    const graus = rumo ?? inicio?.rumo ?? 0;
    mapa.moveCamera({ center: latLng(pontoAdiante(base, graus)), zoom: ZOOM_PRIMEIRA_PESSOA, heading: graus, tilt: INCLINACAO_PRIMEIRA_PESSOA });
  }, [mapa, ondeEstou, inicio, rumo, rota, visaoGeral]);

  return (
    <>
      <Polyline path={rota.map(latLng)} strokeColor="#4c8dff" strokeOpacity={0.9} strokeWeight={9} zIndex={1} />
      <Polyline path={trajeto.map(latLng)} strokeColor={cores.accent} strokeWeight={6} zIndex={2} />
      {ondeEstou ? (
        <Marker
          position={latLng(ondeEstou)}
          icon={{
            url: ICONE_CORREDOR,
            scaledSize: new google.maps.Size(TAMANHO_ICONE_CORREDOR, TAMANHO_ICONE_CORREDOR),
            anchor: new google.maps.Point(TAMANHO_ICONE_CORREDOR / 2, TAMANHO_ICONE_CORREDOR / 2),
          }}
          zIndex={3}
        />
      ) : null}
    </>
  );
}
