import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator, Alert, TextInput, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import globalStyles from '../../styles/global';
import theme from '../../constants/theme';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { exerciseAPI, Exercise } from '../../utils/ExerciseAPI';
import ExerciseDetailModal from '../../components/ExerciseDetailModal';
import { LinearGradient } from 'expo-linear-gradient';
import { getCurrentUser, getUserRoutines, saveUserRoutines } from '../../utils/storage';
import { MaterialIcons as Icon } from '@expo/vector-icons';

export default function GrupoDetalle() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const grupoNombre = params.grupo?.toString() || 'Piernas';
  
  // Estados
  const [ejercicios, setEjercicios] = useState<any[]>([]);
  const [customRoutine, setCustomRoutine] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Estado para modal de detalles
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  // Estado para modal de crear ejercicio personalizado
  const [showCreateExerciseModal, setShowCreateExerciseModal] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState('');
  const [newExerciseDesc, setNewExerciseDesc] = useState('');
  const [newExerciseSeries, setNewExerciseSeries] = useState('');
  const [newExerciseReps, setNewExerciseReps] = useState('');
  const [newExerciseWeight, setNewExerciseWeight] = useState('');
  const [exerciseInputError, setExerciseInputError] = useState('');
  // Estado para edición de ejercicio personalizado
  const [editExerciseIdx, setEditExerciseIdx] = useState<number | null>(null);

  // Mapping de grupo a icono (igual que en rutina)
  const grupoIconos: Record<string, string> = {
    'Piernas': 'run',
    'Brazos': 'arm-flex',
    'Pecho': 'weight-lifter',
    'Espalda': 'human-handsup',
    'Hombros': 'weight-lifter',
    'Core': 'karate',
    'Glúteos': 'run',
    'Pantorrillas': 'run',
  };

  // Determinar si es una rutina personalizada (no está en mapping por defecto)
  const isCustomGroup = !(['Piernas','Brazos','Pecho','Espalda','Hombros','Core','Glúteos','Pantorrillas'].includes(grupoNombre));

  // Cargar ejercicios al montar el componente
  useEffect(() => {
    if (isCustomGroup) {
      loadCustomRoutine();
    } else {
      loadEjerciciosAPI();
    }
  }, [grupoNombre]);

  const loadCustomRoutine = async () => {
    setLoading(true);
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) return;
      const routines = await getUserRoutines(currentUser.id);
      const rutina = routines.find((r: any) => r.nombre === grupoNombre);
      setCustomRoutine(rutina);
      setEjercicios(rutina?.ejercicios || []);
    } catch (err) {
      setEjercicios([]);
    } finally {
      setLoading(false);
    }
  };

  const loadEjerciciosAPI = async () => {
    try {
      setLoading(true);
      setError(null);
      const exercises = await exerciseAPI.getExercisesByMuscleGroup(grupoNombre);
      setEjercicios(exercises || []);
    } catch (err) {
      setEjercicios([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExercise = () => {
    Alert.alert(
      'Agregar ejercicio',
      '¿Cómo deseas agregar un ejercicio?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Crear ejercicio', onPress: () => setShowCreateExerciseModal(true) },
      ]
    );
  };

  // Unificada: si es personalizada, idx es number; si no, ejercicio es objeto
  const handleEditExercise = (arg: any) => {
    if (isCustomGroup) {
      setEditExerciseIdx(arg);
      setShowCreateExerciseModal(true);
    } else {
      setSelectedExercise(arg);
      setShowExerciseModal(true);
    }
  };

  // Si editExerciseIdx !== null, estamos editando un ejercicio existente
  useEffect(() => {
    if (showCreateExerciseModal && editExerciseIdx !== null && isCustomGroup && ejercicios[editExerciseIdx]) {
      const ex = ejercicios[editExerciseIdx];
      setNewExerciseName(ex.name || '');
      setNewExerciseDesc(ex.descripcion || '');
      setNewExerciseSeries(ex.series?.toString() || '');
      setNewExerciseReps(ex.repeticiones?.toString() || '');
      setNewExerciseWeight(ex.peso?.toString() || '');
    }
    if (!showCreateExerciseModal && editExerciseIdx !== null) {
      setEditExerciseIdx(null);
    }
  }, [showCreateExerciseModal]);

  const handleCreateExercise = async () => {
    if (!newExerciseName.trim()) {
      setExerciseInputError('El nombre es obligatorio');
      return;
    }
    if (!newExerciseSeries.trim() || isNaN(Number(newExerciseSeries)) || Number(newExerciseSeries) <= 0) {
      setExerciseInputError('Las series deben ser un número mayor a 0');
      return;
    }
    if (!newExerciseReps.trim() || isNaN(Number(newExerciseReps)) || Number(newExerciseReps) <= 0) {
      setExerciseInputError('Las repeticiones deben ser un número mayor a 0');
      return;
    }
    if (!isCustomGroup) return;
    try {
      setLoading(true);
      const currentUser = await getCurrentUser();
      if (!currentUser) return;
      const routines = await getUserRoutines(currentUser.id);
      const rutinaIdx = routines.findIndex((r: any) => r.nombre === grupoNombre);
      if (rutinaIdx === -1) return;
      let updatedEjercicios = Array.isArray(routines[rutinaIdx].ejercicios) ? [...routines[rutinaIdx].ejercicios] : [];
      if (editExerciseIdx !== null && updatedEjercicios[editExerciseIdx]) {
        // Editar ejercicio existente
        updatedEjercicios[editExerciseIdx] = {
          ...updatedEjercicios[editExerciseIdx],
          name: newExerciseName.trim(),
          descripcion: newExerciseDesc.trim(),
          series: Number(newExerciseSeries),
          repeticiones: Number(newExerciseReps),
          peso: newExerciseWeight.trim(),
        };
      } else {
        // Crear nuevo ejercicio
        updatedEjercicios.push({
          id: Date.now().toString(),
          name: newExerciseName.trim(),
          descripcion: newExerciseDesc.trim(),
          series: Number(newExerciseSeries),
          repeticiones: Number(newExerciseReps),
          peso: newExerciseWeight.trim(),
        });
      }
      routines[rutinaIdx].ejercicios = updatedEjercicios;
      await saveUserRoutines(currentUser.id, routines);
      setCustomRoutine(routines[rutinaIdx]);
      setEjercicios(routines[rutinaIdx].ejercicios);
      setShowCreateExerciseModal(false);
      setNewExerciseName('');
      setNewExerciseDesc('');
      setNewExerciseSeries('');
      setNewExerciseReps('');
      setNewExerciseWeight('');
      setExerciseInputError('');
      setEditExerciseIdx(null);
      Alert.alert('Ejercicio guardado', editExerciseIdx !== null ? 'El ejercicio fue editado' : 'El ejercicio fue guardado en tu rutina');
    } catch (err) {
      setExerciseInputError('Error guardando ejercicio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[globalStyles.container, { paddingTop: 0, paddingBottom: 0, paddingHorizontal: theme.spacing.lg }]}>
      <View style={{ alignItems: 'center', marginBottom: theme.spacing.md, marginTop: theme.spacing.md }}>
        <View style={{ width: 90, height: 90, borderRadius: 45, backgroundColor: theme.colors.primary, alignItems: 'center', justifyContent: 'center' }}>
          <MaterialCommunityIcons name={grupoIconos[grupoNombre] as any || 'dumbbell'} size={54} color={'#fff'} />
        </View>
      </View>
      <View style={styles.headerRow}>
        <Text style={styles.grupoNombre}>{grupoNombre}</Text>
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
              <View key={ejercicio.id || idx} style={styles.ejercicioCardV2}>
                <LinearGradient
                  colors={['#b3dcec', '#EAF7FF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={StyleSheet.absoluteFillObject as any}
                />
                <View style={[styles.iconCircle, { backgroundColor: theme.colors.primary }]}>
                  <MaterialIcons name="fitness-center" size={24} color="#fff" />
                </View>
                <View style={styles.ejercicioInfoV2}>
                  <Text style={[styles.ejercicioNombre, { maxWidth: '98%' }]} numberOfLines={1} ellipsizeMode="tail">{ejercicio.name}</Text>
                  {isCustomGroup ? (
                    <>
                      <Text style={styles.ejercicioDetails} numberOfLines={1} ellipsizeMode="tail">{ejercicio.descripcion}</Text>
                      <Text style={styles.ejercicioTarget} numberOfLines={1} ellipsizeMode="tail">{ejercicio.series} x {ejercicio.repeticiones} {ejercicio.peso ? `• ${ejercicio.peso} kg` : ''}</Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.ejercicioDetails} numberOfLines={1} ellipsizeMode="tail">{ejercicio.equipment} • {ejercicio.target}</Text>
                      <Text style={styles.ejercicioTarget} numberOfLines={1} ellipsizeMode="tail">💪 {ejercicio.bodyPart}</Text>
                    </>
                  )}
                </View>
                {isCustomGroup ? (
                  <TouchableOpacity onPress={() => handleEditExercise(idx)}>
                    <Icon name="edit" size={20} color={theme.colors.primary} />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.editarBtnV2} onPress={() => handleEditExercise(ejercicio)}>
                    <Text style={styles.editarText}>Ver</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
            
            {ejercicios.length === 0 && !loading && (
              <View style={styles.emptyContainer}>
                <MaterialIcons name="fitness-center" size={48} color={theme.colors.textSecondary} />
                <Text style={styles.emptyText}>Aún no agregaste ejercicios</Text>
              </View>
            )}
          </>
        )}
        <MaterialIcons name="keyboard-double-arrow-down" size={32} color={theme.colors.primary} style={styles.arrow} />
      </ScrollView>
      <ExerciseDetailModal
        visible={showExerciseModal}
        exercise={selectedExercise}
        onClose={() => setShowExerciseModal(false)}
        onAddToRoutine={() => {
          setShowExerciseModal(false);
          Alert.alert('Éxito', 'Ejercicio agregado a tu rutina');
        }}
      />
      {/* Modal para crear ejercicio personalizado */}
      <Modal
        visible={showCreateExerciseModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowCreateExerciseModal(false)}
      >
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={globalStyles.modalOverlay}>
          <View style={[{ backgroundColor: theme.colors.card, borderRadius: 16, padding: 24, width: '90%' }]}> 
            <Text style={globalStyles.formTitle}>Nuevo Ejercicio</Text>
            <Text style={globalStyles.label}>Nombre del ejercicio</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="Ej: Sentadilla búlgara, Press banca..."
              placeholderTextColor={theme.colors.textSecondary}
              value={newExerciseName}
              onChangeText={text => {
                setNewExerciseName(text);
                setExerciseInputError('');
              }}
              maxLength={32}
              autoFocus
            />
            <Text style={[globalStyles.label, { marginTop: 12 }]}>Descripción (opcional)</Text>
            <TextInput
              style={[globalStyles.input, { height: 60, textAlignVertical: 'top' }]}
              placeholder="Describe el ejercicio..."
              placeholderTextColor={theme.colors.textSecondary}
              value={newExerciseDesc}
              onChangeText={setNewExerciseDesc}
              maxLength={120}
              multiline
            />
            <Text style={[globalStyles.label, { marginTop: 12 }]}>Series</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="Ej: 3"
              placeholderTextColor={theme.colors.textSecondary}
              value={newExerciseSeries}
              onChangeText={setNewExerciseSeries}
              keyboardType="numeric"
              maxLength={2}
            />
            <Text style={[globalStyles.label, { marginTop: 12 }]}>Repeticiones</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="Ej: 12"
              placeholderTextColor={theme.colors.textSecondary}
              value={newExerciseReps}
              onChangeText={setNewExerciseReps}
              keyboardType="numeric"
              maxLength={3}
            />
            <Text style={[globalStyles.label, { marginTop: 12 }]}>Peso (opcional)</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="Ej: 40 (kg)"
              placeholderTextColor={theme.colors.textSecondary}
              value={newExerciseWeight}
              onChangeText={setNewExerciseWeight}
              keyboardType="numeric"
              maxLength={4}
            />
            {exerciseInputError ? <Text style={{ color: theme.colors.error, marginBottom: 8 }}>{exerciseInputError}</Text> : null}
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 }}>
              <TouchableOpacity onPress={() => { setShowCreateExerciseModal(false); setExerciseInputError(''); }} style={[globalStyles.LoginButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, width: 120, marginRight: 8, paddingVertical: 10, minHeight: 0 }]}> 
                <Text style={[globalStyles.buttonText, { color: theme.colors.textSecondary, fontSize: 15 }]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCreateExercise}
                style={[globalStyles.LoginButton, { width: 120, paddingVertical: 10, minHeight: 0 }]}
              >
                <Text style={[globalStyles.buttonText, { fontSize: 15 }]}>{editExerciseIdx !== null ? 'Editar' : 'Crear'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
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
  ejercicioCardV2: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: theme.spacing.sm,
    width: '100%',
    minHeight: 90,
    maxHeight: 90,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    backgroundColor: 'transparent',
    position: 'relative',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4FC3F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    zIndex: 1,
  },
  ejercicioInfoV2: {
    flex: 1,
    zIndex: 1,
  },
  ejercicioNombre: {
    fontSize: theme.typography.fontSize.medium,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.textSecondary,
    maxWidth: '98%',
  },
  ejercicioSeries: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.textSecondary,
  },
  editarBtnV2: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.lg,
    marginLeft: theme.spacing.sm,
    zIndex: 1,
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
  arrow: {
    marginTop: theme.spacing.md,
    alignSelf: 'center',
  },
}); 