import { Text, TextProps, TextStyle } from "react-native";
import { cores, fontes } from "../theme";

type Peso = "light" | "regular" | "medium" | "semibold" | "bold" | "extrabold" | "black";

interface Props extends TextProps {
  tamanho?: number;
  cor?: string;
  peso?: Peso;
  mono?: boolean;
  alinhar?: TextStyle["textAlign"];
}

function familia(peso: Peso, mono: boolean) {
  if (!mono) return fontes[peso];
  if (peso === "semibold") return fontes.monoSemibold;
  if (peso === "bold" || peso === "extrabold" || peso === "black") return fontes.monoBold;
  return fontes.mono;
}

export default function Texto({
  tamanho = 14,
  cor = cores.text,
  peso = "regular",
  mono = false,
  alinhar,
  style,
  ...resto
}: Props) {
  return (
    <Text
      {...resto}
      style={[
        { fontSize: tamanho, color: cor, fontFamily: familia(peso, mono), textAlign: alinhar },
        style,
      ]}
    />
  );
}

// Rótulo de seção em caixa alta e fonte mono ("ROTAS PRÓXIMAS", "TRECHO ATUAL"...).
export function Rotulo({ children, style }: { children: React.ReactNode; style?: TextStyle }) {
  return (
    <Texto
      tamanho={10}
      cor={cores.muted}
      mono
      style={[{ textTransform: "uppercase", letterSpacing: 2 }, style]}
    >
      {children}
    </Texto>
  );
}
