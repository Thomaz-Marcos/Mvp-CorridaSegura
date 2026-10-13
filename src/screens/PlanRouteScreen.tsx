import { useState } from "react";
import { Pressable, ScrollView, TextInput, View } from "react-native";
import { cores, fontes, INDICADORES } from "../theme";
import Texto, { Rotulo } from "../components/Texto";
import Barra from "../components/Barra";
import Chip from "../components/Chip";
import Botao from "../components/Botao";
import { IconeAlerta, IconeTrocar } from "../components/Icones";

const ROUTE_OPTIONS = [
  {
    id: 1, name: "Rota Verde", via: "Via Parque Ibirapuera",
    distance: "5.2 km", time: "28 min", overall: 84,
    color: cores.safety, label: "Recomendada",
    safety: 88, traffic: 72, clean: 91, conserv: 79,
    warnings: [] as string[],
  },
  {
    id: 2, name: "Rota Direta", via: "Via Av. Brasil",
    distance: "3.8 km", time: "21 min", overall: 61,
    color: cores.traffic, label: "Moderada",
    safety: 65, traffic: 48, clean: 70, conserv: 60,
    warnings: ["Trânsito intenso no horário de pico"],
  },
  {
    id: 3, name: "Rota Alternativa", via: "Via R. Vergueiro",
    distance: "6.1 km", time: "34 min", overall: 43,
    color: cores.danger, label: "Evitar",
    safety: 41, traffic: 35, clean: 52, conserv: 44,
    warnings: ["Relatos de assalto", "Calçada danificada no km 4"],
  },
];

const FAVORITAS = [
  { name: "Parque Ibirapuera, volta completa", dist: "5.2 km", score: 84 },
  { name: "Av. Paulista até a Consolação", dist: "4.1 km", score: 61 },
  { name: "Parque Villa-Lobos", dist: "6.8 km", score: 78 },
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
      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, gap: 14, borderBottomWidth: 1, borderColor: cores.border }}>
        <Texto tamanho={22} peso="bold">Planejar rota</Texto>

        <View style={{ borderRadius: 10, borderWidth: 1, borderColor: cores.border, backgroundColor: cores.surface }}>
          <CampoLocal cor={cores.text} placeholder="Ponto de partida" />
          <View style={{ height: 1, marginLeft: 36, backgroundColor: cores.border }} />
          <CampoLocal cor={cores.danger} placeholder="Destino" />
          <Pressable
            hitSlop={8}
            style={{ position: "absolute", right: 12, top: "50%", marginTop: -14, width: 28, height: 28, alignItems: "center", justifyContent: "center" }}
          >
            <IconeTrocar cor={cores.muted} />
          </Pressable>
        </View>

        <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
          <Chip label="Segura" ativo />
          <Chip label="Rápida" />
          <Chip label="Parques" />
          <Pressable
            onPress={() => setSearched(true)}
            style={{ marginLeft: "auto", paddingHorizontal: 14, paddingVertical: 7, borderRadius: 8, backgroundColor: cores.accent }}
          >
            <Texto tamanho={13} peso="semibold" cor="#0b0b0b">Buscar</Texto>
          </Pressable>
        </View>
      </View>

      {/* Resultados */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16, gap: 12 }}>
        {!searched ? (
          <>
            <Rotulo style={{ paddingHorizontal: 4 }}>Favoritas</Rotulo>
            <View style={{ borderRadius: 12, borderWidth: 1, borderColor: cores.border, backgroundColor: cores.surface }}>
              {FAVORITAS.map((r, i) => (
                <Pressable
                  key={r.name}
                  onPress={() => setSearched(true)}
                  style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 14, paddingVertical: 12, borderTopWidth: i ? 1 : 0, borderColor: cores.border }}
                >
                  <View style={{ flex: 1, gap: 2 }}>
                    <Texto tamanho={14} peso="medium">{r.name}</Texto>
                    <Texto tamanho={12} cor={cores.muted}>{r.dist}</Texto>
                  </View>
                  <Texto tamanho={16} peso="bold">{r.score}</Texto>
                </Pressable>
              ))}
            </View>
          </>
        ) : (
          <>
            <Rotulo style={{ paddingHorizontal: 4 }}>{ROUTE_OPTIONS.length} rotas encontradas</Rotulo>

            {ROUTE_OPTIONS.map((route) => {
              const ativa = selected.id === route.id;
              const valores = [route.safety, route.traffic, route.clean, route.conserv];
              return (
                <Pressable
                  key={route.id}
                  onPress={() => setSelected(route)}
                  style={{
                    borderRadius: 12,
                    padding: 16,
                    gap: 14,
                    backgroundColor: ativa ? cores.surface2 : cores.surface,
                    borderWidth: 1,
                    borderColor: ativa ? cores.muted : cores.border,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
                    <View style={{ flex: 1, gap: 2 }}>
                      <Texto tamanho={16} peso="semibold">{route.name}</Texto>
                      <Texto tamanho={12} cor={cores.muted}>{route.via} · {route.distance} · {route.time}</Texto>
                      <Texto tamanho={12} peso="medium" cor={route.color} style={{ marginTop: 4 }}>{route.label}</Texto>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                      <Texto tamanho={24} peso="bold">{route.overall}</Texto>
                      <Texto tamanho={11} cor={cores.muted}>nota</Texto>
                    </View>
                  </View>

                  <View style={{ flexDirection: "row", flexWrap: "wrap", rowGap: 10, columnGap: 16 }}>
                    {INDICADORES.map((ind, i) => (
                      <View key={ind.chave} style={{ width: "46%", flexGrow: 1, gap: 4 }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                          <Texto tamanho={12} cor={cores.muted}>{ind.label}</Texto>
                          <Texto tamanho={12}>{valores[i]}</Texto>
                        </View>
                        <Barra valor={valores[i]} cor={ind.cor} altura={4} fundo={cores.surface3} />
                      </View>
                    ))}
                  </View>

                  {route.warnings.length > 0 && (
                    <View style={{ gap: 6 }}>
                      {route.warnings.map((w) => (
                        <View key={w} style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                          <IconeAlerta cor={cores.warn} tamanho={14} />
                          <Texto tamanho={12} cor={cores.muted}>{w}</Texto>
                        </View>
                      ))}
                    </View>
                  )}
                </Pressable>
              );
            })}

            <Botao label={`Iniciar com ${selected.name}`} onPress={onStartRun} style={{ marginTop: 4 }} />
          </>
        )}
      </ScrollView>
    </View>
  );
}

function CampoLocal({ cor, placeholder }: { cor: string; placeholder: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 14, paddingLeft: 16, paddingRight: 48, paddingVertical: 12 }}>
      <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: cor }} />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#5f5f5f"
        style={{ flex: 1, fontSize: 15, fontFamily: fontes.regular, color: cores.text, padding: 0 }}
      />
    </View>
  );
}
