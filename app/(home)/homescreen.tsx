import { decode } from '@mapbox/polyline';
import * as Location from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'; // Adicionado: Modal, Animated, TouchableOpacity
import MapView, { Marker, Polyline } from 'react-native-maps';


const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const SIDEBAR_WIDTH = width * 0.8; 
type LatLng = { latitude: number; longitude: number };
export default function Home() {
  const [location, setLocation] = useState<LatLng | null>(null);
  const [carStart, setCarStart] = useState<LatLng | null>(null);
  const [routeCoords, setRouteCoords] = useState<LatLng[]>([]);
  const [currentPos, setCurrentPos] = useState<LatLng | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(false); 
  const mapRef = useRef<MapView>(null);
  
  const animationRef = useRef<number | null>(null);
  const slideAnim = useRef(new Animated.Value(SIDEBAR_WIDTH)).current; 

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permissão negada');
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      const coords: LatLng = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
      setLocation(coords);
      setCurrentPos(coords);
    })();
  }, []);

  useEffect(() => {
    if (routeCoords.length > 0 && !animationRef.current) {
      let index = 0;
      animationRef.current = setInterval(() => {
        if (index < routeCoords.length) {
          setCurrentPos(routeCoords[index]);
          if (mapRef.current) {
            mapRef.current.animateCamera(
              {
                center: routeCoords[index],
                pitch: 2,
                heading: 0,
                altitude: 100,
              },
              { duration: 100 }  
            );
          }
          index++;
        } else {
          if (animationRef.current) clearInterval(animationRef.current);
          animationRef.current = null;
        }
      }, 100); 
    }
    return () => {
      if (animationRef.current) clearInterval(animationRef.current);
    };
  }, [routeCoords]);


  const toggleSidebar = () => {
    if (sidebarVisible) {

      Animated.timing(slideAnim, {
        toValue: SIDEBAR_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setSidebarVisible(false);
      });
    } else {

      setSidebarVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleMapPress = (event: { nativeEvent: { coordinate: LatLng } }) => {
    const pressedCoord = event.nativeEvent.coordinate;
    setCarStart(pressedCoord);
    setRouteCoords([]); 
    setCurrentPos(pressedCoord);
    if (location) {
      calculateRoute(pressedCoord, location);
    }
  };

  const calculateRoute = async (start: LatLng, end: LatLng) => {
    console.log('Ponto de partida do carro:', start); 
    console.log('Destino (sua localização):', end); 
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?overview=full&geometries=polyline`;
      console.log('URL da rota OSRM:', url);
      const response = await fetch(url);
      const data = await response.json();
      console.log('Resposta OSRM (primeira rota):', data.routes?.[0]);
      if (data.routes && data.routes[0]) {
        const polylineStr = data.routes[0].geometry;
        console.log('String polyline raw:', polylineStr); 
        const rawDecoded = decode(polylineStr, 5); 
        const coords: LatLng[] = rawDecoded.map(([lat, lng]: [number, number]) => ({
          latitude: lat,
          longitude: lng
        })); 
        console.log('Rota decodificada corrigida 3 pontos:', coords.slice(0, 3)); 
        setRouteCoords(coords);
      } else {
        console.log('Nenhuma rota encontrada, verifique se pontos são próximos e em estrada');
      }
    } catch (error) {
      console.log('Erro na rota:', error);
    }
  };

  const handleAccountPress = () => {
    console.log('Abrindo conta...');
    toggleSidebar(); 
  };

  const handleSettingsPress = () => {
    console.log('Abrindo configurações...');
    toggleSidebar();
  };

  const handleProviderPress = () => {
    console.log('Abrindo formulário para prestador de serviços...');
    toggleSidebar();
  };

  if (!location) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <TouchableOpacity 
        style={styles.menuButton} 
        onPress={toggleSidebar}
      >
        <Text style={styles.menuText}>☰</Text> 
      </TouchableOpacity>

      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={handleMapPress}
        showsUserLocation
        showsMyLocationButton
      >
        {currentPos && (
          <Marker
            coordinate={currentPos}
            title="Seu Carro"
            image={{ uri: 'https://img.icons8.com/?size=100&id=fstRmz58OJqW&format=png&color=000000' }}
          />
        )}
        {routeCoords.length > 0 && <Polyline coordinates={routeCoords} strokeColor="#007AFF" strokeWidth={3} />}
      </MapView>


      <Modal
        transparent
        visible={sidebarVisible}
        animationType="none" 
        onRequestClose={toggleSidebar}
      >
        <View style={styles.modalOverlay}>

          <TouchableOpacity 
            style={styles.overlayClick} 
            activeOpacity={1} 
            onPress={toggleSidebar} 
          />
          
          {/* Sidebar animada */}
          <Animated.View 
            style={[
              styles.sidebar, 
              { 
                transform: [{ translateX: slideAnim }], 
              }
            ]}
          >
            <View style={styles.sidebarContent}>
              <TouchableOpacity style={styles.sidebarItem} onPress={handleAccountPress}>
                <Text style={styles.sidebarText}>Conta</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.sidebarItem} onPress={handleSettingsPress}>
                <Text style={styles.sidebarText}>Configurações</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.sidebarItem} onPress={handleProviderPress}>
                <Text style={styles.sidebarText}>Quero ser prestador de serviços</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },

  menuButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    padding: 10,
  },
  menuText: {
    fontSize: 24,
    color: '#000',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    justifyContent: 'flex-end',
  },
  overlayClick: {
    flex: 1,
  },
  sidebar: {
    width: SIDEBAR_WIDTH,
    height: height,
    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
    borderLeftWidth: 1,
    borderLeftColor: '#ddd',
  },
  sidebarContent: {
    flex: 1,
    paddingTop: 100, 
    paddingHorizontal: 20,
  },
  sidebarItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sidebarText: {
    fontSize: 18,
    color: '#333',
  },
});
