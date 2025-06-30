import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing, ScrollView, Dimensions } from "react-native";
import { createGlobalStyles } from "../styles/global";
import { useTheme } from "../context/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { saveStopwatchState, loadStopwatchState, clearStopwatchState, StopwatchState } from "../utils/storage";

const formatTime = (value: number) => value.toString().padStart(2, "0");
const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const Stopwatch: React.FC = () => {
  const { theme, isDarkMode } = useTheme();
  const globalStyles = createGlobalStyles(theme);
  
  const [centiseconds, setCentiseconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Animación para el pulso cuando está corriendo
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Cargar estado guardado al montar el componente
  useEffect(() => {
    const loadSavedState = async () => {
      try {
        const savedState = await loadStopwatchState();
        if (savedState) {
          setCentiseconds(savedState.centiseconds);
          setIsRunning(savedState.isRunning);
          setLaps(savedState.laps);
        }
      } catch (error) {
        console.error('Error loading stopwatch state:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadSavedState();
  }, []);

  // Guardar estado cuando cambie (solo si ya se cargó)
  useEffect(() => {
    if (!isLoaded) return;

    const currentState: StopwatchState = {
      centiseconds,
      isRunning,
      laps,
    };

    saveStopwatchState(currentState);
  }, [centiseconds, isRunning, laps, isLoaded]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setCentiseconds((prev) => prev + 1);
      }, 10); // Actualizar cada centésima de segundo
      
      // Animación de pulso
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      pulseAnim.setValue(1);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, pulseAnim]);

  const handlePlayPause = () => {
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    setCentiseconds(0);
    setIsRunning(false);
    setLaps([]);
  };

  const handleLap = () => {
    if (isRunning) {
      setLaps(prev => [centiseconds, ...prev]);
    }
  };

  // Calcular el tiempo de la última vuelta
  const getLastLapTime = () => {
    if (laps.length === 0) return 0;
    const lastLapTotal = laps[0];
    const previousLapTotal = laps.length > 1 ? laps[1] : 0;
    return lastLapTotal - previousLapTotal;
  };

  // Convertir centésimas a formato tiempo
  const formatStopwatchTime = (cs: number) => {
    const minutes = Math.floor(cs / 6000);
    const seconds = Math.floor((cs % 6000) / 100);
    const centis = cs % 100;
    
    return `${formatTime(minutes)}:${formatTime(seconds)}.${formatTime(centis)}`;
  };

  // Estilos dinámicos basados en el tema
  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingHorizontal: 16,
      paddingTop: 40,
    },
    timeDisplayContainer: {
      alignItems: 'center',
      marginBottom: 40,
      marginTop: 20,
    },
    mainTime: {
      fontSize: 64,
      color: theme.colors.textPrimary,
      fontWeight: '300',
      fontFamily: 'monospace',
      textAlign: 'center',
    },
    lastLapTime: {
      fontSize: 20,
      color: theme.colors.textSecondary,
      fontFamily: 'monospace',
      fontWeight: '300',
      marginTop: 8,
      textAlign: 'center',
    },
    buttonsContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginBottom: 40,
      gap: 16,
    },
    button: {
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
      minWidth: 100,
      alignItems: 'center',
      justifyContent: 'center',
    },
    parcialButton: {
      backgroundColor: '#2196F3',
    },
    detenerButton: {
      backgroundColor: '#F44336',
    },
    iniciarButton: {
      backgroundColor: '#4CAF50',
    },
    disabledButton: {
      backgroundColor: '#9E9E9E',
      opacity: 0.6,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
    tableContainer: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      overflow: 'hidden',
    },
    tableHeader: {
      flexDirection: 'row',
      backgroundColor: isDarkMode ? '#333333' : '#F5F5F5',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerCell: {
      flex: 1,
      alignItems: 'center',
    },
    headerCellVuelta: {
      width: 60,
      alignItems: 'center',
    },
    headerText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    tableContent: {
      flex: 1,
    },
    lapRow: {
      flexDirection: 'row',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      alignItems: 'center',
    },
    lapCell: {
      flex: 1,
      alignItems: 'center',
    },
    lapCellVuelta: {
      width: 60,
      alignItems: 'center',
    },
    lapNumber: {
      fontSize: 16,
      color: theme.colors.textPrimary,
      fontWeight: '500',
      textAlign: 'center',
    },
    lapTime: {
      fontSize: 16,
      color: theme.colors.textPrimary,
      fontFamily: 'monospace',
      textAlign: 'center',
    },
    totalTime: {
      fontSize: 16,
      color: theme.colors.textPrimary,
      fontFamily: 'monospace',
      textAlign: 'center',
    },
    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 40,
    },
    emptyText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
  });

  return (
    <View style={dynamicStyles.container}>
      {/* Tiempo principal */}
      <View style={dynamicStyles.timeDisplayContainer}>
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <Text style={dynamicStyles.mainTime}>
            {formatStopwatchTime(centiseconds)}
          </Text>
        </Animated.View>
        {laps.length > 0 && (
          <Text style={dynamicStyles.lastLapTime}>
            {formatStopwatchTime(getLastLapTime())}
          </Text>
        )}
      </View>

      {/* Botones */}
      <View style={dynamicStyles.buttonsContainer}>
        <TouchableOpacity
          style={[
            dynamicStyles.button,
            !isRunning ? dynamicStyles.disabledButton : dynamicStyles.parcialButton
          ]}
          onPress={handleLap}
          disabled={!isRunning}
        >
          <Text style={dynamicStyles.buttonText}>Parcial</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            dynamicStyles.button,
            isRunning ? dynamicStyles.detenerButton : dynamicStyles.iniciarButton
          ]}
          onPress={isRunning ? handleReset : handlePlayPause}
        >
          <Text style={dynamicStyles.buttonText}>
            {isRunning ? "Detener" : "Iniciar"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tabla de vueltas */}
      <View style={dynamicStyles.tableContainer}>
        <View style={dynamicStyles.tableHeader}>
          <View style={dynamicStyles.headerCellVuelta}>
            <Text style={dynamicStyles.headerText}>Vuelta</Text>
          </View>
          <View style={dynamicStyles.headerCell}>
            <Text style={dynamicStyles.headerText}>Tiempos parciales</Text>
          </View>
          <View style={dynamicStyles.headerCell}>
            <Text style={dynamicStyles.headerText}>Tiempo total</Text>
          </View>
        </View>
        
        <ScrollView 
          style={dynamicStyles.tableContent} 
          showsVerticalScrollIndicator={false}
        >
          {laps.length > 0 ? (
            laps.map((lapTime, index) => {
              const lapNumber = laps.length - index;
              const previousLapTime = index < laps.length - 1 ? laps[index + 1] : 0;
              const lapDuration = lapTime - previousLapTime;
              
              return (
                <View key={index} style={dynamicStyles.lapRow}>
                  <View style={dynamicStyles.lapCellVuelta}>
                    <Text style={dynamicStyles.lapNumber}>
                      {formatTime(lapNumber)}
                    </Text>
                  </View>
                  <View style={dynamicStyles.lapCell}>
                    <Text style={dynamicStyles.lapTime}>
                      {formatStopwatchTime(lapDuration)}
                    </Text>
                  </View>
                  <View style={dynamicStyles.lapCell}>
                    <Text style={dynamicStyles.totalTime}>
                      {formatStopwatchTime(lapTime)}
                    </Text>
                  </View>
                </View>
              );
            })
          ) : (
            <View style={dynamicStyles.emptyState}>
              <Text style={dynamicStyles.emptyText}>
                Presiona "Parcial" durante la carrera para registrar vueltas
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default Stopwatch; 