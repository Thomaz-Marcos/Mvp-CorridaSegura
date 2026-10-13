/// <reference types="google.maps" />
import { useEffect, useRef } from "react";
import { APIProvider, Map, Marker, Polyline, useMap } from "@vis.gl/react-google-maps";
import { ROTAS, type Coordenada, type Rota } from "../data/rotas";
import { cores } from "../theme";
import { ESTILO_ESCURO } from "./estiloMapa";

// Na web o react-native-maps não funciona, então usamos o Google Maps JavaScript.
// A chave precisa do prefixo EXPO_PUBLIC_ para chegar ao navegador.
const CHAVE = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

const latLng = ({ latitude, longitude }: Coordenada) => ({ lat: latitude, lng: longitude });

type Props = { selected: Rota; posicao: Coordenada | null; permitido: boolean | null };

export default function MapaRotas({ selected, posicao }: Props) {
  return (
    <APIProvider apiKey={CHAVE}>
      <Map
        style={{ position: "absolute", inset: 0 }}
        defaultCenter={{ lat: -23.578, lng: -46.675 }}
        defaultZoom={13}
        styles={ESTILO_ESCURO}
        backgroundColor={cores.bg}
        disableDefaultUI
        gestureHandling="greedy"
      >
        <Conteudo selected={selected} posicao={posicao} />
      </Map>
    </APIProvider>
  );
}

// Fica dentro do <Map> para ter acesso ao mapa já carregado (useMap e o objeto google).
function Conteudo({ selected, posicao }: { selected: Rota; posicao: Coordenada | null }) {
  const mapa = useMap();
  const primeiraRota = useRef(true);

  // Centraliza o mapa na posição do navegador.
  useEffect(() => {
    if (!mapa || !posicao) return;
    mapa.panTo(latLng(posicao));
    mapa.setZoom(15);
  }, [mapa, posicao]);

  // Enquadra a rota quando o usuário toca num card (na abertura o foco é a posição dele).
  useEffect(() => {
    if (!mapa) return;
    if (primeiraRota.current) {
      primeiraRota.current = false;
      return;
    }
    const limites = new google.maps.LatLngBounds();
    selected.coords.forEach((c) => limites.extend(latLng(c)));
    mapa.fitBounds(limites, { top: 60, right: 90, bottom: 40, left: 40 });
  }, [mapa, selected]);

  return (
    <>
      {ROTAS.map((r) => {
        const ativa = r.id === selected.id;
        const opacidade = ativa ? 1 : 0.4;
        const largura = ativa ? 5 : 3;
        // Linha tracejada no Google Maps JS é feita com um símbolo repetido.
        const tracejada = r.id !== 1;
        return (
          <Polyline
            key={r.id}
            path={r.coords.map(latLng)}
            strokeColor={r.color}
            strokeOpacity={tracejada ? 0 : opacidade}
            strokeWeight={largura}
            zIndex={ativa ? 2 : 1}
            icons={
              tracejada
                ? [{
                    icon: { path: "M 0,-1 0,1", strokeColor: r.color, strokeOpacity: opacidade, strokeWeight: largura, scale: 2 },
                    offset: "0",
                    repeat: "14px",
                  }]
                : undefined
            }
          />
        );
      })}

      {ROTAS.map((r) =>
        r.alerta ? (
          <Marker key={`a${r.id}`} position={latLng(r.alerta.coord)} icon={bolinha(r.alerta.cor, 7)} />
        ) : null,
      )}

      {/* Você */}
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
