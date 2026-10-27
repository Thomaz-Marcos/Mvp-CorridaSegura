import { useCallback, useRef, useState } from "react";
import type { Coordenada } from "../data/coordenada";
import { buscarLugares, CATEGORIAS_SEGURAS, type Lugar } from "../data/lugares";
import { rotaAte, type RotaReal } from "./useRotasReais";

export type Refugio = { lugar: Lugar; rota: RotaReal | null };

type Estado = { tipo: "livre" } | { tipo: "buscando" } | { tipo: "erro"; mensagem: string } | { tipo: "pronto"; refugio: Refugio };

// "Estou em perigo": acha a delegacia ou o hospital mais perto e calcula o caminho a pé até lá.
export default function useRefugio(posicao: Coordenada | null) {
  const [estado, setEstado] = useState<Estado>({ tipo: "livre" });
  const controle = useRef<AbortController | null>(null);

  const cancelar = useCallback(() => {
    controle.current?.abort();
    setEstado({ tipo: "livre" });
  }, []);

  const pedir = useCallback(async () => {
    if (!posicao) return setEstado({ tipo: "erro", mensagem: "Ainda sem sinal de GPS." });
    controle.current?.abort();
    const c = new AbortController();
    controle.current = c;
    setEstado({ tipo: "buscando" });
    try {
      const listas = await Promise.all(CATEGORIAS_SEGURAS.map((cat) => buscarLugares(cat, posicao, c.signal)));
      const lugar = listas.flat().sort((a, b) => a.distancia - b.distancia)[0];
      if (!lugar) return setEstado({ tipo: "erro", mensagem: "Nenhum lugar seguro a menos de 5 km." });
      // Sem a rota ainda dá para abrir o caminho no app de mapas.
      const rota = await rotaAte(posicao, lugar.posicao, c.signal).catch(() => null);
      if (!c.signal.aborted) setEstado({ tipo: "pronto", refugio: { lugar, rota } });
    } catch (e) {
      if (c.signal.aborted) return;
      setEstado({ tipo: "erro", mensagem: e instanceof Error ? e.message : "Não foi possível buscar um lugar seguro." });
    }
  }, [posicao]);

  return { estado, pedir, cancelar };
}
