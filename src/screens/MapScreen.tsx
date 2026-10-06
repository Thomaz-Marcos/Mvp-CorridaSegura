import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import Svg, { Circle, Ellipse, Line, Path, Rect } from "react-native-svg";
import { cores } from "../theme";
import Texto, { Rotulo } from "../components/Texto";
import Chip from "../components/Chip";
import { IconeBusca } from "../components/Icones";

// No Figma o mapa é Google Maps; aqui é um desenho fixo em SVG (sem mapa de verdade).
const ROUTES = [
  {
    id: 1, name: "Parque Ibirapuera", distance: "5.2 km", time: "28 min",
    safety: 88, traffic: 72, clean: 91, conserv: 79, overall: 84,
    color: "#00e87a", label: "Ótima",
    d: "M150 250 Q130 200 175 165 Q215 135 255 120 Q290 110 285 150 Q275 200 240 235 Q205 268 170 268 Q152 266 150 250",
  },
  {
    id: 2, name: "Av. Paulista", distance: "3.8 km", time: "21 min",
    safety: 63, traffic: 45, clean: 68, conserv: 55, overall: 58,
    color: "#f59e0b", label: "Regular",
    d: "M110 205 L180 190 L250 172 L330 155",
    alerta: { x: 225, y: 177, cor: "#facc15" },
  },
  {
    id: 3, name: "Marginal Pinheiros", distance: "8.1 km", time: "45 min",
    safety: 41, traffic: 30, clean: 52, conserv: 47, overall: 43,
    color: "#f43f5e", label: "Evitar",
    d: "M60 300 L140 305 L220 310 L300 300 L370 292",
    alerta: { x: 175, y: 307, cor: "#f43f5e" },
  },
];

export default function MapScreen() {
  const [selected, setSelected] = useState(ROUTES[0]);

  return (
    <View style={{ flex: 1, backgroundColor: cores.bg }}>
      {/* Topo */}
      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, gap: 12 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View>
            <Texto tamanho={20} peso="black">
              Run<Texto tamanho={20} peso="black" cor={cores.accent}>Safe</Texto>
            </Texto>
            <Texto tamanho={11} cor={cores.muted}>São Paulo, SP · Agora</Texto>
          </View>
          <View style={{ width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: cores.surface2 }}>
            <IconeBusca cor={cores.text} />
          </View>
        </View>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Chip label="Todas" ativo />
          <Chip label="🛡️ Seguras" />
          <Chip label="⚡ Rápidas" />
        </View>
      </View>

      {/* Mapa */}
      <View style={{ flex: 1, overflow: "hidden", backgroundColor: "#0d0d1a" }}>
        <Svg width="100%" height="100%" viewBox="0 0 390 420" preserveAspectRatio="xMidYMid slice">
          <Rect width={390} height={420} fill="#0d0d1a" />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <Line key={`h${i}`} x1={0} y1={30 + i * 55} x2={390} y2={30 + i * 55} stroke="#1e1e2a" strokeWidth={8} />
          ))}
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <Line key={`v${i}`} x1={20 + i * 58} y1={0} x2={20 + i * 58} y2={420} stroke="#1e1e2a" strokeWidth={8} />
          ))}
          <Ellipse cx={215} cy={195} rx={70} ry={58} fill="#001a10" />

          {ROUTES.map((r) => {
            const ativa = r.id === selected.id;
            return (
              <Path
                key={r.id}
                d={r.d}
                fill="none"
                stroke={r.color}
                strokeOpacity={ativa ? 1 : 0.4}
                strokeWidth={ativa ? 5 : 3}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={r.id === 1 ? undefined : "8 6"}
              />
            );
          })}

          {ROUTES.map((r) =>
            r.alerta ? (
              <Circle key={`a${r.id}`} cx={r.alerta.x} cy={r.alerta.y} r={7} fill={r.alerta.cor} stroke="#fff" strokeWidth={2} />
            ) : null,
          )}

          {/* Você */}
          <Circle cx={205} cy={215} r={9} fill="#7c6fff" stroke="#fff" strokeWidth={2.5} />
        </Svg>

        {/* Notas do trecho selecionado */}
        <View
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            borderRadius: 12,
            overflow: "hidden",
            backgroundColor: "rgba(22,22,31,0.92)",
            borderWidth: 1,
            borderColor: cores.border,
          }}
        >
          {[
            { label: "S", color: cores.safety, val: selected.safety },
            { label: "T", color: cores.traffic, val: selected.traffic },
            { label: "L", color: cores.clean, val: selected.clean },
            { label: "C", color: cores.conserv, val: selected.conserv },
          ].map((item, i) => (
            <View
              key={item.label}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderBottomWidth: i < 3 ? 1 : 0,
                borderColor: cores.border,
              }}
            >
              <View style={{ width: 20, height: 20, borderRadius: 6, alignItems: "center", justifyContent: "center", backgroundColor: item.color + "22" }}>
                <Texto tamanho={10} peso="black" cor={item.color}>{item.label}</Texto>
              </View>
              <Texto tamanho={12} peso="bold" mono cor={item.color}>{item.val}</Texto>
            </View>
          ))}
        </View>

        {/* Alertas */}
        <View
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 999,
            backgroundColor: "rgba(244,63,94,0.15)",
            borderWidth: 1,
            borderColor: "rgba(244,63,94,0.4)",
          }}
        >
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: cores.danger }} />
          <Texto tamanho={11} peso="semibold" cor={cores.danger}>2 alertas na área</Texto>
        </View>
      </View>

      {/* Cards de rotas */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 12, gap: 8 }}>
        <Rotulo>Rotas Próximas</Rotulo>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingBottom: 4 }}>
          {ROUTES.map((route) => {
            const ativa = selected.id === route.id;
            return (
              <Pressable
                key={route.id}
                onPress={() => setSelected(route)}
                style={{
                  width: 140,
                  borderRadius: 16,
                  padding: 12,
                  gap: 6,
                  backgroundColor: ativa ? cores.surface2 : cores.surface,
                  borderWidth: 1,
                  borderColor: ativa ? route.color : cores.border,
                  boxShadow: ativa ? `0 0 12px ${route.color}30` : undefined,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <View style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999, backgroundColor: route.color + "20" }}>
                    <Texto tamanho={10} peso="bold" cor={route.color}>{route.label}</Texto>
                  </View>
                  <Texto tamanho={11} peso="bold" mono cor={route.color}>{route.overall}</Texto>
                </View>
                <Texto tamanho={12} peso="bold">{route.name}</Texto>
                <Texto tamanho={10} cor={cores.muted}>{route.distance}  ·  {route.time}</Texto>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}
