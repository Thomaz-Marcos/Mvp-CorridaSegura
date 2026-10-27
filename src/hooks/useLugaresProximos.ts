import { useEffect, useState } from "react";
import type { Coordenada } from "../data/coordenada";
import { buscarLugares, type CategoriaLugar, type Lugar } from "../data/lugares";

type Resultado = { chave: string; lugares: Lugar[]; erro: string | null };

// Lugares da categoria perto da posição. `lugares` é null enquanto carrega.
export default function useLugaresProximos(categoria: CategoriaLugar, posicao: Coordenada | null) {
  const [resultado, setResultado] = useState<Resultado | null>(null);

  // Refaz a busca só quando a pessoa anda uns 100 m, não a cada atualização do GPS.
  const latitude = posicao ? Math.round(posicao.latitude * 1000) / 1000 : null;
  const longitude = posicao ? Math.round(posicao.longitude * 1000) / 1000 : null;
  const chave = `${categoria.id}:${latitude}:${longitude}`;

  useEffect(() => {
    if (!posicao) return;
    const controle = new AbortController();
    buscarLugares(categoria, posicao, controle.signal)
      .then((lugares) => setResultado({ chave, lugares, erro: null }))
      .catch((e) => {
        if (e?.name === "AbortError") return;
        setResultado({ chave, lugares: [], erro: e?.message ?? "Não foi possível buscar lugares." });
      });
    return () => controle.abort();
    // `posicao` fica de fora de propósito: veja `latitude` e `longitude` acima.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chave]);

  // Resultado de outra categoria ou lugar não vale: mostra o carregando.
  const atual = resultado?.chave === chave ? resultado : null;
  return { lugares: atual?.lugares ?? null, erro: atual?.erro ?? null };
}
