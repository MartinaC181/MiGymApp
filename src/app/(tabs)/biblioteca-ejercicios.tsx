import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  Dimensions,
  Image,
  FlatList
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import globalStyles from '../../styles/global';
import theme from '../../constants/theme';
import { exerciseAPI, Exercise, ExerciseFilter, getAvailableMuscleGroups, getCommonEquipment } from '../../utils/ExerciseAPI';

const { width } = Dimensions.get('window');

export default function BibliotecaEjercicios() {
  const router = useRouter();
  
  // Estados existentes
  const [ejercicios, setEjercicios] = useState<Exercise[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedMuscle, setSelectedMuscle] = useState<string>('');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  
  // Nuevos estados para mejorar UX
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favoriteExercises, setFavoriteExercises] = useState<string[]>([]);
  const [quickCategories] = useState([
    { id: 'Pecho', name: 'Pecho', icon: 'fitness-center', gradient: ['#FF6B6B', '#FFE66D'] },
    { id: 'Piernas', name: 'Piernas', icon: 'directions-run', gradient: ['#4ECDC4', '#44A08D'] },
    { id: 'Brazos', name: 'Brazos', icon: 'fitness-center', gradient: ['#45B7D1', '#96C93D'] },
    { id: 'Espalda', name: 'Espalda', icon: 'accessibility', gradient: ['#F7DC6F', '#BB6BD9'] },
    { id: 'Hombros', name: 'Hombros', icon: 'sports-gymnastics', gradient: ['#BB6BD9', '#FF6B6B'] },
    { id: 'Core', name: 'Core', icon: 'sports-martial-arts', gradient: ['#96C93D', '#4ECDC4'] }
  ]);

  const muscleGroups = getAvailableMuscleGroups();
  const equipmentTypes = getCommonEquipment();

  useEffect(() => {
    loadPopularExercises();
  }, []);

  const loadPopularExercises = async () => {
    try {
      setLoading(true);
      const exercises = await exerciseAPI.getExercisesByMuscleGroup('Pecho');
      setEjercicios(exercises.slice(0, 12));
    } catch (error) {
      console.error('Error cargando ejercicios populares:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchText.trim()) {
      Alert.alert('Error', 'Por favor ingresa un término de búsqueda');
      return;
    }

    try {
      setLoading(true);
      const results = await exerciseAPI.searchExercises(searchText);
      setEjercicios(results);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron buscar ejercicios');
      console.error('Error buscando ejercicios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = async (categoryId: string) => {
    try {
      setLoading(true);
      setSelectedMuscle(categoryId);
      const exercises = await exerciseAPI.getExercisesByMuscleGroup(categoryId);
      setEjercicios(exercises.slice(0, 20));
    } catch (error) {
      console.error('Error cargando ejercicios por categoría:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    try {
      setLoading(true);
      const filter: ExerciseFilter = {};
      
      if (selectedMuscle && selectedMuscle !== 'Todos') {
        const bodyPartMapping = {
          'Piernas': 'upper legs',
          'Brazos': 'upper arms',
          'Pecho': 'chest',
          'Espalda': 'back',
          'Hombros': 'shoulders',
          'Core': 'waist'
        };
        filter.bodyPart = bodyPartMapping[selectedMuscle as keyof typeof bodyPartMapping];
      }
      
      if (selectedEquipment && selectedEquipment !== 'Todos') {
        filter.equipment = selectedEquipment;
      }
      
      const results = await exerciseAPI.getFilteredExercises(filter);
      setEjercicios(results);
      setShowFilters(false);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron filtrar ejercicios');
      console.error('Error filtrando ejercicios:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSelectedMuscle('');
    setSelectedEquipment('');
    setSearchText('');
    loadPopularExercises();
  };

  const toggleFavorite = (exerciseId: string) => {
    setFavoriteExercises(prev => 
      prev.includes(exerciseId) 
        ? prev.filter(id => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  const showExerciseDetails = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setShowExerciseModal(true);
  };

  const addToRoutine = (exercise: Exercise) => {
    Alert.alert(
      'Agregar a Rutina',
      `¿Deseas agregar "${exercise.name}" a tu rutina?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Agregar', onPress: () => {
          Alert.alert('Éxito', 'Ejercicio agregado a tu rutina');
        }}
      ]
    );
  };

  const renderExerciseCard = ({ item: ejercicio, index }: { item: Exercise; index: number }) => {
    const isGrid = viewMode === 'grid';
    
    return (
      <TouchableOpacity
        style={[
          styles.exerciseCard,
          isGrid ? styles.gridCard : styles.listCard,
          { marginRight: isGrid && index % 2 === 0 ? 8 : 0 }
        ]}
        onPress={() => showExerciseDetails(ejercicio)}
        activeOpacity={0.9}
      >
        <View style={[styles.cardImageContainer, isGrid && styles.gridImageContainer]}>
          {ejercicio.gifUrl ? (
            <Image source={{ uri: ejercicio.gifUrl }} style={styles.exerciseImage} />
          ) : (
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.placeholderGradient}
            >
              <MaterialIcons name="fitness-center" size={isGrid ? 24 : 32} color="white" />
            </LinearGradient>
          )}
          
          <TouchableOpacity 
            style={styles.favoriteBtn}
            onPress={() => toggleFavorite(ejercicio.id)}
          >
            <MaterialIcons 
              name={favoriteExercises.includes(ejercicio.id) ? "favorite" : "favorite-border"} 
              size={16} 
              color={favoriteExercises.includes(ejercicio.id) ? "#FF6B6B" : "white"} 
            />
          </TouchableOpacity>
        </View>
        
        <View style={[styles.cardContent, isGrid && styles.gridCardContent]}>
          <Text style={[styles.exerciseName, isGrid && styles.gridExerciseName]} numberOfLines={isGrid ? 2 : 1}>
            {ejercicio.name}
          </Text>
          
          <View style={styles.exerciseMetadata}>
            <View style={styles.metadataItem}>
              <MaterialCommunityIcons name="target" size={12} color={theme.colors.primary} />
              <Text style={styles.metadataText}>{ejercicio.target}</Text>
            </View>
            
            {!isGrid && (
              <View style={styles.metadataItem}>
                <MaterialCommunityIcons name="dumbbell" size={12} color={theme.colors.primary} />
                <Text style={styles.metadataText}>{ejercicio.equipment}</Text>
              </View>
            )}
          </View>
          
          <View style={styles.cardActions}>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => addToRoutine(ejercicio)}
            >
              <MaterialIcons name="add" size={14} color="white" />
              <Text style={styles.addBtnText}>Agregar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderCategoryCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => handleCategoryPress(item.id)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={item.gradient}
        style={styles.categoryGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <MaterialCommunityIcons name={item.icon} size={24} color="white" />
        <Text style={styles.categoryText}>{item.name}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header mejorado */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Biblioteca</Text>
          <Text style={styles.headerSubtitle}>+1300 ejercicios</Text>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            style={styles.viewModeBtn}
          >
            <MaterialIcons 
              name={viewMode === 'grid' ? "view-list" : "view-module"} 
              size={20} 
              color={theme.colors.primary} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => setShowFilters(true)} style={styles.filterBtn}>
            <MaterialIcons name="tune" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Barra de búsqueda mejorada */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar ejercicios..."
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')} style={styles.clearBtn}>
              <MaterialIcons name="close" size={16} color="#999" />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <MaterialIcons name="search" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Categorías rápidas */}
      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>Categorías</Text>
        <FlatList
          data={quickCategories}
          renderItem={renderCategoryCard}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        />
      </View>

      {/* Filtros activos */}
      {(selectedMuscle || selectedEquipment) && (
        <View style={styles.activeFilters}>
          {selectedMuscle && (
            <View style={styles.filterChip}>
              <Text style={styles.filterChipText}>{selectedMuscle}</Text>
              <TouchableOpacity onPress={() => setSelectedMuscle('')}>
                <MaterialIcons name="close" size={14} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
          )}
          {selectedEquipment && (
            <View style={styles.filterChip}>
              <Text style={styles.filterChipText}>{selectedEquipment}</Text>
              <TouchableOpacity onPress={() => setSelectedEquipment('')}>
                <MaterialIcons name="close" size={14} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity style={styles.clearFiltersBtn} onPress={clearFilters}>
            <Text style={styles.clearFiltersText}>Limpiar todo</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Lista de ejercicios */}
      <View style={styles.exercisesSection}>
        <View style={styles.exercisesHeader}>
          <Text style={styles.sectionTitle}>
            {selectedMuscle ? `${selectedMuscle} (${ejercicios.length})` : `Ejercicios (${ejercicios.length})`}
          </Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Cargando ejercicios...</Text>
          </View>
        ) : (
          <FlatList
            data={ejercicios}
            renderItem={renderExerciseCard}
            keyExtractor={(item, index) => item.id || index.toString()}
            numColumns={viewMode === 'grid' ? 2 : 1}
            key={viewMode}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.exercisesList}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons name="dumbbell" size={64} color={theme.colors.textSecondary} />
                <Text style={styles.emptyText}>No se encontraron ejercicios</Text>
                <Text style={styles.emptySubtext}>Prueba con otros términos de búsqueda</Text>
              </View>
            )}
          />
        )}
      </View>

      {/* Modal de filtros mejorado */}
      <Modal visible={showFilters} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.filterModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtros</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <MaterialIcons name="close" size={24} color={theme.colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.filterContent} showsVerticalScrollIndicator={false}>
              {/* Grupo Muscular */}
              <Text style={styles.filterSectionTitle}>Grupo Muscular</Text>
              <View style={styles.filterOptions}>
                {['', ...muscleGroups].map((muscle) => (
                  <TouchableOpacity
                    key={muscle || 'all'}
                    style={[
                      styles.filterOption,
                      selectedMuscle === muscle && styles.filterOptionSelected
                    ]}
                    onPress={() => setSelectedMuscle(muscle)}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      selectedMuscle === muscle && styles.filterOptionTextSelected
                    ]}>
                      {muscle || 'Todos'}
                    </Text>
                    {selectedMuscle === muscle && (
                      <MaterialIcons name="check" size={16} color="white" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              {/* Equipamiento */}
              <Text style={styles.filterSectionTitle}>Equipamiento</Text>
              <View style={styles.filterOptions}>
                {['', ...equipmentTypes].map((equipment) => (
                  <TouchableOpacity
                    key={equipment || 'all'}
                    style={[
                      styles.filterOption,
                      selectedEquipment === equipment && styles.filterOptionSelected
                    ]}
                    onPress={() => setSelectedEquipment(equipment)}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      selectedEquipment === equipment && styles.filterOptionTextSelected
                    ]}>
                      {equipment || 'Todos'}
                    </Text>
                    {selectedEquipment === equipment && (
                      <MaterialIcons name="check" size={16} color="white" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.clearBtn2} onPress={clearFilters}>
                <Text style={styles.clearBtnText}>Limpiar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyBtn} onPress={handleFilter}>
                <Text style={styles.applyBtnText}>Aplicar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de detalles del ejercicio mejorado */}
      <Modal visible={showExerciseModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.exerciseModal}>
            {selectedExercise && (
              <>
                <View style={styles.exerciseModalHeader}>
                  <TouchableOpacity onPress={() => setShowExerciseModal(false)} style={styles.closeModalBtn}>
                    <MaterialIcons name="close" size={24} color="white" />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.favoriteModalBtn}
                    onPress={() => toggleFavorite(selectedExercise.id)}
                  >
                    <MaterialIcons 
                      name={favoriteExercises.includes(selectedExercise.id) ? "favorite" : "favorite-border"} 
                      size={24} 
                      color={favoriteExercises.includes(selectedExercise.id) ? "#FF6B6B" : "white"} 
                    />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.exerciseDetails} showsVerticalScrollIndicator={false}>
                  {selectedExercise.gifUrl && (
                    <View style={styles.exerciseImageModal}>
                      <Image source={{ uri: selectedExercise.gifUrl }} style={styles.exerciseDetailImage} />
                    </View>
                  )}

                  <View style={styles.exerciseInfo}>
                    <Text style={styles.exerciseModalTitle}>{selectedExercise.name}</Text>
                    
                    <View style={styles.exerciseMetrics}>
                      <View style={styles.metricCard}>
                        <MaterialCommunityIcons name="target" size={20} color={theme.colors.primary} />
                        <Text style={styles.metricLabel}>Músculo</Text>
                        <Text style={styles.metricValue}>{selectedExercise.target}</Text>
                      </View>
                      
                      <View style={styles.metricCard}>
                        <MaterialCommunityIcons name="dumbbell" size={20} color={theme.colors.primary} />
                        <Text style={styles.metricLabel}>Equipo</Text>
                        <Text style={styles.metricValue}>{selectedExercise.equipment}</Text>
                      </View>
                    </View>

                    {selectedExercise.secondaryMuscles && selectedExercise.secondaryMuscles.length > 0 && (
                      <View style={styles.detailSection}>
                        <Text style={styles.detailLabel}>Músculos Secundarios</Text>
                        <View style={styles.muscleChips}>
                          {selectedExercise.secondaryMuscles.map((muscle, index) => (
                            <View key={index} style={styles.muscleChip}>
                              <Text style={styles.muscleChipText}>{muscle}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}

                    <View style={styles.detailSection}>
                      <Text style={styles.detailLabel}>Instrucciones</Text>
                      <View style={styles.instructionsList}>
                        {selectedExercise.instructions.map((instruction, index) => (
                          <View key={index} style={styles.instructionItem}>
                            <View style={styles.instructionNumber}>
                              <Text style={styles.instructionNumberText}>{index + 1}</Text>
                            </View>
                            <Text style={styles.instructionText}>{instruction}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  </View>
                </ScrollView>

                <View style={styles.exerciseModalActions}>
                  <TouchableOpacity
                    style={styles.addToRoutineBtn}
                    onPress={() => {
                      addToRoutine(selectedExercise);
                      setShowExerciseModal(false);
                    }}
                  >
                    <LinearGradient
                      colors={[theme.colors.primary, '#45B7D1']}
                      style={styles.addToRoutineBtnGradient}
                    >
                      <MaterialIcons name="add" size={20} color="white" />
                      <Text style={styles.addToRoutineBtnText}>Agregar a Rutina</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  
  // Header mejorado
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  viewModeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Búsqueda mejorada
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  clearBtn: {
    padding: 4,
  },
  searchBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Categorías
  categoriesSection: {
    backgroundColor: 'white',
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.textPrimary,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
  },
  categoryCard: {
    width: 80,
    height: 80,
    marginHorizontal: 4,
    borderRadius: 16,
    overflow: 'hidden',
  },
  categoryGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  categoryText: {
    fontSize: 11,
    fontFamily: theme.typography.fontFamily.bold,
    color: 'white',
    textAlign: 'center',
  },

  // Filtros activos
  activeFilters: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexWrap: 'wrap',
    backgroundColor: 'white',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF4FF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 4,
  },
  filterChipText: {
    color: theme.colors.primary,
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.medium,
    marginRight: 4,
  },
  clearFiltersBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clearFiltersText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    textDecorationLine: 'underline',
  },

  // Ejercicios
  exercisesSection: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingTop: 16,
  },
  exercisesHeader: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  exercisesList: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },

  // Cards de ejercicios
  exerciseCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  gridCard: {
    width: (width - 48) / 2,
  },
  listCard: {
    width: '100%',
    flexDirection: 'row',
  },
  cardImageContainer: {
    height: 120,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  gridImageContainer: {
    height: 100,
  },
  exerciseImage: {
    width: '100%',
    height: '100%',
  },
  placeholderGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    padding: 12,
  },
  gridCardContent: {
    padding: 10,
  },
  exerciseName: {
    fontSize: 14,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.textPrimary,
    marginBottom: 6,
  },
  gridExerciseName: {
    fontSize: 13,
    lineHeight: 16,
  },
  exerciseMetadata: {
    marginBottom: 8,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  metadataText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginLeft: 4,
    flex: 1,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 2,
  },
  addBtnText: {
    fontSize: 10,
    color: 'white',
    fontFamily: theme.typography.fontFamily.bold,
  },

  // Estados de carga y vacío
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.textSecondary,
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },

  // Modales
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  filterModal: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  exerciseModal: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    flex: 1,
    marginTop: 80,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.textPrimary,
  },
  filterContent: {
    flex: 1,
    padding: 20,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.textPrimary,
    marginBottom: 12,
    marginTop: 20,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterOptionSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterOptionText: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    marginRight: 4,
  },
  filterOptionTextSelected: {
    color: 'white',
    fontFamily: theme.typography.fontFamily.bold,
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  clearBtn2: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  clearBtnText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily.medium,
  },
  applyBtn: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  applyBtnText: {
    fontSize: 16,
    fontFamily: theme.typography.fontFamily.bold,
    color: 'white',
  },

  // Modal de ejercicio
  exerciseModalHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    zIndex: 1,
  },
  closeModalBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteModalBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseDetails: {
    flex: 1,
  },
  exerciseImageModal: {
    height: 250,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseDetailImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  exerciseInfo: {
    padding: 20,
  },
  exerciseModalTitle: {
    fontSize: 24,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  exerciseMetrics: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  metricLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 4,
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
  detailSection: {
    marginBottom: 24,
  },
  detailLabel: {
    fontSize: 16,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.textPrimary,
    marginBottom: 12,
  },
  muscleChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  muscleChip: {
    backgroundColor: '#EBF4FF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  muscleChipText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamily.medium,
  },
  instructionsList: {
    gap: 12,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  instructionNumberText: {
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.bold,
    color: 'white',
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  exerciseModalActions: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  addToRoutineBtn: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  addToRoutineBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  addToRoutineBtnText: {
    fontSize: 16,
    fontFamily: theme.typography.fontFamily.bold,
    color: 'white',
  },
}); 