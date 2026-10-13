// Rotas de exemplo em São Paulo (dados fixos até termos backend).
export type Coordenada = { latitude: number; longitude: number };

export type Rota = {
  id: number;
  name: string;
  distance: string;
  time: string;
  safety: number;
  traffic: number;
  clean: number;
  conserv: number;
  overall: number;
  color: string;
  label: string;
  coords: Coordenada[];
  alerta?: { cor: string; coord: Coordenada };
};

const c = (latitude: number, longitude: number): Coordenada => ({ latitude, longitude });

export const ROTAS: Rota[] = [
  {
    id: 1, name: "Parque Ibirapuera", distance: "5.2 km", time: "28 min",
    safety: 88, traffic: 72, clean: 91, conserv: 79, overall: 84,
    color: "#4cc38a", label: "Ótima",
    coords: [
      c(-23.5810, -46.6620), c(-23.5840, -46.6590), c(-23.5870, -46.6560), c(-23.5905, -46.6545),
      c(-23.5925, -46.6575), c(-23.5900, -46.6625), c(-23.5860, -46.6650), c(-23.5825, -46.6650),
      c(-23.5810, -46.6620),
    ],
  },
  {
    id: 2, name: "Av. Paulista", distance: "3.8 km", time: "21 min",
    safety: 63, traffic: 45, clean: 68, conserv: 55, overall: 58,
    color: "#d9a441", label: "Regular",
    coords: [c(-23.5567, -46.6620), c(-23.5614, -46.6559), c(-23.5651, -46.6516), c(-23.5686, -46.6474), c(-23.5713, -46.6440)],
    alerta: { cor: "#d9b441", coord: c(-23.5633, -46.6538) },
  },
  {
    id: 3, name: "Marginal Pinheiros", distance: "8.1 km", time: "45 min",
    safety: 41, traffic: 30, clean: 52, conserv: 47, overall: 43,
    color: "#e5534b", label: "Evitar",
    coords: [c(-23.5660, -46.7010), c(-23.5755, -46.6990), c(-23.5850, -46.6955), c(-23.5950, -46.6920), c(-23.6040, -46.6930)],
    alerta: { cor: "#e5534b", coord: c(-23.5800, -46.6975) },
  },
];
