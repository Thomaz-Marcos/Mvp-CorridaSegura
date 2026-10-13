import { Pressable, ViewStyle } from "react-native";
import { cores } from "../theme";
import Texto from "./Texto";

interface Props {
  label: string;
  onPress?: () => void;
  secundario?: boolean;
  style?: ViewStyle;
}

// Botão de ação: o principal é preenchido com o destaque; o secundário só tem contorno.
export default function Botao({ label, onPress, secundario, style }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          paddingVertical: 14,
          borderRadius: 10,
          alignItems: "center",
          backgroundColor: secundario ? "transparent" : cores.accent,
          borderWidth: 1,
          borderColor: secundario ? cores.border : cores.accent,
          opacity: pressed ? 0.8 : 1,
        },
        style,
      ]}
    >
      <Texto tamanho={15} peso="semibold" cor={secundario ? cores.text : "#0b0b0b"}>
        {label}
      </Texto>
    </Pressable>
  );
}
