import { useEffect, useState } from "react";
import * as Location from "expo-location";
import type { Coordenada } from "../data/coordenada";
import { formatarLugar } from "../utils/lugar";

// Converte a posição em "Cidade, UF" com o geocodificador do próprio celular.
// Na web usa useNomeDoLugar.web.ts.
export default function useNomeDoLugar(posicao: Coordenada | null) {
  const [nome, setNome] = useState<string | null>(null);

  useEffect(() => {
    if (!posicao) return;
    let ativo = true;
    Location.reverseGeocodeAsync(posicao)
      .then(([endereco]) => {
        if (ativo && endereco) setNome(formatarLugar(endereco.city ?? endereco.subregion, endereco.region));
      })
      .catch((e) => console.warn("Não foi possível obter o nome do lugar:", e?.message ?? e));
    return () => {
      ativo = false;
    };
  }, [posicao]);

  return nome;
}
