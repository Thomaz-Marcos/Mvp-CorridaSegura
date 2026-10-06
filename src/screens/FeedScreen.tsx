import { useState } from "react";
import { Image, Pressable, ScrollView, TextInput, View } from "react-native";
import { cores, fontes } from "../theme";
import Texto from "../components/Texto";
import Chip from "../components/Chip";

type AlertType = "danger" | "warn" | "ok";

const POSTS = [
  {
    id: 1, user: "Rafaela M.", avatar: "RM", time: "há 12 min",
    location: "Av. Paulista, Bela Vista", type: "danger" as AlertType, tag: "Assalto",
    text: "Atenção! Dois caras em moto abordando corredores próximo ao MASP. Evitem o trecho agora, fui assaltado às 7h10.",
    likes: 47, comments: 12, liked: false,
  },
  {
    id: 2, user: "Carlos T.", avatar: "CT", time: "há 38 min",
    location: "Parque Ibirapuera, Sul", type: "ok" as AlertType, tag: "Tudo certo",
    text: "Corrida perfeita essa manhã! Parque limpo, calçadas ótimas e muita galera. Recomendo o trecho da lagoa — linda!",
    likes: 89, comments: 23, liked: true,
    image: "https://images.unsplash.com/photo-1758506971986-b0d0edebd8d5?w=600&h=280&fit=crop&auto=format",
  },
  {
    id: 3, user: "Joana S.", avatar: "JS", time: "há 1h",
    location: "R. Vergueiro, Liberdade", type: "warn" as AlertType, tag: "Buraco",
    text: "Cuidado no km 2.3 da Vergueiro — há um buraco enorme logo após o semáforo. Deu pra torcer o pé se não tiver atenção.",
    likes: 31, comments: 8, liked: false,
  },
  {
    id: 4, user: "Pedro A.", avatar: "PA", time: "há 2h",
    location: "Marginal Pinheiros, km 5", type: "warn" as AlertType, tag: "Lixo",
    text: "A faixa de pedestres da marginal continua um horror. Muito lixo, cheiro ruim e iluminação horrível. Não corram à noite por aqui.",
    likes: 55, comments: 17, liked: false,
  },
  {
    id: 5, user: "Ana L.", avatar: "AL", time: "há 3h",
    location: "Parque Villa-Lobos, Pinheiros", type: "ok" as AlertType, tag: "Rota nova",
    text: "Descobri uma rota de 8km aqui no Villa-Lobos que é incrível! Calçada excelente, zero buraco, e tem bebedouro no meio. Vou postar o GPS.",
    likes: 114, comments: 34, liked: true,
  },
];

const TYPE_CONFIG: Record<AlertType, { color: string; bg: string; border: string; icon: string; label: string }> = {
  danger: { color: "#f43f5e", bg: "#f43f5e18", border: "#f43f5e40", icon: "🚨", label: "Perigo" },
  warn: { color: "#facc15", bg: "#facc1518", border: "#facc1540", icon: "⚠️", label: "Atenção" },
  ok: { color: "#00e87a", bg: "#00e87a18", border: "#00e87a40", icon: "✅", label: "Positivo" },
};

// O "+" abre a tela de novo alerta; curtir, filtrar e publicar não fazem nada.
export default function FeedScreen() {
  const [showCompose, setShowCompose] = useState(false);

  if (showCompose) {
    return (
      <View style={{ flex: 1, backgroundColor: cores.bg }}>
        <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, flexDirection: "row", alignItems: "center", gap: 12, borderBottomWidth: 1, borderColor: cores.border }}>
          <Pressable onPress={() => setShowCompose(false)}>
            <Texto tamanho={14} cor={cores.accent}>← Voltar</Texto>
          </Pressable>
          <Texto tamanho={14} peso="bold">Novo Alerta</Texto>
        </View>
        <View style={{ padding: 20, gap: 16 }}>
          <View style={{ flexDirection: "row", gap: 12 }}>
            {(["danger", "warn", "ok"] as AlertType[]).map((t) => {
              const cfg = TYPE_CONFIG[t];
              return (
                <View
                  key={t}
                  style={{ flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: "center", gap: 4, backgroundColor: cfg.bg, borderWidth: 1, borderColor: cfg.border }}
                >
                  <Texto tamanho={20}>{cfg.icon}</Texto>
                  <Texto tamanho={10} peso="bold" cor={cfg.color}>{cfg.label}</Texto>
                </View>
              );
            })}
          </View>
          <TextInput
            multiline
            numberOfLines={4}
            placeholder="Descreva o que aconteceu na rota..."
            placeholderTextColor={cores.muted}
            style={{
              minHeight: 100,
              borderRadius: 12,
              padding: 12,
              fontSize: 14,
              fontFamily: fontes.regular,
              color: cores.text,
              textAlignVertical: "top",
              backgroundColor: cores.surface2,
              borderWidth: 1,
              borderColor: cores.border,
            }}
          />
          <View style={{ paddingVertical: 12, borderRadius: 12, alignItems: "center", backgroundColor: cores.accent }}>
            <Texto tamanho={14} peso="bold" cor="#000">Publicar Alerta</Texto>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: cores.bg }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, borderBottomWidth: 1, borderColor: cores.border }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <Texto tamanho={18} peso="black">Feed da Comunidade</Texto>
          <Pressable
            onPress={() => setShowCompose(true)}
            style={{ width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: cores.accent }}
          >
            <Texto tamanho={18} peso="bold" cor="#000">+</Texto>
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          <Chip label="Todos" ativo />
          <Chip label="🚨 Perigo" />
          <Chip label="⚠️ Atenção" />
          <Chip label="✅ Positivo" />
        </ScrollView>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {POSTS.map((post) => {
          const cfg = TYPE_CONFIG[post.type];
          return (
            <View key={post.id} style={{ paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1, borderColor: cores.border }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <View style={{ width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: cores.surface3 }}>
                  <Texto tamanho={12} peso="bold" cor={cores.accent}>{post.avatar}</Texto>
                </View>
                <View style={{ flex: 1 }}>
                  <Texto tamanho={12} peso="bold">{post.user}</Texto>
                  <Texto tamanho={10} cor={cores.muted}>{post.location} · {post.time}</Texto>
                </View>
                <View style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999, backgroundColor: cfg.bg, borderWidth: 1, borderColor: cfg.border }}>
                  <Texto tamanho={10} peso="bold" cor={cfg.color}>{cfg.icon} {post.tag}</Texto>
                </View>
              </View>

              {post.image && (
                <View style={{ height: 140, borderRadius: 12, overflow: "hidden", marginBottom: 10, backgroundColor: cores.surface2 }}>
                  <Image source={{ uri: post.image }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
                </View>
              )}

              <Texto tamanho={12} style={{ lineHeight: 19, marginBottom: 12 }}>{post.text}</Texto>

              <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
                <Texto tamanho={11} peso="semibold" cor={post.liked ? cores.danger : cores.muted}>
                  {post.liked ? "♥" : "♡"} {post.likes}
                </Texto>
                <Texto tamanho={11} peso="semibold" cor={cores.muted}>💬 {post.comments}</Texto>
                <Texto tamanho={11} peso="semibold" cor={cores.muted}>↗ Compartilhar</Texto>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
