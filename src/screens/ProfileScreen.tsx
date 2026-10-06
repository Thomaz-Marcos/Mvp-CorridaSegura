import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { cores } from "../theme";
import Texto from "../components/Texto";
import Barra from "../components/Barra";
import { IconeEngrenagem } from "../components/Icones";

const BADGES = [
  { icon: "🛡️", label: "Guardião", desc: "10 alertas postados", unlocked: true },
  { icon: "🏃", label: "Maratonista", desc: "100km completados", unlocked: true },
  { icon: "⭐", label: "Top Corredor", desc: "Top 10 da cidade", unlocked: true },
  { icon: "🗺️", label: "Explorador", desc: "20 rotas diferentes", unlocked: true },
  { icon: "🔥", label: "Sequência 30", desc: "30 dias seguidos", unlocked: false },
  { icon: "🌙", label: "Coruja", desc: "5 corridas noturnas", unlocked: false },
];

const HISTORY = [
  { date: "Hoje, 07:15", route: "Parque Ibirapuera", dist: "5.2 km", time: "28:14", score: 84, color: "#00e87a" },
  { date: "Ontem, 18:30", route: "Av. Brigadeiro Faria Lima", dist: "3.1 km", time: "18:45", score: 61, color: "#f59e0b" },
  { date: "Seg, 06:45", route: "Parque Ibirapuera", dist: "7.8 km", time: "42:30", score: 84, color: "#00e87a" },
  { date: "Dom, 08:00", route: "Parque Villa-Lobos", dist: "6.5 km", time: "35:20", score: 78, color: "#00e87a" },
];

const WEEK = [
  { day: "S", km: 0 },
  { day: "T", km: 5.2 },
  { day: "Q", km: 0 },
  { day: "Q", km: 3.1 },
  { day: "S", km: 7.8 },
  { day: "S", km: 6.5 },
  { day: "D", km: 5.2 },
];

const maxKm = Math.max(...WEEK.map((d) => d.km), 1);

type Aba = "stats" | "history" | "badges";

export default function ProfileScreen() {
  const [tab, setTab] = useState<Aba>("stats");

  return (
    <ScrollView style={{ flex: 1, backgroundColor: cores.bg }}>
      {/* Cabeçalho */}
      <LinearGradient
        colors={["#0a0a1a", "#111128"]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 20, borderBottomWidth: 1, borderColor: cores.border }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          <View>
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: cores.accentDim,
                borderWidth: 2,
                borderColor: cores.accent,
              }}
            >
              <Texto tamanho={24} peso="black">MC</Texto>
            </View>
            <View
              style={{
                position: "absolute",
                bottom: -4,
                right: -4,
                width: 20,
                height: 20,
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: cores.accent,
              }}
            >
              <Texto tamanho={9}>⚡</Texto>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Texto tamanho={16} peso="black">Marina Costa</Texto>
            <Texto tamanho={11} cor={cores.muted}>@marinacorre · São Paulo, SP</Texto>
            <View style={{ flexDirection: "row", gap: 8, marginTop: 6 }}>
              <View style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999, backgroundColor: cores.accentDim }}>
                <Texto tamanho={10} peso="bold" cor={cores.accent}>⭐ Top Corredor</Texto>
              </View>
              <View style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999, backgroundColor: cores.surface2 }}>
                <Texto tamanho={10} peso="bold" cor={cores.muted}>🔥 12 dias</Texto>
              </View>
            </View>
          </View>
          <View style={{ width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: cores.surface2 }}>
            <IconeEngrenagem cor={cores.muted} />
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: 16, marginTop: 16 }}>
          {[
            { val: "247", label: "km rodados" },
            { val: "38", label: "corridas" },
            { val: "14", label: "alertas" },
            { val: "4.8", label: "avaliação" },
          ].map((s) => (
            <View key={s.label} style={{ flex: 1, alignItems: "center" }}>
              <Texto tamanho={16} peso="black" mono cor={cores.accent}>{s.val}</Texto>
              <Texto tamanho={10} cor={cores.muted}>{s.label}</Texto>
            </View>
          ))}
        </View>
      </LinearGradient>

      {/* Abas */}
      <View style={{ flexDirection: "row", paddingHorizontal: 16, paddingVertical: 12, gap: 4, backgroundColor: cores.surface, borderBottomWidth: 1, borderColor: cores.border }}>
        {([
          { id: "stats", label: "Estatísticas" },
          { id: "history", label: "Histórico" },
          { id: "badges", label: "Conquistas" },
        ] as { id: Aba; label: string }[]).map((t) => (
          <Pressable
            key={t.id}
            onPress={() => setTab(t.id)}
            style={{ flex: 1, paddingVertical: 6, borderRadius: 8, alignItems: "center", backgroundColor: tab === t.id ? cores.accent : "transparent" }}
          >
            <Texto tamanho={11} peso="semibold" cor={tab === t.id ? "#000" : cores.muted}>{t.label}</Texto>
          </Pressable>
        ))}
      </View>

      <View style={{ paddingHorizontal: 16, paddingVertical: 16, gap: 16 }}>
        {tab === "stats" && (
          <>
            <View style={{ borderRadius: 16, padding: 16, backgroundColor: cores.surface, borderWidth: 1, borderColor: cores.border }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
                <Texto tamanho={12} peso="bold">Esta Semana</Texto>
                <Texto tamanho={12} peso="bold" mono cor={cores.accent}>27.8 km</Texto>
              </View>
              <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 8, height: 80 }}>
                {WEEK.map((d, i) => (
                  <View key={i} style={{ flex: 1, alignItems: "center", gap: 4 }}>
                    <View
                      style={{
                        width: "100%",
                        height: Math.max((d.km / maxKm) * 64, 4),
                        borderTopLeftRadius: 2,
                        borderTopRightRadius: 2,
                        backgroundColor: d.km > 0 ? (i === 6 ? cores.accent : cores.accentDim) : cores.surface2,
                        borderWidth: 1,
                        borderColor: d.km > 0 ? cores.accent : cores.border,
                      }}
                    />
                    <Texto tamanho={9} mono cor={i === 6 ? cores.accent : cores.muted}>{d.day}</Texto>
                  </View>
                ))}
              </View>
            </View>

            <View style={{ borderRadius: 16, padding: 16, gap: 10, backgroundColor: cores.surface, borderWidth: 1, borderColor: cores.border }}>
              <Texto tamanho={12} peso="bold" style={{ marginBottom: 2 }}>Média das Suas Rotas</Texto>
              {[
                { label: "Segurança", val: 78, color: cores.safety },
                { label: "Trânsito", val: 64, color: cores.traffic },
                { label: "Limpeza", val: 82, color: cores.clean },
                { label: "Conservação", val: 71, color: cores.conserv },
              ].map((m) => (
                <View key={m.label} style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                  <Texto tamanho={11} cor={cores.muted} style={{ width: 80 }}>{m.label}</Texto>
                  <Barra valor={m.val} cor={m.color} altura={8} style={{ flex: 1 }} />
                  <Texto tamanho={11} peso="bold" mono cor={m.color} style={{ width: 24, textAlign: "right" }}>{m.val}</Texto>
                </View>
              ))}
            </View>
          </>
        )}

        {tab === "history" && (
          <View style={{ gap: 8 }}>
            {HISTORY.map((run, i) => (
              <View
                key={i}
                style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 12, borderRadius: 16, backgroundColor: cores.surface, borderWidth: 1, borderColor: cores.border }}
              >
                <View style={{ width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: run.color + "18" }}>
                  <Texto tamanho={14}>🏃</Texto>
                </View>
                <View style={{ flex: 1 }}>
                  <Texto tamanho={12} peso="bold" numberOfLines={1}>{run.route}</Texto>
                  <Texto tamanho={10} cor={cores.muted}>{run.date}</Texto>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Texto tamanho={12} peso="bold" mono>{run.dist}</Texto>
                  <Texto tamanho={10} mono cor={cores.muted}>{run.time}</Texto>
                </View>
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 12,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: run.color + "18",
                    borderWidth: 1,
                    borderColor: run.color + "40",
                  }}
                >
                  <Texto tamanho={12} peso="black" mono cor={run.color}>{run.score}</Texto>
                </View>
              </View>
            ))}
          </View>
        )}

        {tab === "badges" && (
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
            {BADGES.map((badge) => (
              <View
                key={badge.label}
                style={{
                  width: "30%",
                  flexGrow: 1,
                  alignItems: "center",
                  gap: 8,
                  padding: 12,
                  borderRadius: 16,
                  backgroundColor: cores.surface,
                  borderWidth: 1,
                  borderColor: badge.unlocked ? cores.accent : cores.border,
                  opacity: badge.unlocked ? 1 : 0.4,
                }}
              >
                <Texto tamanho={24}>{badge.icon}</Texto>
                <Texto tamanho={11} peso="bold" alinhar="center" cor={badge.unlocked ? cores.text : cores.muted}>{badge.label}</Texto>
                <Texto tamanho={9} alinhar="center" cor={cores.muted}>{badge.desc}</Texto>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
