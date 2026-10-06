import { View, ViewStyle } from "react-native";
import { cores } from "../theme";

interface Props {
  valor: number; // 0–100
  cor: string;
  altura?: number;
  fundo?: string;
  brilho?: boolean;
  style?: ViewStyle;
}

// Barrinha de progresso usada nos indicadores (segurança, trânsito...).
export default function Barra({ valor, cor, altura = 6, fundo = cores.surface2, brilho, style }: Props) {
  return (
    <View style={[{ height: altura, borderRadius: altura, backgroundColor: fundo, overflow: "hidden" }, style]}>
      <View
        style={{
          width: `${valor}%`,
          height: "100%",
          borderRadius: altura,
          backgroundColor: cor,
          boxShadow: brilho ? `0 0 8px ${cor}80` : undefined,
        }}
      />
    </View>
  );
}
