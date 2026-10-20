// Tema escuro do Google Maps, no tom do app (Android e web; o iOS usa o Apple Maps).
// O chão é bem mais claro que o fundo do app (#121212) para o mapa não parecer uma tela preta.
export const ESTILO_ESCURO = [
  { elementType: "geometry", stylers: [{ color: "#2b2f36" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#a3a8b0" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1a1d22" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#434953" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#59606c" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ visibility: "on" }, { color: "#27382e" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#1f3447" }] },
];
