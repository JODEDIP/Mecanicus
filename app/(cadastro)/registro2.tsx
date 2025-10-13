import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import { router } from "expo-router";
import { supabase } from "@/supabaseClient" // ajuste o caminho conforme seu projeto
import type { Country } from "react-native-country-picker-modal";

export default function RegisterScreen() {
  const { colorScheme } = useColorScheme();

  // Etapas do cadastro
  const [step, setStep] = useState<"pessoal" | "cliente" | "veiculo">("pessoal");

  // --- Dados pessoais (usuário) ---
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState<Country["cca2"]>("AO");
  const [callingCode, setCallingCode] = useState("244");

  // --- Dados cliente ---
  const [numeroBI, setNumeroBI] = useState("");

  // --- Dados do veículo ---
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [placa, setPlaca] = useState("");
  const [cor, setCor] = useState("");

  // Função que avança entre as etapas e salva no Supabase
  const handleNext = async () => {
    if (step === "pessoal") {
      if (!firstName || !lastName || !phoneNumber) {
        Alert.alert("Erro", "Preencha todos os campos pessoais.");
        return;
      }
      setStep("cliente");
      return;
    }

    if (step === "cliente") {
      if (!numeroBI) {
        Alert.alert("Erro", "Digite o número do BI.");
        return;
      }
      setStep("veiculo");
      return;
    }

    // Etapa final: inserir no Supabase
    if (!marca || !modelo || !placa || !cor) {
      Alert.alert("Erro", "Preencha todos os dados do veículo.");
      return;
    }

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }

      // --- Insere/atualiza usuário ---
      const { error: userInsertError } = await supabase.from("usuario").upsert({
        id: user.id,
        name: firstName,
        lname: lastName,
        Telefone: `+${callingCode}${phoneNumber}`,
      });
      if (userInsertError) throw userInsertError;

      // --- Insere cliente ---
      const { error: clienteError } = await supabase.from("cliente").insert({
        idusuario: user.id,
        numerobi: numeroBI,
      });
      if (clienteError) throw clienteError;

      // --- Insere veículo ---
      const { error: veiculoError } = await supabase.from("veiculo").insert({
        iddono: user.id,
        placacarro: placa,
        cor,
        marca,
        modelo,
      });
      if (veiculoError) throw veiculoError;

      Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
      router.push("/(home)/home");
    } catch (err: any) {
      console.error("Erro inesperado:", err);
      Alert.alert("Erro", err.message || "Falha ao salvar dados.");
    }
  };

  // --- Renderização dinâmica por etapa ---
  const renderFormStep = () => {
    if (step === "pessoal") {
      return (
        <>
          <TextInput
            placeholder="Nome"
            value={firstName}
            onChangeText={setFirstName}
            className="w-full px-4 py-3 bg-[#F0F0F0] rounded-xl text-black dark:text-white mb-3"
          />
          <TextInput
            placeholder="Sobrenome"
            value={lastName}
            onChangeText={setLastName}
            className="w-full px-4 py-3 bg-[#F0F0F0] rounded-xl text-black dark:text-white mb-3"
          />
          <TextInput
            placeholder="Telefone"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            className="w-full px-4 py-3 bg-[#F0F0F0] rounded-xl text-black dark:text-white mb-3"
          />
        </>
      );
    }

    if (step === "cliente") {
      return (
        <TextInput
          placeholder="Número do BI"
          value={numeroBI}
          onChangeText={setNumeroBI}
          className="w-full px-4 py-3 bg-[#F0F0F0] rounded-xl text-black dark:text-white mb-3"
        />
      );
    }

    return (
      <>
        <TextInput
          placeholder="Marca do veículo"
          value={marca}
          onChangeText={setMarca}
          className="w-full px-4 py-3 bg-[#F0F0F0] rounded-xl text-black dark:text-white mb-3"
        />
        <TextInput
          placeholder="Modelo"
          value={modelo}
          onChangeText={setModelo}
          className="w-full px-4 py-3 bg-[#F0F0F0] rounded-xl text-black dark:text-white mb-3"
        />
        <TextInput
          placeholder="Placa"
          autoCapitalize="characters"
          value={placa}
          onChangeText={setPlaca}
          className="w-full px-4 py-3 bg-[#F0F0F0] rounded-xl text-black dark:text-white mb-3"
        />
        <TextInput
          placeholder="Cor"
          value={cor}
          onChangeText={setCor}
          className="w-full px-4 py-3 bg-[#F0F0F0] rounded-xl text-black dark:text-white mb-3"
        />
      </>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <ScrollView className="flex-1 p-4">
        <View className="w-full max-w-md mx-auto mt-4">
          {/* Indicador de progresso */}
          <View className="mb-6">
            <Text className="text-center text-base text-black dark:text-white mb-2">
              {step === "pessoal" && "1 de 3: Dados Pessoais"}
              {step === "cliente" && "2 de 3: Dados do Cliente"}
              {step === "veiculo" && "3 de 3: Dados do Veículo"}
            </Text>
            <View className="w-full bg-gray-300 h-2 rounded-full">
              <View
                className={`h-2 rounded-full ${
                  step === "pessoal"
                    ? "w-1/3 bg-blue-500"
                    : step === "cliente"
                    ? "w-2/3 bg-blue-500"
                    : "w-full bg-green-500"
                }`}
              />
            </View>
          </View>

          {/* Formulário dinâmico */}
          {renderFormStep()}

          {/* Botão */}
          <TouchableOpacity
            onPress={handleNext}
            className="mt-6 w-full bg-[#2ECC71] py-3 rounded-xl shadow items-center active:opacity-90"
          >
            <Text className="text-white font-bold text-base">
              {step === "veiculo" ? "Concluir Cadastro" : "Próximo"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
