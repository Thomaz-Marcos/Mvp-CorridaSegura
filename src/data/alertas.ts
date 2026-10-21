import { supabase } from "../lib/supabase";

export type TipoAlerta = "danger" | "warn" | "ok";

export type Alerta = {
  id: string;
  tipo: TipoAlerta;
  texto: string;
  local: string | null;
  criadoEm: number; // ms desde 1970
  autorId: string;
  autorNome: string;
  curtidas: number;
  curtido: boolean;
};

type Linha = {
  id: string;
  tipo: TipoAlerta;
  texto: string;
  local: string | null;
  criado_em: string;
  autor_id: string;
  autor_nome: string;
  curtidas: number;
  curtido: boolean;
};

const LIMITE = 50;

export async function lerAlertas(): Promise<Alerta[]> {
  const { data, error } = await supabase.from("feed").select("*").order("criado_em", { ascending: false }).limit(LIMITE);
  if (error) throw new Error(error.message);
  return (data as Linha[]).map((l) => ({
    id: l.id,
    tipo: l.tipo,
    texto: l.texto,
    local: l.local,
    criadoEm: new Date(l.criado_em).getTime(),
    autorId: l.autor_id,
    autorNome: l.autor_nome,
    curtidas: l.curtidas,
    curtido: l.curtido,
  }));
}

export async function publicarAlerta(dados: { tipo: TipoAlerta; texto: string; local: string | null }) {
  const { error } = await supabase.from("alertas").insert({ tipo: dados.tipo, texto: dados.texto.trim(), local: dados.local });
  if (error) throw new Error(error.message);
}

export async function apagarAlerta(id: string) {
  const { error } = await supabase.from("alertas").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function alternarCurtida(id: string, curtir: boolean) {
  const { error } = curtir
    ? await supabase.from("curtidas").insert({ alerta_id: id })
    : await supabase.from("curtidas").delete().eq("alerta_id", id);
  if (error) throw new Error(error.message);
}
