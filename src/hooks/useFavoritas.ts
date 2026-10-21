import { useCallback, useEffect, useState } from "react";
import { gravarFavoritas, idDaFavorita, lerFavoritas, type Favorita } from "../data/favoritas";

export default function useFavoritas() {
  const [favoritas, setFavoritas] = useState<Favorita[]>([]);

  useEffect(() => {
    let ativo = true;
    lerFavoritas().then((lista) => {
      if (ativo) setFavoritas(lista);
    });
    return () => {
      ativo = false;
    };
  }, []);

  const ehFavorita = (origem: string, destino: string) => favoritas.some((f) => f.id === idDaFavorita(origem, destino));

  // Marca ou desmarca o par origem/destino.
  const alternar = useCallback(
    (origem: string, destino: string, medidas?: { metros: number; segundos: number }) => {
      const id = idDaFavorita(origem, destino);
      const nova = favoritas.some((f) => f.id === id) ? favoritas.filter((f) => f.id !== id) : [...favoritas, { id, origem, destino, ...medidas }];
      setFavoritas(nova);
      gravarFavoritas(nova);
    },
    [favoritas],
  );

  return { favoritas, ehFavorita, alternar };
}
