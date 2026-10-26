import { useEffect, useState } from "react";
import { lerAlertasLocalizados, type Alerta } from "../data/alertas";
import { supabaseConfigurado } from "../lib/supabase";

// Alertas recentes com localização. Busca de novo sempre que `atualizar` muda
// (ex.: a aba do mapa voltou a ficar visível); falhas mantêm a lista anterior.
export default function useAlertasLocalizados(atualizar: unknown = null) {
  const [alertas, setAlertas] = useState<Alerta[]>([]);

  useEffect(() => {
    if (!supabaseConfigurado) return;
    let ativo = true;
    lerAlertasLocalizados()
      .then((lista) => ativo && setAlertas(lista))
      .catch((e) => console.warn("Alertas indisponíveis:", e?.message ?? e));
    return () => {
      ativo = false;
    };
  }, [atualizar]);

  return alertas;
}
