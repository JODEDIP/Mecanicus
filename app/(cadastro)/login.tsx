import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { supabase } from "@/supabaseClient";
import { router } from "expo-router";

export default function LoginScreen() {
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

  return (
    <ScrollView
      className="flex-1 bg-[#f6f8f7] dark:bg-[#122018]"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      {/* Header */}
      <View className="flex items-center justify-center py-10">
        <Text className="text-2xl font-bold text-[#122018] dark:text-[#f6f8f7]">
          Mekanikus
        </Text>
      </View>

      {/* Main */}
      <View className="flex-1 justify-center px-6">
        <View className="w-full max-w-sm self-center">
          <View className="mb-8">
            <Text className="text-3xl font-bold text-[#122018] dark:text-[#f6f8f7]">
              Bem-vindo de volta
            </Text>
            <Text className="text-[#122018]/60 dark:text-[#f6f8f7]/60 mt-2">
              Login to your account
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-6">
            {/* Email */}
            <View>
              <Text className="text-sm font-medium text-[#122018] dark:text-[#f6f8f7] mb-1">
                Email
              </Text>
              <TextInput
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                className="w-full rounded-lg border-none px-4 py-3 bg-[#122018]/5 dark:bg-[#f6f8f7]/5 text-[#122018] dark:text-[#f6f8f7] placeholder:text-[#122018]/40 dark:placeholder:text-[#f6f8f7]/40 focus:ring-2 focus:ring-[#22dd6d]/50"
              />
            </View>

            {/* Password */}
            <View>
              <Text className="text-sm font-medium text-[#122018] dark:text-[#f6f8f7] mb-1">
                Password
              </Text>
              <TextInput
                placeholder="••••••••"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                className="w-full rounded-lg border-none px-4 py-3 bg-[#122018]/5 dark:bg-[#f6f8f7]/5 text-[#122018] dark:text-[#f6f8f7] placeholder:text-[#122018]/40 dark:placeholder:text-[#f6f8f7]/40 focus:ring-2 focus:ring-[#22dd6d]/50"
              />

              {/* Mostrar/ocultar senha */}
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5"
              >
                <Text className="text-xs text-[#22dd6d]">
                  {showPassword ? "Ocultar" : "Mostrar"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Esqueci a senha */}
            <View className="items-end">
              <TouchableOpacity>
                <Text className="text-sm font-medium text-[#22dd6d]">
                  Esqueceu a senha?
                </Text>
              </TouchableOpacity>
            </View>

            {/* Botão de Login */}
            <TouchableOpacity
              className={`w-full py-3 rounded-lg ${
                loading ? "bg-[#22dd6d]/70" : "bg-[#22dd6d]"
              } shadow-sm items-center justify-center`}
              activeOpacity={0.9}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#122018" />
              ) : (
                <Text className="text-base font-medium text-[#122018]">
                  Login
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View className="py-6 px-6 items-center">
        <Text className="text-sm text-[#122018]/60 dark:text-[#f6f8f7]/60">
          Não tem uma conta?{" "}
          <Text
            onPress={() => router.push("/(cadastro)/registro")}
            className="font-medium text-[#22dd6d]"
          >
            Cadastre-se
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
}
