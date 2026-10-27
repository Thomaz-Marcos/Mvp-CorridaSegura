import * as ImagePicker from "expo-image-picker";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, Pressable, RefreshControl, ScrollView, TextInput, View } from "react-native";
import { cores, fontes } from "../theme";
import Texto from "../components/Texto";
import Chip from "../components/Chip";
import Botao from "../components/Botao";
import { IconeCoracao, IconeMais, IconeVoltar } from "../components/Icones";
import { alternarCurtida, apagarAlerta, lerAlertas, publicarAlerta, type Alerta, type FotoEscolhida, type TipoAlerta } from "../data/alertas";
import { supabaseConfigurado } from "../lib/supabase";
import usePosicao from "../hooks/usePosicao";
import useNomeDoLugar from "../hooks/useNomeDoLugar";
import { tempoRelativo } from "../utils/formatar";

const TYPE_CONFIG: Record<TipoAlerta, { color: string; label: string }> = {
  danger: { color: cores.danger, label: "Perigo" },
  warn: { color: cores.warn, label: "Atenção" },
  ok: { color: cores.safety, label: "Positivo" },
};

const iniciais = (nome: string) =>
  nome.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join("") || "?";

async function buscar() {
  if (!supabaseConfigurado) {
    return { erro: "Supabase não configurado. Preencha EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY no .env.local." };
  }
  try {
    return { lista: await lerAlertas(), erro: null };
  } catch (e) {
    return { erro: e instanceof Error ? e.message : "Não foi possível carregar os alertas." };
  }
}

interface Props {
  usuarioId: string;
}

// Alertas compartilhados entre os usuários (Supabase). O "+" abre a tela de novo alerta.
export default function FeedScreen({ usuarioId }: Props) {
  const [showCompose, setShowCompose] = useState(false);
  const [tipo, setTipo] = useState<TipoAlerta>("danger");
  const [texto, setTexto] = useState("");
  const [foto, setFoto] = useState<FotoEscolhida | null>(null);
  const [filtro, setFiltro] = useState<TipoAlerta | null>(null);
  const [alertas, setAlertas] = useState<Alerta[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [atualizando, setAtualizando] = useState(false);
  const [publicando, setPublicando] = useState(false);
  const { posicao } = usePosicao();
  const lugar = useNomeDoLugar(posicao);

  // Aplica o resultado de uma busca; em caso de erro mantém a lista que já estava na tela.
  const aplicar = useCallback((r: { lista: Alerta[]; erro: string | null } | { erro: string }) => {
    if ("lista" in r) setAlertas(r.lista);
    else setAlertas((atuais) => atuais ?? []);
    setErro(r.erro);
  }, []);

  useEffect(() => {
    let ativo = true;
    buscar().then((r) => ativo && aplicar(r));
    return () => {
      ativo = false;
    };
  }, [aplicar]);

  const atualizar = async () => {
    setAtualizando(true);
    aplicar(await buscar());
    setAtualizando(false);
  };

  const publicar = async () => {
    if (texto.trim() === "" || publicando) return;
    setPublicando(true);
    try {
      await publicarAlerta({ tipo, texto, local: lugar, posicao, foto });
      setTexto("");
      setFoto(null);
      setShowCompose(false);
      aplicar(await buscar());
    } catch (e) {
      Alert.alert("Não foi possível publicar", e instanceof Error ? e.message : "Tente de novo.");
    } finally {
      setPublicando(false);
    }
  };

  // Atualiza na hora e desfaz se o servidor recusar.
  const curtir = async (a: Alerta) => {
    const troca = (curtido: boolean) =>
      setAlertas((atuais) => atuais?.map((x) => (x.id === a.id ? { ...x, curtido, curtidas: x.curtidas + (curtido ? 1 : -1) } : x)) ?? null);
    troca(!a.curtido);
    try {
      await alternarCurtida(a.id, !a.curtido);
    } catch {
      troca(a.curtido);
    }
  };

  const apagar = (a: Alerta) =>
    Alert.alert("Apagar alerta?", "Ele some para todo mundo.", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Apagar",
        style: "destructive",
        onPress: async () => {
          try {
            await apagarAlerta(a.id, a.fotoCaminho);
            setAlertas((atuais) => atuais?.filter((x) => x.id !== a.id) ?? null);
          } catch (e) {
            Alert.alert("Não foi possível apagar", e instanceof Error ? e.message : "Tente de novo.");
          }
        },
      },
    ]);

  const escolherFoto = async (origem: "camera" | "galeria") => {
    const opcoes: ImagePicker.ImagePickerOptions = { mediaTypes: ["images"], quality: 0.7 };
    try {
      if (origem === "camera") {
        const permissao = await ImagePicker.requestCameraPermissionsAsync();
        if (!permissao.granted) return Alert.alert("Sem acesso à câmera", "Libere a câmera nas configurações do aparelho.");
      }
      const r = origem === "camera" ? await ImagePicker.launchCameraAsync(opcoes) : await ImagePicker.launchImageLibraryAsync(opcoes);
      if (!r.canceled && r.assets[0]) setFoto({ uri: r.assets[0].uri, mimeType: r.assets[0].mimeType });
    } catch (e) {
      Alert.alert("Não foi possível abrir a foto", e instanceof Error ? e.message : "Tente de novo.");
    }
  };

  const adicionarFoto = () =>
    Alert.alert("Adicionar foto", undefined, [
      { text: "Tirar foto", onPress: () => escolherFoto("camera") },
      { text: "Escolher da galeria", onPress: () => escolherFoto("galeria") },
      { text: "Cancelar", style: "cancel" },
    ]);

  const visiveis = (alertas ?? []).filter((a) => filtro === null || a.tipo === filtro);

  if (showCompose) {
    return (
      <View style={{ flex: 1, backgroundColor: cores.bg }}>
        <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12, flexDirection: "row", alignItems: "center", gap: 8, borderBottomWidth: 1, borderColor: cores.border }}>
          <Pressable onPress={() => setShowCompose(false)} hitSlop={10}>
            <IconeVoltar cor={cores.text} tamanho={22} />
          </Pressable>
          <Texto tamanho={17} peso="semibold">Novo alerta</Texto>
        </View>
        <View style={{ padding: 20, gap: 16 }}>
          <Texto tamanho={13} cor={cores.muted}>Tipo</Texto>
          <View style={{ flexDirection: "row", gap: 8, marginTop: -8 }}>
            {(["danger", "warn", "ok"] as TipoAlerta[]).map((t) => {
              const cfg = TYPE_CONFIG[t];
              const ativo = tipo === t;
              return (
                <Pressable
                  key={t}
                  onPress={() => setTipo(t)}
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 8,
                    paddingVertical: 11,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: ativo ? cores.muted : cores.border,
                    backgroundColor: ativo ? cores.surface2 : "transparent",
                  }}
                >
                  <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: cfg.color }} />
                  <Texto tamanho={13} peso="medium" cor={ativo ? cores.text : cores.muted}>{cfg.label}</Texto>
                </Pressable>
              );
            })}
          </View>
          <TextInput
            value={texto}
            onChangeText={setTexto}
            maxLength={500}
            multiline
            numberOfLines={4}
            placeholder="O que aconteceu e onde?"
            placeholderTextColor="#5f5f5f"
            style={{
              minHeight: 120,
              borderRadius: 10,
              padding: 14,
              fontSize: 15,
              fontFamily: fontes.regular,
              color: cores.text,
              textAlignVertical: "top",
              backgroundColor: cores.surface,
              borderWidth: 1,
              borderColor: cores.border,
            }}
          />
          {foto ? (
            <View>
              <Image source={{ uri: foto.uri }} style={{ width: "100%", height: 200, borderRadius: 10, backgroundColor: cores.surface }} resizeMode="cover" />
              <Pressable
                onPress={() => setFoto(null)}
                hitSlop={8}
                style={{ position: "absolute", top: 8, right: 8, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: "rgba(0,0,0,0.65)" }}
              >
                <Texto tamanho={12} peso="medium">Remover</Texto>
              </Pressable>
            </View>
          ) : (
            <Pressable
              onPress={adicionarFoto}
              style={{ paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: cores.border, alignItems: "center" }}
            >
              <Texto tamanho={13} peso="medium" cor={cores.muted}>Adicionar foto</Texto>
            </Pressable>
          )}
          <Texto tamanho={12} cor={cores.muted}>{posicao ? `Local: ${lugar ?? "posição atual"}` : "Sem localização: o alerta não aparece no mapa nem conta na nota das rotas."}</Texto>
          <Botao label={publicando ? "Publicando…" : "Publicar"} onPress={publicar} />
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: cores.bg }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, gap: 14, borderBottomWidth: 1, borderColor: cores.border }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Texto tamanho={22} peso="bold">Comunidade</Texto>
          <Pressable
            onPress={() => setShowCompose(true)}
            style={{ width: 40, height: 40, borderRadius: 10, borderWidth: 1, borderColor: cores.border, alignItems: "center", justifyContent: "center" }}
          >
            <IconeMais cor={cores.text} />
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          <Chip label="Todos" ativo={filtro === null} onPress={() => setFiltro(null)} />
          {(["danger", "warn", "ok"] as TipoAlerta[]).map((t) => (
            <Chip key={t} label={TYPE_CONFIG[t].label} ativo={filtro === t} onPress={() => setFiltro(t)} />
          ))}
        </ScrollView>
      </View>

      <ScrollView style={{ flex: 1 }} refreshControl={<RefreshControl refreshing={atualizando} onRefresh={atualizar} tintColor={cores.muted} />}>
        {alertas === null ? (
          <ActivityIndicator color={cores.muted} style={{ marginTop: 32 }} />
        ) : (
          <>
            {erro && <Texto tamanho={12} cor={cores.muted} style={{ paddingHorizontal: 20, paddingTop: 16 }}>{erro}</Texto>}
            {visiveis.length === 0 && !erro && (
              <Texto tamanho={13} cor={cores.muted} style={{ paddingHorizontal: 20, paddingTop: 16 }}>
                {filtro ? "Nenhum alerta desse tipo." : "Nenhum alerta ainda. Toque em + para avisar quem corre perto."}
              </Texto>
            )}
            {visiveis.map((a) => {
              const cfg = TYPE_CONFIG[a.tipo];
              return (
                <View key={a.id} style={{ paddingHorizontal: 20, paddingVertical: 16, gap: 10, borderBottomWidth: 1, borderColor: cores.border }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <View style={{ width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: cores.surface3 }}>
                      <Texto tamanho={12} peso="semibold" cor={cores.muted}>{iniciais(a.autorNome)}</Texto>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Texto tamanho={14} peso="semibold">{a.autorNome}</Texto>
                      <Texto tamanho={12} cor={cores.muted} numberOfLines={1}>{a.local ? `${a.local} · ` : ""}{tempoRelativo(a.criadoEm)}</Texto>
                    </View>
                    {a.autorId === usuarioId && (
                      <Pressable onPress={() => apagar(a)} hitSlop={8}>
                        <Texto tamanho={12} cor={cores.muted}>Apagar</Texto>
                      </Pressable>
                    )}
                  </View>

                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: cfg.color }} />
                    <Texto tamanho={12} peso="medium" cor={cfg.color}>{cfg.label}</Texto>
                  </View>

                  <Texto tamanho={14} style={{ lineHeight: 21 }}>{a.texto}</Texto>

                  {a.fotoUrl && (
                    <Image source={{ uri: a.fotoUrl }} style={{ width: "100%", height: 220, borderRadius: 10, backgroundColor: cores.surface }} resizeMode="cover" />
                  )}

                  <Pressable onPress={() => curtir(a)} hitSlop={8} style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 2, alignSelf: "flex-start" }}>
                    <IconeCoracao cor={a.curtido ? cores.danger : cores.muted} cheio={a.curtido} />
                    <Texto tamanho={13} cor={cores.muted}>{a.curtidas}</Texto>
                  </Pressable>
                </View>
              );
            })}
          </>
        )}
      </ScrollView>
    </View>
  );
}
