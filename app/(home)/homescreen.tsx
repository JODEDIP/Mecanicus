import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  Image,
  Alert,
  Modal,
  ScrollView,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  watchPositionAsync,
  LocationAccuracy,
  LocationObject,
} from "expo-location";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "@/supabaseClient";

export default function Home() {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const mapRef = useRef<MapView>(null);

  // --- Serviços fixos (problemas pré-definidos) ---
  const services = [
    { id: "1", name: "Pneu furado", price: 5000 },
    { id: "2", name: "Bateria descarregada", price: 7000 },
    { id: "3", name: "Problema nos travões", price: 10000 },
    { id: "4", name: "Pane elétrica", price: 8000 },
  ];

  // --- Veículos e Solicitação ---
  const [veiculos, setVeiculos] = useState<any[]>([]);
  const [veiculoSelecionado, setVeiculoSelecionado] = useState<string | null>(
    null
  );
  const [problemaSelecionado, setProblemaSelecionado] = useState<any>(null);
  const [descricao, setDescricao] = useState("");
  const [imagem, setImagem] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Distância simulada (depois podemos puxar da API Maps)
  const distanciaKm = 10;

  // Buscar veículos do usuário autenticado
  useEffect(() => {
    const fetchVeiculos = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("veiculo")
        .select("*")
        .eq("iddono", user.id);

      if (error) console.error(error);
      else setVeiculos(data || []);
    };
    fetchVeiculos();
  }, []);

  // Permissão de localização
  async function requestLocationPermission() {
    const { status } = await requestForegroundPermissionsAsync();
    if (status === "granted") {
      const currentPosition = await getCurrentPositionAsync();
      setLocation(currentPosition);
    }
  }

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    watchPositionAsync(
      {
        accuracy: LocationAccuracy.Highest,
        timeInterval: 2000,
        distanceInterval: 1,
      },
      (response) => {
        setLocation(response);
        mapRef.current?.animateCamera({
          pitch: 40,
          zoom: 17,
          center: response.coords,
        });
      }
    );
  }, []);

  // Seleção de imagem
  const pickImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) setImagem(result.assets[0].uri);
  };

  // Calcular custo
  const calcularCusto = () => {
    if (!problemaSelecionado) return "A definir (por conta do motorista)";
    const custo = problemaSelecionado.price + distanciaKm * 200; // supondo 200 Kz/km
    return `${custo} Kz (base + distância)`;
  };

  // Enviar solicitação
  const handleSolicitarAjuda = async () => {
    if (!veiculoSelecionado) {
      Alert.alert("Erro", "Selecione um veículo.");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("solicitacoes").insert([
      {
        idusuario: user?.id,
        idveiculo: veiculoSelecionado,
        problema: problemaSelecionado ? problemaSelecionado.name : descricao,
        descricao,
        custo_estimado: problemaSelecionado
          ? problemaSelecionado.price + distanciaKm * 200
          : null,
      },
    ]);

    if (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível criar a solicitação.");
    } else {
      Alert.alert("Sucesso", "Solicitação enviada!");
      setProblemaSelecionado(null);
      setDescricao("");
      setImagem(null);
      setModalVisible(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Mapa */}
      {location && (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
          />
        </MapView>
      )}

      {/* Lista de Serviços Fixos */}
      <View style={styles.bottomContainer}>
        <FlatList
          data={services}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.serviceCard}
              onPress={() => {
                setProblemaSelecionado(item);
                setDescricao(item.name);
                setModalVisible(true);
              }}
            >
              <Text style={styles.serviceName}>{item.name}</Text>
              <Text style={styles.servicePrice}>{item.price} Kz</Text>
            </TouchableOpacity>
          )}
        />

        {/* Abrir modal sem problema fixo */}
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
            Confirmar Pedido
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal Solicitação Completa */}
      <Modal visible={modalVisible} animationType="slide">
        <ScrollView style={{ flex: 1, padding: 20 }}>
          <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>
            Solicitação de Ajuda
          </Text>

          {/* Veículos */}
          <Text style={{ fontWeight: "bold" }}>Selecione o veículo:</Text>
          <FlatList
            data={veiculos}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setVeiculoSelecionado(item.id)}
                style={{
                  padding: 10,
                  margin: 5,
                  borderWidth: 1,
                  borderColor:
                    veiculoSelecionado === item.id ? "green" : "#ccc",
                  borderRadius: 8,
                }}
              >
                <Text>{item.modelo}</Text>
                <Text style={{ fontSize: 12, color: "gray" }}>{item.placa}</Text>
              </TouchableOpacity>
            )}
          />

          {/* Descrição */}
          <Text style={{ fontWeight: "bold", marginTop: 20 }}>Descrição:</Text>
          <TextInput
            value={descricao}
            onChangeText={setDescricao}
            placeholder="Descreva o problema..."
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              padding: 10,
              marginBottom: 10,
              borderRadius: 8,
            }}
          />

          {/* Foto */}
          <TouchableOpacity
            onPress={pickImage}
            style={{
              backgroundColor: "#eee",
              padding: 15,
              borderRadius: 8,
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Text>{imagem ? "Trocar Foto" : "Tirar Foto"}</Text>
          </TouchableOpacity>
          {imagem && (
            <Image
              source={{ uri: imagem }}
              style={{ width: "100%", height: 200, marginBottom: 10 }}
            />
          )}

          {/* Custo */}
          <Text style={{ fontWeight: "bold", marginVertical: 10 }}>
            Custo estimado: {calcularCusto()}
          </Text>

          {/* Botões */}
          <TouchableOpacity
            onPress={handleSolicitarAjuda}
            style={{
              backgroundColor: "green",
              padding: 15,
              borderRadius: 8,
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              Enviar Solicitação
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={{
              backgroundColor: "red",
              padding: 15,
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Cancelar</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    elevation: 5,
  },
  serviceCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
    marginBottom: 10,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  servicePrice: {
    fontSize: 16,
    color: "green",
    fontWeight: "bold",
  },
  confirmButton: {
    marginTop: 10,
    backgroundColor: "green",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
});
