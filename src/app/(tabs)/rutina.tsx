import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, TextInput, Alert } from 'react-native';

import homeStyles from '../../styles/home';
import { useTheme } from '../../context/ThemeContext';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useEffect } from 'react';
import globalStyles from '../../styles/global';
import { getCurrentUser, getUserRoutines, saveUserRoutines } from '../../utils/storage';

// Grupos por defecto (predefinidos)
const DEFAULT_GROUPS = [
  {
    nombre: 'Piernas',
    icon: 'run',
    ejercicios: 12,
    descripcion: 'Cuádriceps, glúteos y pantorrillas'
  },
  {
    nombre: 'Brazos',
    icon: 'arm-flex',
    ejercicios: 8,
    descripcion: 'Bíceps, tríceps y antebrazos'
  },
  {
    nombre: 'Pecho',
    icon: 'weight-lifter',
    ejercicios: 6,
    descripcion: 'Pectorales mayor y menor'
  },
  {
    nombre: 'Espalda',
    icon: 'human-handsup',
    ejercicios: 10,
    descripcion: 'Dorsales, romboides y trapecio'
  },
];

export default function Rutina() {
  const { theme, isDarkMode } = useTheme();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState('');
  const [newRoutineDesc, setNewRoutineDesc] = useState('');
  const [inputError, setInputError] = useState('');

  // Rutinas personalizadas del usuario
  const [customRoutines, setCustomRoutines] = useState<any[]>([]);

  // === Cargar rutinas personalizadas al montar ===
  useEffect(() => {
    (async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          const storedRoutines = await getUserRoutines(currentUser.id);
          setCustomRoutines(storedRoutines);
        }
      } catch (error) {
        console.error('Error cargando rutinas personalizadas:', error);
      }
    })();
  }, []);

  // === Eliminar rutina personalizada ===
  const handleDeleteRoutine = (nombre: string) => {
    Alert.alert(
      'Eliminar rutina',
      `¿Seguro que deseas eliminar la rutina "${nombre}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const currentUser = await getCurrentUser();
              if (!currentUser) return;

              const updated = customRoutines.filter(r => r.nombre !== nombre);
              setCustomRoutines(updated);
              await saveUserRoutines(currentUser.id, updated);
            } catch (err) {
              console.error('Error eliminando rutina:', err);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderGrupoCard = (grupo: any, index: number) => (
    <TouchableOpacity
      key={grupo.nombre}
      style={styles.grupoCard}
      onPress={() => {
        router.push({
          pathname: '/GrupoDetalle',  
          params: { grupo: grupo.nombre }
        });
      }}
      activeOpacity={0.9}
    >
      <LinearGradient
        colors={isDarkMode ? ['#10344A', '#0C2434'] : ['#b3dcec', '#EAF7FF']}
        style={styles.cardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary }]}>
            <MaterialCommunityIcons 
              name={grupo.icon} 
              size={28} 
              color="white" 
            />
          </View>
          <View style={{ flexDirection: 'row' }}>
            {/* Botón editar (para todos) */}
            <TouchableOpacity 
              style={styles.iconActionBtn}
              onPress={() => {
                router.push({ pathname: '/GrupoDetalle', params: { grupo: grupo.nombre } });
              }}
            >
              <MaterialIcons name="edit" size={18} color={theme.colors.textSecondary} />
            </TouchableOpacity>
            {/* Botón eliminar solo para rutinas personalizadas */}
            {grupo.personalizada && (
              <TouchableOpacity 
                style={styles.iconActionBtn}
                onPress={() => handleDeleteRoutine(grupo.nombre)}
              >
                <MaterialIcons name="delete" size={18} color={theme.colors.error} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        <View style={styles.cardContent}>
          <Text style={[styles.grupoNombre, { color: theme.colors.textPrimary }]}>{grupo.nombre}</Text>
          <Text style={[styles.grupoDescripcion, { color: theme.colors.textSecondary }]}>{grupo.descripcion}</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons 
                name="dumbbell" 
                size={16} 
                color={theme.colors.textSecondary} 
              />
              <Text style={[styles.statText, { color: theme.colors.textSecondary }]}>{Array.isArray(grupo.ejercicios) ? grupo.ejercicios.length : grupo.ejercicios || 0} ejercicios</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.cardFooter}>
          <Text style={[styles.verMasText, { color: theme.colors.textSecondary }]}>Ver rutina</Text>
          <MaterialIcons 
            name="keyboard-arrow-right" 
            size={20} 
            color={theme.colors.textSecondary} 
          />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        <View style={homeStyles.greetingContainer}>
          <Text style={[homeStyles.greeting, { color: theme.colors.primary }]}>
            Mis Rutinas
          </Text>
          <Text style={[homeStyles.subGreeting, { color: theme.colors.textSecondary }]}>
            Selecciona el grupo muscular a entrenar
          </Text>
        </View>
        
        <View style={styles.gruposContainer}>
          {[...DEFAULT_GROUPS, ...customRoutines].map((grupo, index) => renderGrupoCard(grupo, index))}
        </View>
        
        <TouchableOpacity style={[styles.addRoutineButton, { backgroundColor: theme.colors.surface }]}
          onPress={() => setShowCreateModal(true)}
        >
          <LinearGradient
            colors={isDarkMode 
              ? ['rgba(0, 191, 255, 0.2)', 'rgba(0, 191, 255, 0.1)'] 
              : ['rgba(0, 191, 255, 0.1)', 'rgba(0, 191, 255, 0.05)']
            }
            style={styles.addButtonGradient}
          >
            <MaterialIcons name="add" size={24} color={theme.colors.primary} />
            <Text style={[styles.addButtonText, { color: theme.colors.primary }]}>Crear rutina personalizada</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
      {/* Modal para crear rutina personalizada */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={globalStyles.modalOverlay}>
          <View style={[{ backgroundColor: theme.colors.card, borderRadius: 16, padding: 24, width: '90%' }]}> 
            <Text style={globalStyles.formTitle}>Nueva Rutina</Text>
            <Text style={globalStyles.label}>Nombre de la rutina o grupo muscular</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="Ej: Full Body, Push, Piernas..."
              placeholderTextColor={theme.colors.textSecondary}
              value={newRoutineName}
              onChangeText={text => {
                setNewRoutineName(text);
                setInputError('');
              }}
              maxLength={32}
              autoFocus
            />
            <Text style={[globalStyles.label, { marginTop: 12 }]}>Descripción (opcional)</Text>
            <TextInput
              style={[globalStyles.input, { height: 80, textAlignVertical: 'top' }]}
              placeholder="Describe brevemente la rutina..."
              placeholderTextColor={theme.colors.textSecondary}
              value={newRoutineDesc}
              onChangeText={setNewRoutineDesc}
              maxLength={120}
              multiline
            />
            {inputError ? <Text style={{ color: theme.colors.error, marginBottom: 8 }}>{inputError}</Text> : null}
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 }}>
              <TouchableOpacity onPress={() => { setShowCreateModal(false); setNewRoutineDesc(''); }} style={[globalStyles.LoginButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, width: 120, marginRight: 8, paddingVertical: 10, minHeight: 0 }]}> 
                <Text style={[globalStyles.buttonText, { color: theme.colors.textSecondary, fontSize: 15 }]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (!newRoutineName.trim()) {
                    setInputError('El nombre es obligatorio');
                    return;
                  }
                  (async () => {
                    try {
                      const currentUser = await getCurrentUser();
                      if (!currentUser) {
                        console.warn('No se encontró usuario actual.');
                        return;
                      }

                      // Crear nueva rutina personalizada
                      const nuevaRutina = {
                        nombre: newRoutineName.trim(),
                        icon: 'dumbbell', // icono predeterminado
                        ejercicios: [], // array de ejercicios personalizados
                        descripcion: newRoutineDesc.trim(),
                        personalizada: true,
                      };

                      // Actualizar estado y persistir en AsyncStorage
                      const updatedRoutines = [...customRoutines, nuevaRutina];
                      setCustomRoutines(updatedRoutines);
                      await saveUserRoutines(currentUser.id, updatedRoutines);
                    } catch (err) {
                      console.error('Error creando rutina personalizada:', err);
                    } finally {
                      setShowCreateModal(false);
                      setNewRoutineName('');
                      setNewRoutineDesc('');
                    }
                  })();
                }}
                style={[globalStyles.LoginButton, { width: 120, paddingVertical: 10, minHeight: 0 }]}
              >
                <Text style={[globalStyles.buttonText, { fontSize: 15 }]}>Crear</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  gruposContainer: {
    paddingHorizontal: 24,
    gap: 12,
  },
  grupoCard: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 8,
  },
  cardGradient: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    padding: 8,
  },
  cardContent: {
    marginTop: 16,
  },
  grupoNombre: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
  },
  grupoDescripcion: {
    fontSize: 13,
    fontFamily: 'Roboto-Regular',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    marginLeft: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  verMasText: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
  },
  addRoutineButton: {
    marginHorizontal: 24,
    marginTop: 16,
    borderRadius: 16,
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
  },
  addButtonText: {
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
    marginLeft: 8,
  },
  iconActionBtn: {
    padding: 8,
  },
});