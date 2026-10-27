import type { Coordenada } from "./coordenada";
import { distanciaEmMetros } from "../hooks/useCorrida";

// Lugares úteis para quem corre, buscados pela Places API (New) do Google (a chave precisa ter ela ativada).
const CHAVE = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
const RAIO_M = 5000;

export type CategoriaLugar = { id: string; label: string; tipos: string[] };

export const CATEGORIAS: CategoriaLugar[] = [
  { id: "hospital", label: "Hospital", tipos: ["hospital"] },
  { id: "delegacia", label: "Delegacia", tipos: ["police"] },
  { id: "farmacia", label: "Farmácia", tipos: ["pharmacy"] },
  { id: "loja", label: "Mercado e lojas", tipos: ["convenience_store", "supermarket"] },
  { id: "academia", label: "Academia", tipos: ["gym"] },
  { id: "onibus", label: "Ponto de ônibus", tipos: ["bus_stop", "bus_station"] },
  { id: "metro", label: "Metrô e trem", tipos: ["subway_station", "train_station"] },
];

// Onde pedir ajuda: sempre têm gente de plantão.
export const CATEGORIAS_SEGURAS = CATEGORIAS.filter((c) => c.id === "delegacia" || c.id === "hospital");

export type Lugar = { id: string; nome: string; endereco: string; posicao: Coordenada; distancia: number };

type Resposta = {
  places?: { id: string; displayName?: { text: string }; formattedAddress?: string; location: { latitude: number; longitude: number } }[];
  error?: { message?: string };
};

// Os lugares mais próximos de `perto` da categoria, do mais perto para o mais longe.
export async function buscarLugares(categoria: CategoriaLugar, perto: Coordenada, sinal?: AbortSignal): Promise<Lugar[]> {
  const r = await fetch("https://places.googleapis.com/v1/places:searchNearby", {
    method: "POST",
    signal: sinal,
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": CHAVE,
      "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.location",
    },
    body: JSON.stringify({
      includedTypes: categoria.tipos,
      maxResultCount: 20,
      rankPreference: "DISTANCE",
      languageCode: "pt-BR",
      locationRestriction: { circle: { center: perto, radius: RAIO_M } },
    }),
  });
  const dados = (await r.json()) as Resposta;
  if (!r.ok) throw new Error(dados.error?.message ?? `Erro ${r.status}`);
  return (dados.places ?? []).map((p) => ({
    id: p.id,
    nome: p.displayName?.text ?? "Sem nome",
    endereco: p.formattedAddress ?? "",
    posicao: { latitude: p.location.latitude, longitude: p.location.longitude },
    distancia: distanciaEmMetros(perto, p.location),
  }));
}

// Link que abre o trajeto a pé até o lugar no app de mapas do aparelho.
export const urlDoCaminho = (l: Lugar) =>
  `https://www.google.com/maps/dir/?api=1&destination=${l.posicao.latitude},${l.posicao.longitude}&destination_place_id=${l.id}&travelmode=walking`;
