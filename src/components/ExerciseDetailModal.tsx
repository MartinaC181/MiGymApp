import React, { useEffect, useState } from 'react'
import { Modal, View, Text, TouchableOpacity, ScrollView, Image, StyleSheet, ActivityIndicator } from 'react-native'
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { Exercise } from '../utils/ExerciseAPI'
import { translateText } from '../utils/translator'
import { useTheme } from '../context/ThemeContext'

interface ExerciseDetailModalProps {
  visible: boolean
  exercise: Exercise | null
  onClose: () => void
  onAddToRoutine?: (exercise: Exercise) => void
  favoriteExercises?: string[]
  onToggleFavorite?: (id: string) => void
}

const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
  visible,
  exercise,
  onClose,
  onAddToRoutine,
  favoriteExercises = [],
  onToggleFavorite
}) => {
  const { theme, isDarkMode } = useTheme ? useTheme() : { theme: { colors: { primary: '#007AFF', card: '#fff', border: '#eee', textPrimary: '#222', textSecondary: '#888', gradient1: ['#007AFF', '#00C6FF'] }, typography: { fontFamily: { bold: 'System', medium: 'System', regular: 'System' } } }, isDarkMode: false }
  const [translatedInstructions, setTranslatedInstructions] = useState<string[] | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let isMounted = true
    const translate = async () => {
      if (exercise?.instructions?.length) {
        setLoading(true)
        try {
          const translated = await Promise.all(
            exercise.instructions.map(i => translateText(i))
          )
          if (isMounted) setTranslatedInstructions(translated)
        } catch {
          if (isMounted) setTranslatedInstructions(exercise.instructions)
        } finally {
          if (isMounted) setLoading(false)
        }
      } else {
        setTranslatedInstructions([])
      }
    }
    if (visible && exercise) translate()
    else setTranslatedInstructions(null)
    return () => { isMounted = false }
  }, [visible, exercise])

  if (!exercise) return null

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles(theme).modalOverlay}>
        <View style={styles(theme).exerciseModal}>
          <View style={styles(theme).exerciseModalHeader}>
            <TouchableOpacity onPress={onClose} style={styles(theme).closeModalBtn}>
              <MaterialIcons name="close" size={24} color="white" />
            </TouchableOpacity>
            {onToggleFavorite && (
              <TouchableOpacity style={styles(theme).favoriteModalBtn} onPress={() => onToggleFavorite(exercise.id)}>
                <MaterialIcons name={favoriteExercises.includes(exercise.id) ? 'favorite' : 'favorite-border'} size={24} color={favoriteExercises.includes(exercise.id) ? '#FF6B6B' : 'white'} />
              </TouchableOpacity>
            )}
          </View>
          <ScrollView style={styles(theme).exerciseDetails} showsVerticalScrollIndicator={false}>
            {exercise.gifUrl && (
              <View style={styles(theme).exerciseImageModal}>
                <Image source={{ uri: exercise.gifUrl }} style={styles(theme).exerciseDetailImage} />
              </View>
            )}
            <View style={styles(theme).exerciseInfo}>
              <Text style={styles(theme).exerciseModalTitle}>{exercise.name}</Text>
              <View style={styles(theme).exerciseMetrics}>
                <View style={styles(theme).metricCard}>
                  <MaterialCommunityIcons name="target" size={20} color={theme.colors.primary} />
                  <Text style={styles(theme).metricLabel}>Músculo</Text>
                  <Text style={styles(theme).metricValue}>{exercise.target}</Text>
                </View>
                <View style={styles(theme).metricCard}>
                  <MaterialCommunityIcons name="dumbbell" size={20} color={theme.colors.primary} />
                  <Text style={styles(theme).metricLabel}>Equipo</Text>
                  <Text style={styles(theme).metricValue}>{exercise.equipment}</Text>
                </View>
              </View>
              {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 && (
                <View style={styles(theme).detailSection}>
                  <Text style={styles(theme).detailLabel}>Músculos Secundarios</Text>
                  <View style={styles(theme).muscleChips}>
                    {exercise.secondaryMuscles.map((muscle, index) => (
                      <View key={index} style={styles(theme).muscleChip}>
                        <Text style={styles(theme).muscleChipText}>{muscle}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
              <View style={styles(theme).detailSection}>
                <Text style={styles(theme).detailLabel}>Instrucciones</Text>
                {loading ? (
                  <ActivityIndicator size="small" color={theme.colors.primary} style={{ marginVertical: 16 }} />
                ) : (
                  <View style={styles(theme).instructionsList}>
                    {(translatedInstructions || []).map((instruction, index) => (
                      <View key={index} style={styles(theme).instructionItem}>
                        <View style={styles(theme).instructionNumber}>
                          <Text style={styles(theme).instructionNumberText}>{index + 1}</Text>
                        </View>
                        <Text style={styles(theme).instructionText}>{instruction}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </View>
          </ScrollView>
          {/*
          <TouchableOpacity style={styles(theme).addToRoutineBtn} onPress={() => onAddToRoutine(exercise)}>
            <LinearGradient 
              colors={
                Array.isArray(theme.colors.gradient1) && theme.colors.gradient1.length >= 2
                  ? (theme.colors.gradient1 as [string, string, ...string[]])
                  : ['#007AFF', '#00C6FF']
              }
              style={styles(theme).addToRoutineBtnGradient}
            >
              <MaterialIcons name="add" size={20} color="white" />
              <Text style={styles(theme).addToRoutineBtnText}>Agregar a Rutina</Text>
            </LinearGradient>
          </TouchableOpacity>
          */}
        </View>
      </View>
    </Modal>
  )
}

const styles = (theme: any) => StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  exerciseModal: {
    backgroundColor: theme.colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    flex: 1,
    marginTop: 80,
  },
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
    backgroundColor: theme.colors.background,
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
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
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
    backgroundColor: theme.colors.primary + '22',
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
    borderTopColor: theme.colors.border,
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
})

export default ExerciseDetailModal 