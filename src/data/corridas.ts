import AsyncStorage from "@react-native-async-storage/async-storage";

// Corridas gravadas no próprio aparelho (ainda não há backend para sincronizar).
export type Corrida = {
  id: string;
  iniciadaEm: number; // ms desde 1970
  metros: number;
  segundos: number;
};

const CHAVE = "pace:corridas";
// Corridas menores que isso são toques acidentais em "Encerrar", não treinos.
export const DISTANCIA_MINIMA_M = 20;

export async function lerCorridas(): Promise<Corrida[]> {
  try {
    const texto = await AsyncStorage.getItem(CHAVE);
    return texto ? (JSON.parse(texto) as Corrida[]) : [];
  } catch (e) {
    console.warn("Não foi possível ler as corridas salvas:", e instanceof Error ? e.message : e);
    return [];
  }
}

// Devolve false quando a corrida é curta demais ou não foi possível salvar.
export async function salvarCorrida(dados: Omit<Corrida, "id">): Promise<boolean> {
  if (dados.metros < DISTANCIA_MINIMA_M) return false;
  try {
    const todas = await lerCorridas();
    todas.push({ ...dados, id: `${dados.iniciadaEm}` });
    await AsyncStorage.setItem(CHAVE, JSON.stringify(todas));
    return true;
  } catch (e) {
    console.warn("Não foi possível salvar a corrida:", e instanceof Error ? e.message : e);
    return false;
  }
}
