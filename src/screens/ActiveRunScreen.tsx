import { Pressable, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Circle, Defs, Ellipse, Line, LinearGradient as SvgGradient, Path, Rect, Stop } from "react-native-svg";
import { cores } from "../theme";
import Texto, { Rotulo } from "../components/Texto";
import Barra from "../components/Barra";

interface Props {
  onFinish: () => void;
}

// Retrato fixo de uma corrida pela metade: sem cronômetro, GPS nem alertas de verdade.
const TEMPO = "14:32";
const DISTANCIA = 2.64;
const PROGRESSO = DISTANCIA / 5.2;
const ALERTA = { icon: "⚠️", color: "#facc15", text: "Buraco detectado à frente — atenção!" };

export default function ActiveRunScreen({ onFinish }: Props) {
  return (
    <View style={{ flex: 1, backgroundColor: cores.bg }}>
      {/* Mapa (desenho) */}
      <View style={{ height: 260, overflow: "hidden", backgroundColor: "#0a0a18" }}>
        <MapaCorrida progresso={PROGRESSO} />

        <View style={{ position: "absolute", top: 0, left: 0, right: 0, flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 16, paddingTop: 16 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 999,
              backgroundColor: "rgba(22,22,31,0.9)",
              borderWidth: 1,
              borderColor: cores.border,
            }}
          >
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: cores.accent }} />
            <Texto tamanho={12} peso="bold" cor={cores.accent}>Gravando</Texto>
          </View>
          <Pressable
            onPress={onFinish}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 999,
              backgroundColor: "rgba(244,63,94,0.15)",
              borderWidth: 1,
              borderColor: "rgba(244,63,94,0.4)",
            }}
          >
            <Texto tamanho={12} peso="bold" cor={cores.danger}>Encerrar</Texto>
          </Pressable>
        </View>

        {/* Aviso que aparece durante a corrida */}
        <View
          style={{
            position: "absolute",
            bottom: 12,
            left: 12,
            maxWidth: "58%",
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            paddingHorizontal: 12,
            paddingVertical: 10,
            borderRadius: 16,
            backgroundColor: ALERTA.color + "20",
            borderWidth: 1,
            borderColor: ALERTA.color + "50",
          }}
        >
          <Texto tamanho={14}>{ALERTA.icon}</Texto>
          <Texto tamanho={12} peso="semibold" cor={ALERTA.color} style={{ flexShrink: 1 }}>{ALERTA.text}</Texto>
        </View>

        <View
          style={{
            position: "absolute",
            bottom: 12,
            right: 12,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 999,
            backgroundColor: "rgba(22,22,31,0.92)",
            borderWidth: 1,
            borderColor: cores.border,
          }}
        >
          <Texto tamanho={12} peso="bold" cor={cores.accent}>
            🛡️ Score atual: <Texto tamanho={12} peso="bold" mono cor={cores.accent}>84</Texto>
          </Texto>
        </View>
      </View>

      {/* Progresso */}
      <View style={{ paddingHorizontal: 20, paddingVertical: 12, backgroundColor: cores.surface, borderBottomWidth: 1, borderColor: cores.border }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
          <Texto tamanho={10} peso="semibold" cor={cores.muted}>Progresso da rota</Texto>
          <Texto tamanho={10} peso="bold" mono cor={cores.accent}>{DISTANCIA.toFixed(2)} / 5.20 km</Texto>
        </View>
        <View style={{ height: 8, borderRadius: 4, overflow: "hidden", backgroundColor: cores.surface2 }}>
          <LinearGradient
            colors={[cores.accent, cores.accent2]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ width: `${PROGRESSO * 100}%`, height: "100%", borderRadius: 4 }}
          />
        </View>
      </View>

      {/* Números */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 20 }}>
        <View style={{ alignItems: "center", marginBottom: 20 }}>
          <Rotulo style={{ marginBottom: 4 }}>Tempo</Rotulo>
          <Texto tamanho={48} peso="black" mono>{TEMPO}</Texto>
        </View>

        <View style={{ flexDirection: "row", gap: 12, marginBottom: 20 }}>
          {[
            { label: "Distância", val: DISTANCIA.toFixed(2), unit: "km", color: cores.accent },
            { label: "Pace", val: `5'30"`, unit: "/km", color: cores.accent2 },
            { label: "Calorias", val: "190", unit: "kcal", color: cores.traffic },
          ].map((s) => (
            <View
              key={s.label}
              style={{ flex: 1, alignItems: "center", paddingVertical: 16, borderRadius: 16, backgroundColor: cores.surface, borderWidth: 1, borderColor: cores.border }}
            >
              <Texto tamanho={10} cor={cores.muted} style={{ marginBottom: 4 }}>{s.label}</Texto>
              <Texto tamanho={20} peso="black" mono cor={s.color}>{s.val}</Texto>
              <Texto tamanho={10} cor={cores.muted}>{s.unit}</Texto>
            </View>
          ))}
        </View>

        <View style={{ borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: cores.surface, borderWidth: 1, borderColor: cores.border }}>
          <Rotulo style={{ marginBottom: 10 }}>Trecho Atual</Rotulo>
          <View style={{ flexDirection: "row", flexWrap: "wrap", rowGap: 8, columnGap: 8 }}>
            {[
              { label: "Segurança", val: 88, color: cores.safety, icon: "🛡️" },
              { label: "Trânsito", val: 72, color: cores.traffic, icon: "🚦" },
              { label: "Limpeza", val: 91, color: cores.clean, icon: "🧹" },
              { label: "Conservação", val: 79, color: cores.conserv, icon: "🛤️" },
            ].map((m) => (
              <View key={m.label} style={{ width: "48%", flexGrow: 1, flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Texto tamanho={12}>{m.icon}</Texto>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                    <Texto tamanho={10} cor={cores.muted}>{m.label}</Texto>
                    <Texto tamanho={10} peso="bold" mono cor={m.color}>{m.val}</Texto>
                  </View>
                  <Barra valor={m.val} cor={m.color} altura={4} />
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Controles */}
      <View style={{ flex: 1, justifyContent: "flex-end", paddingBottom: 24, paddingHorizontal: 24 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 24 }}>
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: cores.surface2,
              borderWidth: 2,
              borderColor: cores.border,
            }}
          >
            <Texto tamanho={20} peso="bold">⏸</Texto>
          </View>

          <Pressable
            onPress={onFinish}
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              backgroundColor: cores.accent,
              boxShadow: `0 0 24px ${cores.accent}40`,
            }}
          >
            <Texto tamanho={20} cor="#000">⏹</Texto>
            <Texto tamanho={9} peso="black" cor="#000" style={{ letterSpacing: 0.5 }}>PARAR</Texto>
          </Pressable>

          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(244,63,94,0.12)",
              borderWidth: 2,
              borderColor: "rgba(244,63,94,0.4)",
            }}
          >
            <Texto tamanho={20}>🚨</Texto>
          </View>
        </View>
      </View>
    </View>
  );
}

function MapaCorrida({ progresso }: { progresso: number }) {
  const PATH =
    "M60 220 Q100 210 140 190 Q170 175 190 150 Q210 125 220 100 Q235 80 260 85 Q285 90 300 115 Q315 140 305 170 Q290 200 265 215 Q235 228 200 232 Q165 236 130 225 Q95 214 60 220";
  const total = 620;

  return (
    <Svg width="100%" height="100%" viewBox="0 0 390 260" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <SvgGradient id="runGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#7c6fff" />
          <Stop offset="100%" stopColor="#00e87a" />
        </SvgGradient>
      </Defs>
      <Rect width={390} height={260} fill="#0d0d1a" />
      {[0, 1, 2, 3, 4].map((i) => (
        <Line key={`h${i}`} x1={0} y1={50 + i * 52} x2={390} y2={50 + i * 52} stroke="#161626" strokeWidth={10} />
      ))}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <Line key={`v${i}`} x1={25 + i * 56} y1={0} x2={25 + i * 56} y2={260} stroke="#161626" strokeWidth={10} />
      ))}
      <Ellipse cx={220} cy={155} rx={50} ry={38} fill="#001a10" stroke="#00e87a20" strokeWidth={1} />
      <Path d={PATH} fill="none" stroke="#2a2a3a" strokeWidth={5} strokeLinecap="round" />
      <Path
        d={PATH}
        fill="none"
        stroke="url(#runGrad)"
        strokeWidth={5}
        strokeLinecap="round"
        strokeDasharray={`${total * progresso} ${total}`}
      />
      <Circle cx={60} cy={220} r={6} fill="#7c6fff" stroke="#fff" strokeWidth={2} />
      {/* Corredor (ponta do trecho percorrido) */}
      <Circle cx={298} cy={112} r={7} fill="#00e87a" stroke="#fff" strokeWidth={2.5} />
    </Svg>
  );
}
