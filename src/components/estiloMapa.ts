// Tema escuro do Google Maps, no tom do app (Android e web; o iOS usa o Apple Maps).
// O chão é um pouco mais claro que o fundo do app (#121212) para o mapa não sumir.
export const ESTILO_ESCURO = [
  { elementType: "geometry", stylers: [{ color: "#1c1c1c" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8a8a8a" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#121212" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#2e2e2e" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#3a3a3a" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ visibility: "on" }, { color: "#1b2a21" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#16202b" }] },
];
