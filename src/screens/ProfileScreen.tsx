import { useEffect, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { cores } from "../theme";
import Texto from "../components/Texto";
import { IconeEngrenagem } from "../components/Icones";
import { lerCorridas, type Corrida } from "../data/corridas";
import { foiNoturna, melhorSequencia, rotuloDaData, sequenciaDeDias, ultimosSeteDias } from "../utils/estatisticas";
import { formatarKm, formatarPace, formatarTempo } from "../utils/formatar";

type Aba = "stats" | "history" | "badges";

const CARTAO = { borderRadius: 12, borderWidth: 1, borderColor: cores.border, backgroundColor: cores.surface };

export default function ProfileScreen() {
  const [tab, setTab] = useState<Aba>("stats");
  const [corridas, setCorridas] = useState<Corrida[]>([]);

  // Lê as corridas salvas no aparelho cada vez que a aba é aberta.
  useEffect(() => {
    let ativo = true;
    lerCorridas().then((lista) => {
      if (ativo) setCorridas(lista);
    });
    return () => {
      ativo = false;
    };
  }, []);

  const totalMetros = corridas.reduce((soma, c) => soma + c.metros, 0);
  const totalSegundos = corridas.reduce((soma, c) => soma + c.segundos, 0);
  const sequencia = sequenciaDeDias(corridas);
  const semana = ultimosSeteDias(corridas);
  const kmDaSemana = semana.reduce((soma, d) => soma + d.km, 0);
  const maxKm = Math.max(...semana.map((d) => d.km), 1);
  const historico = [...corridas].sort((a, b) => b.iniciadaEm - a.iniciadaEm);

  const noturnas = corridas.filter(foiNoturna).length;
  const melhor = melhorSequencia(corridas);
  const conquistas = [
    { label: "Primeira corrida", desc: "Complete 1 corrida", atual: corridas.length, meta: 1 },
    { label: "10 km", desc: "10 km somados", atual: totalMetros / 1000, meta: 10 },
    { label: "Maratonista", desc: "100 km completados", atual: totalMetros / 1000, meta: 100 },
    { label: "Sequência 7", desc: "7 dias seguidos", atual: melhor, meta: 7 },
    { label: "Sequência 30", desc: "30 dias seguidos", atual: melhor, meta: 30 },
    { label: "Coruja", desc: "5 corridas noturnas", atual: noturnas, meta: 5 },
  ].map((c) => ({ ...c, unlocked: c.atual >= c.meta }));

  return (
    <ScrollView style={{ flex: 1, backgroundColor: cores.bg }}>
      {/* Cabeçalho */}
      <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16, gap: 18 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
          <View style={{ width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center", backgroundColor: cores.surface3 }}>
            <Texto tamanho={18} peso="semibold">MC</Texto>
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <Texto tamanho={18} peso="bold">Marina Costa</Texto>
            <Texto tamanho={13} cor={cores.muted}>@marinacorre · São Paulo, SP</Texto>
            <Texto tamanho={12} cor={cores.muted}>
              {sequencia > 0 ? `${sequencia} ${sequencia === 1 ? "dia seguido" : "dias seguidos"}` : "Nenhuma sequência ainda"}
            </Texto>
          </View>
          <Pressable style={{ width: 40, height: 40, borderRadius: 10, borderWidth: 1, borderColor: cores.border, alignItems: "center", justifyContent: "center" }}>
            <IconeEngrenagem cor={cores.muted} />
          </Pressable>
        </View>

        <View style={[CARTAO, { flexDirection: "row" }]}>
          {[
            { val: formatarKm(totalMetros), label: "km" },
            { val: String(corridas.length), label: "corridas" },
            { val: formatarPace(totalSegundos, totalMetros / 1000), label: "pace médio" },
            { val: formatarTempo(totalSegundos), label: "tempo total" },
          ].map((s, i) => (
            <View key={s.label} style={{ flex: 1, paddingVertical: 12, paddingHorizontal: 12, gap: 2, borderLeftWidth: i ? 1 : 0, borderColor: cores.border }}>
              <Texto tamanho={17} peso="bold" numberOfLines={1} adjustsFontSizeToFit>{s.val}</Texto>
              <Texto tamanho={11} cor={cores.muted}>{s.label}</Texto>
            </View>
          ))}
        </View>
      </View>

      {/* Abas */}
      <View style={{ flexDirection: "row", paddingHorizontal: 20, gap: 24, borderBottomWidth: 1, borderColor: cores.border }}>
        {([
          { id: "stats", label: "Estatísticas" },
          { id: "history", label: "Histórico" },
          { id: "badges", label: "Conquistas" },
        ] as { id: Aba; label: string }[]).map((t) => {
          const ativa = tab === t.id;
          return (
            <Pressable
              key={t.id}
              onPress={() => setTab(t.id)}
              style={{ paddingVertical: 12, borderBottomWidth: 2, borderColor: ativa ? cores.text : "transparent", marginBottom: -1 }}
            >
              <Texto tamanho={14} peso="medium" cor={ativa ? cores.text : cores.muted}>{t.label}</Texto>
            </Pressable>
          );
        })}
      </View>

      <View style={{ paddingHorizontal: 16, paddingVertical: 16, gap: 12 }}>
        {tab === "stats" && (
          <View style={[CARTAO, { padding: 16 }]}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
              <Texto tamanho={14} peso="semibold">Últimos 7 dias</Texto>
              <Texto tamanho={14} cor={cores.muted}>{formatarKm(kmDaSemana * 1000)} km</Texto>
            </View>
            <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 10, height: 84 }}>
              {semana.map((d, i) => (
                <View key={i} style={{ flex: 1, alignItems: "center", gap: 6 }}>
                  <View
                    style={{
                      width: "100%",
                      height: Math.max((d.km / maxKm) * 64, 3),
                      borderRadius: 3,
                      backgroundColor: d.km === 0 ? cores.surface3 : i === 6 ? cores.accent : "#4a4a4a",
                    }}
                  />
                  <Texto tamanho={11} cor={i === 6 ? cores.text : cores.muted}>{d.dia}</Texto>
                </View>
              ))}
            </View>
          </View>
        )}

        {tab === "history" &&
          (historico.length === 0 ? (
            <Texto tamanho={13} cor={cores.muted} style={{ paddingHorizontal: 4 }}>
              Nenhuma corrida salva ainda. Inicie uma corrida e toque em Encerrar para ela aparecer aqui.
            </Texto>
          ) : (
            <View style={CARTAO}>
              {historico.map((run, i) => (
                <View
                  key={run.id}
                  style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 14, paddingVertical: 12, borderTopWidth: i ? 1 : 0, borderColor: cores.border }}
                >
                  <View style={{ flex: 1, gap: 2 }}>
                    <Texto tamanho={14} peso="medium" numberOfLines={1}>{rotuloDaData(run.iniciadaEm)}</Texto>
                    <Texto tamanho={12} cor={cores.muted}>{formatarKm(run.metros)} km · {formatarTempo(run.segundos)}</Texto>
                  </View>
                  <Texto tamanho={14} peso="semibold">{formatarPace(run.segundos, run.metros / 1000)}</Texto>
                  <Texto tamanho={11} cor={cores.muted}>/km</Texto>
                </View>
              ))}
            </View>
          ))}

        {tab === "badges" && (
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            {conquistas.map((badge) => (
              <View key={badge.label} style={[CARTAO, { width: "47%", flexGrow: 1, padding: 14, gap: 4, opacity: badge.unlocked ? 1 : 0.45 }]}>
                <Texto tamanho={14} peso="semibold">{badge.label}</Texto>
                <Texto tamanho={12} cor={cores.muted}>{badge.desc}</Texto>
                <Texto tamanho={11} cor={badge.unlocked ? cores.accent : cores.muted} style={{ marginTop: 6 }}>
                  {badge.unlocked ? "Conquistada" : `${Math.floor(badge.atual)} de ${badge.meta}`}
                </Texto>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
