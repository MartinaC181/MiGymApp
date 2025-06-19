import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import globalStyles from '../../styles/global';
import theme from '../../constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

// Datos de ejemplo
const grupo = {
  nombre: 'Piernas',
  icon: require('../../../assets/icon.png'),
};

const ejercicios = [
  { nombre: 'Ejercicio 1', series: '0x0' },
  { nombre: 'Ejercicio 2', series: '0x0' },
  { nombre: 'Ejercicio 3', series: '0x0' },
  { nombre: 'Ejercicio 4', series: '0x0' },
];

export default function GrupoDetalle() {
  return (
    <View style={globalStyles.container}>
      <Image source={grupo.icon} style={styles.grupoIcon} />
      <View style={styles.headerRow}>
        <Text style={styles.grupoNombre}>{grupo.nombre}</Text>
        <TouchableOpacity style={styles.agregarBtn}>
          <Text style={styles.agregarText}>Agregar</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.ejerciciosContainer} showsVerticalScrollIndicator={false}>
        {ejercicios.map((ej, idx) => (
          <View key={ej.nombre} style={styles.ejercicioCard}>
            <MaterialIcons name="fitness-center" size={28} color={theme.colors.primary} style={styles.ejercicioIcon} />
            <View style={styles.ejercicioInfo}>
              <Text style={styles.ejercicioNombre}>{ej.nombre}</Text>
              <Text style={styles.ejercicioSeries}>Series: {ej.series}</Text>
            </View>
            <TouchableOpacity style={styles.editarBtn}>
              <Text style={styles.editarText}>Editar</Text>
            </TouchableOpacity>
          </View>
        ))}
        <MaterialIcons name="keyboard-double-arrow-down" size={32} color={theme.colors.primary} style={styles.arrow} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  grupoIcon: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: theme.spacing.md,
  },
  grupoNombre: {
    fontSize: theme.typography.fontSize.large,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.sm,
  },
  agregarBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.lg,
    marginRight: theme.spacing.sm,
  },
  agregarText: {
    color: theme.colors.background,
    fontSize: theme.typography.fontSize.medium,
    fontFamily: theme.typography.fontFamily.bold,
  },
  ejerciciosContainer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: theme.spacing.xl,
  },
  ejercicioCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    justifyContent: 'space-between',
  },
  ejercicioIcon: {
    marginRight: theme.spacing.sm,
  },
  ejercicioInfo: {
    flex: 1,
  },
  ejercicioNombre: {
    fontSize: theme.typography.fontSize.medium,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.textSecondary,
  },
  ejercicioSeries: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.textSecondary,
  },
  editarBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.lg,
    marginLeft: theme.spacing.sm,
  },
  editarText: {
    color: theme.colors.background,
    fontSize: theme.typography.fontSize.small,
    fontFamily: theme.typography.fontFamily.bold,
  },
  arrow: {
    marginTop: theme.spacing.md,
    alignSelf: 'center',
  },
}); 