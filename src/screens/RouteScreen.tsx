import { useEffect, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { cores } from "../theme";
import Texto from "../components/Texto";
import Botao from "../components/Botao";
import { lerRotasFeitas, removerRotaFeita, type RotaFeita } from "../data/historicoRotas";
import { rotuloDaData } from "../utils/estatisticas";
import { formatarDistancia, formatarDuracao } from "../utils/formatar";

interface Props {
  onRefazer: (origem: string, destino: string) => void;
  onPlanejar: () => void;
}

// Histórico das rotas que o usuário começou a percorrer; tocar numa delas abre Planejar com os mesmos pontos.
export default function RouteScreen({ onRefazer, onPlanejar }: Props) {
  const [rotas, setRotas] = useState<RotaFeita[] | null>(null);

  useEffect(() => {
    let ativo = true;
    lerRotasFeitas().then((lista) => {
      if (ativo) setRotas(lista);
    });
    return () => {
      ativo = false;
    };
  }, []);

  const remover = (id: string) => {
    setRotas((atuais) => atuais?.filter((r) => r.id !== id) ?? null);
    removerRotaFeita(id);
  };

  if (rotas === null) return <View style={{ flex: 1, backgroundColor: cores.bg }} />;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: cores.bg }} contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24, gap: 12 }}>
      <Texto tamanho={22} peso="bold" style={{ paddingHorizontal: 4 }}>Histórico de rotas</Texto>

      {rotas.length === 0 ? (
        <View style={{ gap: 14, paddingHorizontal: 4, paddingTop: 8 }}>
          <Texto tamanho={14} cor={cores.muted} style={{ lineHeight: 21 }}>
            Nenhuma rota ainda. As rotas que você iniciar em Planejar aparecem aqui para refazer com um toque.
          </Texto>
          <Botao label="Planejar rota" onPress={onPlanejar} />
        </View>
      ) : (
        <View style={{ borderRadius: 12, borderWidth: 1, borderColor: cores.border, backgroundColor: cores.surface }}>
          {rotas.map((r, i) => (
            <View key={r.id} style={{ flexDirection: "row", alignItems: "center", borderTopWidth: i ? 1 : 0, borderColor: cores.border }}>
              <Pressable onPress={() => onRefazer(r.origem, r.destino)} style={{ flex: 1, gap: 2, paddingHorizontal: 14, paddingVertical: 12 }}>
                <Texto tamanho={14} peso="medium" numberOfLines={1}>{r.destino}</Texto>
                <Texto tamanho={12} cor={cores.muted} numberOfLines={1}>De {r.origem}</Texto>
                <Texto tamanho={12} cor={cores.muted}>
                  {formatarDistancia(r.metros)} · {formatarDuracao(r.segundos)} · {r.vezes === 1 ? "1 vez" : `${r.vezes} vezes`} · {rotuloDaData(r.ultimaVez)}
                </Texto>
              </Pressable>
              <Pressable onPress={() => remover(r.id)} hitSlop={8} style={{ paddingHorizontal: 14, paddingVertical: 12 }}>
                <Texto tamanho={12} cor={cores.muted}>Remover</Texto>
              </Pressable>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
