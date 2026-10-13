import { Pressable, View } from "react-native";
import Svg, { Circle, Ellipse, Line, Path, Rect } from "react-native-svg";
import { cores, INDICADORES } from "../theme";
import Texto, { Rotulo } from "../components/Texto";
import Barra from "../components/Barra";
import { IconeAlerta, IconePausa, IconeParar } from "../components/Icones";

interface Props {
  onFinish: () => void;
}

// Retrato fixo de uma corrida pela metade: sem cronômetro, GPS nem alertas de verdade.
const TEMPO = "14:32";
const DISTANCIA = 2.64;
const PROGRESSO = DISTANCIA / 5.2;
const ALERTA = "Buraco na calçada a 200 m";
const TRECHO = [88, 72, 91, 79];

const PAINEL = { backgroundColor: "rgba(18,18,18,0.92)", borderWidth: 1, borderColor: cores.border, borderRadius: 10 };

export default function ActiveRunScreen({ onFinish }: Props) {
  return (
    <View style={{ flex: 1, backgroundColor: cores.bg }}>
      {/* Mapa (desenho) */}
      <View style={{ height: 260, overflow: "hidden", backgroundColor: cores.bg }}>
        <MapaCorrida progresso={PROGRESSO} />

        <View style={{ position: "absolute", top: 12, left: 12, right: 12, flexDirection: "row", justifyContent: "space-between" }}>
          <View style={[PAINEL, { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 10, paddingVertical: 6 }]}>
            <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: cores.danger }} />
            <Texto tamanho={12} peso="medium">Gravando</Texto>
          </View>
          <View style={[PAINEL, { paddingHorizontal: 10, paddingVertical: 6 }]}>
            <Texto tamanho={12} cor={cores.muted}>Nota do trecho <Texto tamanho={12} peso="semibold">84</Texto></Texto>
          </View>
        </View>

        {/* Aviso que aparece durante a corrida */}
        <View style={[PAINEL, { position: "absolute", bottom: 12, left: 12, right: 12, flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 12, paddingVertical: 10 }]}>
          <IconeAlerta cor={cores.warn} tamanho={16} />
          <Texto tamanho={13} style={{ flexShrink: 1 }}>{ALERTA}</Texto>
        </View>
      </View>

      {/* Progresso */}
      <View style={{ paddingHorizontal: 20, paddingVertical: 12, gap: 8, borderBottomWidth: 1, borderColor: cores.border }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Texto tamanho={12} cor={cores.muted}>Progresso da rota</Texto>
          <Texto tamanho={12} cor={cores.muted}>{DISTANCIA.toFixed(2)} de 5.20 km</Texto>
        </View>
        <Barra valor={PROGRESSO * 100} cor={cores.accent} altura={4} fundo={cores.surface3} />
      </View>

      {/* Números */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 20, gap: 20 }}>
        <View style={{ alignItems: "center" }}>
          <Texto tamanho={13} cor={cores.muted}>Tempo</Texto>
          <Texto tamanho={56} peso="bold" mono style={{ lineHeight: 64 }}>{TEMPO}</Texto>
        </View>

        <View style={{ flexDirection: "row", borderRadius: 12, borderWidth: 1, borderColor: cores.border, backgroundColor: cores.surface }}>
          {[
            { label: "Distância", val: DISTANCIA.toFixed(2), unit: "km" },
            { label: "Pace", val: `5'30"`, unit: "/km" },
            { label: "Calorias", val: "190", unit: "kcal" },
          ].map((s, i) => (
            <View key={s.label} style={{ flex: 1, paddingVertical: 14, paddingHorizontal: 14, gap: 2, borderLeftWidth: i ? 1 : 0, borderColor: cores.border }}>
              <Texto tamanho={12} cor={cores.muted}>{s.label}</Texto>
              <Texto tamanho={20} peso="bold">
                {s.val}<Texto tamanho={12} cor={cores.muted}> {s.unit}</Texto>
              </Texto>
            </View>
          ))}
        </View>

        <View style={{ borderRadius: 12, padding: 16, gap: 12, backgroundColor: cores.surface, borderWidth: 1, borderColor: cores.border }}>
          <Rotulo>Trecho atual</Rotulo>
          <View style={{ flexDirection: "row", flexWrap: "wrap", rowGap: 12, columnGap: 16 }}>
            {INDICADORES.map((ind, i) => (
              <View key={ind.chave} style={{ width: "46%", flexGrow: 1, gap: 4 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Texto tamanho={12} cor={cores.muted}>{ind.label}</Texto>
                  <Texto tamanho={12}>{TRECHO[i]}</Texto>
                </View>
                <Barra valor={TRECHO[i]} cor={ind.cor} altura={4} fundo={cores.surface3} />
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Controles */}
      <View style={{ flex: 1, justifyContent: "flex-end", paddingBottom: 24, paddingHorizontal: 24 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 28 }}>
          <BotaoRedondo label="Pausar">
            <IconePausa cor={cores.text} />
          </BotaoRedondo>

          <Pressable onPress={onFinish} style={{ alignItems: "center", gap: 6 }}>
            <View style={{ width: 76, height: 76, borderRadius: 38, alignItems: "center", justifyContent: "center", backgroundColor: cores.accent }}>
              <IconeParar cor="#0b0b0b" tamanho={26} />
            </View>
            <Texto tamanho={12} cor={cores.muted}>Encerrar</Texto>
          </Pressable>

          <BotaoRedondo label="Alertar">
            <IconeAlerta cor={cores.danger} tamanho={22} />
          </BotaoRedondo>
        </View>
      </View>
    </View>
  );
}

function BotaoRedondo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Pressable style={{ alignItems: "center", gap: 6 }}>
      <View style={{ width: 60, height: 60, borderRadius: 30, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: cores.border, backgroundColor: cores.surface }}>
        {children}
      </View>
      <Texto tamanho={12} cor={cores.muted}>{label}</Texto>
    </Pressable>
  );
}

function MapaCorrida({ progresso }: { progresso: number }) {
  const PATH =
    "M60 220 Q100 210 140 190 Q170 175 190 150 Q210 125 220 100 Q235 80 260 85 Q285 90 300 115 Q315 140 305 170 Q290 200 265 215 Q235 228 200 232 Q165 236 130 225 Q95 214 60 220";
  const total = 620;

  return (
    <Svg width="100%" height="100%" viewBox="0 0 390 260" preserveAspectRatio="xMidYMid slice">
      <Rect width={390} height={260} fill="#1c1c1c" />
      {[0, 1, 2, 3, 4].map((i) => (
        <Line key={`h${i}`} x1={0} y1={50 + i * 52} x2={390} y2={50 + i * 52} stroke="#2a2a2a" strokeWidth={10} />
      ))}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <Line key={`v${i}`} x1={25 + i * 56} y1={0} x2={25 + i * 56} y2={260} stroke="#2a2a2a" strokeWidth={10} />
      ))}
      <Ellipse cx={220} cy={155} rx={50} ry={38} fill="#1b2a21" />
      <Path d={PATH} fill="none" stroke="#3a3a3a" strokeWidth={5} strokeLinecap="round" />
      <Path
        d={PATH}
        fill="none"
        stroke={cores.accent}
        strokeWidth={5}
        strokeLinecap="round"
        strokeDasharray={`${total * progresso} ${total}`}
      />
      <Circle cx={60} cy={220} r={5} fill="#ececec" />
      {/* Corredor (ponta do trecho percorrido) */}
      <Circle cx={298} cy={112} r={7} fill={cores.accent} stroke="#fff" strokeWidth={2} />
    </Svg>
  );
}
