// Tokens copiados do src/index.css do Figma Make (Rota Segura / RunSafe).
export const cores = {
  bg: "#0d0d12",
  surface: "#16161f",
  surface2: "#1e1e2a",
  surface3: "#252535",
  border: "#2a2a3a",
  text: "#f0f0f5",
  muted: "#7878a0",
  accent: "#00e87a",
  accentDim: "#00e87a22",
  accent2: "#7c6fff",
  accent2Dim: "#7c6fff22",
  safety: "#00e87a",
  traffic: "#f59e0b",
  clean: "#38bdf8",
  conserv: "#fb923c",
  danger: "#f43f5e",
  warn: "#facc15",
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
  { chave: "safety", label: "Segurança", icone: "🛡️", cor: cores.safety, desc: "Criminalidade e fluxo de pedestres" },
  { chave: "traffic", label: "Trânsito", icone: "🚦", cor: cores.traffic, desc: "Volume de veículos na via" },
  { chave: "clean", label: "Limpeza", icone: "🧹", cor: cores.clean, desc: "Acúmulo de lixo e resíduos" },
  { chave: "conserv", label: "Conservação", icone: "🛤️", cor: cores.conserv, desc: "Estado da calçada e pavimento" },
] as const;
