import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import globalStyles from '../../styles/global';
import theme from '../../constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const grupos = [
  {
    nombre: 'Piernas',
    icon: require('../../../assets/icon.png'),
  },
  {
    nombre: 'Brazos',
    icon: require('../../../assets/icon.png'),
  },
  {
    nombre: 'Pecho',
    icon: require('../../../assets/icon.png'),
  },
  {
    nombre: 'Espalda',
    icon: require('../../../assets/icon.png'),
  },
];

export default function Rutina() {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Elegí qué vas a entrenar</Text>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {grupos.map((grupo, idx) => (
          <View key={grupo.nombre} style={styles.card}>
            <View style={styles.iconContainer}>
              <Image source={grupo.icon} style={styles.icon} />
            </View>
            <Text style={styles.cardText}>{grupo.nombre}</Text>
            <TouchableOpacity onPress={() => {router.push({
                pathname: '/GrupoDetalle',  
                params: { grupo: grupo.nombre }
              })}}>
              <Text style={styles.editText}>Editar</Text>
            </TouchableOpacity>
          </View>
        ))}
        <MaterialIcons name="keyboard-double-arrow-down" size={32} color={theme.colors.primary} style={styles.arrow} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Se eliminaron safeArea, header y title redundantes
  scrollContent: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: theme.spacing.xl,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
  },
  cardText: {
    flex: 1,
    fontSize: theme.typography.fontSize.medium,
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily.medium,
    marginLeft: theme.spacing.md,
  },
  editText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.small,
    fontFamily: theme.typography.fontFamily.bold,
  },
  arrow: {
    marginTop: theme.spacing.md,
    alignSelf: 'center',
  },
});