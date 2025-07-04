import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions,
  StyleSheet
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import globalStyles from '../../styles/global';
import homeStyles from '../../styles/home';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');

interface MenuOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  route?: string;
}

export default function Entrenamiento() {
  const router = useRouter();
  const { theme, isDarkMode } = useTheme();

  const menuOptions: MenuOption[] = [
    {
      id: 'rutina',
      title: 'Rutina',
      description: 'Crea y personaliza tus rutinas de entrenamiento',
      icon: 'fitness-center',
      route: '/rutina'
    },
    {
      id: 'reloj',
      title: 'Reloj',
      description: 'Controla el tiempo de tus series y descansos',
      icon: 'timer',
      route: '/temporizador'
    },
    {
      id: 'guia',
      title: 'Biblioteca de Ejercicios',
      description: 'Explora más de 1300 ejercicios con videos',
      icon: 'menu-book',
      route: '/biblioteca-ejercicios'
    },
    {
      id: 'calculadora',
      title: 'Calculadora RPM',
      description: 'Calcula tu ritmo y repeticiones máximas',
      icon: 'calculate',
      route: '/calculadora-rpm'
    }
  ];

  const handleMenuPress = (option: MenuOption) => {
    if (option.route) {
      router.push(option.route);
    } else {
      // TODO: Implementar navegación para otras opciones
    }
  };

  const renderMenuCard = (option: MenuOption, index: number) => {
    return (
      <TouchableOpacity
        key={option.id}
        style={styles.menuCard}
        onPress={() => handleMenuPress(option)}
        activeOpacity={0.9}
      >
        {/* Gradiente de fondo - igual que "Mis clases" */}
        <LinearGradient
          colors={isDarkMode ? ['#10344A', '#0C2434'] : ['#b3dcec', '#EAF7FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFillObject as any}
        />
        
        <View style={styles.cardContent}>
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary }]}>
            <MaterialIcons 
              name={option.icon as any} 
              size={24} 
              color="white" 
            />
          </View>
          
          <View style={styles.textContainer}>
            <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>
              {option.title}
            </Text>
            <Text style={[styles.cardDescription, { color: theme.colors.textSecondary }]}>
              {option.description}
            </Text>
          </View>
          
          <View style={styles.arrowContainer}>
            <MaterialIcons 
              name="keyboard-arrow-right" 
              size={24} 
              color={theme.colors.textSecondary}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[globalStyles.safeArea, styles.container, { backgroundColor: theme.colors.background }]}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section - usando estilos unificados */}
          <View style={homeStyles.greetingContainer}>
            <Text style={homeStyles.greeting}>
              ¡Hora de entrenar!
            </Text>
            <Text style={[homeStyles.subGreeting, { color: theme.colors.textSecondary }]}>
              Elige tu herramienta de entrenamiento
            </Text>
          </View>

          {/* Menu Options */}
          <View style={styles.menuContainer}>
            {menuOptions.map((option, index) => renderMenuCard(option, index))}
          </View>
        </ScrollView>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  menuContainer: {
    paddingHorizontal: 24,
    gap: 16,
  },
  menuCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 8,
    height: 85,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    flex: 1,
    height: 75,
    zIndex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    paddingRight: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    marginBottom: 2,
  },
  cardDescription: {
    fontSize: 13,
    fontFamily: 'Roboto-Regular',
    lineHeight: 16,
  },
  arrowContainer: {
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
        