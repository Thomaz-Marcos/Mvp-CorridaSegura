import { useState } from "react";
import { Image, Pressable, ScrollView, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { cores } from "../theme";
import Texto, { Rotulo } from "../components/Texto";
import Barra from "../components/Barra";
import Botao from "../components/Botao";
import { IconeSeta } from "../components/Icones";

const ROUTE = {
  name: "Parque Ibirapuera",
  subtitle: "Vila Mariana até Moema",
  overall: 84,
  stats: [
    { label: "Distância", val: "5.2 km" },
    { label: "Tempo", val: "28 min" },
    { label: "Elevação", val: "+32 m" },
    { label: "Calorias", val: "380" },
  ],
  metrics: [
    {
      key: "safety", label: "Segurança", score: 88, color: cores.safety,
      desc: "Área bem iluminada, com bastante gente circulando.",
      detail: "Dados de 3 delegacias próximas, poucas ocorrências.",
      tags: ["Iluminada", "Movimentada", "Câmeras"],
    },
    {
      key: "traffic", label: "Trânsito", score: 72, color: cores.traffic,
      desc: "Moderado nos horários de pico (7h–9h e 17h–19h).",
      detail: "As vias internas do parque não têm carros.",
      tags: ["Moderado", "Ciclofaixa", "Cruzamentos"],
    },
    {
      key: "clean", label: "Limpeza", score: 91, color: cores.clean,
      desc: "Rua bem cuidada, com limpeza diária do parque.",
      detail: "Nenhum registro recente de lixo acumulado.",
      tags: ["Limpa", "Lixeiras", "Varrida"],
    },
    {
      key: "conserv", label: "Conservação", score: 79, color: cores.conserv,
      desc: "Calçadas em bom estado, com pequenas irregularidades.",
      detail: "O trecho sul tem 2 remendos recentes na ciclovia.",
      tags: ["Boa calçada", "Asfalto ok", "2 remendos"],
    },
  ],
};

const SEGMENTS = [
  { label: "Entrada Sul", dist: "0–1.2 km", quality: 92 },
  { label: "Lago das Garças", dist: "1.2–2.8 km", quality: 88 },
  { label: "Ciclovia Leste", dist: "2.8–4.0 km", quality: 71 },
  { label: "Saída Norte", dist: "4.0–5.2 km", quality: 83 },
];

// Cor da nota de um trecho: verde se boa, amarela se média, vermelha se ruim.
const corDaNota = (n: number) => (n >= 80 ? cores.safety : n >= 60 ? cores.traffic : cores.danger);

export default function RouteScreen({ onStartRun }: { onStartRun?: () => void }) {
  const [expanded, setExpanded] = useState<string | null>("safety");

  return (
    <ScrollView style={{ flex: 1, backgroundColor: cores.bg }}>
      {/* Capa */}
      <View style={{ height: 200 }}>
        <Image
          source={{ uri: "https://images.unsplash.com/photo-1454486837617-ce8e1ba5ebfe?w=800&h=400&fit=crop&auto=format" }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
        <LinearGradient
          colors={["rgba(18,18,18,0)", "rgba(18,18,18,0.95)"]}
          locations={[0.3, 1]}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        />
        <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingBottom: 16, flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" }}>
          <View style={{ gap: 2 }}>
            <Texto tamanho={12} cor="rgba(255,255,255,0.7)">Rota recomendada</Texto>
            <Texto tamanho={22} peso="bold" cor="#fff">{ROUTE.name}</Texto>
            <Texto tamanho={13} cor="rgba(255,255,255,0.7)">{ROUTE.subtitle}</Texto>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Texto tamanho={32} peso="bold" cor="#fff" style={{ lineHeight: 36 }}>{ROUTE.overall}</Texto>
            <Texto tamanho={12} cor="rgba(255,255,255,0.7)">nota geral</Texto>
          </View>
        </View>
      </View>

      {/* Números */}
      <View style={{ flexDirection: "row", borderBottomWidth: 1, borderColor: cores.border }}>
        {ROUTE.stats.map((s, i) => (
          <View key={s.label} style={{ flex: 1, paddingVertical: 14, paddingHorizontal: 12, gap: 2, borderLeftWidth: i ? 1 : 0, borderColor: cores.border }}>
            <Texto tamanho={15} peso="semibold">{s.val}</Texto>
            <Texto tamanho={11} cor={cores.muted}>{s.label}</Texto>
          </View>
        ))}
      </View>

      <View style={{ paddingHorizontal: 16, paddingVertical: 20, gap: 12 }}>
        {/* Indicadores */}
        <Rotulo style={{ paddingHorizontal: 4 }}>Avaliação por indicador</Rotulo>
        <View style={{ borderRadius: 12, borderWidth: 1, borderColor: cores.border, backgroundColor: cores.surface }}>
          {ROUTE.metrics.map((m, i) => {
            const isOpen = expanded === m.key;
            return (
              <Pressable
                key={m.key}
                onPress={() => setExpanded(isOpen ? null : m.key)}
                style={{ paddingHorizontal: 16, paddingVertical: 14, gap: 10, borderTopWidth: i ? 1 : 0, borderColor: cores.border }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                  <Texto tamanho={14} peso="medium" style={{ width: 96 }}>{m.label}</Texto>
                  <Barra valor={m.score} cor={m.color} altura={4} fundo={cores.surface3} style={{ flex: 1 }} />
                  <Texto tamanho={14} peso="semibold" alinhar="right" style={{ width: 26 }}>{m.score}</Texto>
                  <IconeSeta cor={cores.muted} aberta={isOpen} />
                </View>

                {isOpen && (
                  <View style={{ gap: 8 }}>
                    <Texto tamanho={13} style={{ lineHeight: 19 }}>{m.desc}</Texto>
                    <Texto tamanho={12} cor={cores.muted}>{m.detail}</Texto>
                    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 2 }}>
                      {m.tags.map((tag) => (
                        <View key={tag} style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, borderWidth: 1, borderColor: cores.border }}>
                          <Texto tamanho={12} cor={cores.muted}>{tag}</Texto>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        {/* Trechos */}
        <Rotulo style={{ paddingHorizontal: 4, marginTop: 8 }}>Trechos da rota</Rotulo>
        <View style={{ borderRadius: 12, borderWidth: 1, borderColor: cores.border, backgroundColor: cores.surface }}>
          {SEGMENTS.map((seg, i) => (
            <View
              key={seg.label}
              style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: i ? 1 : 0, borderColor: cores.border }}
            >
              <Texto tamanho={13} cor={cores.muted} style={{ width: 14 }}>{i + 1}</Texto>
              <View style={{ flex: 1, gap: 2 }}>
                <Texto tamanho={14} peso="medium">{seg.label}</Texto>
                <Texto tamanho={12} cor={cores.muted}>{seg.dist}</Texto>
              </View>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: corDaNota(seg.quality) }} />
              <Texto tamanho={14} peso="semibold" alinhar="right" style={{ width: 26 }}>{seg.quality}</Texto>
            </View>
          ))}
        </View>

        <Botao label="Iniciar corrida" onPress={onStartRun} style={{ marginTop: 8 }} />
      </View>
    </ScrollView>
  );
}
