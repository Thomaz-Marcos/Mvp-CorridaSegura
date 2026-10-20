import { Pressable, View } from "react-native";
import { cores, INDICADORES } from "../theme";
import Texto from "../components/Texto";
import Chip from "../components/Chip";
import { IconeBusca } from "../components/Icones";
import MapaRotas from "../components/MapaRotas";
import { ROTAS } from "../data/rotas";
import usePosicao from "../hooks/usePosicao";
import useNomeDoLugar from "../hooks/useNomeDoLugar";

const PAINEL = { backgroundColor: "rgba(18,18,18,0.92)", borderWidth: 1, borderColor: cores.border, borderRadius: 10 };

export default function MapScreen() {
  const selected = ROTAS[0];
  const { posicao, permitido } = usePosicao();
  const lugar = useNomeDoLugar(posicao);
  const textoLugar = permitido === false ? "Localização desativada" : lugar ?? "Localizando…";

  return (
    <View style={{ flex: 1, backgroundColor: cores.bg }}>
      {/* Topo */}
      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, gap: 14 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ gap: 2 }}>
            <Texto tamanho={22} peso="bold">Pace</Texto>
            <Texto tamanho={12} cor={cores.muted}>{textoLugar}</Texto>
          </View>
          <Pressable
            style={{ width: 40, height: 40, borderRadius: 10, borderWidth: 1, borderColor: cores.border, alignItems: "center", justifyContent: "center" }}
          >
            <IconeBusca cor={cores.text} />
          </Pressable>
        </View>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Chip label="Todas" ativo />
          <Chip label="Seguras" />
          <Chip label="Rápidas" />
        </View>
      </View>

      {/* Mapa */}
      <View style={{ flex: 1, overflow: "hidden", backgroundColor: cores.bg }}>
        <MapaRotas selected={selected} posicao={posicao} permitido={permitido} />

        {/* Notas do trecho selecionado */}
        <View style={[PAINEL, { position: "absolute", top: 12, right: 12, paddingVertical: 8, paddingHorizontal: 12, gap: 6 }]}>
          {INDICADORES.map((ind) => (
            <View key={ind.chave} style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: ind.cor }} />
              <Texto tamanho={11} cor={cores.muted} style={{ width: 76 }}>{ind.label}</Texto>
              <Texto tamanho={12} peso="semibold" alinhar="right" style={{ minWidth: 20 }}>{selected[ind.chave]}</Texto>
            </View>
          ))}
        </View>

        {/* Alertas */}
        <View style={[PAINEL, { position: "absolute", top: 12, left: 12, flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 10, paddingVertical: 6 }]}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: cores.danger }} />
          <Texto tamanho={12}>2 alertas na área</Texto>
        </View>
      </View>
    </View>
  );
}
