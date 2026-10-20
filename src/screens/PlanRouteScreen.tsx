import { useState } from "react";
import { Keyboard, Pressable, ScrollView, TextInput, View } from "react-native";
import usePosicao from "../hooks/usePosicao";
import useRotasReais, { MINHA_LOCALIZACAO, type RotaReal } from "../hooks/useRotasReais";
import useSugestoesDeEndereco from "../hooks/useSugestoesDeEndereco";
import { cores, fontes } from "../theme";
import Texto, { Rotulo } from "../components/Texto";
import Chip from "../components/Chip";
import Botao from "../components/Botao";
import { IconeTrocar } from "../components/Icones";

// Lugares de atalho (só os nomes; distância e rota vêm do Google ao escolher).
const FAVORITAS = ["Parque Ibirapuera, São Paulo", "Avenida Paulista, São Paulo", "Parque Villa-Lobos, São Paulo"];

function formatarDistancia(metros: number) {
  return metros < 1000 ? `${Math.round(metros)} m` : `${(metros / 1000).toFixed(1).replace(".", ",")} km`;
}

function formatarDuracao(segundos: number) {
  const min = Math.max(1, Math.round(segundos / 60));
  return min < 60 ? `${min} min` : `${Math.floor(min / 60)} h ${min % 60 ? `${min % 60} min` : ""}`.trim();
}

interface Props {
  onStartRun: (rota: RotaReal) => void;
}

// As rotas aparecem assim que origem e destino são preenchidos (resultados ainda são dados fixos).
export default function PlanRouteScreen({ onStartRun }: Props) {
  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const [escolhida, setEscolhida] = useState(0);
  const [campoAtivo, setCampoAtivo] = useState<"origem" | "destino" | null>(null);
  const { posicao } = usePosicao();
  const { sugestoes, erro } = useSugestoesDeEndereco(
    campoAtivo === "origem" ? origem : destino,
    campoAtivo !== null,
    posicao,
  );
  const searched = origem.trim() !== "" && destino.trim() !== "" && campoAtivo === null;
  const { rotas, erro: erroRotas, carregando } = useRotasReais(origem.trim(), destino.trim(), searched, posicao);
  const selecionada = rotas.find((r) => r.id === escolhida) ?? rotas[0];
  const maisRapida = rotas.length > 1 ? rotas.reduce((a, b) => (b.segundos < a.segundos ? b : a)).id : null;
  const maisCurta = rotas.length > 1 ? rotas.reduce((a, b) => (b.metros < a.metros ? b : a)).id : null;

  const escolherSugestao = (texto: string) => {
    if (campoAtivo === "origem") setOrigem(texto);
    else setDestino(texto);
    setCampoAtivo(null);
    Keyboard.dismiss();
  };

  const trocar = () => {
    setOrigem(destino);
    setDestino(origem);
  };

  // Tocar numa favorita define o destino; a origem fica por conta de quem digita.
  const escolherFavorita = (nome: string) => {
    setDestino(nome);
    if (!origem.trim()) setOrigem(MINHA_LOCALIZACAO);
  };

  return (
    <View style={{ flex: 1, backgroundColor: cores.bg }}>
      {/* Cabeçalho */}
      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, gap: 14, borderBottomWidth: 1, borderColor: cores.border }}>
        <Texto tamanho={22} peso="bold">Planejar rota</Texto>

        <View style={{ borderRadius: 10, borderWidth: 1, borderColor: cores.border, backgroundColor: cores.surface }}>
          <CampoLocal cor={cores.text} placeholder="Ponto de partida" valor={origem} onChange={setOrigem} onFoco={() => setCampoAtivo("origem")} />
          <View style={{ height: 1, marginLeft: 36, backgroundColor: cores.border }} />
          <CampoLocal cor={cores.danger} placeholder="Destino" valor={destino} onChange={setDestino} onFoco={() => setCampoAtivo("destino")} />
          <Pressable
            onPress={trocar}
            hitSlop={8}
            style={{ position: "absolute", right: 12, top: "50%", marginTop: -14, width: 28, height: 28, alignItems: "center", justifyContent: "center" }}
          >
            <IconeTrocar cor={cores.muted} />
          </Pressable>
        </View>

        <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
          <Chip label="Segura" ativo />
          <Chip label="Rápida" />
          <Chip label="Parques" />
        </View>
      </View>

      {/* Resultados */}
      <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16, gap: 12 }}>
        {campoAtivo ? (
          <>
            {campoAtivo === "origem" && (
              <Pressable onPress={() => escolherSugestao(MINHA_LOCALIZACAO)} style={CARTAO_LINHA}>
                <Texto tamanho={14} peso="medium">{MINHA_LOCALIZACAO}</Texto>
              </Pressable>
            )}
            {sugestoes.length > 0 && (
              <View style={{ borderRadius: 12, borderWidth: 1, borderColor: cores.border, backgroundColor: cores.surface }}>
                {sugestoes.map((s, i) => (
                  <Pressable
                    key={s.id}
                    onPress={() => escolherSugestao(s.texto)}
                    style={{ paddingHorizontal: 14, paddingVertical: 12, gap: 2, borderTopWidth: i ? 1 : 0, borderColor: cores.border }}
                  >
                    <Texto tamanho={14} peso="medium">{s.principal}</Texto>
                    {s.secundario !== "" && <Texto tamanho={12} cor={cores.muted}>{s.secundario}</Texto>}
                  </Pressable>
                ))}
              </View>
            )}
            {erro && <Texto tamanho={12} cor={cores.muted} style={{ paddingHorizontal: 4 }}>Não foi possível buscar endereços: {erro}</Texto>}
          </>
        ) : !searched ? (
          <>
            <Rotulo style={{ paddingHorizontal: 4 }}>Favoritas</Rotulo>
            <View style={{ borderRadius: 12, borderWidth: 1, borderColor: cores.border, backgroundColor: cores.surface }}>
              {FAVORITAS.map((r, i) => (
                <Pressable
                  key={r}
                  onPress={() => escolherFavorita(r)}
                  style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 14, paddingVertical: 12, borderTopWidth: i ? 1 : 0, borderColor: cores.border }}
                >
                  <Texto tamanho={14} peso="medium">{r}</Texto>
                </Pressable>
              ))}
            </View>
          </>
        ) : carregando ? (
          <Texto tamanho={13} cor={cores.muted} style={{ paddingHorizontal: 4 }}>Calculando rotas…</Texto>
        ) : erroRotas ? (
          <Texto tamanho={13} cor={cores.muted} style={{ paddingHorizontal: 4 }}>Não foi possível calcular a rota: {erroRotas}</Texto>
        ) : rotas.length === 0 ? (
          <Texto tamanho={13} cor={cores.muted} style={{ paddingHorizontal: 4 }}>Nenhuma rota a pé encontrada entre esses pontos.</Texto>
        ) : (
          <>
            <Rotulo style={{ paddingHorizontal: 4 }}>
              {rotas.length} {rotas.length === 1 ? "rota encontrada" : "rotas encontradas"}
            </Rotulo>

            {rotas.map((rota, i) => {
              const ativa = selecionada.id === rota.id;
              const etiquetas = [rota.id === maisRapida ? "Mais rápida" : null, rota.id === maisCurta ? "Mais curta" : null].filter(Boolean);
              return (
                <Pressable
                  key={rota.id}
                  onPress={() => setEscolhida(rota.id)}
                  style={{
                    borderRadius: 12,
                    padding: 16,
                    gap: 4,
                    backgroundColor: ativa ? cores.surface2 : cores.surface,
                    borderWidth: 1,
                    borderColor: ativa ? cores.muted : cores.border,
                  }}
                >
                  <Texto tamanho={16} peso="semibold">Rota {i + 1}{rota.descricao ? ` · via ${rota.descricao}` : ""}</Texto>
                  <Texto tamanho={12} cor={cores.muted}>{formatarDistancia(rota.metros)} · {formatarDuracao(rota.segundos)}</Texto>
                  {etiquetas.length > 0 && (
                    <Texto tamanho={12} peso="medium" cor={cores.safety} style={{ marginTop: 4 }}>{etiquetas.join(" · ")}</Texto>
                  )}
                </Pressable>
              );
            })}

            <Texto tamanho={12} cor={cores.muted} style={{ paddingHorizontal: 4 }}>
              Notas de segurança, trânsito, limpeza e conservação ainda não estão disponíveis.
            </Texto>

            <Botao label={`Iniciar rota ${rotas.indexOf(selecionada) + 1}`} onPress={() => onStartRun(selecionada)} style={{ marginTop: 4 }} />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const CARTAO_LINHA = {
  borderRadius: 12,
  borderWidth: 1,
  borderColor: cores.border,
  backgroundColor: cores.surface,
  paddingHorizontal: 14,
  paddingVertical: 12,
} as const;

type CampoProps = { cor: string; placeholder: string; valor: string; onChange: (v: string) => void; onFoco: () => void };

function CampoLocal({ cor, placeholder, valor, onChange, onFoco }: CampoProps) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 14, paddingLeft: 16, paddingRight: 48, paddingVertical: 12 }}>
      <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: cor }} />
      <TextInput
        value={valor}
        onChangeText={onChange}
        onFocus={onFoco}
        placeholder={placeholder}
        placeholderTextColor="#5f5f5f"
        style={{ flex: 1, fontSize: 15, fontFamily: fontes.regular, color: cores.text, padding: 0 }}
      />
    </View>
  );
}
