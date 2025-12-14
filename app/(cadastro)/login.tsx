import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { supabase } from "@/supabaseClient";
import { router } from "expo-router";

const LIGHT_BG = "#f5f8f7";
const DARK_BG = "#0f2317";
const SURFACE_DARK = "#2c2b13";
const PRIMARY = "#04a341";

const TEXT_LIGHT = "#1c1c0d";
const TEXT_DARK = "#fcfcf8";
const MUTED_LIGHT = "#9e9d47";
const MUTED_DARK = "#c4c38d";

export default function LoginScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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
        router.replace("/(home)/home");
      }
    } catch (err: any) {
      Alert.alert("Erro inesperado", err.message);
    } finally {
      setLoading(false);
    }
  };

  const textColor = isDark ? TEXT_DARK : TEXT_LIGHT;
  const mutedColor = isDark ? MUTED_DARK : MUTED_LIGHT;
  const cardBg = isDark ? `${SURFACE_DARK}CC` : "rgba(255,255,255,0.6)";
  const inputBg = isDark ? "#2c2b13" : "#fcfcf8";

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: isDark ? DARK_BG : LIGHT_BG },
      ]}
    >
      {/* Background decorativo */}
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logo}>
          <MaterialIcons name="settings" size={32} color={DARK_BG} />
        </View>
        <Text style={[styles.title, { color: textColor }]}>Mekanikus</Text>
        <Text style={[styles.subtitle, { color: mutedColor }]}>
        Acesse a plataforma
        </Text>
      </View>

      {/* Card */}
      <View style={[styles.card, { backgroundColor: cardBg }]}>
        {/* Email */}
        <Text style={[styles.label, { color: textColor }]}>E-mail</Text>
        <View style={styles.inputWrapper}>
          <MaterialIcons name="mail-outline" size={20} color={mutedColor} />
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enderenço de email"
            placeholderTextColor={`${mutedColor}99`}
            keyboardType="email-address"
            autoCapitalize="none"
            style={[
              styles.input,
              { color: textColor, backgroundColor: inputBg },
            ]}
          />
        </View>

        {/* Password */}
        <Text style={[styles.label, { color: textColor, marginTop: 16 }]}>
          Palavra-passe
        </Text>
        <View style={styles.inputWrapper}>
          <MaterialIcons name="lock-outline" size={20} color={mutedColor} />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Palavra-passe"
            placeholderTextColor={`${mutedColor}99`}
            secureTextEntry={!showPassword}
            style={[
              styles.input,
              { color: textColor, backgroundColor: inputBg },
            ]}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <MaterialIcons
              name={showPassword ? "visibility-off" : "visibility"}
              size={20}
              color={mutedColor}
            />
          </TouchableOpacity>
        </View>

        {/* Botão */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color={TEXT_LIGHT} />
          ) : (
            <>
              <Text style={styles.buttonText}>Login</Text>
              <MaterialIcons
                name="arrow-forward"
                size={20}
                color={TEXT_LIGHT}
              />
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity>
          <Text style={[styles.footerLink, { color: mutedColor }]}>
           esqueceu a palavra-passe
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },

  glowTop: {
    position: "absolute",
    top: -100,
    left: -80,
    width: 300,
    height: 300,
    backgroundColor: `${PRIMARY}22`,
    borderRadius: 300,
  },
  glowBottom: {
    position: "absolute",
    bottom: -120,
    right: -80,
    width: 260,
    height: 260,
    backgroundColor: `${PRIMARY}22`,
    borderRadius: 260,
  },

  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 36,
    fontWeight: "900",
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "500",
  },

  card: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  label: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 6,
    marginLeft: 6,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    height: 56,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  input: {
    flex: 1,
    fontSize: 15,
  },

  button: {
    marginTop: 24,
    height: 56,
    borderRadius: 999,
    backgroundColor: PRIMARY,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: PRIMARY,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    color: TEXT_LIGHT,
  },

  footer: {
    alignItems: "center",
    marginTop: 24,
    gap: 10,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: "500",
    textDecorationLine: "underline",
  },
  version: {
    fontSize: 11,
    color: "rgba(255,255,255,0.25)",
  },
});
