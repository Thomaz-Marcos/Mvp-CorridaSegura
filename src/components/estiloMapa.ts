// Tema escuro do Google Maps, no tom do app (Android e web; o iOS usa o Apple Maps).
// O chão é bem mais claro que o fundo do app (#121212) para o mapa não parecer uma tela preta;
// parques, água e vias têm cores vivas e os lugares (comércio, praças, transporte) aparecem com nome.
export const ESTILO_ESCURO = [
  { elementType: "geometry", stylers: [{ color: "#2f3542" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#c5cad3" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1a1d22" }] },
  { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#5b6577" }] },
  { featureType: "landscape.man_made", elementType: "geometry", stylers: [{ color: "#394152" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#5a6478" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#e1e5ec" }] },
  { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#6b7691" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#f0a742" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#b97a1e" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#9fd6b0" }] },
  { featureType: "poi.business", elementType: "geometry", stylers: [{ color: "#3f4a5e" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#2e7d4f" }] },
  { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#8be0a8" }] },
  { featureType: "poi.sports_complex", elementType: "geometry", stylers: [{ color: "#2a7a6a" }] },
  { featureType: "transit.line", elementType: "geometry", stylers: [{ color: "#8f7cf0" }] },
  { featureType: "transit.station", elementType: "geometry", stylers: [{ color: "#a897ff" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#1f6fb5" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#9cc8f0" }] },
];

export type TemaMapa = "claro" | "escuro";

// De dia o mapa claro é mais legível sob o sol; à noite o escuro cansa menos a vista.
export const temaDoMapa = (agora = new Date()): TemaMapa => (agora.getHours() >= 6 && agora.getHours() < 18 ? "claro" : "escuro");
