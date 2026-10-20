import { useEffect, useState } from "react";
import type { Coordenada } from "../data/rotas";

// Rotas a pé entre dois pontos, pela Routes API do Google (inclui alternativas).
// A chave precisa ter a "Routes API" ativada no Google Cloud.
const CHAVE = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

export const MINHA_LOCALIZACAO = "Minha localização";

export type RotaReal = { id: number; metros: number; segundos: number; descricao: string };

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
        "X-Goog-FieldMask": "routes.distanceMeters,routes.duration,routes.description",
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
        return dados as { routes?: { distanceMeters?: number; duration?: string; description?: string }[] };
      })
      .then((dados) => {
        const rotas = (dados.routes ?? []).map((r, i) => ({
          id: i,
          metros: r.distanceMeters ?? 0,
          segundos: parseInt(r.duration ?? "0", 10),
          descricao: r.description ?? "",
        }));
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
