import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Vibration, StyleSheet, TextInput, Modal, Animated, Easing } from "react-native";
import globalStyles from "../styles/global";
import { useTheme } from "../context/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface TimerProps {
  initialHours?: number;
  initialMinutes?: number;
  initialSeconds?: number;
}

const formatTime = (value: number) => value.toString().padStart(2, "0");

const Timer: React.FC<TimerProps> = ({
  initialHours = 0,
  initialMinutes = 1,
  initialSeconds = 0,
}) => {
  const { theme, isDarkMode } = useTheme();
  
  const [secondsLeft, setSecondsLeft] = useState(
    initialHours * 3600 + initialMinutes * 60 + initialSeconds
  );
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Estados para los inputs
  const [inputHours, setInputHours] = useState(initialHours.toString());
  const [inputMinutes, setInputMinutes] = useState(initialMinutes.toString());
  const [inputSeconds, setInputSeconds] = useState(initialSeconds.toString());

  // Nuevo estado para guardar el valor seteado por el usuario
  const [customInitialSeconds, setCustomInitialSeconds] = useState(
    initialHours * 3600 + initialMinutes * 60 + initialSeconds
  );

  // Estado y animación para el modal de finalización
  const [showModal, setShowModal] = useState(false);
  const flashAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  useEffect(() => {
    if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
      setIsFinished(true);
      Vibration.vibrate(1000);
    }
  }, [secondsLeft, isRunning]);

  // Actualiza el tiempo cuando cambian los inputs y el timer no está corriendo
  useEffect(() => {
    if (!isRunning && !isFinished) {
      const h = Math.max(0, parseInt(inputHours) || 0);
      const m = Math.max(0, Math.min(59, parseInt(inputMinutes) || 0));
      const s = Math.max(0, Math.min(59, parseInt(inputSeconds) || 0));
      setSecondsLeft(h * 3600 + m * 60 + s);
      setCustomInitialSeconds(h * 3600 + m * 60 + s); // Actualiza el valor personalizado
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputHours, inputMinutes, inputSeconds]);

  // Guardar el valor seteado justo antes de iniciar
  const handlePauseResume = () => {
    if (isFinished) return;
    if (!isRunning) {
      // Guardar el valor actual solo cuando se inicia
      setCustomInitialSeconds(secondsLeft);
    }
    setIsRunning((prev) => !prev);
  };

  const handleRestart = () => {
    setSecondsLeft(customInitialSeconds);
    setIsRunning(false);
    setIsFinished(false);
  };

  // Mostrar modal y animar destello al finalizar
  useEffect(() => {
    if (isFinished) {
      setShowModal(true);
      Animated.loop(
        Animated.sequence([
          Animated.timing(flashAnim, {
            toValue: 1,
            duration: 300,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
          Animated.timing(flashAnim, {
            toValue: 0,
            duration: 300,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
        ])
      ).start();
    } else {
      setShowModal(false);
      flashAnim.setValue(0);
    }
  }, [isFinished]);

  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  // Estilos dinámicos basados en el tema
  const dynamicStyles = StyleSheet.create({
    timerContainer: {
      justifyContent: "center",
      alignItems: "center",
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.background,
      borderRadius: 16,
      borderWidth: isDarkMode ? 1 : 0,
      borderColor: isDarkMode ? theme.colors.border : 'transparent',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: isDarkMode ? 4 : 1 },
      shadowOpacity: isDarkMode ? 0.3 : 0.05,
      shadowRadius: isDarkMode ? 8 : 3,
      elevation: isDarkMode ? 8 : 2,
    },
    timerText: {
      fontSize: 48,
      marginBottom: theme.spacing.lg,
      color: theme.colors.primary,
      fontWeight: 'bold',
      textShadowColor: isDarkMode ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.05)',
      textShadowOffset: { width: 0, height: isDarkMode ? 2 : 0 },
      textShadowRadius: isDarkMode ? 4 : 1,
    },
    finishedText: {
      color: theme.colors.error,
      textShadowColor: isDarkMode ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.05)',
      textShadowOffset: { width: 0, height: isDarkMode ? 2 : 0 },
      textShadowRadius: isDarkMode ? 4 : 1,
    },
    alarmText: {
      color: theme.colors.error,
      fontSize: 18,
      marginBottom: theme.spacing.md,
      fontWeight: "bold",
      textShadowColor: isDarkMode ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.05)',
      textShadowOffset: { width: 0, height: isDarkMode ? 2 : 0 },
      textShadowRadius: isDarkMode ? 4 : 1,
    },
    buttonRow: {
      flexDirection: "row",
      marginTop: theme.spacing.lg,
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      gap: undefined,
    },
    timerButton: {
      minWidth: 100,
      maxWidth: 120,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 8,
      marginRight: 8,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: isDarkMode ? 3 : 1 },
      shadowOpacity: isDarkMode ? 0.4 : 0.1,
      shadowRadius: isDarkMode ? 6 : 3,
      elevation: isDarkMode ? 6 : 2,
    },
    inputRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
      backgroundColor: isDarkMode ? theme.colors.surface : 'transparent',
      borderRadius: isDarkMode ? 12 : 0,
      padding: isDarkMode ? theme.spacing.md : 0,
      borderWidth: 0,
      borderColor: 'transparent',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: isDarkMode ? 2 : 0 },
      shadowOpacity: isDarkMode ? 0.2 : 0,
      shadowRadius: isDarkMode ? 4 : 0,
      elevation: isDarkMode ? 4 : 0,
    },
    inputContainer: {
      alignItems: 'center',
      marginHorizontal: theme.spacing.sm,
      flex: 1,
    },
    pickerLabel: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 8,
      fontWeight: '600',
      textShadowColor: isDarkMode ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.02)',
      textShadowOffset: { width: 0, height: isDarkMode ? 1 : 0 },
      textShadowRadius: isDarkMode ? 2 : 0.5,
    },
    timeInput: {
      width: 60,
      height: 50,
      borderWidth: isDarkMode ? 2 : 1,
      borderColor: theme.colors.primary,
      borderRadius: 12,
      textAlign: 'center',
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.textPrimary,
      backgroundColor: isDarkMode ? theme.colors.card : theme.colors.surface,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: isDarkMode ? 2 : 1 },
      shadowOpacity: isDarkMode ? 0.3 : 0.08,
      shadowRadius: isDarkMode ? 4 : 2,
      elevation: isDarkMode ? 4 : 1,
    },
    startButton: {
      backgroundColor: '#43A047',
      borderColor: '#43A047',
      borderWidth: isDarkMode ? 2 : 1,
    },
    pauseButton: {
      backgroundColor: '#FFD600',
      borderColor: '#FFD600',
      borderWidth: isDarkMode ? 2 : 1,
    },
    resetButton: {
      backgroundColor: '#E53935',
      borderColor: '#E53935',
      borderWidth: isDarkMode ? 2 : 1,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDarkMode ? 'rgba(0,0,0,0.9)' : 'rgba(0,0,0,0.7)',
    },
    modalContent: {
      backgroundColor: theme.colors.card,
      borderRadius: 24,
      padding: 32,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: isDarkMode ? 0.6 : 0.15,
      shadowRadius: isDarkMode ? 20 : 12,
      elevation: isDarkMode ? 12 : 6,
      minWidth: 300,
      maxWidth: '90%',
      borderWidth: isDarkMode ? 2 : 1,
      borderColor: isDarkMode ? theme.colors.primary : theme.colors.border,
    },
    modalTitle: {
      fontSize: 36,
      color: theme.colors.primary,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 16,
      textTransform: 'uppercase',
      textShadowColor: isDarkMode ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.05)',
      textShadowOffset: { width: 0, height: isDarkMode ? 2 : 0 },
      textShadowRadius: isDarkMode ? 4 : 1,
    },
    modalSubtitle: {
      fontSize: 18,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: 8,
      textShadowColor: isDarkMode ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.02)',
      textShadowOffset: { width: 0, height: isDarkMode ? 1 : 0 },
      textShadowRadius: isDarkMode ? 2 : 0.5,
    },
  });

  return (
    <View style={[globalStyles.container, dynamicStyles.timerContainer]}>
      {/* Inputs para setear el tiempo solo si no está corriendo ni finalizado */}
      {!isRunning && !isFinished && (
        <View style={dynamicStyles.inputRow}>
          <View style={dynamicStyles.inputContainer}>
            <Text style={dynamicStyles.pickerLabel}>Horas</Text>
            <TextInput
              style={dynamicStyles.timeInput}
              keyboardType="numeric"
              maxLength={2}
              value={inputHours}
              onChangeText={text => setInputHours(text.replace(/[^0-9]/g, ""))}
              placeholder="0"
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>
          <View style={dynamicStyles.inputContainer}>
            <Text style={dynamicStyles.pickerLabel}>Minutos</Text>
            <TextInput
              style={dynamicStyles.timeInput}
              keyboardType="numeric"
              maxLength={2}
              value={inputMinutes}
              onChangeText={text => setInputMinutes(text.replace(/[^0-9]/g, ""))}
              placeholder="0"
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>
          <View style={dynamicStyles.inputContainer}>
            <Text style={dynamicStyles.pickerLabel}>Segundos</Text>
            <TextInput
              style={dynamicStyles.timeInput}
              keyboardType="numeric"
              maxLength={2}
              value={inputSeconds}
              onChangeText={text => setInputSeconds(text.replace(/[^0-9]/g, ""))}
              placeholder="0"
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>
        </View>
      )}
      <Text style={[globalStyles.title, dynamicStyles.timerText, isFinished && dynamicStyles.finishedText]}>
        {formatTime(hours)}:{formatTime(minutes)}:{formatTime(seconds)}
      </Text>
      {isFinished && (
        <Text style={dynamicStyles.alarmText}>¡Tiempo finalizado!</Text>
      )}
      <View style={dynamicStyles.buttonRow}>
        <TouchableOpacity
          style={[
            globalStyles.LoginButton,
            dynamicStyles.timerButton,
            isRunning ? dynamicStyles.pauseButton : dynamicStyles.startButton
          ]}
          onPress={handlePauseResume}
          disabled={isFinished}
        >
          <MaterialCommunityIcons
            name={isRunning ? "pause" : "play"}
            size={24}
            color="#fff"
          />
          <Text style={globalStyles.buttonText}>
            {isRunning ? "Pausar" : "Iniciar"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            globalStyles.LoginButton,
            dynamicStyles.timerButton,
            dynamicStyles.resetButton,
            { marginLeft: theme.spacing.md }
          ]}
          onPress={handleRestart}
        >
          <MaterialCommunityIcons name="restart" size={24} color="#fff" />
          <Text style={globalStyles.buttonText}>Reiniciar</Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <Animated.View style={[
          dynamicStyles.modalOverlay,
          { backgroundColor: flashAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [
                isDarkMode ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.7)", 
                theme.colors.card
              ]
            }) }
        ]}>
          <View style={dynamicStyles.modalContent}>
            <MaterialCommunityIcons name="alarm-light" size={80} color={theme.colors.primary} style={{ marginBottom: 24 }} />
            <Text style={dynamicStyles.modalTitle}>¡TIEMPO FINALIZADO!</Text>
            <Text style={dynamicStyles.modalSubtitle}>Presiona reiniciar o ajusta el tiempo para volver a usar el temporizador.</Text>
            <TouchableOpacity style={[globalStyles.LoginButton, dynamicStyles.resetButton, { marginTop: 32 }]} onPress={handleRestart}>
              <MaterialCommunityIcons name="restart" size={28} color="#fff" />
              <Text style={globalStyles.buttonText}>Reiniciar</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Modal>
    </View>
  );
};

export default Timer;
