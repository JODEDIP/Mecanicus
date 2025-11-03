import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
  useColorScheme,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { supabase } from "@/supabaseClient";
import { router } from "expo-router";

// 🎨 Paleta de cores consistente
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

// 🔹 Schemas de validação
const personalSchema = z.object({
  firstName: z.string().min(2, "Nome obrigatório"),
  lastName: z.string().min(2, "Sobrenome obrigatório"),
  phoneNumber: z
    .string()
    .min(7, "Telefone inválido")
    .regex(/^\d+$/, "Apenas números"),
});

const clientSchema = z.object({
  numeroBI: z.string().min(5, "Número do BI obrigatório"),
});

const vehicleSchema = z.object({
  marca: z.string().min(2, "Marca obrigatória"),
  modelo: z.string().min(2, "Modelo obrigatória"),
  placa: z.string().min(2, "Placa obrigatória"),
  cor: z.string().min(2, "Cor obrigatória"),
});

type FormData = z.infer<typeof personalSchema> &
  z.infer<typeof clientSchema> &
  z.infer<typeof vehicleSchema>;

export default function RegisterScreen() {
  const [step, setStep] = useState<"pessoal" | "cliente" | "veiculo">("pessoal");
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [loading, setLoading] = useState(false);

  const { control, getValues, reset } = useForm<FormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      numeroBI: "",
      marca: "",
      modelo: "",
      placa: "",
      cor: "",
    },
  });

  const getDynamicColor = (light: string, dark: string) => (isDark ? dark : light);

  // 🔹 Função principal
  const handleNext = async () => {
    const values = getValues();

    try {
      if (step === "pessoal") {
        personalSchema.parse(values);
        return setStep("cliente");
      }
      if (step === "cliente") {
        clientSchema.parse(values);
        return setStep("veiculo");
      }

      vehicleSchema.parse(values);
      setLoading(true);

      // Supabase user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setLoading(false);
        return Alert.alert("Erro", "Usuário não autenticado.");
      }

      const { firstName, lastName, phoneNumber, numeroBI, marca, modelo, placa, cor } =
        values;

      await supabase.from("usuario").upsert({
        id: user.id,
        name: firstName,
        lname: lastName,
        Telefone: phoneNumber,
      });

      await supabase.from("cliente").insert({
        idusuario: user.id,
        numerobi: numeroBI,
      });

      await supabase.from("veiculo").insert({
        iddono: user.id,
        marca,
        modelo,
        placacarro: placa,
        cor,
      });

      Alert.alert("Sucesso", "Cadastro concluído!");
      reset();
      router.push("/(home)/home");
    } catch (err: any) {
      Alert.alert("Erro", err.errors?.[0]?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    const inputStyle = [
      styles.textInput,
      {
        backgroundColor: getDynamicColor(LIGHT_INPUT_BG, DARK_INPUT_BG),
        color: getDynamicColor(LIGHT_TEXT, DARK_TEXT),
      },
    ];

    if (step === "pessoal")
      return (
        <>
          <Controller
            control={control}
            name="firstName"
            render={({ field }) => (
              <TextInput
                placeholder="Nome"
                placeholderTextColor={getDynamicColor(LIGHT_PLACEHOLDER, DARK_PLACEHOLDER)}
                value={field.value}
                onChangeText={field.onChange}
                style={inputStyle}
              />
            )}
          />
          <Controller
            control={control}
            name="lastName"
            render={({ field }) => (
              <TextInput
                placeholder="Sobrenome"
                placeholderTextColor={getDynamicColor(LIGHT_PLACEHOLDER, DARK_PLACEHOLDER)}
                value={field.value}
                onChangeText={field.onChange}
                style={inputStyle}
              />
            )}
          />
          <Controller
            control={control}
            name="phoneNumber"
            render={({ field }) => (
              <TextInput
                placeholder="Telefone"
                placeholderTextColor={getDynamicColor(LIGHT_PLACEHOLDER, DARK_PLACEHOLDER)}
                keyboardType="phone-pad"
                value={field.value}
                onChangeText={field.onChange}
                style={inputStyle}
              />
            )}
          />
        </>
      );

    if (step === "cliente")
      return (
        <Controller
          control={control}
          name="numeroBI"
          render={({ field }) => (
            <TextInput
              placeholder="Número do BI"
              placeholderTextColor={getDynamicColor(LIGHT_PLACEHOLDER, DARK_PLACEHOLDER)}
              value={field.value}
              onChangeText={field.onChange}
              style={inputStyle}
            />
          )}
        />
      );

    return (
      <>
        <Controller
          control={control}
          name="marca"
          render={({ field }) => (
            <TextInput
              placeholder="Marca"
              placeholderTextColor={getDynamicColor(LIGHT_PLACEHOLDER, DARK_PLACEHOLDER)}
              value={field.value}
              onChangeText={field.onChange}
              style={inputStyle}
            />
          )}
        />
        <Controller
          control={control}
          name="modelo"
          render={({ field }) => (
            <TextInput
              placeholder="Modelo"
              placeholderTextColor={getDynamicColor(LIGHT_PLACEHOLDER, DARK_PLACEHOLDER)}
              value={field.value}
              onChangeText={field.onChange}
              style={inputStyle}
            />
          )}
        />
        <Controller
          control={control}
          name="placa"
          render={({ field }) => (
            <TextInput
              placeholder="Placa"
              placeholderTextColor={getDynamicColor(LIGHT_PLACEHOLDER, DARK_PLACEHOLDER)}
              autoCapitalize="characters"
              value={field.value}
              onChangeText={field.onChange}
              style={inputStyle}
            />
          )}
        />
        <Controller
          control={control}
          name="cor"
          render={({ field }) => (
            <TextInput
              placeholder="Cor"
              placeholderTextColor={getDynamicColor(LIGHT_PLACEHOLDER, DARK_PLACEHOLDER)}
              value={field.value}
              onChangeText={field.onChange}
              style={inputStyle}
            />
          )}
        />
      </>
    );
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: getDynamicColor(LIGHT_BG, DARK_BG) }]}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Cabeçalho e progresso */}
        <View style={styles.headerContainer}>
          <View style={styles.logoWrapper}>
            <Text style={styles.logoText}>Mekanikus</Text>
          </View>

          <View style={styles.progressBarWrapper}>
            <View style={styles.progressBarTextWrapper}>
              <Text
                style={[
                  styles.progressBarText,
                  { color: getDynamicColor(LIGHT_TEXT, DARK_TEXT) },
                ]}
              >
                {step === "pessoal"
                  ? "Dados Pessoais"
                  : step === "cliente"
                  ? "Informações do Cliente"
                  : "Dados do Veículo"}
              </Text>
            </View>
            <View
              style={[
                styles.progressBarBackground,
                { backgroundColor: getDynamicColor(LIGHT_INPUT_BG, DARK_INPUT_BG) },
              ]}
            >
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: step === "pessoal" ? "33%" : step === "cliente" ? "66%" : "100%",
                  },
                ]}
              />
            </View>
          </View>

          {/* Formulário */}
          <View style={styles.formContainer}>
            {renderStep()}

            <View style={styles.buttonWrapper}>
              <TouchableOpacity
                style={[styles.button, { opacity: loading ? 0.8 : 1 }]}
                onPress={handleNext}
                disabled={loading}
                activeOpacity={0.9}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>
                    {step === "veiculo" ? "Concluir Cadastro" : "Próximo"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// 🎨 Estilos herdados e aplicados
const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollViewContent: { flexGrow: 1, padding: 16 },
  headerContainer: {
    width: "100%",
    maxWidth: 448,
    alignSelf: "center",
    marginTop: 32,
  },
  logoWrapper: { alignItems: "center", marginBottom: 32 },
  logoText: { fontSize: 36, fontWeight: "700", color: ACCENT_COLOR },
  progressBarWrapper: { marginBottom: 32 },
  progressBarTextWrapper: { alignItems: "center", marginBottom: 8 },
  progressBarText: { fontSize: 14, fontWeight: "500" },
  progressBarBackground: { width: "100%", borderRadius: 9999, height: 8 },
  progressBarFill: { backgroundColor: ACCENT_COLOR, height: 8, borderRadius: 9999 },
  formContainer: { gap: 16 },
  textInput: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 14,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonWrapper: { paddingTop: 24 },
  button: {
    width: "100%",
    backgroundColor: ACCENT_COLOR,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: { color: "white", fontWeight: "700", fontSize: 16 },
});
