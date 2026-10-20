import { useRef, useState } from "react";
import { Pressable, View } from "react-native";
import { salvarCorrida } from "../data/corridas";
import { formatarPace, formatarTempo } from "../utils/formatar";
import { cores } from "../theme";
import Texto from "../components/Texto";
import MapaCorrida from "../components/MapaCorrida";
import useCorrida from "../hooks/useCorrida";
import type { RotaReal } from "../hooks/useRotasReais";
import { IconeAlerta, IconePausa, IconeParar } from "../components/Icones";

interface Props {
  rota: RotaReal | null;
  onFinish: () => void;
}

const BALAO_FUNDO = "rgba(18,18,18,0.94)";

// Durante a corrida a tela é só o mapa em primeira pessoa, três balões com os números e os três botões.
export default function ActiveRunScreen({ rota, onFinish }: Props) {
  const { permitido, pausada, metros, segundos, posicao, rumo, trajeto, alternarPausa } = useCorrida();
  const [iniciadaEm] = useState(() => Date.now());
  const encerrando = useRef(false);

  // Grava a corrida no aparelho antes de voltar (ignora corridas curtas demais).
  const encerrar = async () => {
    if (encerrando.current) return;
    encerrando.current = true;
    await salvarCorrida({ iniciadaEm, metros, segundos });
    onFinish();
  };

  const distancia = metros / 1000;

  return (
    <View style={{ flex: 1, backgroundColor: cores.bg }}>
      <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
        <MapaCorrida posicao={posicao} rumo={rumo} trajeto={trajeto} rota={rota?.coords ?? []} visaoGeral={false} permitido={permitido} />
      </View>

      {/* Balões ao lado do mapa */}
      <View pointerEvents="none" style={{ position: "absolute", left: 12, bottom: 124, gap: 10 }}>
        <Balao valor={formatarTempo(segundos)} unidade="tempo" mono />
        <Balao valor={distancia.toFixed(2)} unidade="km" />
        <Balao valor={formatarPace(segundos, distancia)} unidade="pace /km" />
      </View>

      <View pointerEvents="box-none" style={{ position: "absolute", left: 0, right: 0, bottom: 28, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 24 }}>
        <BotaoRedondo rotulo={pausada ? "Retomar" : "Pausar"} onPress={alternarPausa}>
          <IconePausa cor={cores.text} />
        </BotaoRedondo>

        <Pressable accessibilityLabel="Encerrar" onPress={encerrar} style={{ width: 68, height: 68, borderRadius: 34, alignItems: "center", justifyContent: "center", backgroundColor: cores.accent }}>
          <IconeParar cor="#0b0b0b" tamanho={24} />
        </Pressable>

        <BotaoRedondo rotulo="Alertar">
          <IconeAlerta cor={cores.danger} tamanho={22} />
        </BotaoRedondo>
      </View>
    </View>
  );
}

function BotaoRedondo({ rotulo, children, onPress }: { rotulo: string; children: React.ReactNode; onPress?: () => void }) {
  return (
    <Pressable
      accessibilityLabel={rotulo}
      onPress={onPress}
      style={{ width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: cores.border, backgroundColor: "rgba(18,18,18,0.94)" }}
    >
      {children}
    </Pressable>
  );
}

// Balão de fala: cantos bem arredondados e uma ponta apontando para o corredor.
function Balao({ valor, unidade, mono }: { valor: string; unidade: string; mono?: boolean }) {
  return (
    <View style={{ alignSelf: "flex-start", marginRight: 8 }}>
      <View style={{ minWidth: 84, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, backgroundColor: BALAO_FUNDO, borderWidth: 1, borderColor: cores.border }}>
        <Texto tamanho={19} peso="bold" mono={mono}>{valor}</Texto>
        <Texto tamanho={11} cor={cores.muted}>{unidade}</Texto>
      </View>
      <View style={{ position: "absolute", right: -5, top: "50%", marginTop: -6, width: 12, height: 12, backgroundColor: BALAO_FUNDO, borderTopWidth: 1, borderRightWidth: 1, borderColor: cores.border, transform: [{ rotate: "45deg" }] }} />
    </View>
  );
}
