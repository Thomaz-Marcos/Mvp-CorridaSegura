/// <reference types="google.maps" />
import { useEffect } from "react";
import { APIProvider, Map, Marker, Polyline, useMap } from "@vis.gl/react-google-maps";
import type { Coordenada } from "../data/rotas";
import { cores } from "../theme";
import { ESTILO_ESCURO } from "./estiloMapa";

const CHAVE = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

const latLng = ({ latitude, longitude }: Coordenada) => ({ lat: latitude, lng: longitude });

type Props = { posicao: Coordenada | null; trajeto: Coordenada[]; permitido: boolean | null };

export default function MapaCorrida({ posicao, trajeto }: Props) {
  return (
    <APIProvider apiKey={CHAVE}>
      <Map
        style={{ position: "absolute", inset: 0 }}
        defaultCenter={{ lat: -23.578, lng: -46.675 }}
        defaultZoom={16}
        styles={ESTILO_ESCURO}
        backgroundColor={cores.bg}
        disableDefaultUI
        gestureHandling="greedy"
      >
        <Conteudo posicao={posicao} trajeto={trajeto} />
      </Map>
    </APIProvider>
  );
}

function Conteudo({ posicao, trajeto }: { posicao: Coordenada | null; trajeto: Coordenada[] }) {
  const mapa = useMap();

  useEffect(() => {
    if (mapa && posicao) mapa.panTo(latLng(posicao));
  }, [mapa, posicao]);

  return (
    <>
      <Polyline path={trajeto.map(latLng)} strokeColor={cores.accent} strokeWeight={5} />
      {posicao ? (
        <Marker
          position={latLng(posicao)}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: cores.accent,
            fillOpacity: 1,
            strokeColor: "#fff",
            strokeWeight: 2,
          }}
        />
      ) : null}
    </>
  );
}
