import AsyncStorage from "@react-native-async-storage/async-storage";

// Rotas favoritas gravadas no próprio aparelho (ainda não há backend para sincronizar).
// Guarda origem e destino (o trajeto é recalculado pelo Google ao usar) e a distância e o tempo da hora em que foi favoritada.
export type Favorita = { id: string; origem: string; destino: string; metros?: number; segundos?: number };

const CHAVE = "pace:favoritas";

export const idDaFavorita = (origem: string, destino: string) => `${origem}|${destino}`;

export async function lerFavoritas(): Promise<Favorita[]> {
  try {
    const texto = await AsyncStorage.getItem(CHAVE);
    return texto ? (JSON.parse(texto) as Favorita[]) : [];
  } catch (e) {
    console.warn("Não foi possível ler as favoritas:", e instanceof Error ? e.message : e);
    return [];
  }
}

export async function gravarFavoritas(lista: Favorita[]): Promise<boolean> {
  try {
    await AsyncStorage.setItem(CHAVE, JSON.stringify(lista));
    return true;
  } catch (e) {
    console.warn("Não foi possível salvar as favoritas:", e instanceof Error ? e.message : e);
    return false;
  }
}
