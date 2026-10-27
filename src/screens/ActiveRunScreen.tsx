import { useRef, useState } from "react";
import { ActivityIndicator, Linking, Pressable, View } from "react-native";
import { salvarCorrida } from "../data/corridas";
import { urlDoCaminho } from "../data/lugares";
import type { Coordenada } from "../data/coordenada";
import type { ModoMapa } from "../utils/camera";
import { formatarDistancia, formatarDuracao, formatarPace, formatarTempo } from "../utils/formatar";
import { cores } from "../theme";
import Texto from "../components/Texto";
import MapaCorrida from "../components/MapaCorrida";
import useCorrida, { distanciaEmMetros } from "../hooks/useCorrida";
import useGuiaDeVoz from "../hooks/useGuiaDeVoz";
import useNavegacao from "../hooks/useNavegacao";
import useRefugio, { type Refugio } from "../hooks/useRefugio";
import type { RotaReal } from "../hooks/useRotasReais";
import { IconeAlerta, IconeManobra, IconePausa, IconeParar } from "../components/Icones";

interface Props {
  rota: RotaReal | null;
  onFinish: () => void;
}

const BALAO_FUNDO = "rgba(18,18,18,0.94)";

// Durante a corrida a tela é só o mapa em primeira pessoa, três balões com os números e os três botões.
export default function ActiveRunScreen({ rota, onFinish }: Props) {
  const { permitido, pausada, metros, segundos, posicao, rumo, trajeto, alternarPausa } = useCorrida();
  const { estado: socorro, pedir: pedirSocorro, cancelar: cancelarSocorro } = useRefugio(posicao);
  const [modo, setModo] = useState<ModoMapa>("seguir");
  const [vozLigada, setVozLigada] = useState(true);
  useGuiaDeVoz(rota, posicao, metros, vozLigada);
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
        <MapaCorrida posicao={posicao} rumo={rumo} trajeto={trajeto} rota={(socorro.tipo === "pronto" ? socorro.refugio.rota?.coords : null) ?? rota?.coords ?? []} modo={modo} permitido={permitido} />
      </View>

      {socorro.tipo !== "livre" && (
        <View style={{ position: "absolute", top: 12, left: 12, right: 12 }}>
          <AvisoSocorro estado={socorro} posicao={posicao} metros={metros} onTentar={pedirSocorro} onFechar={cancelarSocorro} />
        </View>
      )}

      <View style={{ position: "absolute", right: 12, bottom: 124, gap: 10, alignItems: "flex-end" }}>
        <BotaoPilula rotulo={ROTULO_MODO[modo]} onPress={() => setModo(proximoModo(modo, rota !== null))} />
        {rota && <BotaoPilula rotulo={vozLigada ? "Voz: ligada" : "Voz: desligada"} onPress={() => setVozLigada(!vozLigada)} />}
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

        <BotaoRedondo rotulo="Estou em perigo" onPress={pedirSocorro} perigo>
          <IconeAlerta cor={cores.danger} tamanho={22} />
        </BotaoRedondo>
      </View>
    </View>
  );
}

function BotaoRedondo({ rotulo, children, onPress, perigo }: { rotulo: string; children: React.ReactNode; onPress?: () => void; perigo?: boolean }) {
  return (
    <Pressable
      accessibilityLabel={rotulo}
      onPress={onPress}
      style={{ width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center", borderWidth: perigo ? 2 : 1, borderColor: perigo ? cores.danger : cores.border, backgroundColor: BALAO_FUNDO }}
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

const ROTULO_MODO: Record<ModoMapa, string> = { seguir: "Mapa: girando", norte: "Mapa: norte fixo", rota: "Mapa: rota inteira" };

// seguir → norte → rota inteira (só quando há rota planejada) → seguir.
const proximoModo = (modo: ModoMapa, temRota: boolean): ModoMapa => (modo === "seguir" ? "norte" : modo === "norte" && temRota ? "rota" : "seguir");

function BotaoPilula({ rotulo, onPress }: { rotulo: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={{ paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: cores.border, backgroundColor: BALAO_FUNDO }}>
      <Texto tamanho={12} peso="semibold">{rotulo}</Texto>
    </Pressable>
  );
}

const ligar190 =() => Linking.openURL("tel:190");

type EstadoSocorro = ReturnType<typeof useRefugio>["estado"];

// Aviso no topo da corrida: procurando, erro, ou o caminho até o lugar seguro mais perto.
function AvisoSocorro({ estado, posicao, metros, onTentar, onFechar }: { estado: EstadoSocorro; posicao: Coordenada | null; metros: number; onTentar: () => void; onFechar: () => void }) {
  return (
    <View style={{ borderRadius: 16, padding: 14, gap: 10, backgroundColor: BALAO_FUNDO, borderWidth: 1, borderColor: cores.danger }}>
      {estado.tipo === "buscando" && (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <ActivityIndicator color={cores.danger} />
          <Texto tamanho={14} peso="semibold">Procurando o lugar seguro mais perto…</Texto>
        </View>
      )}
      {estado.tipo === "erro" && <Texto tamanho={14} peso="semibold">{estado.mensagem}</Texto>}
      {estado.tipo === "pronto" && <CaminhoSeguro refugio={estado.refugio} posicao={posicao} metros={metros} />}
      <View style={{ flexDirection: "row", gap: 8 }}>
        <BotaoAviso rotulo="Ligar 190" onPress={ligar190} destaque />
        {estado.tipo === "pronto" && <BotaoAviso rotulo="Abrir no Maps" onPress={() => Linking.openURL(urlDoCaminho(estado.refugio.lugar))} />}
        {estado.tipo === "erro" && <BotaoAviso rotulo="Tentar de novo" onPress={onTentar} />}
        <BotaoAviso rotulo={estado.tipo === "pronto" ? "Estou seguro" : "Fechar"} onPress={onFechar} />
      </View>
    </View>
  );
}

// Curva atual, nome do lugar e quanto falta. É um componente à parte para a navegação recomeçar a cada pedido.
function CaminhoSeguro({ refugio, posicao, metros }: { refugio: Refugio; posicao: Coordenada | null; metros: number }) {
  const [metrosAoPedir] = useState(metros);
  const { atual, ateCurva, restanteM, restanteS } = useNavegacao(refugio.rota, posicao, metros - metrosAoPedir);
  const faltam = posicao ? distanciaEmMetros(posicao, refugio.lugar.posicao) : refugio.lugar.distancia;
  const chegou = faltam < 30;
  const resumo = refugio.rota ? `${formatarDistancia(restanteM)} · ${formatarDuracao(restanteS)} a pé` : formatarDistancia(faltam);
  return (
    <View style={{ gap: 8 }}>
      <Texto tamanho={12} cor={cores.muted}>Lugar seguro mais perto</Texto>
      <Texto tamanho={16} peso="bold">{refugio.lugar.nome}</Texto>
      <Texto tamanho={13} cor={cores.muted}>{chegou ? "Você chegou. Entre e peça ajuda." : resumo}</Texto>
      {!chegou && atual && (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <IconeManobra manobra={atual.manobra} cor={cores.text} tamanho={32} />
          <Texto tamanho={14} peso="medium" style={{ flex: 1 }}>{formatarDistancia(ateCurva)} · {atual.instrucao}</Texto>
        </View>
      )}
    </View>
  );
}

function BotaoAviso({ rotulo, onPress, destaque }: { rotulo: string; onPress: () => void; destaque?: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      style={{ flex: 1, alignItems: "center", paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: destaque ? cores.danger : cores.border, backgroundColor: destaque ? cores.danger : "transparent" }}
    >
      <Texto tamanho={12} peso="semibold" cor={destaque ? "#fff" : cores.text}>{rotulo}</Texto>
    </Pressable>
  );
}
