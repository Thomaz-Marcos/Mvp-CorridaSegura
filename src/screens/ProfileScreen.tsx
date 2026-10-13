import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { cores, INDICADORES } from "../theme";
import Texto from "../components/Texto";
import Barra from "../components/Barra";
import { IconeEngrenagem } from "../components/Icones";

const BADGES = [
  { label: "Guardião", desc: "10 alertas postados", unlocked: true },
  { label: "Maratonista", desc: "100 km completados", unlocked: true },
  { label: "Top 10", desc: "Entre os 10 da cidade", unlocked: true },
  { label: "Explorador", desc: "20 rotas diferentes", unlocked: true },
  { label: "Sequência 30", desc: "30 dias seguidos", unlocked: false },
  { label: "Coruja", desc: "5 corridas noturnas", unlocked: false },
];

const HISTORY = [
  { date: "Hoje, 07:15", route: "Parque Ibirapuera", dist: "5.2 km", time: "28:14", score: 84 },
  { date: "Ontem, 18:30", route: "Av. Brigadeiro Faria Lima", dist: "3.1 km", time: "18:45", score: 61 },
  { date: "Seg, 06:45", route: "Parque Ibirapuera", dist: "7.8 km", time: "42:30", score: 84 },
  { date: "Dom, 08:00", route: "Parque Villa-Lobos", dist: "6.5 km", time: "35:20", score: 78 },
];

const WEEK = [
  { day: "S", km: 0 },
  { day: "T", km: 5.2 },
  { day: "Q", km: 0 },
  { day: "Q", km: 3.1 },
  { day: "S", km: 7.8 },
  { day: "S", km: 6.5 },
  { day: "D", km: 5.2 },
];

const MEDIAS = [78, 64, 82, 71];

const maxKm = Math.max(...WEEK.map((d) => d.km), 1);

type Aba = "stats" | "history" | "badges";

const CARTAO = { borderRadius: 12, borderWidth: 1, borderColor: cores.border, backgroundColor: cores.surface };

export default function ProfileScreen() {
  const [tab, setTab] = useState<Aba>("stats");

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
            <Texto tamanho={12} cor={cores.muted}>Top 10 da cidade · 12 dias seguidos</Texto>
          </View>
          <Pressable style={{ width: 40, height: 40, borderRadius: 10, borderWidth: 1, borderColor: cores.border, alignItems: "center", justifyContent: "center" }}>
            <IconeEngrenagem cor={cores.muted} />
          </Pressable>
        </View>

        <View style={[CARTAO, { flexDirection: "row" }]}>
          {[
            { val: "247", label: "km" },
            { val: "38", label: "corridas" },
            { val: "14", label: "alertas" },
            { val: "4.8", label: "avaliação" },
          ].map((s, i) => (
            <View key={s.label} style={{ flex: 1, paddingVertical: 12, paddingHorizontal: 12, gap: 2, borderLeftWidth: i ? 1 : 0, borderColor: cores.border }}>
              <Texto tamanho={17} peso="bold">{s.val}</Texto>
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
          <>
            <View style={[CARTAO, { padding: 16 }]}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
                <Texto tamanho={14} peso="semibold">Esta semana</Texto>
                <Texto tamanho={14} cor={cores.muted}>27.8 km</Texto>
              </View>
              <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 10, height: 84 }}>
                {WEEK.map((d, i) => (
                  <View key={i} style={{ flex: 1, alignItems: "center", gap: 6 }}>
                    <View
                      style={{
                        width: "100%",
                        height: Math.max((d.km / maxKm) * 64, 3),
                        borderRadius: 3,
                        backgroundColor: d.km === 0 ? cores.surface3 : i === 6 ? cores.accent : "#4a4a4a",
                      }}
                    />
                    <Texto tamanho={11} cor={i === 6 ? cores.text : cores.muted}>{d.day}</Texto>
                  </View>
                ))}
              </View>
            </View>

            <View style={[CARTAO, { padding: 16, gap: 12 }]}>
              <Texto tamanho={14} peso="semibold">Média das suas rotas</Texto>
              {INDICADORES.map((ind, i) => (
                <View key={ind.chave} style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                  <Texto tamanho={13} cor={cores.muted} style={{ width: 92 }}>{ind.label}</Texto>
                  <Barra valor={MEDIAS[i]} cor={ind.cor} altura={4} fundo={cores.surface3} style={{ flex: 1 }} />
                  <Texto tamanho={13} alinhar="right" style={{ width: 24 }}>{MEDIAS[i]}</Texto>
                </View>
              ))}
            </View>
          </>
        )}

        {tab === "history" && (
          <View style={CARTAO}>
            {HISTORY.map((run, i) => (
              <View
                key={i}
                style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 14, paddingVertical: 12, borderTopWidth: i ? 1 : 0, borderColor: cores.border }}
              >
                <View style={{ flex: 1, gap: 2 }}>
                  <Texto tamanho={14} peso="medium" numberOfLines={1}>{run.route}</Texto>
                  <Texto tamanho={12} cor={cores.muted}>{run.date} · {run.dist} · {run.time}</Texto>
                </View>
                <Texto tamanho={16} peso="bold">{run.score}</Texto>
              </View>
            ))}
          </View>
        )}

        {tab === "badges" && (
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            {BADGES.map((badge) => (
              <View key={badge.label} style={[CARTAO, { width: "47%", flexGrow: 1, padding: 14, gap: 4, opacity: badge.unlocked ? 1 : 0.45 }]}>
                <Texto tamanho={14} peso="semibold">{badge.label}</Texto>
                <Texto tamanho={12} cor={cores.muted}>{badge.desc}</Texto>
                <Texto tamanho={11} cor={badge.unlocked ? cores.accent : cores.muted} style={{ marginTop: 6 }}>
                  {badge.unlocked ? "Conquistada" : "Bloqueada"}
                </Texto>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
