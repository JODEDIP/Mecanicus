import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/supabaseClient";
import { router } from "expo-router";

// ✅ Validação com Zod
const registerSchema = z.object({
  email: z.string().email("E-mail inválido"),
  username: z.string().min(3, "Nome de usuário deve ter pelo menos 3 caracteres"),
  phone: z.string().min(9, "Número de telefone inválido"),
  document: z.string().min(6, "Documento inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const { colorScheme } = useColorScheme();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ✅ React Hook Form + Zod
  const { control, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  // ✅ Função de registro
  const handleRegister = async (data: RegisterFormData) => {
    try {
      setLoading(true);
      const { email, password } = data;

      const { error } = await supabase.auth.signUp({ email, password });

      if (error) {
        Alert.alert("Erro", error.message);
      } else {
        Alert.alert("Sucesso", "Cadastro realizado! Verifique seu e-mail.");
        router.replace("/(cadastro)/registro2");
      }
    } catch (err: any) {
      Alert.alert("Erro inesperado", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black font-display">
      <ScrollView className="flex-1 p-4">
        {/* Cabeçalho */}
        <View className="w-full max-w-md mx-auto mt-8">
          <View className="items-center mb-8">
            <Text className="text-4xl font-bold text-[#2ECC71]">Mekanikus</Text>
          </View>

          {/* Barra de progresso */}
          <View className="mb-8">
            <View className="items-center justify-center mb-2">
              <Text className="text-sm font-medium text-black dark:text-white">
                Criar Conta
              </Text>
            </View>
            <View className="w-full bg-[#F0F0F0] dark:bg-[#1C1C1E] rounded-full h-2">
              <View
                className="bg-[#2ECC71] h-2 rounded-full"
                style={{ width: "50%" }}
              />
            </View>
          </View>

          {/* Formulário */}
          <View className="space-y-4">
            {/* EMAIL */}
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <View>
                  <TextInput
                    placeholder="Email"
                    value={value}
                    onChangeText={onChange}
                    placeholderTextColor={colorScheme === "dark" ? "#8E8E93" : "#A0A0A0"}
                    className="w-full px-4 py-3 bg-[#F0F0F0] dark:bg-[#1C1C1E] text-black dark:text-white rounded-xl shadow"
                  />
                  {errors.email && <Text className="text-red-500 text-xs mt-1">{errors.email.message}</Text>}
                </View>
              )}
            />

            {/* USERNAME 
            <Controller
              control={control}
              name="username"
              render={({ field: { onChange, value } }) => (
                <View>
                  <TextInput
                    placeholder="Username"
                    value={value}
                    onChangeText={onChange}
                    placeholderTextColor={colorScheme === "dark" ? "#8E8E93" : "#A0A0A0"}
                    className="w-full px-4 py-3 bg-[#F0F0F0] dark:bg-[#1C1C1E] text-black dark:text-white rounded-xl shadow"
                  />
                  {errors.username && <Text className="text-red-500 text-xs mt-1">{errors.username.message}</Text>}
                </View>
              )}
            />

            {/* PHONE 
            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, value } }) => (
                <View>
                  <TextInput
                    placeholder="Phone Number"
                    keyboardType="phone-pad"
                    value={value}
                    onChangeText={onChange}
                    placeholderTextColor={colorScheme === "dark" ? "#8E8E93" : "#A0A0A0"}
                    className="w-full px-4 py-3 bg-[#F0F0F0] dark:bg-[#1C1C1E] text-black dark:text-white rounded-xl shadow"
                  />
                  {errors.phone && <Text className="text-red-500 text-xs mt-1">{errors.phone.message}</Text>}
                </View>
              )}
            />

            {/* DOCUMENT 
            <Controller
              control={control}
              name="document"
              render={({ field: { onChange, value } }) => (
                <View>
                  <TextInput
                    placeholder="Identity Document Number"
                    value={value}
                    onChangeText={onChange}
                    placeholderTextColor={colorScheme === "dark" ? "#8E8E93" : "#A0A0A0"}
                    className="w-full px-4 py-3 bg-[#F0F0F0] dark:bg-[#1C1C1E] text-black dark:text-white rounded-xl shadow"
                  />
                  {errors.document && <Text className="text-red-500 text-xs mt-1">{errors.document.message}</Text>}
                </View>
              )}
            />
*/}
            {/* PASSWORD */}
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <View>
                  <TextInput
                    placeholder="Password"
                    secureTextEntry={!showPassword}
                    value={value}
                    onChangeText={onChange}
                    placeholderTextColor={colorScheme === "dark" ? "#8E8E93" : "#A0A0A0"}
                    className="w-full px-4 py-3 bg-[#F0F0F0] dark:bg-[#1C1C1E] text-black dark:text-white rounded-xl shadow"
                  />
                  {errors.password && <Text className="text-red-500 text-xs mt-1">{errors.password.message}</Text>}
                </View>
              )}
            />

            {/* Botão */}
            <View className="pt-6">
              <TouchableOpacity
                className="w-full bg-[#2ECC71] py-3 rounded-xl shadow items-center active:opacity-90"
                onPress={handleSubmit(handleRegister)}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white font-bold text-base">Continuar</Text>
                )}
              </TouchableOpacity>

            {/* Link para login */}      
            </View>

            <View className="flex-row justify-center items-center mt-6">
              <Text className="text-sm text-gray-700 dark:text-gray-300">
                Já tem uma conta?
              </Text>
              <TouchableOpacity onPress={() => router.push("/(cadastro)/login")}>
                <Text className="text-sm text-[#2ECC71] font-semibold ml-1">
                  Efetuar login
                </Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
