// Monta o texto "Cidade, UF" a partir do nome da cidade e do estado.
const SIGLAS: Record<string, string> = {
  acre: "AC", alagoas: "AL", amapa: "AP", amazonas: "AM", bahia: "BA", ceara: "CE",
  "distrito federal": "DF", "espirito santo": "ES", goias: "GO", maranhao: "MA",
  "mato grosso": "MT", "mato grosso do sul": "MS", "minas gerais": "MG", para: "PA",
  paraiba: "PB", parana: "PR", pernambuco: "PE", piaui: "PI", "rio de janeiro": "RJ",
  "rio grande do norte": "RN", "rio grande do sul": "RS", rondonia: "RO", roraima: "RR",
  "santa catarina": "SC", "sao paulo": "SP", sergipe: "SE", tocantins: "TO",
};

function sigla(estado: string) {
  const chave = estado
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/^(estado d[eo] |state of )/, "")
    .trim();
  return SIGLAS[chave] ?? estado;
}

export function formatarLugar(cidade?: string | null, estado?: string | null) {
  if (cidade && estado) return `${cidade}, ${sigla(estado)}`;
  return cidade || estado || null;
}
