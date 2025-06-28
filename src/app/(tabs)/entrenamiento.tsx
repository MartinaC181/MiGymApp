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
import theme from '../../constants/theme';

const { width } = Dimensions.get('window');

interface MenuOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  colors: [string, string];
  route?: string;
}

export default function Entrenamiento() {
  const router = useRouter();

  const menuOptions: MenuOption[] = [
    {
      id: 'rutina',
      title: 'Rutina',
      description: 'Crea y personaliza tus rutinas de entrenamiento',
      icon: 'fitness-center',
      colors: ['#b3dcec', '#e6f3f9'],
      route: '/rutina'
    },
    {
      id: 'reloj',
      title: 'Cronómetro',
      description: 'Controla el tiempo de tus series y descansos',
      icon: 'timer',
      colors: ['#b3dcec', '#e6f3f9'],
    },
    {
      id: 'guia',
      title: 'Guía de Ejercicios',
      description: 'Aprende técnicas y formas correctas',
      icon: 'menu-book',
      colors: ['#b3dcec', '#e6f3f9'],
    },
    {
      id: 'calculadora',
      title: 'Calculadora RPM',
      description: 'Calcula tu ritmo y repeticiones máximas',
      icon: 'calculate',
      colors: ['#b3dcec', '#e6f3f9'],
    }
  ];

  const handleMenuPress = (option: MenuOption) => {
    if (option.route) {
      router.push(option.route);
    } else {
      // TODO: Implementar navegación para otras opciones
      console.log(`Navegando a ${option.title}`);
    }
  };

  const renderMenuCard = (option: MenuOption, index: number) => (
    <TouchableOpacity
      key={option.id}
      style={styles.menuCard}
      onPress={() => handleMenuPress(option)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={option.colors}
        style={styles.cardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.cardContent}>
          <View style={styles.iconContainer}>
            <MaterialIcons 
              name={option.icon as any} 
              size={24} 
              color="white" 
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.cardTitle}>
              {option.title}
            </Text>
            <Text style={styles.cardDescription}>
              {option.description}
            </Text>
          </View>
          <View style={styles.arrowContainer}>
            <MaterialIcons 
              name="keyboard-arrow-right" 
              size={20} 
              color={theme.colors.textSecondary} 
            />
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={[globalStyles.safeArea, styles.container]}>
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
            <Text style={homeStyles.subGreeting}>
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
    backgroundColor: theme.colors.surface,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl,
  },

  menuContainer: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  menuCard: {
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: theme.spacing.sm,
    height: 75, // Altura un poco mayor
  },
  cardGradient: {
    flex: 1,
    height: 75, // Altura un poco mayor
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    flex: 1,
    height: 75, // Altura un poco mayor
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  textContainer: {
    flex: 1,
    paddingRight: theme.spacing.sm,
  },
  cardTitle: {
    fontSize: theme.typography.fontSize.medium,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  cardDescription: {
    fontSize: 11,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textSecondary,
    lineHeight: 14,
  },
  arrowContainer: {
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
