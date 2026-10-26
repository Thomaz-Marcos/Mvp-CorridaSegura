import { Pressable, View } from "react-native";
import { cores } from "../theme";
import Texto from "../components/Texto";
import { IconeBusca } from "../components/Icones";
import MapaRotas from "../components/MapaRotas";
import type { RotaReal } from "../hooks/useRotasReais";
import usePosicao from "../hooks/usePosicao";
import useAlertasLocalizados from "../hooks/useAlertasLocalizados";
import useNomeDoLugar from "../hooks/useNomeDoLugar";
import { formatarDistancia, formatarDuracao } from "../utils/formatar";

const PAINEL = { backgroundColor: "rgba(18,18,18,0.92)", borderWidth: 1, borderColor: cores.border, borderRadius: 10 };

interface Props {
  rota: RotaReal | null;
  onPlanejar: () => void;
  // O mapa fica montado quando a aba está escondida; os alertas são buscados de novo ao voltar.
  visivel: boolean;
}

export default function MapScreen({ rota, onPlanejar, visivel }: Props) {
  const { posicao, permitido } = usePosicao();
  const lugar = useNomeDoLugar(posicao);
  const alertas = useAlertasLocalizados(visivel);
  const textoLugar = permitido === false ? "Localização desativada" : lugar ?? "Localizando…";

  return (
    <View style={{ flex: 1, backgroundColor: cores.bg }}>
      {/* Topo */}
      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ gap: 2 }}>
            <Texto tamanho={22} peso="bold">Pace</Texto>
            <Texto tamanho={12} cor={cores.muted}>{textoLugar}</Texto>
          </View>
          <Pressable
            onPress={onPlanejar}
            style={{ width: 40, height: 40, borderRadius: 10, borderWidth: 1, borderColor: cores.border, alignItems: "center", justifyContent: "center" }}
          >
            <IconeBusca cor={cores.text} />
          </Pressable>
        </View>
      </View>

      {/* Mapa */}
      <View style={{ flex: 1, overflow: "hidden", backgroundColor: cores.bg }}>
        <MapaRotas rota={rota?.coords ?? null} posicao={posicao} alertas={alertas} />

        {rota && (
          <View style={[PAINEL, { position: "absolute", top: 12, left: 12, paddingVertical: 8, paddingHorizontal: 12, gap: 2 }]}>
            <Texto tamanho={12} cor={cores.muted}>Rota escolhida</Texto>
            <Texto tamanho={13} peso="semibold">{formatarDistancia(rota.metros)} · {formatarDuracao(rota.segundos)}</Texto>
          </View>
        )}
      </View>
    </View>
  );
}
