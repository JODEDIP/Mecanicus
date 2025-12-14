import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

/* 🎨 Tema Claro */
const BG_COLOR = "#ffffff";
const CARD_BG = "#ffffff";

const TEXT_PRIMARY = "#18181b";
const TEXT_MUTED = "#71717a";
const BORDER_COLOR = "#d4d4d8";
const INPUT_BG = "#f4f4f5";

export default function EditProfileScreen() {
  const [name, setName] = useState("Petel");
  const [email, setEmail] = useState("exemplo@gmail.com");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: BG_COLOR },
      ]}
    >
      {/* Background decorativo */}
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <MaterialIcons name="manage-accounts" size={32} color="#000" />
        </View>

        <Text style={styles.title}>Editar Perfil</Text>
        <Text style={styles.subtitle}>
         Atualizar informações do perfil
        </Text>
      </View>

      {/* Card */}
      <View style={[styles.card, { backgroundColor: CARD_BG }]}>
        {/* Full Name */}
        <Text style={styles.label}>Nome</Text>
        <View style={styles.inputWrapper}>
          <MaterialIcons name="person" size={20} color={TEXT_PRIMARY} />
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Introduzar nova Palavra Passe"
            placeholderTextColor={TEXT_MUTED}
            style={styles.input}
          />
        </View>

        {/* Email */}
        <Text style={[styles.label, { marginTop: 16 }]}>
          Endereço de Email
        </Text>
        <View style={styles.inputWrapper}>
          <MaterialIcons name="mail-outline" size={20} color={TEXT_PRIMARY} />
          <TextInput
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="Colocar novo email"
            placeholderTextColor={TEXT_MUTED}
            style={styles.input}
          />
        </View>

        {/* New Password */}
        <Text style={[styles.label, { marginTop: 16 }]}>
          Nova Palavra
        </Text>
        <View style={styles.inputWrapper}>
          <MaterialIcons name="lock-outline" size={20} color={TEXT_PRIMARY} />
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Definir nova palavra Passe"
            placeholderTextColor={TEXT_MUTED}
            style={styles.input}
          />
        </View>

        {/* Confirm Password */}
        <Text style={[styles.label, { marginTop: 16 }]}>
          Confirmar Palavra passe
        </Text>
        <View style={styles.inputWrapper}>
          <MaterialIcons name="lock-reset" size={20} color={TEXT_PRIMARY} />
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            placeholder="Confirmar nova Palavra-Passe"
            placeholderTextColor={TEXT_MUTED}
            style={styles.input}
          />
        </View>

        {/* Button */}
        <TouchableOpacity style={styles.button} activeOpacity={0.85}>
          <Text style={styles.buttonText}>Salvar Mudanças</Text>
          <MaterialIcons name="save" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity>
          <Text style={styles.footerLink}>Retornar a Dashboard</Text>
        </TouchableOpacity>
        <Text style={styles.footerText}>
          Mekanikus v2.4.0
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "center",
  },

  glowTop: {
    position: "absolute",
    top: -120,
    left: -80,
    width: 280,
    height: 280,
    backgroundColor: "rgba(0,0,0,0.04)",
    borderRadius: 280,
  },
  glowBottom: {
    position: "absolute",
    bottom: -120,
    right: -80,
    width: 260,
    height: 260,
    backgroundColor: "rgba(0,0,0,0.04)",
    borderRadius: 260,
  },

  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  title: {
    fontSize: 34,
    fontWeight: "900",
    color: TEXT_PRIMARY,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: TEXT_MUTED,
    textAlign: "center",
  },

  card: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },

  label: {
    fontSize: 13,
    fontWeight: "700",
    marginLeft: 6,
    marginBottom: 6,
    color: TEXT_PRIMARY,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    height: 56,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    backgroundColor: INPUT_BG,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: TEXT_PRIMARY,
  },

  button: {
    marginTop: 24,
    height: 56,
    borderRadius: 999,
    backgroundColor: "#000",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },

  footer: {
    alignItems: "center",
    marginTop: 24,
    gap: 8,
  },
  footerLink: {
    fontSize: 14,
    textDecorationLine: "underline",
    color: TEXT_MUTED,
  },
  footerText: {
    fontSize: 11,
    color: "#52525b",
  },
});
