import { useState } from "react";
import { Pressable, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  useFonts,
  Outfit_300Light,
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
  Outfit_800ExtraBold,
  Outfit_900Black,
} from "@expo-google-fonts/outfit";
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_600SemiBold,
  JetBrainsMono_700Bold,
} from "@expo-google-fonts/jetbrains-mono";
import { cores } from "./src/theme";
import Texto from "./src/components/Texto";
import { IconeAba } from "./src/components/Icones";
import OnboardingScreen from "./src/screens/OnboardingScreen";
import MapScreen from "./src/screens/MapScreen";
import PlanRouteScreen from "./src/screens/PlanRouteScreen";
import RouteScreen from "./src/screens/RouteScreen";
import FeedScreen from "./src/screens/FeedScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import ActiveRunScreen from "./src/screens/ActiveRunScreen";
import type { RotaReal } from "./src/hooks/useRotasReais";

type Tab = "map" | "plan" | "route" | "feed" | "profile";

const TABS: { id: Tab; label: string }[] = [
  { id: "map", label: "Mapa" },
  { id: "plan", label: "Planejar" },
  { id: "route", label: "Rotas" },
  { id: "feed", label: "Feed" },
  { id: "profile", label: "Perfil" },
];

// Protótipo navegável das telas do app Pace: só troca de tela, sem lógica.
export default function App() {
  const [fontsLoaded] = useFonts({
    Outfit_300Light,
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Outfit_800ExtraBold,
    Outfit_900Black,
    JetBrainsMono_400Regular,
    JetBrainsMono_600SemiBold,
    JetBrainsMono_700Bold,
  });
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [activeRun, setActiveRun] = useState(false);
  const [rotaPlanejada, setRotaPlanejada] = useState<RotaReal | null>(null);
  const [rotaEscolhida, setRotaEscolhida] = useState<RotaReal | null>(null);
  const [pedido, setPedido] = useState<{ origem: string; destino: string } | null>(null);
  const [tab, setTab] = useState<Tab>("map");

  if (!fontsLoaded) return <View style={{ flex: 1, backgroundColor: cores.bg }} />;

  const comAbas = !showOnboarding && !activeRun;

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <SafeAreaView style={{ flex: 1, backgroundColor: cores.bg }} edges={["top", "left", "right"]}>
        <View style={{ flex: 1 }}>
          {showOnboarding && <OnboardingScreen onFinish={() => { setShowOnboarding(false); setTab("map"); }} />}
          {!showOnboarding && activeRun && <ActiveRunScreen rota={rotaPlanejada} onFinish={() => { setActiveRun(false); setRotaPlanejada(null); setTab("map"); }} />}
          {comAbas && (
            <>
              {tab === "map" && <MapScreen rota={rotaEscolhida} onPlanejar={() => setTab("plan")} />}
              {tab === "plan" && (
                <PlanRouteScreen
                  onStartRun={(rota) => { setRotaPlanejada(rota); setActiveRun(true); }}
                  onVerNoMapa={(rota) => { setRotaEscolhida(rota); setTab("map"); }}
                  inicial={pedido}
                  onUsouInicial={() => setPedido(null)}
                />
              )}
              {tab === "route" && (
                <RouteScreen
                  onRefazer={(origem, destino) => { setPedido({ origem, destino }); setTab("plan"); }}
                  onPlanejar={() => setTab("plan")}
                />
              )}
              {tab === "feed" && <FeedScreen />}
              {tab === "profile" && <ProfileScreen />}
            </>
          )}
        </View>
      </SafeAreaView>

      {comAbas && (
        <SafeAreaView edges={["bottom"]} style={{ backgroundColor: cores.surface, borderTopWidth: 1, borderColor: cores.border }}>
          <View style={{ flexDirection: "row", justifyContent: "space-around", paddingHorizontal: 8, paddingTop: 12, paddingBottom: 8 }}>
            {TABS.map((t) => {
              const ativa = tab === t.id;
              const cor = ativa ? cores.text : cores.muted;
              return (
                <Pressable
                  key={t.id}
                  onPress={() => setTab(t.id)}
                  style={{ alignItems: "center", gap: 4, paddingHorizontal: 12, paddingVertical: 4 }}
                >
                  <IconeAba id={t.id} cor={cor} />
                  <Texto tamanho={10} peso="semibold" cor={cor} style={{ letterSpacing: 0.3 }}>{t.label}</Texto>
                </Pressable>
              );
            })}
          </View>
        </SafeAreaView>
      )}
    </SafeAreaProvider>
  );
}
