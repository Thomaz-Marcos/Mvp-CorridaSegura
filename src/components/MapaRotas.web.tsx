/// <reference types="google.maps" />
import { useEffect } from "react";
import { APIProvider, Map, Marker, Polyline, useMap } from "@vis.gl/react-google-maps";
import type { Alerta } from "../data/alertas";
import type { Coordenada } from "../data/coordenada";
import { corDoAlerta } from "../utils/seguranca";
import { cores } from "../theme";
import { CENTRO_INICIAL, ZOOM_INICIAL } from "./centroInicial";
import { ESTILO_ESCURO, temaDoMapa } from "./estiloMapa";

// Na web o react-native-maps não funciona, então usamos o Google Maps JavaScript.
// A chave precisa do prefixo EXPO_PUBLIC_ para chegar ao navegador.
const CHAVE = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

const latLng = ({ latitude, longitude }: Coordenada) => ({ lat: latitude, lng: longitude });

type Props = { rota: Coordenada[] | null; posicao: Coordenada | null; alertas: Alerta[] };

export default function MapaRotas({ rota, posicao, alertas }: Props) {
  return (
    <APIProvider apiKey={CHAVE}>
      <Map
        style={{ position: "absolute", inset: 0 }}
        defaultCenter={latLng(CENTRO_INICIAL)}
        defaultZoom={ZOOM_INICIAL}
        styles={temaDoMapa() === "claro" ? undefined : ESTILO_ESCURO}
        backgroundColor={cores.bg}
        disableDefaultUI
        gestureHandling="greedy"
      >
        <Conteudo rota={rota} posicao={posicao} alertas={alertas} />
      </Map>
    </APIProvider>
  );
}

// Fica dentro do <Map> para ter acesso ao mapa já carregado (useMap e o objeto google).
function Conteudo({ rota, posicao, alertas }: Props) {
  const mapa = useMap();

  // Centraliza o mapa na posição do navegador.
  useEffect(() => {
    if (!mapa || !posicao) return;
    mapa.panTo(latLng(posicao));
    mapa.setZoom(15);
  }, [mapa, posicao]);

  // Quando há rota escolhida, o foco passa a ser ela.
  useEffect(() => {
    if (!mapa || !rota || rota.length < 2) return;
    const limites = new google.maps.LatLngBounds();
    rota.forEach((c) => limites.extend(latLng(c)));
    mapa.fitBounds(limites, { top: 60, right: 40, bottom: 40, left: 40 });
  }, [mapa, rota]);

  return (
    <>
      {rota && <Polyline path={rota.map(latLng)} strokeColor="#4c8dff" strokeWeight={5} zIndex={1} />}
      {alertas.map((a) => (a.posicao ? <Marker key={a.id} position={latLng(a.posicao)} icon={bolinha(corDoAlerta(a.tipo), 6)} zIndex={2} title={a.texto} /> : null))}
      {posicao ? <Marker position={latLng(posicao)} icon={bolinha("#4c8dff", 8)} zIndex={3} /> : null}
    </>
  );
}

function bolinha(cor: string, tamanho: number): google.maps.Symbol {
  return {
    path: google.maps.SymbolPath.CIRCLE,
    scale: tamanho,
    fillColor: cor,
    fillOpacity: 1,
    strokeColor: "#fff",
    strokeWeight: 2,
  };
}
