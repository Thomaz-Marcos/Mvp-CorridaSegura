import { useState } from "react";
import { Pressable, ScrollView, TextInput, View } from "react-native";
import { cores, fontes } from "../theme";
import Texto, { Rotulo } from "../components/Texto";
import Barra from "../components/Barra";

const ROUTE_OPTIONS = [
  {
    id: 1, name: "Rota Verde", via: "Via Parque Ibirapuera",
    distance: "5.2 km", time: "28 min", overall: 84,
    color: "#00e87a", label: "Recomendada",
    safety: 88, traffic: 72, clean: 91, conserv: 79,
    warnings: [] as string[],
  },
  {
    id: 2, name: "Rota Direta", via: "Via Av. Brasil",
    distance: "3.8 km", time: "21 min", overall: 61,
    color: "#f59e0b", label: "Moderada",
    safety: 65, traffic: 48, clean: 70, conserv: 60,
    warnings: ["Trânsito intenso no horário de pico"],
  },
  {
    id: 3, name: "Rota Alternativa", via: "Via R. Vergueiro",
    distance: "6.1 km", time: "34 min", overall: 43,
    color: "#f43f5e", label: "Evitar",
    safety: 41, traffic: 35, clean: 52, conserv: 44,
    warnings: ["Relatos de assalto", "Calçada danificada no km 4"],
  },
];

const FAVORITAS = [
  { name: "Parque Ibirapuera — Loop completo", dist: "5.2 km", score: 84, color: "#00e87a" },
  { name: "Av. Paulista → MASP → Consolação", dist: "4.1 km", score: 61, color: "#f59e0b" },
  { name: "Parque Villa-Lobos", dist: "6.8 km", score: 78, color: "#00e87a" },
];

interface Props {
  onStartRun: () => void;
}

// "Buscar" e as favoritas só alternam para a lista de resultados (dados fixos).
export default function PlanRouteScreen({ onStartRun }: Props) {
  const [searched, setSearched] = useState(false);
  const [selected, setSelected] = useState(ROUTE_OPTIONS[0]);

  return (
    <View style={{ flex: 1, backgroundColor: cores.bg }}>
      {/* Cabeçalho */}
      <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16, borderBottomWidth: 1, borderColor: cores.border }}>
        <Texto tamanho={18} peso="black" style={{ marginBottom: 16 }}>Planejar Rota</Texto>

        <View style={{ gap: 8 }}>
          <CampoLocal cor={cores.accent} placeholder="Ponto de partida" />
          <CampoLocal cor={cores.danger} placeholder="Destino" />
          <View
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              marginTop: -14,
              width: 28,
              height: 28,
              borderRadius: 14,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: cores.surface3,
            }}
          >
            <Texto tamanho={14} cor={cores.muted}>⇅</Texto>
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: 8, marginTop: 12, alignItems: "center" }}>
          {[
            { icon: "🛡️", label: "Segura" },
            { icon: "⚡", label: "Rápida" },
            { icon: "🌿", label: "Parques" },
          ].map((f, i) => (
            <View
              key={f.label}
              style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, backgroundColor: i === 0 ? cores.accent : cores.surface2 }}
            >
              <Texto tamanho={11} peso="semibold" cor={i === 0 ? "#000" : cores.muted}>{f.icon} {f.label}</Texto>
            </View>
          ))}
          <Pressable
            onPress={() => setSearched(true)}
            style={{ marginLeft: "auto", paddingHorizontal: 16, paddingVertical: 6, borderRadius: 999, backgroundColor: cores.accent2 }}
          >
            <Texto tamanho={11} peso="black" cor="#fff">Buscar</Texto>
          </Pressable>
        </View>
      </View>

      {/* Resultados */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16, gap: 12 }}>
        {!searched ? (
          <>
            <Rotulo>Rotas Favoritas</Rotulo>
            {FAVORITAS.map((r) => (
              <Pressable
                key={r.name}
                onPress={() => setSearched(true)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  padding: 12,
                  borderRadius: 16,
                  backgroundColor: cores.surface,
                  borderWidth: 1,
                  borderColor: cores.border,
                }}
              >
                <View style={{ width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: r.color + "18" }}>
                  <Texto>🏃</Texto>
                </View>
                <View style={{ flex: 1 }}>
                  <Texto tamanho={12} peso="bold">{r.name}</Texto>
                  <Texto tamanho={10} cor={cores.muted}>{r.dist}</Texto>
                </View>
                <Nota valor={r.score} cor={r.color} />
              </Pressable>
            ))}
          </>
        ) : (
          <>
            <Rotulo>{ROUTE_OPTIONS.length} rotas encontradas</Rotulo>

            {ROUTE_OPTIONS.map((route) => {
              const ativa = selected.id === route.id;
              return (
                <Pressable
                  key={route.id}
                  onPress={() => setSelected(route)}
                  style={{
                    borderRadius: 16,
                    overflow: "hidden",
                    backgroundColor: cores.surface,
                    borderWidth: 1,
                    borderColor: ativa ? route.color : cores.border,
                    boxShadow: ativa ? `0 0 16px ${route.color}25` : undefined,
                  }}
                >
                  <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 2 }}>
                        <Texto tamanho={14} peso="black">{route.name}</Texto>
                        <View style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999, backgroundColor: route.color + "18" }}>
                          <Texto tamanho={10} peso="bold" cor={route.color}>{route.label}</Texto>
                        </View>
                      </View>
                      <Texto tamanho={11} cor={cores.muted}>{route.via}</Texto>
                    </View>
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: route.color + "15",
                        borderWidth: 1,
                        borderColor: route.color + "40",
                      }}
                    >
                      <Texto tamanho={16} peso="black" mono cor={route.color}>{route.overall}</Texto>
                      <Texto tamanho={8} cor={route.color}>score</Texto>
                    </View>
                  </View>

                  <View style={{ flexDirection: "row", borderTopWidth: 1, borderBottomWidth: 1, borderColor: cores.border }}>
                    {[
                      { icon: "📍", val: route.distance },
                      { icon: "⏱", val: route.time },
                      { icon: "🔥", val: "~340 kcal" },
                    ].map((s, i) => (
                      <View
                        key={s.val}
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 4,
                          paddingVertical: 8,
                          borderRightWidth: i < 2 ? 1 : 0,
                          borderColor: cores.border,
                        }}
                      >
                        <Texto tamanho={12}>{s.icon}</Texto>
                        <Texto tamanho={11} peso="semibold">{s.val}</Texto>
                      </View>
                    ))}
                  </View>

                  <View style={{ paddingHorizontal: 16, paddingVertical: 12, flexDirection: "row", flexWrap: "wrap", rowGap: 8, columnGap: 16 }}>
                    {[
                      { label: "Segurança", val: route.safety, color: cores.safety },
                      { label: "Trânsito", val: route.traffic, color: cores.traffic },
                      { label: "Limpeza", val: route.clean, color: cores.clean },
                      { label: "Conservação", val: route.conserv, color: cores.conserv },
                    ].map((m) => (
                      <View key={m.label} style={{ width: "46%", flexGrow: 1 }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                          <Texto tamanho={10} cor={cores.muted}>{m.label}</Texto>
                          <Texto tamanho={10} peso="bold" mono cor={m.color}>{m.val}</Texto>
                        </View>
                        <Barra valor={m.val} cor={m.color} />
                      </View>
                    ))}
                  </View>

                  {route.warnings.length > 0 && (
                    <View style={{ paddingHorizontal: 16, paddingBottom: 12, gap: 4 }}>
                      {route.warnings.map((w) => (
                        <Texto key={w} tamanho={10} cor={cores.warn}>⚠️  {w}</Texto>
                      ))}
                    </View>
                  )}
                </Pressable>
              );
            })}

            <Pressable onPress={onStartRun} style={{ paddingVertical: 16, borderRadius: 16, alignItems: "center", backgroundColor: cores.accent }}>
              <Texto tamanho={14} peso="black" cor="#000">▶ Iniciar com “{selected.name}”</Texto>
            </Pressable>
          </>
        )}
      </ScrollView>
    </View>
  );
}

function CampoLocal({ cor, placeholder }: { cor: string; placeholder: string }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        borderRadius: 12,
        paddingLeft: 12,
        paddingRight: 48,
        paddingVertical: 10,
        backgroundColor: cores.surface2,
        borderWidth: 1,
        borderColor: cores.border,
      }}
    >
      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: cor }} />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={cores.muted}
        style={{ flex: 1, fontSize: 14, fontFamily: fontes.regular, color: cores.text, padding: 0 }}
      />
    </View>
  );
}

function Nota({ valor, cor }: { valor: number; cor: string }) {
  return (
    <View
      style={{
        width: 36,
        height: 36,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: cor + "18",
        borderWidth: 1,
        borderColor: cor + "40",
      }}
    >
      <Texto tamanho={12} peso="black" mono cor={cor}>{valor}</Texto>
    </View>
  );
}
