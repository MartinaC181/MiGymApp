import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { 
  getCurrentUser, 
  getUserClasses, 
  saveUserClasses,
  getClientEnrolledClassesWithDetails,
  cancelEnrollment
} from '../utils/storage';
import { useRouter } from 'expo-router';

interface Clase {
  id: number | string;
  nombre: string;
  imagen: string;
  [key: string]: any;
}

const MisClases: React.FC = () => {
  const { theme, isDarkMode } = useTheme();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [clases, setClases] = useState<Clase[]>([]);
  const [animation] = useState(new Animated.Value(0));
  const [rotateAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    const cargarClases = async () => {
      try {
        const user = await getCurrentUser();
        if (user && user.role === 'client') {
          // Cargar clases usando el nuevo sistema de inscripciones
          const enrolledClasses = await getClientEnrolledClassesWithDetails(user.id);
          
          // Mantener compatibilidad con el sistema anterior
          const legacyClasses = await getUserClasses(user.id);
          
          // Combinar ambos sistemas y eliminar duplicados
          const allClasses = [...enrolledClasses, ...legacyClasses];
          const uniqueClasses = allClasses.filter((clase, index, self) => 
            index === self.findIndex(c => c.id === clase.id || c.claseId === clase.claseId)
          );
          
          setClases(uniqueClasses);
        }
      } catch (error) {
        console.error('Error cargando clases:', error);
      }
    };
    cargarClases();
  }, []);

  const toggleExpanded = () => {
    const toValue = isExpanded ? 0 : 1;
    
    Animated.parallel([
      Animated.timing(animation, {
        toValue,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(rotateAnimation, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
    
    setIsExpanded(!isExpanded);
  };

  const expandedHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, clases.length > 0 ? clases.length * 70 + 60 : 210],
  });

  const rotateIcon = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const darseDeBaja = async (claseId: number | string) => {
    try {
      const user = await getCurrentUser();
      if (!user || user.role !== 'client') return;
      
      // Encontrar la clase para obtener el gymId
      const clase = clases.find(c => c.id === claseId || c.claseId === claseId);
      const gymId = clase?.gymId || clase?.enrollmentInfo?.gymId || (user as any).gymId;
      
      if (gymId) {
        // Cancelar inscripción usando el nuevo sistema
        const result = await cancelEnrollment(user.id, Number(claseId), gymId);
        if (result.success) {
          console.log('Inscripción cancelada exitosamente');
        }
      }
      
      // Mantener compatibilidad con el sistema anterior
      const filtradas = clases.filter(c => c.claseId !== claseId && c.id !== claseId);
      await saveUserClasses(user.id, filtradas);
      setClases(filtradas);
      
    } catch (error) {
      console.error('Error al darse de baja:', error);
    }
  };

  const confirmarBaja = (claseId: number | string) => {
    Alert.alert('Confirmar', '¿Deseas darte de baja de esta clase?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sí', style: 'destructive', onPress: () => darseDeBaja(claseId) },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Botón principal */}
      <TouchableOpacity
        activeOpacity={0.9}
        style={[styles.mainButton, { 
          borderBottomLeftRadius: isExpanded ? 0 : 16, 
          borderBottomRightRadius: isExpanded ? 0 : 16 
        }]}
        onPress={toggleExpanded}
      >
        {/* Gradiente de fondo */}
        <LinearGradient
          colors={isDarkMode ? ['#10344A', '#0C2434'] : ['#b3dcec', '#EAF7FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFillObject as any}
        />
        
        <View style={styles.buttonContent}>
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary }]}>
            <MaterialIcons name="class" size={24} color="white" />
          </View>
          
          <View style={styles.textContainer}>
            <Text style={[styles.buttonTitle, { color: theme.colors.textPrimary }]}>
              Mis clases
            </Text>
            <Text style={[styles.buttonDescription, { color: theme.colors.textSecondary }]}>
              {clases.length > 0 
                ? `${clases.length} clase${clases.length > 1 ? 's' : ''} inscrita${clases.length > 1 ? 's' : ''}`
                : 'Aquí aparecen las clases cuando te inscribas'
              }
            </Text>
          </View>
          
          <Animated.View style={[styles.arrowContainer, { transform: [{ rotate: rotateIcon }] }]}>
            <MaterialIcons 
              name="keyboard-arrow-down" 
              size={24} 
              color={theme.colors.textSecondary}
            />
          </Animated.View>
        </View>
      </TouchableOpacity>

      <Animated.View style={[styles.expandedContainer, { height: expandedHeight }]}>
        <View style={[styles.expandedContent, { 
          backgroundColor: isDarkMode ? '#2A2A2A' : theme.colors.background,
          borderColor: isDarkMode ? '#333' : '#D9D9D9',
          borderWidth: 1,
          borderTopWidth: 0,
        }]}>
          {clases.length > 0 ? (
            <View style={styles.clasesListContainer}>
              {clases.map((clase, index) => (
                <View 
                  key={`${clase.id}-${index}`} 
                  style={[styles.claseItem, { 
                    borderBottomColor: isDarkMode ? '#333' : '#E1F3FF',
                    borderBottomWidth: index < clases.length - 1 ? 1 : 0,
                    backgroundColor: isDarkMode ? '#222' : 'white',
                  }]}
                >
                  <TouchableOpacity 
                    style={styles.claseInfo} 
                    onPress={() => {
                      const classIdParam = (clase.claseId ?? clase.id).toString();
                      const nombreParam = clase.nombre || clase.nombreClase;
                      const imagenParam = clase.imagen ?? undefined;
                      router.push({ pathname: '/clases', params: { id: classIdParam, nombre: nombreParam, imagen: imagenParam } });
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.claseIconContainer, { backgroundColor: isDarkMode ? '#00BFFF20' : '#00BFFF10' }]}>
                      <MaterialIcons 
                        name="fitness-center" 
                        size={20} 
                        color={theme.colors.primary} 
                      />
                    </View>
                    <View style={styles.claseDetailsContainer}>
                      <Text style={[styles.claseNombre, { color: theme.colors.textPrimary }]}>
                        {clase.nombre || clase.nombreClase || 'Clase'}
                      </Text>
                      <Text style={[styles.claseHorario, { color: theme.colors.textSecondary }]}>
                        {(() => {
                          // 1) Horarios seleccionados por el usuario en la inscripción
                          const inscritos = clase.enrollmentInfo?.scheduleInfo?.horarios;
                          if (inscritos && inscritos.length > 0) {
                            return inscritos.join(', ');
                          }
                          // 2) Si la clase tiene array simple de strings
                          if (Array.isArray(clase.horarios) && typeof clase.horarios[0] === 'string') {
                            return clase.horarios.join(', ');
                          }
                          // 3) Si la clase tiene array de objetos {dia, horas}
                          if (Array.isArray(clase.horarios) && typeof clase.horarios[0] === 'object') {
                            const primera = clase.horarios[0];
                            // Mostrar primer día y primer horario a modo resumen
                            return `${primera.dia}-${primera.horas?.[0] || ''}`;
                          }
                          return 'Horarios no definidos';
                        })()}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.deleteButton, { backgroundColor: theme.colors.surface }]}
                    onPress={() => confirmarBaja(clase.claseId)}
                    activeOpacity={0.7}
                  >
                    <MaterialIcons 
                      name="delete-outline" 
                      size={22} 
                      color={theme.colors.textSecondary} 
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <View style={[styles.emptyIconContainer, { 
                backgroundColor: isDarkMode ? '#00BFFF15' : '#00BFFF08'
              }]}>
                <MaterialIcons 
                  name="event-available" 
                  size={32} 
                  color={isDarkMode ? '#00BFFF80' : '#00BFFF60'} 
                />
              </View>
              <Text style={[styles.emptyTitle, { color: theme.colors.textPrimary }]}>
                No hay clases inscritas
              </Text>
              <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                Explorá nuestras clases disponibles{'\n'}y comenzá tu entrenamiento
              </Text>
            </View>
          )}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 24,
    marginBottom: 16,
  },
  mainButton: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: 85,
  },
  buttonContent: {
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
  buttonTitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    marginBottom: 2,
  },
  buttonDescription: {
    fontSize: 13,
    fontFamily: 'Roboto-Regular',
    lineHeight: 16,
  },
  arrowContainer: {
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expandedContainer: {
    overflow: 'hidden',
  },
  expandedContent: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  clasesListContainer: {
    padding: 20,
  },
  claseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    borderRadius: 12,
    marginBottom: 8,
  },
  claseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  claseIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  claseDetailsContainer: {
    flex: 1,
  },
  claseNombre: {
    fontSize: 15,
    fontFamily: 'Roboto-Medium',
    marginBottom: 2,
  },
  claseHorario: {
    fontSize: 13,
    fontFamily: 'Roboto-Regular',
    lineHeight: 16,
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  emptyIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
});

export default MisClases; 