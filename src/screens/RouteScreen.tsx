import { useState } from "react";
import { Image, Pressable, ScrollView, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { cores } from "../theme";
import Texto, { Rotulo } from "../components/Texto";
import Barra from "../components/Barra";
import { IconeSeta } from "../components/Icones";

const ROUTE = {
  name: "Parque Ibirapuera",
  subtitle: "Vila Mariana → Moema",
  overall: 84,
  stats: [
    { label: "Distância", val: "5.2 km", icon: "📍" },
    { label: "Tempo", val: "28 min", icon: "⏱" },
    { label: "Elevação", val: "+32m", icon: "⛰" },
    { label: "Calorias", val: "~380 kcal", icon: "🔥" },
  ],
  metrics: [
    {
      key: "safety", label: "Segurança", icon: "🛡️", score: 88, color: cores.safety,
      desc: "Área bem iluminada, alta circulação de pessoas",
      detail: "Dados de 3 delegacias próximas · Índice baixo de ocorrências",
      tags: ["Iluminada", "Movimentada", "Câmeras"],
    },
    {
      key: "traffic", label: "Trânsito", icon: "🚦", score: 72, color: cores.traffic,
      desc: "Moderado nos horários de pico (7h–9h, 17h–19h)",
      detail: "Vias internas do parque têm tráfego zero",
      tags: ["Moderado", "Bike lane", "Cruzamentos"],
    },
    {
      key: "clean", label: "Limpeza", icon: "🧹", score: 91, color: cores.clean,
      desc: "Rua bem cuidada, limpeza diária pelo parque",
      detail: "Sem registros recentes de lixo acumulado",
      tags: ["Limpa", "Lixeiras", "Varrida"],
    },
    {
      key: "conserv", label: "Conservação", icon: "🛤️", score: 79, color: cores.conserv,
      desc: "Calçadas em bom estado, pequenas irregularidades",
      detail: "Trecho sul tem 2 remendos recentes na ciclovia",
      tags: ["Boa calçada", "Asfalto ok", "2 remendos"],
    },
  ],
};

const SEGMENTS = [
  { label: "Entrada Sul", dist: "0–1.2 km", quality: 92, color: "#00e87a" },
  { label: "Lago das Garças", dist: "1.2–2.8 km", quality: 88, color: "#00e87a" },
  { label: "Ciclovia Leste", dist: "2.8–4.0 km", quality: 71, color: "#f59e0b" },
  { label: "Saída Norte", dist: "4.0–5.2 km", quality: 83, color: "#00e87a" },
];

export default function RouteScreen({ onStartRun }: { onStartRun?: () => void }) {
  const [expanded, setExpanded] = useState<string | null>("safety");

  return (
    <ScrollView style={{ flex: 1, backgroundColor: cores.bg }}>
      {/* Capa */}
      <View style={{ height: 180 }}>
        <Image
          source={{ uri: "https://images.unsplash.com/photo-1454486837617-ce8e1ba5ebfe?w=800&h=360&fit=crop&auto=format" }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
        <LinearGradient
          colors={["rgba(13,13,18,0.3)", "rgba(13,13,18,0.9)"]}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        />
        <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingBottom: 16, flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" }}>
          <View>
            <Rotulo style={{ color: cores.accent, marginBottom: 4 }}>Rota Recomendada</Rotulo>
            <Texto tamanho={18} peso="black" cor="#fff">{ROUTE.name}</Texto>
            <Texto tamanho={11} cor="rgba(255,255,255,0.6)">{ROUTE.subtitle}</Texto>
          </View>
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0,232,122,0.15)",
              borderWidth: 2,
              borderColor: cores.accent,
            }}
          >
            <Texto tamanho={20} peso="black" cor={cores.accent}>{ROUTE.overall}</Texto>
            <Texto tamanho={9} peso="semibold" cor={cores.accent}>SCORE</Texto>
          </View>
        </View>
      </View>

      {/* Números */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 12, flexDirection: "row", gap: 8, backgroundColor: cores.surface }}>
        {ROUTE.stats.map((s) => (
          <View key={s.label} style={{ flex: 1, alignItems: "center", gap: 2, paddingVertical: 8, borderRadius: 12, backgroundColor: cores.surface2 }}>
            <Texto tamanho={16}>{s.icon}</Texto>
            <Texto tamanho={12} peso="bold">{s.val}</Texto>
            <Texto tamanho={9} cor={cores.muted}>{s.label}</Texto>
          </View>
        ))}
      </View>

      {/* Indicadores */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 16, gap: 12 }}>
        <Rotulo>Avaliação por Indicador</Rotulo>

        {ROUTE.metrics.map((m) => {
          const isOpen = expanded === m.key;
          return (
            <Pressable
              key={m.key}
              onPress={() => setExpanded(isOpen ? null : m.key)}
              style={{ borderRadius: 16, overflow: "hidden", backgroundColor: cores.surface, borderWidth: 1, borderColor: isOpen ? m.color + "60" : cores.border }}
            >
              <View style={{ paddingHorizontal: 16, paddingVertical: 12, flexDirection: "row", alignItems: "center", gap: 12 }}>
                <View style={{ width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: m.color + "18" }}>
                  <Texto tamanho={16}>{m.icon}</Texto>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
                    <Texto tamanho={14} peso="bold">{m.label}</Texto>
                    <Texto tamanho={14} peso="black" mono cor={m.color}>{m.score}</Texto>
                  </View>
                  <Barra valor={m.score} cor={m.color} altura={8} fundo={cores.surface3} brilho />
                </View>
                <IconeSeta cor={cores.muted} aberta={isOpen} />
              </View>

              {isOpen && (
                <View style={{ paddingHorizontal: 16, paddingBottom: 12, gap: 8, borderTopWidth: 1, borderColor: cores.border }}>
                  <Texto tamanho={12} cor={cores.muted} style={{ marginTop: 8 }}>{m.desc}</Texto>
                  <Texto tamanho={10} mono cor={m.color}>{m.detail}</Texto>
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
                    {m.tags.map((tag) => (
                      <View key={tag} style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999, backgroundColor: m.color + "18" }}>
                        <Texto tamanho={10} peso="semibold" cor={m.color}>{tag}</Texto>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </Pressable>
          );
        })}

        {/* Trechos */}
        <Rotulo style={{ marginTop: 4 }}>Trechos da Rota</Rotulo>
        <View style={{ borderRadius: 16, overflow: "hidden", backgroundColor: cores.surface, borderWidth: 1, borderColor: cores.border }}>
          {SEGMENTS.map((seg, i) => (
            <View
              key={seg.label}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderBottomWidth: i < SEGMENTS.length - 1 ? 1 : 0,
                borderColor: cores.border,
              }}
            >
              <View style={{ width: 20, height: 20, borderRadius: 10, alignItems: "center", justifyContent: "center", backgroundColor: seg.color + "20" }}>
                <Texto tamanho={10} peso="bold" cor={seg.color}>{i + 1}</Texto>
              </View>
              <View style={{ flex: 1 }}>
                <Texto tamanho={12} peso="semibold">{seg.label}</Texto>
                <Texto tamanho={10} cor={cores.muted}>{seg.dist}</Texto>
              </View>
              <Barra valor={seg.quality} cor={seg.color} fundo={cores.surface3} style={{ width: 64 }} />
              <Texto tamanho={12} peso="bold" mono cor={seg.color} style={{ width: 24, textAlign: "right" }}>{seg.quality}</Texto>
            </View>
          ))}
        </View>

        <Pressable onPress={onStartRun} style={{ paddingVertical: 16, borderRadius: 16, alignItems: "center", backgroundColor: cores.accent }}>
          <Texto tamanho={14} peso="bold" cor="#000">▶ Iniciar Corrida</Texto>
        </Pressable>
      </View>
    </ScrollView>
  );
}
