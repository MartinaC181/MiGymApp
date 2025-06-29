import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import globalStyles from '../../styles/global';
import { useTheme } from '../../context/ThemeContext';

// Fórmulas de 1RM más utilizadas
const calcularBrzycki = (peso: number, reps: number) => peso / (1.0278 - 0.0278 * reps);
const calcularEpley = (peso: number, reps: number) => peso * (1 + reps / 30);
const calcularMcGlothin = (peso: number, reps: number) => (100 * peso) / (101.3 - 2.67123 * reps);
const calcularLombardi = (peso: number, reps: number) => peso * Math.pow(reps, 0.10);

interface FormulaResult {
  name: string;
  value: number;
  description: string;
  color: string;
}

export default function CalculadoraRPM() {
  const { theme, isDarkMode } = useTheme();
  const [peso, setPeso] = useState('');
  const [repeticiones, setRepeticiones] = useState('');
  const [resultados, setResultados] = useState<FormulaResult[]>([]);
  const [promedio, setPromedio] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    calcularRPM();
  }, [peso, repeticiones]);

  const calcularRPM = () => {
    const pesoNum = parseFloat(peso);
    const repsNum = parseInt(repeticiones);

    if (!pesoNum || !repsNum || pesoNum <= 0 || repsNum <= 0 || repsNum > 20) {
      setResultados([]);
      setPromedio(0);
      return;
    }

    try {
      const resultados: FormulaResult[] = [
        {
          name: 'Brzycki',
          value: calcularBrzycki(pesoNum, repsNum),
          description: 'Fórmula más popular y precisa',
          color: theme.colors.primary
        },
        {
          name: 'Epley',
          value: calcularEpley(pesoNum, repsNum),
          description: 'Recomendada para 2-10 repeticiones',
          color: theme.colors.primaryDark
        },
        {
          name: 'McGlothin',
          value: calcularMcGlothin(pesoNum, repsNum),
          description: 'Buena para altas repeticiones',
          color: theme.colors.accent
        },
        {
          name: 'Lombardi',
          value: calcularLombardi(pesoNum, repsNum),
          description: 'Conservadora y segura',
          color: theme.colors.secondary
        }
      ];

      const promedioCalculado = resultados.reduce((sum, r) => sum + r.value, 0) / resultados.length;
      
      setResultados(resultados);
      setPromedio(promedioCalculado);
    } catch (error) {
      console.error('Error calculando 1RM:', error);
      setResultados([]);
      setPromedio(0);
    }
  };

  const generarTablaIntensidades = () => {
    if (promedio === 0) return [];
    
    const intensidades = [95, 90, 85, 80, 75, 70, 65, 60];
    return intensidades.map(intensidad => ({
      porcentaje: intensidad,
      peso: (promedio * intensidad / 100),
      repsEstimadas: intensidad >= 90 ? '1-3' : 
                   intensidad >= 80 ? '3-5' :
                   intensidad >= 70 ? '6-8' :
                   intensidad >= 60 ? '8-12' : '12+'
    }));
  };

  const limpiarCampos = () => {
    setPeso('');
    setRepeticiones('');
    setResultados([]);
    setPromedio(0);
  };

  const validarEntrada = (valor: string, tipo: 'peso' | 'reps') => {
    if (tipo === 'peso') {
      return valor.replace(/[^0-9.]/g, '');
    } else {
      return valor.replace(/[^0-9]/g, '');
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Limpiar todos los campos
    limpiarCampos();
    // Simular un pequeño delay para el efecto visual
    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.surface,
    },
    scrollContent: {
      padding: theme.spacing.lg,
      paddingBottom: 100,
    },
    header: {
      alignItems: 'center',
      marginBottom: theme.spacing.xl,
    },
    headerTitle: {
      fontSize: theme.typography.fontSize.title,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.textPrimary,
      marginTop: theme.spacing.sm,
    },
    headerSubtitle: {
      fontSize: theme.typography.fontSize.medium,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginTop: theme.spacing.xs,
    },
    inputSection: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    inputContainer: {
      marginBottom: theme.spacing.lg,
    },
    inputLabel: {
      fontSize: theme.typography.fontSize.small,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.sm,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.surface,
    },
    input: {
      flex: 1,
      height: 50,
      paddingHorizontal: theme.spacing.md,
      fontSize: theme.typography.fontSize.large,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.textPrimary,
    },
    inputUnit: {
      paddingHorizontal: theme.spacing.md,
      fontSize: theme.typography.fontSize.medium,
      color: theme.colors.textSecondary,
      fontFamily: theme.typography.fontFamily.medium,
    },
    clearButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.sm,
      gap: theme.spacing.xs,
    },
    clearButtonText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.medium,
    },
    averageSection: {
      marginBottom: theme.spacing.lg,
    },
    averageGradient: {
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.xl,
      paddingHorizontal: theme.spacing.md,
      alignItems: 'center',
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
      minHeight: 140,
    },
    averageLabel: {
      color: 'white',
      fontSize: theme.typography.fontSize.medium,
      fontFamily: theme.typography.fontFamily.medium,
      marginTop: theme.spacing.sm,
    },
    averageValue: {
      color: 'white',
      fontSize: 36,
      fontFamily: theme.typography.fontFamily.bold,
      marginTop: theme.spacing.xs,
    },
    averageNote: {
      color: 'rgba(255,255,255,0.9)',
      fontSize: theme.typography.fontSize.small,
      marginTop: theme.spacing.xs,
      textAlign: 'center',
      paddingHorizontal: 4,
      width: '100%',
      flexWrap: 'wrap',
    },
    resultsSection: {
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSize.large,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.md,
    },
    formulaCard: {
      flexDirection: 'row',
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.sm,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    formulaIndicator: {
      width: 4,
      borderTopLeftRadius: theme.borderRadius.md,
      borderBottomLeftRadius: theme.borderRadius.md,
    },
    formulaContent: {
      flex: 1,
      padding: theme.spacing.md,
    },
    formulaHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    formulaName: {
      fontSize: theme.typography.fontSize.medium,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.textPrimary,
    },
    formulaValue: {
      fontSize: theme.typography.fontSize.large,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.primary,
    },
    formulaDescription: {
      fontSize: theme.typography.fontSize.small,
      color: theme.colors.textSecondary,
    },
    intensitySection: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    intensitySubtitle: {
      fontSize: theme.typography.fontSize.small,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.md,
    },
    tableHeader: {
      flexDirection: 'row',
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.sm,
      padding: theme.spacing.sm,
      marginBottom: theme.spacing.xs,
    },
    tableHeaderText: {
      flex: 1,
      textAlign: 'center',
      color: 'white',
      fontSize: theme.typography.fontSize.small,
      fontFamily: theme.typography.fontFamily.bold,
    },
    tableRow: {
      flexDirection: 'row',
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.xs,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.surface,
    },
    tableCellBold: {
      flex: 1,
      textAlign: 'center',
      fontSize: theme.typography.fontSize.small,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.textPrimary,
    },
    tableCell: {
      flex: 1,
      textAlign: 'center',
      fontSize: theme.typography.fontSize.small,
      color: theme.colors.textSecondary,
    },
    notesSection: {
      marginBottom: theme.spacing.lg,
    },
    noteCard: {
      flexDirection: 'row',
      backgroundColor: isDarkMode ? '#2D2D00' : '#FFF3CD',
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      borderWidth: 1,
      borderColor: isDarkMode ? '#4D4D00' : '#FFE69C',
    },
    noteContent: {
      flex: 1,
      marginLeft: theme.spacing.sm,
    },
    noteTitle: {
      fontSize: theme.typography.fontSize.medium,
      fontFamily: theme.typography.fontFamily.bold,
      color: isDarkMode ? '#FFFF99' : '#856404',
      marginBottom: theme.spacing.xs,
    },
    noteText: {
      fontSize: theme.typography.fontSize.small,
      color: isDarkMode ? '#FFFF99' : '#856404',
      lineHeight: 18,
    },
    infoSection: {
      alignItems: 'center',
      padding: theme.spacing.xl,
    },
    infoTitle: {
      fontSize: theme.typography.fontSize.large,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.textPrimary,
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      textAlign: 'center',
    },
    infoText: {
      fontSize: theme.typography.fontSize.medium,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
            title="Limpiando calculadora..."
            titleColor={theme.colors.textSecondary}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <MaterialCommunityIcons name="calculator" size={32} color={theme.colors.primary} />
          <Text style={styles.headerTitle}>Calculadora 1RM</Text>
          <Text style={styles.headerSubtitle}>
            Calcula tu repetición máxima estimada
          </Text>
        </View>

        {/* Inputs */}
        <View style={styles.inputSection}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>PESO LEVANTADO (kg)</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={peso}
                onChangeText={(text) => setPeso(validarEntrada(text, 'peso'))}
                placeholder="Ej: 80"
                placeholderTextColor="#999"
                keyboardType="decimal-pad"
                maxLength={6}
              />
              <Text style={styles.inputUnit}>kg</Text>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>REPETICIONES REALIZADAS</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={repeticiones}
                onChangeText={(text) => setRepeticiones(validarEntrada(text, 'reps'))}
                placeholder="Ej: 8"
                placeholderTextColor="#999"
                keyboardType="number-pad"
                maxLength={2}
              />
              <Text style={styles.inputUnit}>reps</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.clearButton} onPress={limpiarCampos}>
            <MaterialIcons name="clear" size={20} color={theme.colors.textSecondary} />
            <Text style={styles.clearButtonText}>Limpiar</Text>
          </TouchableOpacity>
        </View>

        {/* Resultados */}
        {resultados.length > 0 && (
          <>
            {/* Promedio destacado */}
            <View style={styles.averageSection}>
              <LinearGradient
                colors={theme.colors.gradient1}
                style={styles.averageGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <MaterialCommunityIcons name="trophy" size={28} color="white" />
                <Text style={styles.averageLabel}>Tu 1RM Estimado</Text>
                <Text style={styles.averageValue}>
                  {promedio.toFixed(1)} kg
                </Text>
                <Text style={styles.averageNote}>
                  (Promedio de 4 fórmulas)
                </Text>
              </LinearGradient>
            </View>

            {/* Resultados por fórmula */}
            <View style={styles.resultsSection}>
              <Text style={styles.sectionTitle}>Resultados por Fórmula</Text>
              {resultados.map((resultado, index) => (
                <View key={index} style={styles.formulaCard}>
                  <View 
                    style={[styles.formulaIndicator, { backgroundColor: resultado.color }]}
                  />
                  <View style={styles.formulaContent}>
                    <View style={styles.formulaHeader}>
                      <Text style={styles.formulaName}>{resultado.name}</Text>
                      <Text style={styles.formulaValue}>
                        {resultado.value.toFixed(1)} kg
                      </Text>
                    </View>
                    <Text style={styles.formulaDescription}>
                      {resultado.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Tabla de intensidades */}
            <View style={styles.intensitySection}>
              <Text style={styles.sectionTitle}>Tabla de Intensidades</Text>
              <Text style={styles.intensitySubtitle}>
                Pesos recomendados según porcentaje de 1RM
              </Text>
              
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>%</Text>
                <Text style={styles.tableHeaderText}>Peso (kg)</Text>
                <Text style={styles.tableHeaderText}>Reps</Text>
              </View>

              {generarTablaIntensidades().map((fila, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCellBold}>{fila.porcentaje}%</Text>
                  <Text style={styles.tableCell}>{fila.peso.toFixed(1)}</Text>
                  <Text style={styles.tableCell}>{fila.repsEstimadas}</Text>
                </View>
              ))}
            </View>

            {/* Notas importantes */}
            <View style={styles.notesSection}>
              <View style={styles.noteCard}>
                <MaterialIcons name="info" size={20} color={theme.colors.primary} />
                <View style={styles.noteContent}>
                  <Text style={styles.noteTitle}>Notas Importantes</Text>
                  <Text style={styles.noteText}>
                    • Estos son valores estimados, no reales{'\n'}
                    • Válido para 1-20 repeticiones{'\n'}
                    • Siempre usa un spotter para cargas altas{'\n'}
                    • Calienta adecuadamente antes de probar
                  </Text>
                </View>
              </View>
            </View>
          </>
        )}

        {/* Información inicial */}
        {resultados.length === 0 && (
          <View style={styles.infoSection}>
            <MaterialCommunityIcons 
              name="information-outline" 
              size={48} 
              color={theme.colors.textSecondary} 
            />
            <Text style={styles.infoTitle}>¿Cómo usar la calculadora?</Text>
            <Text style={styles.infoText}>
              1. Ingresa el peso que levantaste{'\n'}
              2. Ingresa las repeticiones que hiciste{'\n'}
              3. Obtendrás tu 1RM estimado con múltiples fórmulas{'\n'}
              4. Usa la tabla de intensidades para planificar entrenamientos
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
} 