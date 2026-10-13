import { useState } from "react";
import { Image, Pressable, ScrollView, TextInput, View } from "react-native";
import { cores, fontes } from "../theme";
import Texto from "../components/Texto";
import Chip from "../components/Chip";
import Botao from "../components/Botao";
import { IconeComentario, IconeCompartilhar, IconeCoracao, IconeMais, IconeVoltar } from "../components/Icones";

type AlertType = "danger" | "warn" | "ok";

const POSTS = [
  {
    id: 1, user: "Rafaela M.", avatar: "RM", time: "há 12 min",
    location: "Av. Paulista, Bela Vista", type: "danger" as AlertType, tag: "Assalto",
    text: "Dois caras de moto abordando corredores perto do MASP. Evitem o trecho agora, fui assaltada às 7h10.",
    likes: 47, comments: 12, liked: false,
  },
  {
    id: 2, user: "Carlos T.", avatar: "CT", time: "há 38 min",
    location: "Parque Ibirapuera, Sul", type: "ok" as AlertType, tag: "Tudo certo",
    text: "Corrida tranquila hoje cedo. Parque limpo, calçada boa e bastante gente. O trecho da lagoa vale a pena.",
    likes: 89, comments: 23, liked: true,
    image: "https://images.unsplash.com/photo-1758506971986-b0d0edebd8d5?w=600&h=280&fit=crop&auto=format",
  },
  {
    id: 3, user: "Joana S.", avatar: "JS", time: "há 1h",
    location: "R. Vergueiro, Liberdade", type: "warn" as AlertType, tag: "Buraco",
    text: "Cuidado no km 2.3 da Vergueiro, tem um buraco grande logo depois do semáforo. Quase torci o pé.",
    likes: 31, comments: 8, liked: false,
  },
  {
    id: 4, user: "Pedro A.", avatar: "PA", time: "há 2h",
    location: "Marginal Pinheiros, km 5", type: "warn" as AlertType, tag: "Lixo",
    text: "A passarela da marginal continua cheia de lixo e mal iluminada. Não recomendo correr ali à noite.",
    likes: 55, comments: 17, liked: false,
  },
  {
    id: 5, user: "Ana L.", avatar: "AL", time: "há 3h",
    location: "Parque Villa-Lobos, Pinheiros", type: "ok" as AlertType, tag: "Rota nova",
    text: "Achei uma volta de 8 km no Villa-Lobos com calçada ótima e bebedouro no meio do caminho. Depois posto o GPS.",
    likes: 114, comments: 34, liked: true,
  },
];

const TYPE_CONFIG: Record<AlertType, { color: string; label: string }> = {
  danger: { color: cores.danger, label: "Perigo" },
  warn: { color: cores.warn, label: "Atenção" },
  ok: { color: cores.safety, label: "Positivo" },
};

// O "+" abre a tela de novo alerta; curtir, filtrar e publicar não fazem nada.
export default function FeedScreen() {
  const [showCompose, setShowCompose] = useState(false);
  const [tipo, setTipo] = useState<AlertType>("danger");

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
            {(["danger", "warn", "ok"] as AlertType[]).map((t) => {
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
          <Botao label="Publicar" />
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
          <Chip label="Todos" ativo />
          <Chip label="Perigo" />
          <Chip label="Atenção" />
          <Chip label="Positivo" />
        </ScrollView>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {POSTS.map((post) => {
          const cfg = TYPE_CONFIG[post.type];
          return (
            <View key={post.id} style={{ paddingHorizontal: 20, paddingVertical: 16, gap: 10, borderBottomWidth: 1, borderColor: cores.border }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <View style={{ width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: cores.surface3 }}>
                  <Texto tamanho={12} peso="semibold" cor={cores.muted}>{post.avatar}</Texto>
                </View>
                <View style={{ flex: 1 }}>
                  <Texto tamanho={14} peso="semibold">{post.user}</Texto>
                  <Texto tamanho={12} cor={cores.muted} numberOfLines={1}>{post.location} · {post.time}</Texto>
                </View>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: cfg.color }} />
                <Texto tamanho={12} peso="medium" cor={cfg.color}>{post.tag}</Texto>
              </View>

              <Texto tamanho={14} style={{ lineHeight: 21 }}>{post.text}</Texto>

              {post.image && (
                <View style={{ height: 160, borderRadius: 10, overflow: "hidden", backgroundColor: cores.surface2 }}>
                  <Image source={{ uri: post.image }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
                </View>
              )}

              <View style={{ flexDirection: "row", alignItems: "center", gap: 22, marginTop: 2 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <IconeCoracao cor={post.liked ? cores.danger : cores.muted} cheio={post.liked} />
                  <Texto tamanho={13} cor={cores.muted}>{post.likes}</Texto>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <IconeComentario cor={cores.muted} />
                  <Texto tamanho={13} cor={cores.muted}>{post.comments}</Texto>
                </View>
                <IconeCompartilhar cor={cores.muted} />
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
