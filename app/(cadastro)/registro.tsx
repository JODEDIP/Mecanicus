import React, { useState } from "react";
import {View,Text,TextInput,TouchableOpacity,ScrollView,Alert,ActivityIndicator,StyleSheet, 
  useColorScheme, 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/supabaseClient";
import { router } from "expo-router";

const ACCENT_COLOR = "#2ECC71"; 
const LIGHT_BG = "white";
const DARK_BG = "black";
const LIGHT_INPUT_BG = "#F0F0F0";
const DARK_INPUT_BG = "#1C1C1E";
const LIGHT_TEXT = "black";
const DARK_TEXT = "white";
const LIGHT_PLACEHOLDER = "#A0A0A0";
const DARK_PLACEHOLDER = "#8E8E93";
const LIGHT_GRAY_TEXT = "#4A4A4A"; 
const DARK_GRAY_TEXT = "#D1D5DB";


const registerSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const getDynamicColor = (light: string, dark: string) => (isDark ? dark : light);


  const handleRegister = async (data: RegisterFormData) => {
    try {
      setLoading(true);
      const { email, password } = data;

      const { error } = await supabase.auth.signUp({ email, password });

      if (error) {
        Alert.alert("Erro", error.message);
      } else {
        Alert.alert("Sucesso", "Cadastro realizado! Vamos para a segunda etapa");
        router.replace("/(cadastro)/registro2");
      }
    } catch (err: any) {
      Alert.alert("Erro inesperado", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: getDynamicColor(LIGHT_BG, DARK_BG) }]}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Cabeçalho */}
        <View style={styles.headerContainer}>
          <View style={styles.headerContent}>
            <View style={styles.logoWrapper}>
              <Text style={styles.logoText}>Mekanikus</Text>
            </View>

            {/* Barra de progresso */}
            <View style={styles.progressBarWrapper}>
              <View style={styles.progressBarTextWrapper}>
                <Text style={[styles.progressBarText, { color: getDynamicColor(LIGHT_TEXT, DARK_TEXT) }]}>
                  Criar Conta
                </Text>
              </View>
              <View style={[styles.progressBarBackground, { backgroundColor: getDynamicColor("#F0F0F0", "#1C1C1E") }]}>
                <View
                  style={[styles.progressBarFill, { width: "50%" }]}
                />
              </View>
            </View>

            <View style={styles.formContainer}>
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
                      keyboardType="email-address"
                      placeholderTextColor={getDynamicColor(LIGHT_PLACEHOLDER, DARK_PLACEHOLDER)}
                      style={[
                        styles.textInput,
                        {
                          backgroundColor: getDynamicColor(LIGHT_INPUT_BG, DARK_INPUT_BG),
                          color: getDynamicColor(LIGHT_TEXT, DARK_TEXT),
                        },
                      ]}
                    />
                    {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
                  </View>
                )}
              />

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
                      placeholderTextColor={getDynamicColor(LIGHT_PLACEHOLDER, DARK_PLACEHOLDER)}
                      style={[
                        styles.textInput,
                        {
                          backgroundColor: getDynamicColor(LIGHT_INPUT_BG, DARK_INPUT_BG),
                          color: getDynamicColor(LIGHT_TEXT, DARK_TEXT),
                        },
                      ]}
                    />
                    {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
                  </View>
                )}
              />
              
               <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.showPasswordButton}
              >
                <Text style={styles.showPasswordText}>
                  {showPassword ? "Ocultar" : "Mostrar"}
                </Text>
              </TouchableOpacity>


              {/* Botão */}
              <View style={styles.buttonWrapper}>
                <TouchableOpacity
                  style={[styles.button, { opacity: loading ? 0.8 : 1 }]} 
                  onPress={()=> handleSubmit(handleRegister)()}
                  disabled={loading}
                  activeOpacity={0.9} 
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Continuar</Text>
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.loginLinkWrapper}>
                <Text style={[styles.loginLinkText, { color: getDynamicColor(LIGHT_GRAY_TEXT, DARK_GRAY_TEXT) }]}>
                  Já tem uma conta?
                </Text>
                <TouchableOpacity onPress={() => router.push("/(cadastro)/login")}>
                  <Text style={styles.loginLinkButtonText}>
                    Efetuar login
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 16, 
  },

  headerContainer: {
    width: "100%",
    maxWidth: 448,
    alignSelf: "center", 
    marginTop: 32,
  },
  
  headerContent: {
    marginBottom: 32,
  },

  logoWrapper: {
    alignItems: "center",
    marginBottom: 32, 
  },
 
  logoText: {
    fontSize: 36,
    fontWeight: "700",
    color: ACCENT_COLOR,
  },


  progressBarWrapper: {
    marginBottom: 32, 
  },
  progressBarTextWrapper: {
    alignItems: "center", 
    justifyContent: "center", 
    marginBottom: 8, 
  },
  progressBarText: {
    fontSize: 14, // text-sm
    fontWeight: "500", // font-medium
  },
  // w-full bg-[#F0F0F0] dark:bg-[#1C1C1E] rounded-full h-2
  progressBarBackground: {
    width: "100%",
    borderRadius: 9999, // rounded-full
    height: 8, // h-2 (2 * 4 = 8)
  },
  // bg-[#2ECC71] h-2 rounded-full
  progressBarFill: {
    backgroundColor: ACCENT_COLOR,
    height: 8,
    borderRadius: 9999,
  },

  // Formulário (space-y-4)
  formContainer: {
    gap: 16, // space-y-4
  },

  // TextInput (w-full px-4 py-3 bg-x text-y rounded-xl shadow)
  textInput: {
    width: "100%",
    paddingHorizontal: 16, // px-4
    paddingVertical: 12, // py-3
    borderRadius: 12, // rounded-xl
    // Simulação da shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    fontSize: 14,
  },
  // Erro (text-red-500 text-xs mt-1)
  errorText: {
    color: "red",
    fontSize: 12, // text-xs
    marginTop: 4, // mt-1
  },

  // Botão Mostrar/Ocultar Senha (para um posicionamento mais fácil no RN)
  showPasswordButton: {
    position: "absolute",
    right: 16,
    bottom: 24, // Ajustado para a posição aproximada do último TextInput
    zIndex: 1,
  },
  showPasswordText: {
    color: ACCENT_COLOR,
    fontSize: 12,
    fontWeight: "600",
  },
  
  // Button Wrapper (pt-6)
  buttonWrapper: {
    paddingTop: 24, // pt-6
  },
  // Botão (w-full bg-[#2ECC71] py-3 rounded-xl shadow items-center active:opacity-90)
  button: {
    width: "100%",
    backgroundColor: ACCENT_COLOR,
    paddingVertical: 12, // py-3
    borderRadius: 12, // rounded-xl
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    alignItems: "center", // items-center
    justifyContent: "center",
  },
  // Botão Text (text-white font-bold text-base)
  buttonText: {
    color: "white",
    fontWeight: "700", // font-bold
    fontSize: 16, // text-base
  },

  // Link para Login (flex-row justify-center items-center mt-6)
  loginLinkWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24, // mt-6
  },
  // Link Text (text-sm text-gray-700 dark:text-gray-300)
  loginLinkText: {
    fontSize: 14, // text-sm
  },
  // Link Button Text (text-sm text-[#2ECC71] font-semibold ml-1)
  loginLinkButtonText: {
    fontSize: 14, // text-sm
    color: ACCENT_COLOR,
    fontWeight: "600", // font-semibold
    marginLeft: 4, // ml-1
  },
});