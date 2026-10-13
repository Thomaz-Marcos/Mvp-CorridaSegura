import { useState } from "react";
import { Pressable, ScrollView, TextInput, View } from "react-native";
import { cores, fontes, INDICADORES } from "../theme";
import Texto from "../components/Texto";
import Botao from "../components/Botao";
import { IconeVoltar } from "../components/Icones";

const SLIDES = [
  {
    title: "Rotas avaliadas antes de você sair",
    desc: "Cada trecho tem nota de segurança, trânsito, limpeza e conservação, com base no que outros corredores relatam.",
  },
  {
    title: "Avisos de quem corre perto",
    desc: "Assalto, buraco, lixo na calçada: a comunidade avisa e você decide por onde ir.",
  },
  {
    title: "Seu histórico num lugar só",
    desc: "Pace, distância e tempo de cada corrida, semana a semana.",
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
      <ScrollView style={{ flex: 1, backgroundColor: cores.bg }} contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 32 }}>
        <Pressable onPress={() => setStep("slides")} style={{ flexDirection: "row", alignItems: "center", gap: 2, paddingTop: 20, paddingBottom: 8, marginLeft: -6 }}>
          <IconeVoltar cor={cores.muted} />
          <Texto tamanho={14} cor={cores.muted}>Voltar</Texto>
        </Pressable>

        <View style={{ paddingTop: 32, paddingBottom: 28, gap: 6 }}>
          <Texto tamanho={28} peso="bold">Pace</Texto>
          <Texto tamanho={14} cor={cores.muted}>{isLogin ? "Entre na sua conta" : "Crie sua conta"}</Texto>
        </View>

        {/* Entrar / Cadastrar */}
        <View style={{ flexDirection: "row", padding: 3, borderRadius: 10, marginBottom: 24, backgroundColor: cores.surface }}>
          {["Entrar", "Cadastrar"].map((label, i) => {
            const ativo = isLogin === (i === 0);
            return (
              <Pressable
                key={label}
                onPress={() => setIsLogin(i === 0)}
                style={{ flex: 1, paddingVertical: 9, borderRadius: 8, alignItems: "center", backgroundColor: ativo ? cores.surface3 : "transparent" }}
              >
                <Texto tamanho={14} peso="medium" cor={ativo ? cores.text : cores.muted}>{label}</Texto>
              </Pressable>
            );
          })}
        </View>

        {/* Formulário */}
        <View style={{ gap: 14 }}>
          {!isLogin && <Campo label="Nome" placeholder="Marina Costa" />}
          <Campo label="E-mail" placeholder="marina@email.com" />
          <Campo label="Senha" placeholder="Sua senha" senha />

          {isLogin && (
            <Texto tamanho={13} cor={cores.muted} alinhar="right">Esqueci a senha</Texto>
          )}

          <Botao label={isLogin ? "Entrar" : "Criar conta"} onPress={onFinish} style={{ marginTop: 6 }} />

          <Texto tamanho={12} cor={cores.muted} alinhar="center" style={{ marginVertical: 6 }}>ou</Texto>

          <View style={{ flexDirection: "row", gap: 12 }}>
            <Botao label="Google" secundario onPress={onFinish} style={{ flex: 1 }} />
            <Botao label="Apple" secundario onPress={onFinish} style={{ flex: 1 }} />
          </View>
        </View>
      </ScrollView>
    );
  }

  const ultimo = slide === SLIDES.length - 1;

  return (
    <View style={{ flex: 1, backgroundColor: cores.bg }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 24, paddingTop: 20 }}>
        <Texto tamanho={13} cor={cores.muted}>{slide + 1} de {SLIDES.length}</Texto>
        <Pressable onPress={onFinish} hitSlop={12}>
          <Texto tamanho={14} cor={cores.muted}>Pular</Texto>
        </Pressable>
      </View>

      {/* Exemplo do que o app mostra */}
      <View style={{ flex: 1, justifyContent: "center", paddingHorizontal: 24 }}>
        {slide === 0 && (
          <View style={{ borderRadius: 12, borderWidth: 1, borderColor: cores.border, backgroundColor: cores.surface, padding: 16, gap: 12 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" }}>
              <Texto tamanho={15} peso="semibold">Parque Ibirapuera</Texto>
              <Texto tamanho={22} peso="bold">84</Texto>
            </View>
            {INDICADORES.map((ind, i) => {
              const valor = [88, 72, 91, 79][i];
              return (
                <View key={ind.chave} style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <Texto tamanho={12} cor={cores.muted} style={{ width: 86 }}>{ind.label}</Texto>
                  <View style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: cores.surface3 }}>
                    <View style={{ width: `${valor}%`, height: "100%", borderRadius: 2, backgroundColor: ind.cor }} />
                  </View>
                  <Texto tamanho={12} style={{ width: 22 }} alinhar="right">{valor}</Texto>
                </View>
              );
            })}
          </View>
        )}

        {slide === 1 && (
          <View style={{ borderRadius: 12, borderWidth: 1, borderColor: cores.border, backgroundColor: cores.surface }}>
            {[
              { cor: cores.danger, text: "Assalto relatado na Paulista, perto do MASP", time: "3 min" },
              { cor: cores.warn, text: "Buraco na calçada da Rua Augusta", time: "12 min" },
              { cor: cores.safety, text: "Ibirapuera tranquilo agora de manhã", time: "20 min" },
            ].map((a, i) => (
              <View
                key={a.text}
                style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 14, paddingVertical: 12, borderTopWidth: i ? 1 : 0, borderColor: cores.border }}
              >
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: a.cor }} />
                <Texto tamanho={13} style={{ flex: 1 }}>{a.text}</Texto>
                <Texto tamanho={12} cor={cores.muted}>{a.time}</Texto>
              </View>
            ))}
          </View>
        )}

        {slide === 2 && (
          <View style={{ flexDirection: "row", borderRadius: 12, borderWidth: 1, borderColor: cores.border, backgroundColor: cores.surface }}>
            {[
              { val: "247", label: "km" },
              { val: "38", label: "corridas" },
              { val: "5'30\"", label: "pace médio" },
            ].map((s, i) => (
              <View key={s.label} style={{ flex: 1, paddingVertical: 18, paddingHorizontal: 14, gap: 2, borderLeftWidth: i ? 1 : 0, borderColor: cores.border }}>
                <Texto tamanho={22} peso="bold">{s.val}</Texto>
                <Texto tamanho={12} cor={cores.muted}>{s.label}</Texto>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Texto e controles */}
      <View style={{ paddingHorizontal: 24, paddingBottom: 32, gap: 24 }}>
        <View style={{ gap: 10 }}>
          <Texto tamanho={26} peso="bold" style={{ lineHeight: 32 }}>{current.title}</Texto>
          <Texto tamanho={15} cor={cores.muted} style={{ lineHeight: 22 }}>{current.desc}</Texto>
        </View>

        <View style={{ flexDirection: "row", gap: 6 }}>
          {SLIDES.map((_, i) => (
            <Pressable
              key={i}
              onPress={() => setSlide(i)}
              hitSlop={8}
              style={{ flex: 1, height: 3, borderRadius: 2, backgroundColor: i <= slide ? cores.text : cores.surface3 }}
            />
          ))}
        </View>

        {!ultimo ? (
          <Botao label="Continuar" onPress={() => setSlide(slide + 1)} />
        ) : (
          <View style={{ gap: 10 }}>
            <Botao label="Criar conta" onPress={() => { setIsLogin(false); setStep("login"); }} />
            <Botao label="Já tenho conta" secundario onPress={() => { setIsLogin(true); setStep("login"); }} />
          </View>
        )}
      </View>
    </View>
  );
}

function Campo({ label, placeholder, senha }: { label: string; placeholder: string; senha?: boolean }) {
  return (
    <View style={{ gap: 6 }}>
      <Texto tamanho={13} cor={cores.muted}>{label}</Texto>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#5f5f5f"
        secureTextEntry={senha}
        style={{
          borderRadius: 10,
          paddingHorizontal: 14,
          paddingVertical: 12,
          fontSize: 15,
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
