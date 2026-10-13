import { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { ROTAS, type Coordenada, type Rota } from "../data/rotas";
import { ESTILO_ESCURO } from "./estiloMapa";

// Mapa real (Google Maps no Android, Apple Maps no iOS). Na web usa MapaRotas.web.tsx.
const REGIAO_INICIAL = {
  latitude: -23.578,
  longitude: -46.675,
  latitudeDelta: 0.07,
  longitudeDelta: 0.07,
};

const MARGEM = { top: 60, right: 90, bottom: 40, left: 40 };
const TODOS_OS_PONTOS = ROTAS.flatMap((r) => r.coords);

type Props = { selected: Rota; posicao: Coordenada | null; permitido: boolean | null };

export default function MapaRotas({ selected, posicao, permitido }: Props) {
  const mapa = useRef<MapView>(null);
  const primeiraRota = useRef(true);

  // Centraliza o mapa na posição atual do celular.
  useEffect(() => {
    if (!posicao) return;
    mapa.current?.animateToRegion({ ...posicao, latitudeDelta: 0.02, longitudeDelta: 0.02 }, 600);
  }, [posicao]);

  // Sem permissão de localização, o mapa enquadra as rotas de exemplo.
  useEffect(() => {
    if (permitido === false) mapa.current?.fitToCoordinates(TODOS_OS_PONTOS, { edgePadding: MARGEM, animated: true });
  }, [permitido]);

  // Enquadra a rota quando o usuário toca num card (na abertura o foco é a posição dele).
  useEffect(() => {
    if (primeiraRota.current) {
      primeiraRota.current = false;
      return;
    }
    mapa.current?.fitToCoordinates(selected.coords, { edgePadding: MARGEM, animated: true });
  }, [selected]);

  return (
    <MapView
      ref={mapa}
      style={StyleSheet.absoluteFill}
      initialRegion={REGIAO_INICIAL}
      customMapStyle={ESTILO_ESCURO}
      userInterfaceStyle="dark"
      showsUserLocation={permitido === true}
      showsMyLocationButton={permitido === true}
      toolbarEnabled={false}
    >
      {ROTAS.map((r) => {
        const ativa = r.id === selected.id;
        return (
          <Polyline
            key={r.id}
            coordinates={r.coords}
            strokeColor={ativa ? r.color : r.color + "66"}
            strokeWidth={ativa ? 5 : 3}
            lineCap="round"
            lineJoin="round"
            lineDashPattern={r.id === 1 ? undefined : [8, 6]}
            zIndex={ativa ? 2 : 1}
          />
        );
      })}

      {ROTAS.map((r) =>
        r.alerta ? (
          <Marker key={`a${r.id}`} coordinate={r.alerta.coord} anchor={{ x: 0.5, y: 0.5 }} tracksViewChanges={false}>
            <MarcadorAlerta cor={r.alerta.cor} />
          </Marker>
        ) : null,
      )}
    </MapView>
  );
}

function MarcadorAlerta({ cor }: { cor: string }) {
  return <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: cor, borderWidth: 2, borderColor: "#fff" }} />;
}
