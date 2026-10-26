import { useEffect, useMemo, useRef } from "react";
import { StyleSheet } from "react-native";
import { WebView, type WebViewMessageEvent } from "react-native-webview";
import type { Coordenada } from "../data/coordenada";
import { cores } from "../theme";
import { ESTILO_ESCURO } from "./estiloMapa";

// Google Maps JavaScript dentro de um WebView. O mapa nativo do Android (react-native-maps) depende de
// uma chave embutida no build e fica preto no Expo Go; assim a mesma chave e API da web funcionam no celular.
const CHAVE = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
// Girar e inclinar o mapa exige o mapa vetorial, que só liga com um Map ID. DEMO_MAP_ID serve para testar;
// para produção crie um Map ID vetorial no Google Cloud e ponha em EXPO_PUBLIC_GOOGLE_MAPS_MAP_ID.
const MAP_ID = process.env.EXPO_PUBLIC_GOOGLE_MAPS_MAP_ID ?? "DEMO_MAP_ID";

export type Linha = {
  id: string;
  path: Coordenada[];
  cor: string;
  opacidade?: number;
  largura?: number;
  tracejada?: boolean;
  z?: number;
};

export type Ponto = { id: string; pos: Coordenada; cor: string; raio?: number; z?: number; icone?: { url: string; tamanho: number } };

export type Margem = { top: number; right: number; bottom: number; left: number };

// Cada mudança de `id` move a câmera uma vez: centraliza (centro + zoom, com rumo e inclinação opcionais)
// ou enquadra os pontos de `ajustar`.
export type Camera = { id: string; centro?: Coordenada; zoom?: number; rumo?: number; inclinacao?: number; ajustar?: Coordenada[]; margem?: Margem };

type Props = {
  linhas: Linha[];
  pontos: Ponto[];
  camera?: Camera;
  centroInicial: Coordenada;
  zoomInicial: number;
  // Mapa vetorial: permite girar e inclinar. Desliga o `styles` (o tema escuro vem do colorScheme).
  inclinavel?: boolean;
};

const latLng = ({ latitude, longitude }: Coordenada) => ({ lat: latitude, lng: longitude });

function converter({ linhas, pontos, camera }: Pick<Props, "linhas" | "pontos" | "camera">) {
  return JSON.stringify({
    linhas: linhas.map((l) => ({ ...l, path: l.path.map(latLng) })),
    pontos: pontos.map((p) => ({ ...p, pos: latLng(p.pos) })),
    camera: camera && {
      id: camera.id,
      centro: camera.centro && latLng(camera.centro),
      zoom: camera.zoom,
      rumo: camera.rumo,
      inclinacao: camera.inclinacao,
      ajustar: camera.ajustar?.map(latLng),
      margem: camera.margem,
    },
  });
}

function montarHtml(centro: Coordenada, zoom: number, inclinavel: boolean) {
  return `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<style>
  html, body, #mapa { margin: 0; padding: 0; height: 100%; width: 100%; background: ${cores.bg}; }
</style>
</head>
<body>
<div id="mapa"></div>
<script>
  var mapa, linhas = {}, pontos = {}, cameraAtual = null, pendente = null;

  function enviar(msg) {
    if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(msg);
  }

  function iniciar() {
    mapa = new google.maps.Map(document.getElementById('mapa'), {
      center: ${JSON.stringify(latLng(centro))},
      zoom: ${zoom},
      ${inclinavel
        ? `mapId: ${JSON.stringify(MAP_ID)}, renderingType: google.maps.RenderingType.VECTOR, colorScheme: google.maps.ColorScheme.DARK,`
        : `styles: ${JSON.stringify(ESTILO_ESCURO)},`}
      backgroundColor: '${cores.bg}',
      disableDefaultUI: true,
      gestureHandling: 'greedy',
      clickableIcons: false
    });
    google.maps.event.addListenerOnce(mapa, 'idle', function () { enviar('pronto'); });
    if (pendente) { aplicar(pendente); pendente = null; }
  }

  function aplicar(estado) {
    if (!mapa) { pendente = estado; return; }

    var vistas = {};
    estado.linhas.forEach(function (l) {
      vistas[l.id] = true;
      var opacidade = l.opacidade == null ? 1 : l.opacidade;
      var largura = l.largura || 5;
      var opcoes = {
        path: l.path,
        strokeColor: l.cor,
        strokeWeight: largura,
        strokeOpacity: l.tracejada ? 0 : opacidade,
        zIndex: l.z || 1,
        icons: l.tracejada ? [{
          icon: { path: 'M 0,-1 0,1', strokeColor: l.cor, strokeOpacity: opacidade, strokeWeight: largura, scale: 2 },
          offset: '0',
          repeat: '14px'
        }] : []
      };
      if (linhas[l.id]) linhas[l.id].setOptions(opcoes);
      else linhas[l.id] = new google.maps.Polyline(Object.assign({ map: mapa }, opcoes));
    });
    Object.keys(linhas).forEach(function (id) {
      if (!vistas[id]) { linhas[id].setMap(null); delete linhas[id]; }
    });

    var vistos = {};
    estado.pontos.forEach(function (p) {
      vistos[p.id] = true;
      var opcoes = {
        position: p.pos,
        zIndex: p.z || 1,
        icon: p.icone ? {
          url: p.icone.url,
          scaledSize: new google.maps.Size(p.icone.tamanho, p.icone.tamanho),
          anchor: new google.maps.Point(p.icone.tamanho / 2, p.icone.tamanho / 2)
        } : {
          path: google.maps.SymbolPath.CIRCLE,
          scale: p.raio || 8,
          fillColor: p.cor,
          fillOpacity: 1,
          strokeColor: '#fff',
          strokeWeight: 2
        }
      };
      if (pontos[p.id]) pontos[p.id].setOptions(opcoes);
      else pontos[p.id] = new google.maps.Marker(Object.assign({ map: mapa }, opcoes));
    });
    Object.keys(pontos).forEach(function (id) {
      if (!vistos[id]) { pontos[id].setMap(null); delete pontos[id]; }
    });

    var cam = estado.camera;
    if (cam && cam.id !== cameraAtual) {
      cameraAtual = cam.id;
      if (cam.ajustar && cam.ajustar.length) {
        var limites = new google.maps.LatLngBounds();
        cam.ajustar.forEach(function (c) { limites.extend(c); });
        if (mapa.getHeading() || mapa.getTilt()) mapa.moveCamera({ heading: 0, tilt: 0 });
        mapa.fitBounds(limites, cam.margem || 40);
      } else if (cam.centro && cam.rumo != null) {
        mapa.moveCamera({ center: cam.centro, zoom: cam.zoom, heading: cam.rumo, tilt: cam.inclinacao || 0 });
      } else if (cam.centro) {
        mapa.panTo(cam.centro);
        if (cam.zoom) mapa.setZoom(cam.zoom);
      }
    }
  }
  window.aplicar = aplicar;
</script>
<script async src="https://maps.googleapis.com/maps/api/js?key=${CHAVE}&callback=iniciar&language=pt-BR&v=weekly"
  onerror="window.ReactNativeWebView && window.ReactNativeWebView.postMessage('erro')"></script>
</body>
</html>`;
}

export default function MapaGoogleWebView({ linhas, pontos, camera, centroInicial, zoomInicial, inclinavel = false }: Props) {
  const webview = useRef<WebView<object>>(null);
  const pronto = useRef(false);

  const estado = useMemo(() => converter({ linhas, pontos, camera }), [linhas, pontos, camera]);
  const estadoAtual = useRef(estado);

  // O HTML é montado uma vez; depois o app só manda o estado novo, sem recarregar (não reseta o zoom).
  const source = useMemo(() => ({ html: montarHtml(centroInicial, zoomInicial, inclinavel) }), []); // eslint-disable-line react-hooks/exhaustive-deps

  const enviar = (json: string) => webview.current?.injectJavaScript(`window.aplicar(${json}); true;`);

  useEffect(() => {
    estadoAtual.current = estado;
    if (pronto.current) enviar(estado);
  }, [estado]);

  const aoReceber = (e: WebViewMessageEvent) => {
    if (e.nativeEvent.data !== "pronto") return;
    pronto.current = true;
    enviar(estadoAtual.current);
  };

  return (
    <WebView
      ref={webview}
      source={source}
      style={[StyleSheet.absoluteFill, { backgroundColor: cores.bg }]}
      originWhitelist={["*"]}
      javaScriptEnabled
      onMessage={aoReceber}
      scrollEnabled={false}
      overScrollMode="never"
      nestedScrollEnabled
      setSupportMultipleWindows={false}
      androidLayerType="hardware"
      domStorageEnabled
    />
  );
}
