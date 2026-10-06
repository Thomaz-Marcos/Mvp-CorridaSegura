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

type Tab = "map" | "plan" | "route" | "feed" | "profile";

const TABS: { id: Tab; label: string }[] = [
  { id: "map", label: "Mapa" },
  { id: "plan", label: "Planejar" },
  { id: "route", label: "Rota" },
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
  const [tab, setTab] = useState<Tab>("map");

  if (!fontsLoaded) return <View style={{ flex: 1, backgroundColor: cores.bg }} />;

  const comAbas = !showOnboarding && !activeRun;

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <SafeAreaView style={{ flex: 1, backgroundColor: cores.bg }} edges={["top", "left", "right"]}>
        <View style={{ flex: 1 }}>
          {showOnboarding && <OnboardingScreen onFinish={() => { setShowOnboarding(false); setTab("map"); }} />}
          {!showOnboarding && activeRun && <ActiveRunScreen onFinish={() => { setActiveRun(false); setTab("map"); }} />}
          {comAbas && (
            <>
              {tab === "map" && <MapScreen />}
              {tab === "plan" && <PlanRouteScreen onStartRun={() => setActiveRun(true)} />}
              {tab === "route" && <RouteScreen onStartRun={() => setActiveRun(true)} />}
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
              const cor = ativa ? cores.accent : cores.muted;
              return (
                <Pressable
                  key={t.id}
                  onPress={() => setTab(t.id)}
                  style={{ alignItems: "center", gap: 4, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, backgroundColor: ativa ? cores.accentDim : "transparent" }}
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
