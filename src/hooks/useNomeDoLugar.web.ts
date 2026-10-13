import { useEffect, useState } from "react";
import type { Coordenada } from "../data/rotas";
import { formatarLugar } from "../utils/lugar";

// Na web o expo-location não converte posição em endereço, então usamos a Geocoding API do Google.
// A chave precisa ter a "Geocoding API" ativada no Google Cloud.
const CHAVE = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

type Componente = { long_name: string; short_name: string; types: string[] };

export default function useNomeDoLugar(posicao: Coordenada | null) {
  const [nome, setNome] = useState<string | null>(null);

  useEffect(() => {
    if (!posicao) return;
    let ativo = true;
    const url =
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${posicao.latitude},${posicao.longitude}` +
      `&language=pt-BR&key=${CHAVE}`;
    fetch(url)
      .then((r) => r.json())
      .then((dados) => {
        if (dados.status !== "OK") throw new Error(dados.error_message ?? dados.status);
        const componentes: Componente[] = dados.results.flatMap((r: { address_components: Componente[] }) => r.address_components);
        const achar = (tipo: string) => componentes.find((c) => c.types.includes(tipo));
        const cidade = achar("locality") ?? achar("administrative_area_level_2");
        const estado = achar("administrative_area_level_1");
        if (ativo) setNome(formatarLugar(cidade?.long_name, estado?.short_name));
      })
      .catch((e) => console.warn("Não foi possível obter o nome do lugar:", e?.message ?? e));
    return () => {
      ativo = false;
    };
  }, [posicao]);

  return nome;
}
