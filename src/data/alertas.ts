import { File } from "expo-file-system";
import { supabase } from "../lib/supabase";
import type { Coordenada } from "./coordenada";

export type TipoAlerta = "danger" | "warn" | "ok";

export type Alerta = {
  id: string;
  tipo: TipoAlerta;
  texto: string;
  local: string | null;
  posicao: Coordenada | null; // null nos alertas sem localização
  criadoEm: number; // ms desde 1970
  autorId: string;
  autorNome: string;
  fotoUrl: string | null;
  fotoCaminho: string | null; // caminho no bucket, usado para apagar a foto junto com o alerta
  curtidas: number;
  curtido: boolean;
};

type Linha = {
  id: string;
  tipo: TipoAlerta;
  texto: string;
  local: string | null;
  latitude: number | null;
  longitude: number | null;
  criado_em: string;
  autor_id: string;
  autor_nome: string;
  foto_caminho: string | null;
  curtidas: number;
  curtido: boolean;
};

const LIMITE = 50;
const BUCKET = "fotos-alertas";

const paraAlerta = (l: Linha): Alerta => ({
  id: l.id,
  tipo: l.tipo,
  texto: l.texto,
  local: l.local,
  posicao: l.latitude != null && l.longitude != null ? { latitude: l.latitude, longitude: l.longitude } : null,
  criadoEm: new Date(l.criado_em).getTime(),
  autorId: l.autor_id,
  autorNome: l.autor_nome,
  fotoUrl: l.foto_caminho ? supabase.storage.from(BUCKET).getPublicUrl(l.foto_caminho).data.publicUrl : null,
  fotoCaminho: l.foto_caminho,
  curtidas: l.curtidas,
  curtido: l.curtido,
});

export async function lerAlertas(): Promise<Alerta[]> {
  const { data, error } = await supabase.from("feed").select("*").order("criado_em", { ascending: false }).limit(LIMITE);
  if (error) throw new Error(error.message);
  return (data as Linha[]).map(paraAlerta);
}

// Alertas com localização dos últimos dias: alimentam o mapa e a nota de segurança das rotas.
export const JANELA_DIAS = 30;
const LIMITE_NO_MAPA = 500;

export async function lerAlertasLocalizados(): Promise<Alerta[]> {
  const desde = new Date(Date.now() - JANELA_DIAS * 24 * 3600 * 1000).toISOString();
  const { data, error } = await supabase
    .from("feed")
    .select("*")
    .not("latitude", "is", null)
    .gte("criado_em", desde)
    .order("criado_em", { ascending: false })
    .limit(LIMITE_NO_MAPA);
  if (error) throw new Error(error.message);
  return (data as Linha[]).map(paraAlerta);
}

export type FotoEscolhida = { uri: string; mimeType?: string | null };

// Envia a foto para a pasta do usuário e devolve o caminho no bucket.
async function enviarFoto(foto: FotoEscolhida): Promise<string> {
  const { data: sessao } = await supabase.auth.getUser();
  if (!sessao.user) throw new Error("Entre na sua conta para enviar fotos.");
  const tipo = foto.mimeType === "image/png" || foto.mimeType === "image/webp" ? foto.mimeType : "image/jpeg";
  const caminho = `${sessao.user.id}/${Date.now()}.${tipo.split("/")[1].replace("jpeg", "jpg")}`;
  const bytes = await new File(foto.uri).arrayBuffer();
  const { error } = await supabase.storage.from(BUCKET).upload(caminho, bytes, { contentType: tipo });
  if (error) throw new Error(error.message);
  return caminho;
}

export async function publicarAlerta(dados: { tipo: TipoAlerta; texto: string; local: string | null; posicao: Coordenada | null; foto?: FotoEscolhida | null }) {
  const fotoCaminho = dados.foto ? await enviarFoto(dados.foto) : null;
  const { error } = await supabase.from("alertas").insert({
    tipo: dados.tipo,
    texto: dados.texto.trim(),
    local: dados.local,
    latitude: dados.posicao?.latitude ?? null,
    longitude: dados.posicao?.longitude ?? null,
    foto_caminho: fotoCaminho,
  });
  if (error) {
    if (fotoCaminho) await supabase.storage.from(BUCKET).remove([fotoCaminho]);
    throw new Error(error.message);
  }
}

export async function apagarAlerta(id: string, fotoCaminho?: string | null) {
  const { error } = await supabase.from("alertas").delete().eq("id", id);
  if (error) throw new Error(error.message);
  if (fotoCaminho) await supabase.storage.from(BUCKET).remove([fotoCaminho]);
}

export async function alternarCurtida(id: string, curtir: boolean) {
  const { error } = curtir
    ? await supabase.from("curtidas").insert({ alerta_id: id })
    : await supabase.from("curtidas").delete().eq("alerta_id", id);
  if (error) throw new Error(error.message);
}
