import { Pressable } from "react-native";
import { cores } from "../theme";
import Texto from "./Texto";

interface Props {
  label: string;
  ativo?: boolean;
  onPress?: () => void;
}

// Filtro em formato de pílula ("Todas", "🛡️ Seguras"...). Só visual.
export default function Chip({ label, ativo, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
        backgroundColor: ativo ? cores.accent : cores.surface2,
      }}
    >
      <Texto tamanho={11} peso="semibold" cor={ativo ? "#000" : cores.muted}>
        {label}
      </Texto>
    </Pressable>
  );
}
