import { useState } from "react";
import { Pressable, ScrollView, TextInput, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { cores, fontes } from "../theme";
import Texto from "../components/Texto";

const SLIDES = [
  {
    emoji: "🗺️",
    title: "Rotas avaliadas para você",
    desc: "Cada rua é analisada em tempo real por segurança, trânsito, limpeza e conservação. Corra com confiança.",
    bg: ["#001a10", "#0d0d1a"] as const,
    accent: "#00e87a",
  },
  {
    emoji: "🛡️",
    title: "Comunidade que protege",
    desc: "Corredores da sua cidade postam alertas de assalto, buracos e lixo em tempo real. Você avisa, todo mundo corre seguro.",
    bg: ["#1a0a1a", "#0d0d1a"] as const,
    accent: "#7c6fff",
  },
  {
    emoji: "⚡",
    title: "Rastreie cada corrida",
    desc: "Acompanhe pace, distância e calorias enquanto corre. Seu histórico e conquistas ficam todos aqui.",
    bg: ["#1a1000", "#0d0d1a"] as const,
    accent: "#f59e0b",
  },
];

interface Props {
  onFinish: () => void;
}

// Só navegação entre os slides e o login; nenhum campo é validado nem enviado.
export default function OnboardingScreen({ onFinish }: Props) {
  const [step, setStep] = useState<"slides" | "login">("slides");
  const [slide, setSlide] = useState(0);
  const [isLogin, setIsLogin] = useState(true);

  const current = SLIDES[slide];

  if (step === "login") {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: cores.bg }} contentContainerStyle={{ paddingBottom: 32 }}>
        <Pressable onPress={() => setStep("slides")} style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 }}>
          <Texto tamanho={12} peso="semibold" cor={cores.muted}>← Voltar</Texto>
        </Pressable>

        {/* Logo */}
        <View style={{ alignItems: "center", paddingTop: 24, paddingBottom: 32 }}>
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
              backgroundColor: cores.accentDim,
              borderWidth: 2,
              borderColor: cores.accent,
            }}
          >
            <Texto tamanho={30}>⚡</Texto>
          </View>
          <Texto tamanho={24} peso="black">
            Pace<Texto tamanho={24} peso="black" cor={cores.accent}>.</Texto>
          </Texto>
          <Texto tamanho={12} cor={cores.muted} style={{ marginTop: 4 }}>
            {isLogin ? "Entre na sua conta" : "Crie sua conta grátis"}
          </Texto>
        </View>

        {/* Entrar / Cadastrar */}
        <View style={{ marginHorizontal: 20, flexDirection: "row", borderRadius: 12, overflow: "hidden", marginBottom: 24, backgroundColor: cores.surface2 }}>
          {["Entrar", "Cadastrar"].map((label, i) => {
            const ativo = isLogin === (i === 0);
            return (
              <Pressable
                key={label}
                onPress={() => setIsLogin(i === 0)}
                style={{ flex: 1, paddingVertical: 10, alignItems: "center", backgroundColor: ativo ? cores.accent : "transparent" }}
              >
                <Texto tamanho={14} peso="bold" cor={ativo ? "#000" : cores.muted}>{label}</Texto>
              </Pressable>
            );
          })}
        </View>

        {/* Formulário */}
        <View style={{ gap: 12, paddingHorizontal: 20 }}>
          {!isLogin && <Campo label="Nome completo" placeholder="Marina Costa" />}
          <Campo label="E-mail" placeholder="marina@email.com" />
          <Campo label="Senha" placeholder="••••••••" senha />

          {isLogin && (
            <Texto tamanho={11} peso="semibold" cor={cores.accent} alinhar="right">
              Esqueci a senha
            </Texto>
          )}

          <Pressable
            onPress={onFinish}
            style={{ marginTop: 8, paddingVertical: 16, borderRadius: 16, alignItems: "center", backgroundColor: cores.accent }}
          >
            <Texto tamanho={14} peso="black" cor="#000" style={{ letterSpacing: 0.4 }}>
              {isLogin ? "Entrar" : "Criar conta"} →
            </Texto>
          </Pressable>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginVertical: 4 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: cores.border }} />
            <Texto tamanho={10} cor={cores.muted}>ou continue com</Texto>
            <View style={{ flex: 1, height: 1, backgroundColor: cores.border }} />
          </View>

          <View style={{ flexDirection: "row", gap: 12 }}>
            {[
              { label: "Google", icon: "G" },
              { label: "Apple", icon: "🍎" },
            ].map((s) => (
              <Pressable
                key={s.label}
                onPress={onFinish}
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  paddingVertical: 12,
                  borderRadius: 12,
                  backgroundColor: cores.surface2,
                  borderWidth: 1,
                  borderColor: cores.border,
                }}
              >
                <Texto tamanho={14} peso="black">{s.icon}</Texto>
                <Texto tamanho={14} peso="semibold">{s.label}</Texto>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <LinearGradient colors={current.bg} locations={[0, 0.6]} start={{ x: 0.2, y: 0 }} end={{ x: 0.8, y: 1 }} style={{ flex: 1 }}>
      <Pressable onPress={onFinish} style={{ position: "absolute", top: 20, right: 20, zIndex: 10 }}>
        <Texto tamanho={12} peso="semibold" cor={cores.muted}>Pular</Texto>
      </Pressable>

      {/* Ilustração */}
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32, paddingBottom: 16 }}>
        <View style={{ alignItems: "center", justifyContent: "center", marginBottom: 40, width: 192, height: 192 }}>
          <View style={{ position: "absolute", width: 192, height: 192, borderRadius: 96, borderWidth: 2, borderColor: current.accent, opacity: 0.1 }} />
          <View style={{ position: "absolute", width: 144, height: 144, borderRadius: 72, borderWidth: 2, borderColor: current.accent, opacity: 0.2 }} />
          <View
            style={{
              width: 96,
              height: 96,
              borderRadius: 24,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: current.accent + "18",
              borderWidth: 2,
              borderColor: current.accent + "40",
              boxShadow: `0 0 40px ${current.accent}30`,
            }}
          >
            <Texto tamanho={48}>{current.emoji}</Texto>
          </View>
        </View>

        {slide === 0 && (
          <View style={{ flexDirection: "row", gap: 8, marginBottom: 32 }}>
            {[
              { icon: "🛡️", val: 88, color: "#00e87a" },
              { icon: "🚦", val: 72, color: "#f59e0b" },
              { icon: "🧹", val: 91, color: "#38bdf8" },
              { icon: "🛤️", val: 79, color: "#fb923c" },
            ].map((m) => (
              <View
                key={m.icon}
                style={{
                  alignItems: "center",
                  gap: 4,
                  paddingHorizontal: 8,
                  paddingVertical: 8,
                  borderRadius: 12,
                  backgroundColor: m.color + "15",
                  borderWidth: 1,
                  borderColor: m.color + "30",
                }}
              >
                <Texto tamanho={14}>{m.icon}</Texto>
                <Texto tamanho={12} peso="black" mono cor={m.color}>{m.val}</Texto>
              </View>
            ))}
          </View>
        )}

        {slide === 1 && (
          <View style={{ width: "100%", marginBottom: 32, gap: 8 }}>
            {[
              { color: "#f43f5e", icon: "🚨", text: "Assalto relatado na Paulista, km 3", time: "3 min" },
              { color: "#facc15", icon: "⚠️", text: "Buraco na calçada — Rua Augusta", time: "12 min" },
              { color: "#00e87a", icon: "✅", text: "Ibirapuera está ótimo agora!", time: "20 min" },
            ].map((a) => (
              <View
                key={a.text}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  borderRadius: 12,
                  backgroundColor: a.color + "12",
                  borderWidth: 1,
                  borderColor: a.color + "30",
                }}
              >
                <Texto>{a.icon}</Texto>
                <Texto tamanho={11} style={{ flex: 1 }}>{a.text}</Texto>
                <Texto tamanho={10} cor={cores.muted}>{a.time}</Texto>
              </View>
            ))}
          </View>
        )}

        {slide === 2 && (
          <View style={{ flexDirection: "row", gap: 16, marginBottom: 32, width: "100%" }}>
            {[
              { val: "247", label: "km", icon: "🏃" },
              { val: "38", label: "corridas", icon: "📅" },
              { val: "4", label: "conquistas", icon: "⭐" },
            ].map((s) => (
              <View
                key={s.label}
                style={{
                  flex: 1,
                  alignItems: "center",
                  gap: 4,
                  paddingVertical: 16,
                  borderRadius: 16,
                  backgroundColor: current.accent + "10",
                  borderWidth: 1,
                  borderColor: current.accent + "30",
                }}
              >
                <Texto tamanho={24}>{s.icon}</Texto>
                <Texto tamanho={18} peso="black" mono cor={current.accent}>{s.val}</Texto>
                <Texto tamanho={10} cor={cores.muted}>{s.label}</Texto>
              </View>
            ))}
          </View>
        )}

        <Texto tamanho={24} peso="black" alinhar="center" style={{ marginBottom: 12, lineHeight: 30 }}>
          {current.title}
        </Texto>
        <Texto tamanho={14} cor={cores.muted} alinhar="center" style={{ lineHeight: 22 }}>
          {current.desc}
        </Texto>
      </View>

      {/* Controles de baixo */}
      <View style={{ paddingHorizontal: 24, paddingBottom: 40, gap: 20 }}>
        <View style={{ flexDirection: "row", justifyContent: "center", gap: 8 }}>
          {SLIDES.map((_, i) => (
            <Pressable
              key={i}
              onPress={() => setSlide(i)}
              style={{ width: i === slide ? 24 : 8, height: 8, borderRadius: 4, backgroundColor: i === slide ? current.accent : cores.border }}
            />
          ))}
        </View>

        {slide < SLIDES.length - 1 ? (
          <Pressable
            onPress={() => setSlide(slide + 1)}
            style={{ paddingVertical: 16, borderRadius: 16, alignItems: "center", backgroundColor: current.accent }}
          >
            <Texto tamanho={14} peso="black" cor="#000">Próximo →</Texto>
          </Pressable>
        ) : (
          <View style={{ gap: 12 }}>
            <Pressable
              onPress={() => { setIsLogin(false); setStep("login"); }}
              style={{ paddingVertical: 16, borderRadius: 16, alignItems: "center", backgroundColor: current.accent }}
            >
              <Texto tamanho={14} peso="black" cor="#000">Criar conta grátis</Texto>
            </Pressable>
            <Pressable onPress={() => { setIsLogin(true); setStep("login"); }} style={{ paddingVertical: 12, alignItems: "center" }}>
              <Texto tamanho={14} peso="semibold" cor={cores.muted}>Já tenho conta</Texto>
            </Pressable>
          </View>
        )}
      </View>
    </LinearGradient>
  );
}

function Campo({ label, placeholder, senha }: { label: string; placeholder: string; senha?: boolean }) {
  return (
    <View style={{ gap: 6 }}>
      <Texto tamanho={11} peso="semibold" cor={cores.muted}>{label}</Texto>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={cores.muted}
        secureTextEntry={senha}
        style={{
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingVertical: 12,
          fontSize: 14,
          fontFamily: fontes.regular,
          color: cores.text,
          backgroundColor: cores.surface,
          borderWidth: 1,
          borderColor: cores.border,
        }}
      />
    </View>
  );
}
