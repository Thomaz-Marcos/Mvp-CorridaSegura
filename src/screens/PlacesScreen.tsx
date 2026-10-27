import { useState } from "react";
import { ActivityIndicator, Linking, Pressable, ScrollView, View } from "react-native";
import { cores } from "../theme";
import Texto from "../components/Texto";
import Chip from "../components/Chip";
import { CATEGORIAS, urlDoCaminho } from "../data/lugares";
import useLugaresProximos from "../hooks/useLugaresProximos";
import usePosicao from "../hooks/usePosicao";
import { formatarDistancia } from "../utils/formatar";

const EMERGENCIAS = [
  { numero: "190", label: "Polícia" },
  { numero: "192", label: "SAMU" },
];

// Lugares úteis perto do corredor: hospital, delegacia, farmácia, mercado e lojas.
export default function PlacesScreen() {
  const [categoria, setCategoria] = useState(CATEGORIAS[0]);
  const { posicao, permitido } = usePosicao();
  const { lugares, erro } = useLugaresProximos(categoria, posicao);

  return (
    <View style={{ flex: 1, backgroundColor: cores.bg }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, gap: 14, borderBottomWidth: 1, borderColor: cores.border }}>
        <Texto tamanho={22} peso="bold">Perto de você</Texto>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {CATEGORIAS.map((c) => (
            <Chip key={c.id} label={c.label} ativo={c.id === categoria.id} onPress={() => setCategoria(c)} />
          ))}
        </ScrollView>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Texto tamanho={12} cor={cores.muted}>Emergência:</Texto>
          {EMERGENCIAS.map((e) => (
            <Pressable
              key={e.numero}
              onPress={() => Linking.openURL(`tel:${e.numero}`)}
              style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, borderWidth: 1, borderColor: cores.danger }}
            >
              <Texto tamanho={12} peso="semibold" cor={cores.danger}>{e.numero} {e.label}</Texto>
            </Pressable>
          ))}
        </View>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {permitido === false ? (
          <Texto tamanho={13} cor={cores.muted} style={{ padding: 20 }}>Libere a localização do aparelho para ver o que há perto de você.</Texto>
        ) : lugares === null ? (
          <ActivityIndicator color={cores.muted} style={{ marginTop: 32 }} />
        ) : (
          <>
            {erro && <Texto tamanho={12} cor={cores.muted} style={{ paddingHorizontal: 20, paddingTop: 16 }}>{erro}</Texto>}
            {lugares.length === 0 && !erro && (
              <Texto tamanho={13} cor={cores.muted} style={{ paddingHorizontal: 20, paddingTop: 16 }}>Nada encontrado em 5 km.</Texto>
            )}
            {lugares.map((l) => (
              <Pressable
                key={l.id}
                onPress={() => Linking.openURL(urlDoCaminho(l))}
                style={{ paddingHorizontal: 20, paddingVertical: 14, gap: 4, borderBottomWidth: 1, borderColor: cores.border }}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
                  <Texto tamanho={15} peso="semibold" style={{ flex: 1 }}>{l.nome}</Texto>
                  <Texto tamanho={13} peso="medium" cor={cores.safety}>{formatarDistancia(l.distancia)}</Texto>
                </View>
                <Texto tamanho={12} cor={cores.muted} numberOfLines={2}>{l.endereco}</Texto>
                <Texto tamanho={12} cor={cores.muted}>Toque para ver o caminho a pé</Texto>
              </Pressable>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}
