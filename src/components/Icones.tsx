import Svg, { Circle, Path } from "react-native-svg";

// Ícones da barra de abas (mesmos paths do App.tsx do Figma).
const PATHS: Record<string, string[]> = {
  map: ["M9 3L15 6L21 3V19L15 22L9 19L3 22V6L9 3Z", "M15 6V22", "M9 3V19"],
  plan: ["M3 3h18v4H3z", "M3 10h18", "M3 17h18", "M8 7V3", "M16 7V3"],
  route: [
    "M3 12H21",
    "M17 8L21 12L17 16",
    "M3 8C3 5.79 4.79 4 7 4C9.21 4 11 5.79 11 8V16C11 18.21 12.79 20 15 20C17.21 20 19 18.21 19 16",
  ],
  feed: ["M21 15C21 16.1 20.1 17 19 17H7L3 21V5C3 3.9 3.9 3 5 3H19C20.1 3 21 3.9 21 5V15Z"],
  profile: [
    "M20 21V19C20 16.79 18.21 15 16 15H8C5.79 15 4 16.79 4 19V21",
    "M12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11Z",
  ],
};

export function IconeAba({ id, cor }: { id: string; cor: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={cor} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      {PATHS[id]?.map((d) => <Path key={d} d={d} />)}
    </Svg>
  );
}

export function IconeBusca({ cor }: { cor: string }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={cor} strokeWidth={2} strokeLinecap="round">
      <Circle cx={11} cy={11} r={8} />
      <Path d="m21 21-4.35-4.35" />
    </Svg>
  );
}

export function IconeSeta({ cor, aberta }: { cor: string; aberta?: boolean }) {
  return (
    <Svg
      width={14}
      height={14}
      viewBox="0 0 24 24"
      fill="none"
      stroke={cor}
      strokeWidth={2}
      style={{ transform: [{ rotate: aberta ? "180deg" : "0deg" }] }}
    >
      <Path d="M6 9l6 6 6-6" />
    </Svg>
  );
}

export function IconeEngrenagem({ cor }: { cor: string }) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={cor} strokeWidth={2}>
      <Circle cx={12} cy={12} r={3} />
      <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </Svg>
  );
}
