import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';

import Icon from 'react-native-vector-icons/Feather';
import FaIcon from 'react-native-vector-icons/FontAwesome5';

interface MenuItem {
  id: string;
  iconName: string;
  iconSet: 'Feather' | 'FontAwesome5'; 
  label: string;
  subtitle?: string;
  showChevron: boolean;
  isSpecial?: boolean;
  rightComponent?: React.ReactNode;
}

const menuItems: MenuItem[] = [
  {
    id: 'payment',
    iconName: 'credit-card',
    iconSet: 'FontAwesome5', 
    label: 'Métodos de pagamento',
    subtitle: 'Numerário',
    showChevron: true,
    rightComponent: <FaIcon name="money-bill-wave" size={18} color="#00C853" />,
  },
  {
    id: 'discounts',
    iconName: 'percent',
    iconSet: 'FontAwesome5', 
    label: 'Descontos e ofertas',
    subtitle: 'Introduzir código promocional',
    showChevron: true,
  },
  {
    id: 'history',
    iconName: 'file-text',
    iconSet: 'Feather', 
    label: 'Histórico',
    showChevron: true,
  },
  {
    id: 'support',
    iconName: 'headphones',
    iconSet: 'Feather', 
    label: 'Suporte',
    showChevron: true,
  },
];

const actionItems: MenuItem[] = [
  {
    id: 'driver',
    iconName: 'taxi',
    iconSet: 'FontAwesome5',
    label: 'Ganhar como mecânico',
    showChevron: true,
    isSpecial: true,
  },
  {
    id: 'business',
    iconName: 'briefcase',
    iconSet: 'Feather',
    label: 'Conta empresarial',
    showChevron: true,
  },
  {
    id: 'security',
    iconName: 'shield',
    iconSet: 'Feather', 
    label: 'Segurança',
    showChevron: true,
  },
];

const infoItems: MenuItem[] = [
  {
    id: 'settings',
    iconName: 'settings',
    iconSet: 'Feather', 
    label: 'Definições',
    showChevron: true,
  },
  {
    id: 'info',
    iconName: 'info',
    iconSet: 'Feather', 
    label: 'Informações',
    showChevron: true,
  },
];

interface MenuItemProps {
  item: MenuItem;
  onPress: () => void;
}

const MenuItemComponent: React.FC<MenuItemProps> = ({ item, onPress }) => {

  const IconMap = {
    Feather: Icon,
    FontAwesome5: FaIcon,
  };

  const IconComponent = IconMap[item.iconSet];

  const content = (
    <View style={styles.menuItemContent}>
      <View
        style={[
          styles.iconContainer,
          item.isSpecial && styles.specialIconContainer,
        ]}
      >
        <IconComponent
          name={item.iconName}
          size={20}
          color={item.isSpecial ? '#000' : '#000'}
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={[styles.label, item.isSpecial && styles.specialLabel]}>
          {item.label}
        </Text>
        {item.subtitle && (
          <Text style={styles.subtitle}>{item.subtitle}</Text>
        )}
      </View>

      {item.rightComponent && (
        <View style={styles.rightComponentContainer}>
          {item.rightComponent}
        </View>
      )}

      {item.showChevron && (
        <Icon 
          name="chevron-right" 
          size={24} 
          color={item.isSpecial ? '#fff' : '#aaa'} 
          style={item.isSpecial && styles.specialChevron}
        />
      )}
    </View>
  );

  return (
    <TouchableOpacity
      style={[styles.menuItem, item.isSpecial && styles.specialMenuItem]}
      onPress={onPress}
    >
      {content}
    </TouchableOpacity>
  );
};


const ProfileScreen: React.FC = () => {
  const handlePress = (id: string) => {
    console.log(`Pressionado item: ${id}`);
  };

  const renderSection = (items: MenuItem[]) => (
    <View style={styles.sectionContainer}>
      {items.map((item) => (
        <MenuItemComponent
          key={item.id}
          item={item}
          onPress={() => handlePress(item.id)}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => console.log('Voltar')}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>

        <View style={styles.profileContainer}>
          <View style={styles.avatarPlaceholder}>
            <FaIcon name="user" size={40} color="#fff" />
          </View>
          <Text style={styles.nameText}>Usuario</Text>
          <Text style={styles.phoneText}>+244999999999</Text>
        </View>

        {renderSection(menuItems)}

        {renderSection(actionItems)}

        {renderSection(infoItems)}
      </ScrollView>
    </SafeAreaView>
  );
};

// --- Estilos ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 15,
    paddingBottom: 0,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  profileContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    marginBottom: 10,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ccc', 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  nameText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  phoneText: {
    fontSize: 16,
    color: '#666',
  },
  sectionContainer: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginTop: 10,
  },
  menuItem: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  specialMenuItem: {
    backgroundColor: '#333333', 
    borderBottomWidth: 0,
    borderRadius: 8,
    marginHorizontal: 15,
    marginVertical: 15,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 30,
    alignItems: 'flex-start',
    marginRight: 15,
  },
  specialIconContainer: {
    backgroundColor: '#FFC700', 
    borderRadius: 6,
    padding: 3,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  label: {
    fontSize: 16,
    color: '#000',
  },
  specialLabel: {
    color: '#fff', 
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
    color: '#888',
  },
  rightComponentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  specialChevron: {
    
  }
});

export default ProfileScreen;