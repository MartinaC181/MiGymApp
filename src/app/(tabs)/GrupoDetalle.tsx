import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import globalStyles from '../../styles/global';
import theme from '../../constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { exerciseAPI, Exercise } from '../../utils/ExerciseAPI';

export default function GrupoDetalle() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const grupoNombre = params.grupo?.toString() || 'Piernas';
  
  // Estados
  const [ejercicios, setEjercicios] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar ejercicios al montar el componente
  useEffect(() => {
    loadEjercicios();
  }, [grupoNombre]);

  const loadEjercicios = async () => {
    try {
      setLoading(true);
      setError(null);
      const exercises = await exerciseAPI.getExercisesByMuscleGroup(grupoNombre);
      setEjercicios(exercises);
    } catch (err) {
      setError('Error cargando ejercicios. Mostrando datos de ejemplo.');
      console.error('Error loading exercises:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExercise = () => {
    Alert.alert(
      'Agregar Ejercicio',
      '¿Deseas buscar más ejercicios en la biblioteca?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Buscar', onPress: () => {
          router.push('/biblioteca-ejercicios');
        }}
      ]
    );
  };

  const handleEditExercise = (exercise: Exercise) => {
    Alert.alert(
      'Detalles del Ejercicio',
      `${exercise.name}\n\n🎯 Músculo: ${exercise.target}\n🏋️ Equipamiento: ${exercise.equipment}\n\n📋 Instrucciones:\n${exercise.instructions.join('\n\n')}`,
      [
        { text: 'Cerrar', style: 'cancel' },
        { text: 'Agregar a Rutina', onPress: () => {
          Alert.alert('Éxito', 'Ejercicio agregado a tu rutina');
        }}
      ]
    );
  };

  const grupo = {
    nombre: grupoNombre,
    icon: require('../../../assets/icon.png'),
  };
  return (
    <View style={globalStyles.container}>
      <Image source={grupo.icon} style={styles.grupoIcon} />
      <View style={styles.headerRow}>
        <Text style={styles.grupoNombre}>{grupo.nombre}</Text>
        <TouchableOpacity style={styles.agregarBtn} onPress={handleAddExercise}>
          <Text style={styles.agregarText}>Agregar</Text>
        </TouchableOpacity>
      </View>
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.ejerciciosContainer} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Cargando ejercicios...</Text>
          </View>
        ) : (
          <>
            {ejercicios.map((ejercicio, idx) => (
              <View key={ejercicio.id || idx} style={styles.ejercicioCard}>
                <MaterialIcons name="fitness-center" size={28} color={theme.colors.primary} style={styles.ejercicioIcon} />
                <View style={styles.ejercicioInfo}>
                  <Text style={styles.ejercicioNombre}>{ejercicio.name}</Text>
                  <Text style={styles.ejercicioDetails}>{ejercicio.equipment} • {ejercicio.target}</Text>
                  <Text style={styles.ejercicioTarget}>💪 {ejercicio.bodyPart}</Text>
                </View>
                <TouchableOpacity style={styles.editarBtn} onPress={() => handleEditExercise(ejercicio)}>
                  <Text style={styles.editarText}>Ver</Text>
                </TouchableOpacity>
              </View>
            ))}
            
            {ejercicios.length === 0 && !loading && (
              <View style={styles.emptyContainer}>
                <MaterialIcons name="fitness-center" size={48} color={theme.colors.textSecondary} />
                <Text style={styles.emptyText}>No hay ejercicios disponibles</Text>
                <TouchableOpacity style={styles.refreshBtn} onPress={loadEjercicios}>
                  <Text style={styles.refreshText}>Recargar</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
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
  ejercicioDetails: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  ejercicioTarget: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.primary,
    marginTop: 2,
    fontFamily: theme.typography.fontFamily.medium,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    width: '100%',
  },
  errorText: {
    color: '#c62828',
    fontSize: theme.typography.fontSize.small,
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.medium,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl,
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.medium,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  refreshBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.md,
  },
  refreshText: {
    color: theme.colors.background,
    fontSize: theme.typography.fontSize.medium,
    fontFamily: theme.typography.fontFamily.bold,
  },
  arrow: {
    marginTop: theme.spacing.md,
    alignSelf: 'center',
  },
}); 