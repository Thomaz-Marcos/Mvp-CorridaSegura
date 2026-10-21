import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

// Preencha EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY no .env.local (veja .env.example).
const URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
const CHAVE = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabaseConfigurado = URL !== "" && CHAVE !== "";

// Sem as variáveis o app abre mesmo assim (as telas avisam), então o cliente usa valores de enfeite.
export const supabase = createClient(supabaseConfigurado ? URL : "http://localhost", supabaseConfigurado ? CHAVE : "sem-chave", {
  auth: { storage: AsyncStorage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false },
});
