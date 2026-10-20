import { cores } from "../theme";

// Marcador do corredor no mapa: figura correndo (Material "directions_run") dentro de um círculo, com halo.
const SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="${cores.accent}" fill-opacity="0.22"/><circle cx="32" cy="32" r="21" fill="${cores.accent}" stroke="#ffffff" stroke-width="3"/><g transform="translate(18 18) scale(1.17)" fill="#0b0b0b"><path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z"/></g></svg>`;

export const ICONE_CORREDOR = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(SVG)}`;
export const TAMANHO_ICONE_CORREDOR = 64;
