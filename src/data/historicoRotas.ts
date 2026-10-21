import AsyncStorage from "@react-native-async-storage/async-storage";

// Rotas que o usuário começou a percorrer, gravadas no próprio aparelho (ainda não há backend para sincronizar).
// Guarda origem e destino (o trajeto é recalculado pelo Google ao refazer) e a distância e o tempo da última vez.
export type RotaFeita = { id: string; origem: string; destino: string; metros: number; segundos: number; ultimaVez: number; vezes: number };

const CHAVE = "pace:rotas-feitas";
const LIMITE = 50;

export async function lerRotasFeitas(): Promise<RotaFeita[]> {
  try {
    const texto = await AsyncStorage.getItem(CHAVE);
    return texto ? (JSON.parse(texto) as RotaFeita[]) : [];
  } catch (e) {
    console.warn("Não foi possível ler o histórico de rotas:", e instanceof Error ? e.message : e);
    return [];
  }
}

async function gravar(lista: RotaFeita[]) {
  try {
    await AsyncStorage.setItem(CHAVE, JSON.stringify(lista));
  } catch (e) {
    console.warn("Não foi possível salvar o histórico de rotas:", e instanceof Error ? e.message : e);
  }
}

// Repetir o mesmo origem/destino não cria outra linha: sobe para o topo e soma uma vez.
export async function registrarRotaFeita(dados: { origem: string; destino: string; metros: number; segundos: number }) {
  const id = `${dados.origem}|${dados.destino}`;
  const todas = await lerRotasFeitas();
  const anterior = todas.find((r) => r.id === id);
  const nova: RotaFeita = { id, ...dados, ultimaVez: Date.now(), vezes: (anterior?.vezes ?? 0) + 1 };
  await gravar([nova, ...todas.filter((r) => r.id !== id)].slice(0, LIMITE));
}

export async function removerRotaFeita(id: string) {
  await gravar((await lerRotasFeitas()).filter((r) => r.id !== id));
}
