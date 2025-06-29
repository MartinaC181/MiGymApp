import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing } from "react-native";
import globalStyles from "../styles/global";
import { useTheme } from "../context/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { saveStopwatchState, loadStopwatchState, clearStopwatchState, StopwatchState } from "../utils/storage";

const formatTime = (value: number) => value.toString().padStart(2, "0");

const Stopwatch: React.FC = () => {
  const { theme, isDarkMode } = useTheme();
  
  const [centiseconds, setCentiseconds] = useState(0); // Para precisión de centésimas
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
  const totalCentiseconds = centiseconds;
  const hours = Math.floor(totalCentiseconds / 360000);
  const minutes = Math.floor((totalCentiseconds % 360000) / 6000);
  const seconds = Math.floor((totalCentiseconds % 6000) / 100);
  const centis = totalCentiseconds % 100;

  const formatStopwatchTime = (cs: number) => {
    const h = Math.floor(cs / 360000);
    const m = Math.floor((cs % 360000) / 6000);
    const s = Math.floor((cs % 6000) / 100);
    const c = cs % 100;
    
    if (h > 0) {
      return `${formatTime(h)}:${formatTime(m)}:${formatTime(s)}.${formatTime(c)}`;
    } else {
      return `${formatTime(m)}:${formatTime(s)}.${formatTime(c)}`;
    }
  };

  // Estilos dinámicos basados en el tema
  const dynamicStyles = StyleSheet.create({
    stopwatchContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: theme.spacing.lg,
    },
    timeDisplay: {
      alignItems: 'center',
      marginBottom: theme.spacing.xl,
      marginTop: theme.spacing.xl,
    },
    stopwatchText: {
      fontSize: 72,
      color: theme.colors.textPrimary,
      fontWeight: '300',
      fontFamily: 'monospace',
    },
    lastLapText: {
      fontSize: 32,
      color: theme.colors.textSecondary,
      fontFamily: 'monospace',
      fontWeight: '300',
      marginTop: theme.spacing.sm,
    },
    buttonRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: theme.spacing.xl,
      paddingHorizontal: theme.spacing.xl,
    },
    roundButton: {
      width: 80,
      height: 80,
      borderRadius: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
    },
    lapButton: {
      backgroundColor: isDarkMode ? theme.colors.surface : '#f0f0f0',
      borderColor: isDarkMode ? theme.colors.border : '#ccc',
    },
    stopButton: {
      backgroundColor: '#ff3b30',
      borderColor: '#ff3b30',
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '500',
    },
    lapButtonText: {
      color: theme.colors.textPrimary,
    },
    stopButtonText: {
      color: 'white',
    },
    lapsContainer: {
      flex: 1,
    },
    tableHeader: {
      flexDirection: 'row',
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? theme.colors.border : '#e0e0e0',
      marginBottom: theme.spacing.sm,
    },
    headerCell: {
      flex: 1,
      alignItems: 'center',
    },
    headerText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.textSecondary,
    },
    lapRow: {
      flexDirection: 'row',
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: 0.5,
      borderBottomColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    },
    lapCell: {
      flex: 1,
      alignItems: 'center',
    },
    lapNumber: {
      fontSize: 16,
      color: theme.colors.textPrimary,
      fontWeight: '500',
    },
    lapTime: {
      fontSize: 16,
      color: theme.colors.textPrimary,
      fontFamily: 'monospace',
    },
    totalTime: {
      fontSize: 16,
      color: theme.colors.textPrimary,
      fontFamily: 'monospace',
    },
  });

  return (
    <View style={dynamicStyles.stopwatchContainer}>
      <View style={dynamicStyles.timeDisplay}>
        <Text style={dynamicStyles.stopwatchText}>
          {formatStopwatchTime(centiseconds)}
        </Text>
        {laps.length > 0 && (
          <Text style={dynamicStyles.lastLapText}>
            {formatStopwatchTime(getLastLapTime())}
          </Text>
        )}
      </View>

      <View style={dynamicStyles.buttonRow}>
        <TouchableOpacity
          style={[dynamicStyles.roundButton, dynamicStyles.lapButton]}
          onPress={handleLap}
          disabled={!isRunning}
        >
          <Text style={[dynamicStyles.buttonText, dynamicStyles.lapButtonText]}>
            Parcial
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[dynamicStyles.roundButton, isRunning ? dynamicStyles.stopButton : dynamicStyles.lapButton]}
          onPress={isRunning ? handleReset : handlePlayPause}
        >
          <Text style={[dynamicStyles.buttonText, isRunning ? dynamicStyles.stopButtonText : dynamicStyles.lapButtonText]}>
            {isRunning ? "Detener" : "Iniciar"}
          </Text>
        </TouchableOpacity>
      </View>

      {laps.length > 0 && (
        <View style={dynamicStyles.lapsContainer}>
          <View style={dynamicStyles.tableHeader}>
            <View style={dynamicStyles.headerCell}>
              <Text style={dynamicStyles.headerText}>Vuelta</Text>
            </View>
            <View style={dynamicStyles.headerCell}>
              <Text style={dynamicStyles.headerText}>Tiempos parciales</Text>
            </View>
            <View style={dynamicStyles.headerCell}>
              <Text style={dynamicStyles.headerText}>Tiempo total</Text>
            </View>
          </View>
          
          {laps.slice(0, 6).map((lapTime, index) => {
            const lapNumber = laps.length - index;
            const previousLapTime = index < laps.length - 1 ? laps[index + 1] : 0;
            const lapDuration = lapTime - previousLapTime;
            
            return (
              <View key={index} style={dynamicStyles.lapRow}>
                <View style={dynamicStyles.lapCell}>
                  <Text style={dynamicStyles.lapNumber}>{lapNumber.toString().padStart(2, '0')}</Text>
                </View>
                <View style={dynamicStyles.lapCell}>
                  <Text style={dynamicStyles.lapTime}>{formatStopwatchTime(lapDuration)}</Text>
                </View>
                <View style={dynamicStyles.lapCell}>
                  <Text style={dynamicStyles.totalTime}>{formatStopwatchTime(lapTime)}</Text>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default Stopwatch; 