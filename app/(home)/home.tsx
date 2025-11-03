import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import{router} from "expo-router";
export default function ServiceScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const services = [
    {
      title: "Pneu Furado",
      description: "Vamos substituir seu pneu furado por um novo.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD8r1hIhg1pT7fyb-FfXJA9EtNBBlgMmWzo9pcNRj3Trq_OO2-8P6E5PGzi-joAV0O7BikE8gLxqNWnFqIiyrWrjd9JZC_ucN8R9wgzOveTCo3bog9xUIOyZVdnSBDDQZuq9ukX5QoPN_0F9IAswPhlBEshV1DUhwyl9x67apb6xW9tRj4r5Te222-o9K_RQUxSkjSH_eLdN7hCQS5obhatT8L85xj12k87X-OZ8Ok2Mp6hMQHTp9pTOCyUTQIKC6iop4pJY2zpMA",
    },
    {
      title: "Problema elétrico",
      description: "Diagnosticaremos e resolveremos quaisquer problemas elétricos.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDENPRhr0-yIdry4L5efijMiigeGVimsTwZYsAU3X8LFErFRNFA2foBz0Lw0qEVRU2SnkErj6IsukL8uFdezm-Ql6UjePzBgcv0pfqNwGvKq4PL_DFmXtLPnBRV0u3phXlC-09cyw6BabHcN2hysERVw0MAhDssNpDrYcHkMXSU_UtH8eZJaQjLf4w-PTqYeMUUJK350-JI7fIivNvyHMJuC-X0m46Zp3e52KK0HV5_9Z9M0dqOIqh5jcMGj_p_YaGMhPBWVPg0aw",
    },
    {
      title: "Reboque",
      description: "Rebocaremos seu carro até a oficina mecânica mais próxima.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDC0zQBexUWX8pjqXI7QfvRj23aSaYOT6kJahrItSUDTlXgdGd0XKPdjvUudaLNcDsryBEZjaT2DslD7oivBGBPzE9w5ad5xDnaxm-QXlRX331pZ4-dn3jSj6hBVXea7lWO9uiOU9KNLLSQAsEcjxwqJGxp2lMdJZpgjNxdZ0HqsdxrnDMwXGYRG_ne79X0JbHpRNFeRYUXv6XuZ7KXY_Br0ESp_s_Kqj6Fq5p6nrkc9HP0sFx81wgNiq1WCgyV30ktrswm8PyI6w",
    },
    {
      title: "Bateria descarregada",
      description: "Vamos dar partida no seu carro com cabos auxiliares ou trocar a bateria.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC7302qobhJSDNf26Or8P2tLTW6cKilBBpKJl0rNwWwBRFXIeXHhrrCGrm3BJA0J3ZYWy6Uc0YzsiMHCXFVq-AAo5fXISSFKDKeVzBgfvkfh8wo37YWpKvry5iQxt03XwS2aMytfUpj0dMt8aDoJIvdkw3rWldoHEVaZGNJV9vO1N-SEeKZn-j-YBFd0m3AnPlenqcYBO3M48ZKikDqj-vFlOWBp7B6yQ6LrA7uSUrPrYanAWi540wotWzp_lof1kAriq1-fQ8RHw",
    },
    {
      title: "Outros serviços",
      description: "Fou qualquer outro problema, estamos aqui para ajudar.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBJ7k6V9FIukanxZ4ZuV3jkhhJYnjckXKsSsQy8_ThyOHhGHnIx7fpG6PdMhbux9YeMolfQ2bPqBMZOOp7byhBH5IGUfcpl4AgNhcfqgHDZ8F61vE-1ocXq2-pCwuI8qmRkefU4EtNI_uNbV4rs0l5QNeNjqNH79wxTiO0ReQw_g9Mwb5FDOzGb5ujNR6q4z2y5CBh3q-rQ3w3tEWaTIoy-6_W8JPtpAbK2GfZo2QZYkpMEc-WSAc8aAB8YJdX2gVTs34fgyEDWwA",
    },
  ];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#122018" : "#f6f8f7" },
      ]}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: isDark ? "#122018cc" : "#f6f8f7cc",
          },
        ]}
      >
        <Text
          style={[
            styles.title,
            { color: isDark ? "#fff" : "#122018" },
          ]}
        >
          Mekanikus
        </Text>

        <TouchableOpacity 
        onPress={()=> router.push("/(home)/configuracoes")}
        style={styles.settingsButton}>
          <MaterialIcons name="settings" size={26} color="#22dd6d" />
        </TouchableOpacity>
      </View>

      {/* Main */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 160 }}
      >
        <Text
          style={[
            styles.sectionTitle,
            { color: isDark ? "#fff" : "#122018" },
          ]}
        >
          Qual é o problema?
        </Text>

        {services.map((item, index) => (
          <View
            key={index}
            style={[
              styles.card,
              { backgroundColor: isDark ? "#27272a" : "#fff" },
            ]}
          >
            <Image
              source={{ uri: item.image }}
              style={styles.cardImage}
              resizeMode="cover"
            />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text
                style={[
                  styles.cardDescription,
                  { color: isDark ? "#ccc" : "#666" },
                ]}
              >
                {item.description}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Footer */}
      <View
        style={[
          styles.footer,
          {
            backgroundColor: isDark ? "#122018" : "#f6f8f7",
            borderTopColor: isDark ? "#22dd6d33" : "#22dd6d33",
          },
        ]}
      >
        <View style={styles.footerContent}>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.callButton}
          >
            <Text 
            onPress={() => router.push("/(home)/homescreen")}
            style={styles.callButtonText}>Chame um mecânico com um clique
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Nav */}
        <View style={styles.navBar}>
          <TouchableOpacity style={styles.navItem}>
            <MaterialIcons name="home" size={24} color="#22dd6d" />
            <Text style={[styles.navText, { color: "#22dd6d" }]}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <MaterialIcons name="build" size={24} color="#888" />
            <Text style={[styles.navText, { color: "#888" }]}>Serviços</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <MaterialIcons name="person" size={24} color="#888" />
            <Text style={[styles.navText, { color: "#888" }]}>Perfil</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  settingsButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 24,
  },
  card: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    marginBottom: 16,
  },
  cardImage: {
    width: "100%",
    height: 190,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    textTransform: "uppercase",
    letterSpacing: 1,
    fontSize: 13,
    color: "#22dd6d",
    fontWeight: "600",
  },
  cardDescription: {
    marginTop: 8,
    fontSize: 14,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
  },
  footerContent: {
    padding: 16,
  },
  callButton: {
    backgroundColor: "#22dd6d",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  callButtonText: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#122018",
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingBottom: 12,
  },
  navItem: {
    alignItems: "center",
    gap: 4,
  },
  navText: {
    fontSize: 12,
    fontWeight: "500",
  },
});
