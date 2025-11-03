import React, { useState } from "react";
import {
  View,Text,TextInput,TouchableOpacity,ScrollView,ActivityIndicator,Alert,StyleSheet,useColorScheme,ViewStyle,TextStyle,StyleProp,
} from "react-native";
import { supabase } from "@/supabaseClient";
import { router } from "expo-router";

// Cores base para Light e Dark Mode
const LIGHT_BG = "#f6f8f7";
const DARK_BG = "#122018";
const PRIMARY_TEXT_LIGHT = "#122018";
const PRIMARY_TEXT_DARK = "#f6f8f7";
const ACCENT_COLOR = "#22dd6d";

// 👈 Definindo o tipo de estilo que a função dinâmica irá retornar
type DynamicStyle = ViewStyle | TextStyle;

export default function LoginScreen() {
  // 🔹 Para lidar com o Dark Mode (simula a funcionalidade do Tailwind)
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // 🔹 Estados do formulário
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // 🔹 Lógica de login
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha o e-mail e a senha.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Erro", "Digite um e-mail válido.");
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        Alert.alert("Erro", error.message);
      } else {
        Alert.alert("Sucesso", "Login realizado!");
        router.replace("/(home)/home");
      }
    } catch (err: any) {
      Alert.alert("Erro inesperado", err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Funções para obter estilos dinâmicos (equivalente a dark: classes)
  // Tipando os parâmetros explicitamente para resolver 'any' implícito
  const getDynamicStyles = (lightStyle: DynamicStyle, darkStyle: DynamicStyle): DynamicStyle => {
    return isDark ? darkStyle : lightStyle;
  };

  // Outras variáveis de cor não precisam de DynamicStyle se forem apenas strings
  const primaryTextColor = isDark ? PRIMARY_TEXT_DARK : PRIMARY_TEXT_LIGHT;
  const secondaryTextColor = isDark ? `${PRIMARY_TEXT_DARK}99` : `${PRIMARY_TEXT_LIGHT}99`; // 60% opacity
  const inputBgColor = isDark ? `${PRIMARY_TEXT_DARK}0D` : `${PRIMARY_TEXT_LIGHT}0D`; // 5% opacity
  const placeholderColor = isDark ? `${PRIMARY_TEXT_DARK}66` : `${PRIMARY_TEXT_LIGHT}66`; // 40% opacity

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: isDark ? DARK_BG : LIGHT_BG }]}
      contentContainerStyle={styles.scrollViewContent}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerText, { color: primaryTextColor }]}>
          Mekanikus
        </Text>
      </View>

      {/* Main */}
      <View style={styles.mainContainer}>
        <View style={styles.formWrapper}>
          <View style={styles.welcomeSection}>
            <Text style={[styles.welcomeTitle, { color: primaryTextColor }]}>
              Bem-vindo de volta
            </Text>
            <Text style={[styles.welcomeSubtitle, { color: secondaryTextColor, marginTop: 8 }]}>
              Login to your account
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formBody}>
            {/* Email */}
            <View>
              <Text style={[styles.inputLabel, { color: primaryTextColor, marginBottom: 4 }]}>
                Email
              </Text>
              <TextInput
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                placeholderTextColor={placeholderColor}
                style={[
                  styles.textInput,
                  {
                    backgroundColor: inputBgColor,
                    color: primaryTextColor,
                    // O foco real no RN exige o uso de estado, aqui apenas definimos a cor base.
                    // Adicionei uma borda para que o 'ring' possa ser simulado com estado.
                    borderColor: ACCENT_COLOR
                  },
                ]}
              />
            </View>

            {/* Password */}
            <View>
              <Text style={[styles.inputLabel, { color: primaryTextColor, marginBottom: 4 }]}>
                Password
              </Text>
              <TextInput
                placeholder="••••••••"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                placeholderTextColor={placeholderColor}
                style={[
                  styles.textInput,
                  {
                    backgroundColor: inputBgColor,
                    color: primaryTextColor,
                    borderColor: ACCENT_COLOR
                  },
                ]}
              />

              {/* Mostrar/ocultar senha */}
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.showPasswordButton}
              >
                <Text style={styles.showPasswordText}>
                  {showPassword ? "Ocultar" : "Mostrar"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Esqueci a senha */}
            <View style={styles.forgotPasswordContainer}>
              <TouchableOpacity>
                <Text style={styles.forgotPasswordText}>
                  Esqueceu a senha?
                </Text>
              </TouchableOpacity>
            </View>

            {/* Botão de Login */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                {
                  backgroundColor: loading ? `${ACCENT_COLOR}B3` : ACCENT_COLOR, // 70% opacity
                },
              ]}
              activeOpacity={0.9}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={PRIMARY_TEXT_LIGHT} />
              ) : (
                <Text style={styles.loginButtonText}>
                  Login
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: secondaryTextColor }]}>
          Não tem uma conta?{" "}
          <Text
            onPress={() => router.push("/(cadastro)/registro")}
            style={styles.footerLink}
          >
            Cadastre-se
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
}

// 🎨 StyleSheet com Estilos CSS normais para React Native
const styles = StyleSheet.create({
  // ScrollView (flex-1 bg-...)
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },

  // Header (flex items-center justify-center py-10)
  header: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40, // py-10
  },
  // Header Text (text-2xl font-bold text-...)
  headerText: {
    fontSize: 24, // text-2xl
    fontWeight: "700", // font-bold
  },

  // Main (flex-1 justify-center px-6)
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24, // px-6
  },
  // Form Wrapper (w-full max-w-sm self-center)
  formWrapper: {
    width: "100%",
    maxWidth: 384, // max-w-sm
    alignSelf: "center",
  },

  // Welcome Section (mb-8)
  welcomeSection: {
    marginBottom: 32, // mb-8
  },
  // Welcome Title (text-3xl font-bold text-...)
  welcomeTitle: {
    fontSize: 30, // text-3xl
    fontWeight: "700", // font-bold
  },
  // Welcome Subtitle (...)
  welcomeSubtitle: {
    fontSize: 14,
  },

  // Form Body (space-y-6)
  formBody: {
    gap: 24, // space-y-6
  },

  // Input Label (text-sm font-medium text-...)
  inputLabel: {
    fontSize: 14, // text-sm
    fontWeight: "500", // font-medium
  },
  // TextInput (w-full rounded-lg border-none px-4 py-3 bg-x text-y focus:ring-2...)
  textInput: {
    width: "100%",
    borderRadius: 8, // rounded-lg
    borderWidth: 1, // Simulação para o "ring"
    borderColor: "transparent",
    paddingHorizontal: 16, // px-4
    paddingVertical: 12, // py-3
  },

  // Password Toggle Button (absolute right-4 top-3.5)
  showPasswordButton: {
    position: "absolute",
    right: 16, // right-4
    top: 14, // top-3.5
    zIndex: 1,
  },
  // Password Toggle Text (text-xs text-[#22dd6d])
  showPasswordText: {
    fontSize: 12, // text-xs
    color: ACCENT_COLOR,
  },

  // Forgot Password (items-end)
  forgotPasswordContainer: {
    alignItems: "flex-end", // items-end
  },
  // Forgot Password Text (text-sm font-medium text-[#22dd6d])
  forgotPasswordText: {
    fontSize: 14, // text-sm
    fontWeight: "500", // font-medium
    color: ACCENT_COLOR,
  },

  // Login Button (w-full py-3 rounded-lg bg-x shadow-sm items-center justify-center)
  loginButton: {
    width: "100%",
    paddingVertical: 12, // py-3
    borderRadius: 8, // rounded-lg
    shadowColor: "#000", // shadow-sm
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    alignItems: "center", // items-center
    justifyContent: "center", // justify-center
  },
  // Login Button Text (text-base font-medium text-[#122018])
  loginButtonText: {
    fontSize: 16, // text-base
    fontWeight: "500", // font-medium
    color: PRIMARY_TEXT_LIGHT,
  },

  // Footer (py-6 px-6 items-center)
  footer: {
    paddingVertical: 24, // py-6
    paddingHorizontal: 24, // px-6
    alignItems: "center",
  },
  // Footer Text (text-sm text-...)
  footerText: {
    fontSize: 14, // text-sm
  },
  // Footer Link (font-medium text-[#22dd6d])
  footerLink: {
    fontWeight: "500", // font-medium
    color: ACCENT_COLOR,
  },
});