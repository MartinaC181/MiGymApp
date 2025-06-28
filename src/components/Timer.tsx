import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Vibration, StyleSheet, TextInput, Modal, Animated, Easing } from "react-native";
import globalStyles from "../styles/global";
import theme from "../constants/theme";
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

  return (
    <View style={[globalStyles.container, styles.timerContainer]}>
      {/* Inputs para setear el tiempo solo si no está corriendo ni finalizado */}
      {!isRunning && !isFinished && (
        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <Text style={styles.pickerLabel}>Horas</Text>
            <TextInput
              style={styles.timeInput}
              keyboardType="numeric"
              maxLength={2}
              value={inputHours}
              onChangeText={text => setInputHours(text.replace(/[^0-9]/g, ""))}
              placeholder="0"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.pickerLabel}>Minutos</Text>
            <TextInput
              style={styles.timeInput}
              keyboardType="numeric"
              maxLength={2}
              value={inputMinutes}
              onChangeText={text => setInputMinutes(text.replace(/[^0-9]/g, ""))}
              placeholder="0"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.pickerLabel}>Segundos</Text>
            <TextInput
              style={styles.timeInput}
              keyboardType="numeric"
              maxLength={2}
              value={inputSeconds}
              onChangeText={text => setInputSeconds(text.replace(/[^0-9]/g, ""))}
              placeholder="0"
            />
          </View>
        </View>
      )}
      <Text style={[globalStyles.title, styles.timerText, isFinished && styles.finishedText]}>
        {formatTime(hours)}:{formatTime(minutes)}:{formatTime(seconds)}
      </Text>
      {isFinished && (
        <Text style={styles.alarmText}>¡Tiempo finalizado!</Text>
      )}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[
            globalStyles.LoginButton,
            styles.timerButton,
            isRunning ? styles.pauseButton : styles.startButton
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
            styles.timerButton,
            styles.resetButton,
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
          styles.modalOverlay,
          { backgroundColor: flashAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ["rgba(0,0,0,0.7)", "#fff"]
            }) }
        ]}>
          <View style={styles.modalContent}>
            <MaterialCommunityIcons name="alarm-light" size={80} color={theme.colors.primary} style={{ marginBottom: 24 }} />
            <Text style={[styles.modalTitle, { color: theme.colors.primary }]}>¡TIEMPO FINALIZADO!</Text>
            <Text style={styles.modalSubtitle}>Presiona reiniciar o ajusta el tiempo para volver a usar el temporizador.</Text>
            <TouchableOpacity style={[globalStyles.LoginButton, styles.resetButton, { marginTop: 32 }]} onPress={handleRestart}>
              <MaterialCommunityIcons name="restart" size={28} color="#fff" />
              <Text style={globalStyles.buttonText}>Reiniciar</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  timerContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.lg,
  },
  timerText: {
    fontSize: 48,
    marginBottom: theme.spacing.lg,
    color: theme.colors.primary,
  },
  finishedText: {
    color: theme.colors.error,
  },
  alarmText: {
    color: theme.colors.error,
    fontSize: 18,
    marginBottom: theme.spacing.md,
    fontWeight: "bold",
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: theme.spacing.lg,
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "nowrap",
    gap: undefined, // Elimina gap para compatibilidad RN
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
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  inputContainer: {
    alignItems: 'center',
    marginHorizontal: theme.spacing.sm,
    flex: 1,
  },
  pickerLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  timeInput: {
    width: 50,
    height: 40,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 18,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.surface,
  },
  startButton: {
    backgroundColor: '#43A047', // verde
    borderColor: '#43A047',
  },
  pauseButton: {
    backgroundColor: '#FFD600', // amarillo
    borderColor: '#FFD600',
  },
  resetButton: {
    backgroundColor: '#E53935', // rojo
    borderColor: '#E53935',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
    minWidth: 300,
    maxWidth: '90%',
  },
  modalTitle: {
    fontSize: 36,
    // color: theme.colors.error, // Se reemplaza por theme.colors.primary en el componente
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  modalSubtitle: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
});

export default Timer;
