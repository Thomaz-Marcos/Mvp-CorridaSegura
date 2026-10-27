import { useEffect, useState } from "react";
import type { Coordenada } from "../data/coordenada";

// Rotas a pé entre dois pontos, pela Routes API do Google (inclui alternativas).
// A chave precisa ter a "Routes API" ativada no Google Cloud.
const CHAVE = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

export const MINHA_LOCALIZACAO = "Minha localização";

export type Passo = { instrucao: string; manobra: string; metros: number; fim: Coordenada };
export type RotaReal = { id: number; metros: number; segundos: number; descricao: string; coords: Coordenada[]; passos: Passo[] };

// Decodifica o "encoded polyline" do Google em coordenadas.
function decodificar(texto: string): Coordenada[] {
  const coords: Coordenada[] = [];
  let i = 0;
  let lat = 0;
  let lng = 0;
  const proximo = () => {
    let resultado = 0;
    let deslocamento = 0;
    let byte: number;
    do {
      byte = texto.charCodeAt(i++) - 63;
      resultado |= (byte & 0x1f) << deslocamento;
      deslocamento += 5;
    } while (byte >= 0x20);
    return resultado & 1 ? ~(resultado >> 1) : resultado >> 1;
  };
  while (i < texto.length) {
    lat += proximo();
    lng += proximo();
    coords.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  }
  return coords;
}

const CAMPOS = "routes.distanceMeters,routes.duration,routes.description,routes.polyline.encodedPolyline,routes.legs.steps.navigationInstruction,routes.legs.steps.distanceMeters,routes.legs.steps.endLocation";

type RespostaRotas = {
  routes?: {
    distanceMeters?: number;
    duration?: string;
    description?: string;
    polyline?: { encodedPolyline?: string };
    legs?: { steps?: { navigationInstruction?: { maneuver?: string; instructions?: string }; distanceMeters?: number; endLocation?: { latLng?: Coordenada } }[] }[];
  }[];
};

const paraRotas = (dados: RespostaRotas): RotaReal[] =>
  (dados.routes ?? []).map((r, i) => ({
    id: i,
    metros: r.distanceMeters ?? 0,
    segundos: parseInt(r.duration ?? "0", 10),
    descricao: r.description ?? "",
    coords: decodificar(r.polyline?.encodedPolyline ?? ""),
    passos: (r.legs ?? [])
      .flatMap((l) => l.steps ?? [])
      .flatMap((p) =>
        p.endLocation?.latLng
          ? [{ instrucao: p.navigationInstruction?.instructions ?? "", manobra: p.navigationInstruction?.maneuver ?? "STRAIGHT", metros: p.distanceMeters ?? 0, fim: p.endLocation.latLng }]
          : [],
      ),
  }));

// A melhor rota a pé entre duas coordenadas (null se o Google não achar caminho).
export async function rotaAte(origem: Coordenada, destino: Coordenada, sinal?: AbortSignal): Promise<RotaReal | null> {
  const r = await fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
    method: "POST",
    signal: sinal,
    headers: { "Content-Type": "application/json", "X-Goog-Api-Key": CHAVE, "X-Goog-FieldMask": CAMPOS },
    body: JSON.stringify({
      origin: { location: { latLng: origem } },
      destination: { location: { latLng: destino } },
      travelMode: "WALK",
      languageCode: "pt-BR",
      units: "METRIC",
    }),
  });
  const dados = await r.json();
  if (!r.ok) throw new Error(dados.error?.message ?? `Erro ${r.status}`);
  return paraRotas(dados as RespostaRotas)[0] ?? null;
}

type Ponto = { address: string } | { location: { latLng: { latitude: number; longitude: number } } };

function ponto(texto: string, posicao: Coordenada | null): Ponto | null {
  if (texto === MINHA_LOCALIZACAO) return posicao ? { location: { latLng: posicao } } : null;
  return { address: texto };
}

// ativo: só busca quando origem e destino estão definidos.
export default function useRotasReais(origem: string, destino: string, ativo: boolean, posicao: Coordenada | null) {
  const [resultado, setResultado] = useState<{ chave: string; rotas: RotaReal[]; erro: string | null } | null>(null);

  const partida = ponto(origem, posicao);
  const chave = `${origem}|${destino}`;
  // "Minha localização" espera o GPS responder antes de buscar.
  const pronto = ativo && partida !== null;
  const latitude = posicao?.latitude;
  const longitude = posicao?.longitude;

  useEffect(() => {
    if (!pronto) return;
    const controle = new AbortController();
    const origemPonto = ponto(origem, latitude != null && longitude != null ? { latitude, longitude } : null);
    fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
      method: "POST",
      signal: controle.signal,
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": CHAVE,
        "X-Goog-FieldMask": CAMPOS,
      },
      body: JSON.stringify({
        origin: origemPonto,
        destination: { address: destino },
        travelMode: "WALK",
        computeAlternativeRoutes: true,
        languageCode: "pt-BR",
        units: "METRIC",
      }),
    })
      .then(async (r) => {
        const dados = await r.json();
        if (!r.ok) throw new Error(dados.error?.message ?? `Erro ${r.status}`);
        return dados as RespostaRotas;
      })
      .then((dados) => {
        const rotas = paraRotas(dados);
        setResultado({ chave, rotas, erro: null });
      })
      .catch((e) => {
        if (e?.name === "AbortError") return;
        console.warn("Rotas indisponíveis:", e?.message ?? e);
        setResultado({ chave, rotas: [], erro: e?.message ?? "Não foi possível calcular a rota." });
      });
    return () => controle.abort();
  }, [pronto, origem, destino, chave, latitude, longitude]);

  // O resultado só vale para o par origem/destino que foi pedido.
  const atual = pronto && resultado?.chave === chave ? resultado : null;
  return { rotas: atual?.rotas ?? [], erro: atual?.erro ?? null, carregando: pronto && atual === null };
}
