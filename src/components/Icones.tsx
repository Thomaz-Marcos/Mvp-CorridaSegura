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
  places: ["M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z", "M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"],
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

// Ícones de linha usados no lugar de emoji (traço 2, viewBox 24).
function Linha({ cor, tamanho = 18, children }: { cor: string; tamanho?: number; children: React.ReactNode }) {
  return (
    <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" stroke={cor} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      {children}
    </Svg>
  );
}

export function IconeMais({ cor, tamanho }: { cor: string; tamanho?: number }) {
  return <Linha cor={cor} tamanho={tamanho}><Path d="M12 5v14M5 12h14" /></Linha>;
}

export function IconeTrocar({ cor, tamanho = 16 }: { cor: string; tamanho?: number }) {
  return <Linha cor={cor} tamanho={tamanho}><Path d="M7 4v16M3 8l4-4 4 4M17 20V4M13 16l4 4 4-4" /></Linha>;
}

export function IconeVoltar({ cor, tamanho = 18 }: { cor: string; tamanho?: number }) {
  return <Linha cor={cor} tamanho={tamanho}><Path d="M15 18l-6-6 6-6" /></Linha>;
}

export function IconeAlerta({ cor, tamanho }: { cor: string; tamanho?: number }) {
  return (
    <Linha cor={cor} tamanho={tamanho}>
      <Path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
      <Path d="M12 9v4M12 17h.01" />
    </Linha>
  );
}

export function IconeCoracao({ cor, tamanho = 16, cheio }: { cor: string; tamanho?: number; cheio?: boolean }) {
  return (
    <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill={cheio ? cor : "none"} stroke={cor} strokeWidth={2} strokeLinejoin="round">
      <Path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
    </Svg>
  );
}

export function IconeComentario({ cor, tamanho = 16 }: { cor: string; tamanho?: number }) {
  return <Linha cor={cor} tamanho={tamanho}><Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></Linha>;
}

export function IconeCompartilhar({ cor, tamanho = 16 }: { cor: string; tamanho?: number }) {
  return <Linha cor={cor} tamanho={tamanho}><Path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7M16 6l-4-4-4 4M12 2v13" /></Linha>;
}

export function IconePausa({ cor, tamanho = 22 }: { cor: string; tamanho?: number }) {
  return <Linha cor={cor} tamanho={tamanho}><Path d="M9 5v14M15 5v14" /></Linha>;
}

export function IconeParar({ cor, tamanho = 22 }: { cor: string; tamanho?: number }) {
  return (
    <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24">
      <Path d="M7 7h10v10H7z" fill={cor} />
    </Svg>
  );
}

// Seta de manobra: um "em frente" girado conforme a curva (direita 90°, esquerda -90°).
const ANGULO_MANOBRA: Record<string, number> = {
  TURN_SLIGHT_RIGHT: 45, TURN_RIGHT: 90, TURN_SHARP_RIGHT: 135, RAMP_RIGHT: 45, FORK_RIGHT: 45, ROUNDABOUT_RIGHT: 90,
  TURN_SLIGHT_LEFT: -45, TURN_LEFT: -90, TURN_SHARP_LEFT: -135, RAMP_LEFT: -45, FORK_LEFT: -45, ROUNDABOUT_LEFT: -90,
  UTURN_LEFT: 180, UTURN_RIGHT: 180,
};

export function IconeManobra({ manobra, cor, tamanho = 40 }: { manobra: string; cor: string; tamanho?: number }) {
  return (
    <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" stroke={cor} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" style={{ transform: [{ rotate: `${ANGULO_MANOBRA[manobra] ?? 0}deg` }] }}>
      <Path d="M12 20V5M5.5 11.5 12 5l6.5 6.5" />
    </Svg>
  );
}
