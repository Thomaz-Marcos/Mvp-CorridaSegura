import { useEffect, useMemo, useState } from "react";
import { Keyboard, Pressable, ScrollView, TextInput, View } from "react-native";
import usePosicao from "../hooks/usePosicao";
import useRotasReais, { MINHA_LOCALIZACAO, type RotaReal } from "../hooks/useRotasReais";
import useSugestoesDeEndereco from "../hooks/useSugestoesDeEndereco";
import useFavoritas from "../hooks/useFavoritas";
import useAlertasLocalizados from "../hooks/useAlertasLocalizados";
import { registrarRotaFeita } from "../data/historicoRotas";
import { cores, fontes } from "../theme";
import { formatarDistancia, formatarDuracao } from "../utils/formatar";
import { corDaNota, notaDaRota, resumoDosAlertas, rotuloDaNota } from "../utils/seguranca";
import Texto, { Rotulo } from "../components/Texto";
import Chip from "../components/Chip";
import Barra from "../components/Barra";
import Botao from "../components/Botao";
import { IconeTrocar } from "../components/Icones";

interface Props {
  onStartRun: (rota: RotaReal) => void;
  onVerNoMapa: (rota: RotaReal) => void;
  // Origem e destino vindos do histórico de rotas; preenchem os campos ao abrir a tela.
  inicial: { origem: string; destino: string } | null;
  onUsouInicial: () => void;
}

// As rotas aparecem assim que origem e destino são preenchidos.
export default function PlanRouteScreen({ onStartRun, onVerNoMapa, inicial, onUsouInicial }: Props) {
  const [origem, setOrigem] = useState(inicial?.origem ?? "");
  const [destino, setDestino] = useState(inicial?.destino ?? "");
  const [escolhida, setEscolhida] = useState(0);
  const [campoAtivo, setCampoAtivo] = useState<"origem" | "destino" | null>(null);
  const { posicao } = usePosicao();
  const { favoritas, ehFavorita, alternar } = useFavoritas();

  useEffect(() => {
    if (inicial) onUsouInicial();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const { sugestoes, erro } = useSugestoesDeEndereco(
    campoAtivo === "origem" ? origem : destino,
    campoAtivo !== null,
    posicao,
  );
  const searched = origem.trim() !== "" && destino.trim() !== "" && campoAtivo === null;
  const { rotas: rotasGoogle, erro: erroRotas, carregando } = useRotasReais(origem.trim(), destino.trim(), searched, posicao);
  const alertas = useAlertasLocalizados(carregando);
  const notas = useMemo(() => new Map(rotasGoogle.map((r) => [r.id, notaDaRota(r.coords, alertas)])), [rotasGoogle, alertas]);
  const [ordem, setOrdem] = useState<"sugerida" | "segura" | "rapida" | "curta">("sugerida");
  const nota = (r: RotaReal) => notas.get(r.id)?.nota ?? 100;
  const rotas =
    ordem === "segura" ? [...rotasGoogle].sort((a, b) => nota(b) - nota(a) || a.segundos - b.segundos)
    : ordem === "rapida" ? [...rotasGoogle].sort((a, b) => a.segundos - b.segundos)
    : ordem === "curta" ? [...rotasGoogle].sort((a, b) => a.metros - b.metros)
    : rotasGoogle;
  const selecionada = rotas.find((r) => r.id === escolhida) ?? rotas[0];
  const maisRapida = rotas.length > 1 ? rotas.reduce((a, b) => (b.segundos < a.segundos ? b : a)).id : null;
  const maisCurta = rotas.length > 1 ? rotas.reduce((a, b) => (b.metros < a.metros ? b : a)).id : null;
  // Só destaca "Mais segura" quando alguma rota realmente se diferencia das outras.
  const maisSegura = rotas.length > 1 && new Set(rotas.map(nota)).size > 1 ? rotas.reduce((a, b) => (nota(b) > nota(a) ? b : a)).id : null;

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

  const escolherFavorita = (f: { origem: string; destino: string }) => {
    setOrigem(f.origem);
    setDestino(f.destino);
  };

  // Guarda a rota no histórico (aba Rota) e começa a corrida.
  const iniciar = () => {
    registrarRotaFeita({ origem: origem.trim(), destino: destino.trim(), metros: selecionada.metros, segundos: selecionada.segundos });
    onStartRun(selecionada);
  };

  const favoritada = ehFavorita(origem.trim(), destino.trim());

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
          {([["sugerida", "Sugerida"], ["segura", "Mais segura"], ["rapida", "Mais rápida"], ["curta", "Mais curta"]] as const).map(([id, label]) => (
            <Chip key={id} label={label} ativo={ordem === id} onPress={() => { setOrdem(id); setEscolhida(-1); }} />
          ))}
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
            {favoritas.length === 0 ? (
              <Texto tamanho={13} cor={cores.muted} style={{ paddingHorizontal: 4 }}>
                Nenhuma rota favorita ainda. Calcule uma rota e toque em Favoritar para ela aparecer aqui.
              </Texto>
            ) : (
              <View style={{ borderRadius: 12, borderWidth: 1, borderColor: cores.border, backgroundColor: cores.surface }}>
                {favoritas.map((f, i) => (
                  <View key={f.id} style={{ flexDirection: "row", alignItems: "center", borderTopWidth: i ? 1 : 0, borderColor: cores.border }}>
                    <Pressable onPress={() => escolherFavorita(f)} style={{ flex: 1, gap: 2, paddingHorizontal: 14, paddingVertical: 12 }}>
                      <Texto tamanho={14} peso="medium" numberOfLines={1}>{f.destino}</Texto>
                      <Texto tamanho={12} cor={cores.muted} numberOfLines={1}>
                        De {f.origem}{f.metros != null && f.segundos != null ? ` · ${formatarDistancia(f.metros)} · ${formatarDuracao(f.segundos)}` : ""}
                      </Texto>
                    </Pressable>
                    <Pressable onPress={() => alternar(f.origem, f.destino)} hitSlop={8} style={{ paddingHorizontal: 14, paddingVertical: 12 }}>
                      <Texto tamanho={12} cor={cores.muted}>Remover</Texto>
                    </Pressable>
                  </View>
                ))}
              </View>
            )}
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
              const detalhe = notas.get(rota.id);
              const etiquetas = [rota.id === maisSegura ? "Mais segura" : null, rota.id === maisRapida ? "Mais rápida" : null, rota.id === maisCurta ? "Mais curta" : null].filter(Boolean);
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
                  {detalhe && (
                    <View style={{ gap: 6, marginTop: 8 }}>
                      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Texto tamanho={12} peso="medium" cor={corDaNota(detalhe.nota)}>Segurança {detalhe.nota} · {rotuloDaNota(detalhe.nota)}</Texto>
                        <Texto tamanho={12} cor={cores.muted}>{resumoDosAlertas(detalhe)}</Texto>
                      </View>
                      <Barra valor={detalhe.nota} cor={corDaNota(detalhe.nota)} />
                    </View>
                  )}
                  {etiquetas.length > 0 && (
                    <Texto tamanho={12} peso="medium" cor={cores.safety} style={{ marginTop: 4 }}>{etiquetas.join(" · ")}</Texto>
                  )}
                </Pressable>
              );
            })}

            <Texto tamanho={12} cor={cores.muted} style={{ paddingHorizontal: 4 }}>
              A nota de segurança considera os alertas da comunidade a até 60 m do trajeto nos últimos 30 dias; alertas mais recentes e confirmados por curtidas pesam mais. Trânsito, limpeza e conservação ainda não estão disponíveis.
            </Texto>

            <Botao label={`Iniciar rota ${rotas.indexOf(selecionada) + 1}`} onPress={iniciar} style={{ marginTop: 4 }} />
            <Botao label="Ver no mapa" secundario onPress={() => onVerNoMapa(selecionada)} />
            <Botao
              label={favoritada ? "Remover dos favoritos" : "Favoritar"}
              secundario
              onPress={() => alternar(origem.trim(), destino.trim(), { metros: selecionada.metros, segundos: selecionada.segundos })}
            />
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
