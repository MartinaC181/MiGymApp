import React, { useEffect, useRef, useState } from "react";
import { Modal, View, Text, Pressable, Animated, Easing } from "react-native";
import Flame from "./Flame";
import styles from "../styles/rachaModal";
import theme from "../constants/theme";
import { MaterialIcons } from "@expo/vector-icons";

interface Props {
  visible: boolean;
  onClose: () => void;
  onMarkAttendance: () => void;
  onResetAttendance?: () => void;
  onIncrementStreak?: () => void;
  streak: number;
  weeklyGoal: number;
  currentWeekCount: number;
}

const flameColor = (streak: number) => {
  if (streak === 0) return "#d8d8d8";
  if (streak < 3) return theme.colors.primary;
  return "#FF5722";
};

const getRachaMessage = (streak: number, currentWeekCount: number, goal: number) => {
  if (streak === 0) {
    if (currentWeekCount === 0) {
      return "No te preocupes, ¡volvé a empezar la semana que viene!";
    }
    return "¡La semana recién empieza, vamos por la racha!";
  }
  if (streak < 4) return "¡No aflojés, ya casi un mes!";
  if (streak < 8) return "¡Un mes cumplido, felicitaciones!";
  return "¡Leyenda total, seguí así!";
};

export default function RachaModal({
  visible,
  onClose,
  onMarkAttendance,
  onResetAttendance,
  onIncrementStreak,
  streak,
  weeklyGoal,
  currentWeekCount,
}: Props) {
  const flameScale = useRef(new Animated.Value(1)).current;
  const successAnimation = useRef(new Animated.Value(0)).current;
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (visible) {
      // Reiniciar la animación cada vez que se abre el modal
      flameScale.setValue(1);
      Animated.loop(
        Animated.sequence([
          Animated.timing(flameScale, {
            toValue: 1.15,
            duration: 800,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(flameScale, {
            toValue: 1,
            duration: 800,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [visible, flameScale]);

  const handleMarkAttendanceWithAnimation = () => {
    // Ejecutar la función de marcar asistencia
    onMarkAttendance();
    
    // Mostrar animación de éxito
    setShowSuccess(true);
    Animated.sequence([
      Animated.timing(successAnimation, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.back(1.7)),
        useNativeDriver: true,
      }),
      Animated.delay(1000),
      Animated.timing(successAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowSuccess(false);
    });
  };

  const renderProgressDots = () => {
    return Array.from({ length: weeklyGoal }).map((_, idx) => {
      const isActive = idx < currentWeekCount;
      return (
        <View key={idx} style={styles.progressDotWrapper}>
          <MaterialIcons
            name={isActive ? "check-circle" : "radio-button-unchecked"}
            size={22}
            color={isActive ? theme.colors.primary : "#d8d8d8"}
          />
        </View>
      );
    });
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modal} onPress={(e) => e.stopPropagation()}>
          {/* Botón de cerrar (cruz) */}
          <Pressable style={styles.closeButton} onPress={onClose}>
            <MaterialIcons name="close" size={24} color={theme.colors.textSecondary} />
          </Pressable>

          <Animated.View style={{ transform: [{ scale: flameScale }] }}>
            <Flame size={90} muted={streak === 0 && currentWeekCount === 0} />
          </Animated.View>
          <Text style={styles.streakNumber}>{streak}</Text>
          <Text style={styles.streakLabel}>
            {streak === 1 ? "semana de racha!" : "semanas de racha!"}
          </Text>
          <Text style={styles.streakMessage}>{getRachaMessage(streak, currentWeekCount, weeklyGoal)}</Text>
          
          <Text style={styles.weeklyGoalText}>Asistencia {currentWeekCount} días por semana</Text>
          <View style={styles.progressWrapper}>{renderProgressDots()}</View>
          
          <Pressable style={styles.ctaButton} onPress={handleMarkAttendanceWithAnimation}>
            <Text style={styles.ctaText}>Marcar asistencia</Text>
          </Pressable>
          
          {__DEV__ && onResetAttendance && (
            <Pressable onPress={onResetAttendance} style={styles.resetButton}>
              <Text style={styles.resetText}>Reset asistencia (DEV)</Text>
            </Pressable>
          )}

          {__DEV__ && onIncrementStreak && (
            <Pressable onPress={onIncrementStreak} style={styles.resetButton}>
              <Text style={styles.resetText}>Incrementar racha (DEV)</Text>
            </Pressable>
          )}

          {/* Animación de éxito */}
          {showSuccess && (
            <Animated.View 
              style={[
                styles.successOverlay,
                {
                  opacity: successAnimation,
                  transform: [{ scale: successAnimation }]
                }
              ]}
            >
              <MaterialIcons name="check-circle" size={80} color={theme.colors.primary} />
              <Text style={styles.successText}>¡Asistencia marcada!</Text>
            </Animated.View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
} 