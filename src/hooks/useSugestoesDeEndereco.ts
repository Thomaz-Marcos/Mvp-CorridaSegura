import { useEffect, useState } from "react";
import type { Coordenada } from "../data/rotas";

// Sugestões de endereço enquanto a pessoa digita, pela Places API (New) do Google.
// A chave precisa ter a "Places API (New)" ativada no Google Cloud.
const CHAVE = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
const MINIMO_DE_LETRAS = 3;
const ESPERA_MS = 300;

export type Sugestao = { id: string; principal: string; secundario: string; texto: string };

type Previsao = {
  placePrediction?: {
    placeId: string;
    text: { text: string };
    structuredFormat?: { mainText: { text: string }; secondaryText?: { text: string } };
  };
};

// ativo: só busca enquanto o campo está em foco. perto: favorece resultados próximos do celular.
export default function useSugestoesDeEndereco(texto: string, ativo: boolean, perto: Coordenada | null) {
  const [sugestoes, setSugestoes] = useState<Sugestao[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  const busca = texto.trim();
  const pesquisavel = ativo && busca.length >= MINIMO_DE_LETRAS;

  useEffect(() => {
    if (!pesquisavel) return;

    const controle = new AbortController();
    const timer = setTimeout(() => {
      fetch("https://places.googleapis.com/v1/places:autocomplete", {
        method: "POST",
        signal: controle.signal,
        headers: { "Content-Type": "application/json", "X-Goog-Api-Key": CHAVE },
        body: JSON.stringify({
          input: busca,
          languageCode: "pt-BR",
          includedRegionCodes: ["br"],
          ...(perto && {
            locationBias: { circle: { center: { latitude: perto.latitude, longitude: perto.longitude }, radius: 30000 } },
          }),
        }),
      })
        .then(async (r) => {
          const dados = await r.json();
          if (!r.ok) throw new Error(dados.error?.message ?? `Erro ${r.status}`);
          return dados as { suggestions?: Previsao[] };
        })
        .then((dados) => {
          const lista = (dados.suggestions ?? []).flatMap(({ placePrediction: p }) =>
            p
              ? [{
                  id: p.placeId,
                  principal: p.structuredFormat?.mainText.text ?? p.text.text,
                  secundario: p.structuredFormat?.secondaryText?.text ?? "",
                  texto: p.text.text,
                }]
              : [],
          );
          setSugestoes(lista);
          setErro(null);
        })
        .catch((e) => {
          if (e?.name === "AbortError") return;
          console.warn("Sugestões de endereço indisponíveis:", e?.message ?? e);
          setSugestoes([]);
          setErro(e?.message ?? "Não foi possível buscar endereços.");
        });
    }, ESPERA_MS);

    return () => {
      clearTimeout(timer);
      controle.abort();
    };
  }, [busca, pesquisavel, perto]);

  // Resultados antigos ficam guardados, mas só valem enquanto o campo é pesquisável.
  return pesquisavel ? { sugestoes, erro } : { sugestoes: [], erro: null };
}
