import { useRef, useState } from "react";
import { Pressable, View } from "react-native";
import { salvarCorrida } from "../data/corridas";
import { formatarPace, formatarTempo } from "../utils/formatar";
import { cores, INDICADORES } from "../theme";
import Texto, { Rotulo } from "../components/Texto";
import Barra from "../components/Barra";
import MapaCorrida from "../components/MapaCorrida";
import useCorrida from "../hooks/useCorrida";
import { IconeAlerta, IconePausa, IconeParar } from "../components/Icones";

interface Props {
  onFinish: () => void;
}

// Tempo, distância, pace e calorias vêm do GPS; alerta e notas do trecho ainda são fixos.
const DISTANCIA_ROTA = 5.2;
const KCAL_POR_KM = 65; // estimativa média, sem peso do usuário
const ALERTA = "Buraco na calçada a 200 m";
const TRECHO = [88, 72, 91, 79];

const PAINEL = { backgroundColor: "rgba(18,18,18,0.92)", borderWidth: 1, borderColor: cores.border, borderRadius: 10 };

export default function ActiveRunScreen({ onFinish }: Props) {
  const { permitido, pausada, metros, segundos, posicao, trajeto, alternarPausa } = useCorrida();
  const [iniciadaEm] = useState(() => Date.now());
  const encerrando = useRef(false);

  // Grava a corrida no aparelho antes de voltar (ignora corridas curtas demais).
  const encerrar = async () => {
    if (encerrando.current) return;
    encerrando.current = true;
    await salvarCorrida({ iniciadaEm, metros, segundos });
    onFinish();
  };

  const DISTANCIA = metros / 1000;
  const PROGRESSO = Math.min(DISTANCIA / DISTANCIA_ROTA, 1);
  const TEMPO = formatarTempo(segundos);

  return (
    <View style={{ flex: 1, backgroundColor: cores.bg }}>
      <View style={{ height: 260, backgroundColor: cores.bg }}>
        <MapaCorrida posicao={posicao} trajeto={trajeto} permitido={permitido} />

        <View style={{ position: "absolute", top: 12, left: 12, right: 12, flexDirection: "row", justifyContent: "space-between" }}>
          <View style={[PAINEL, { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 10, paddingVertical: 6 }]}>
            <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: cores.danger }} />
            <Texto tamanho={12} peso="medium">{permitido === false ? "Sem GPS" : pausada ? "Pausada" : "Gravando"}</Texto>
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
          <Texto tamanho={12} cor={cores.muted}>{DISTANCIA.toFixed(2)} de {DISTANCIA_ROTA.toFixed(2)} km</Texto>
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
            { label: "Pace", val: formatarPace(segundos, DISTANCIA), unit: "/km" },
            { label: "Calorias", val: String(Math.round(DISTANCIA * KCAL_POR_KM)), unit: "kcal" },
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
          <BotaoRedondo label={pausada ? "Retomar" : "Pausar"} onPress={alternarPausa}>
            <IconePausa cor={cores.text} />
          </BotaoRedondo>

          <Pressable onPress={encerrar} style={{ alignItems: "center", gap: 6 }}>
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

function BotaoRedondo({ label, children, onPress }: { label: string; children: React.ReactNode; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={{ alignItems: "center", gap: 6 }}>
      <View style={{ width: 60, height: 60, borderRadius: 30, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: cores.border, backgroundColor: cores.surface }}>
        {children}
      </View>
      <Texto tamanho={12} cor={cores.muted}>{label}</Texto>
    </Pressable>
  );
}
