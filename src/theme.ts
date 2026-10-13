// Escuro sóbrio: cinzas neutros, um só destaque (verde) e cores de dados pouco saturadas.
export const cores = {
  bg: "#121212",
  surface: "#1a1a1a",
  surface2: "#222222",
  surface3: "#2b2b2b",
  border: "#2e2e2e",
  text: "#ececec",
  muted: "#9a9a9a",
  accent: "#4cc38a",
  accentDim: "#4cc38a22",
  accent2: "#d4d4d4",
  accent2Dim: "#d4d4d422",
  safety: "#4cc38a",
  traffic: "#d9a441",
  clean: "#6aa9d8",
  conserv: "#d98a5b",
  danger: "#e5534b",
  warn: "#d9b441",
};

// Cada peso é uma família própria (no Android não dá para usar fontWeight com fonte carregada).
export const fontes = {
  light: "Outfit_300Light",
  regular: "Outfit_400Regular",
  medium: "Outfit_500Medium",
  semibold: "Outfit_600SemiBold",
  bold: "Outfit_700Bold",
  extrabold: "Outfit_800ExtraBold",
  black: "Outfit_900Black",
  mono: "JetBrainsMono_400Regular",
  monoSemibold: "JetBrainsMono_600SemiBold",
  monoBold: "JetBrainsMono_700Bold",
};

// Os quatro indicadores que aparecem em quase todas as telas.
export const INDICADORES = [
  { chave: "safety", label: "Segurança", cor: cores.safety, desc: "Criminalidade e fluxo de pedestres" },
  { chave: "traffic", label: "Trânsito", cor: cores.traffic, desc: "Volume de veículos na via" },
  { chave: "clean", label: "Limpeza", cor: cores.clean, desc: "Acúmulo de lixo e resíduos" },
  { chave: "conserv", label: "Conservação", cor: cores.conserv, desc: "Estado da calçada e pavimento" },
] as const;
