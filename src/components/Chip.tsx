import { Pressable } from "react-native";
import { cores } from "../theme";
import Texto from "./Texto";

interface Props {
  label: string;
  ativo?: boolean;
  onPress?: () => void;
}

// Filtro ("Todas", "Seguras"...): ativo fica preenchido, os outros só com contorno.
export default function Chip({ label, ativo, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: ativo ? cores.surface3 : cores.border,
        backgroundColor: ativo ? cores.surface3 : "transparent",
      }}
    >
      <Texto tamanho={12} peso="medium" cor={ativo ? cores.text : cores.muted}>
        {label}
      </Texto>
    </Pressable>
  );
}
