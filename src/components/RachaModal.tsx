import React, { useEffect, useRef, useState } from "react";
import { Modal, View, Text, Pressable, Animated, Easing } from "react-native";
import Flame from "./Flame";
import styles from "../styles/rachaModal";
import theme from "../constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

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

const flameColor = (streak: number, currentTheme: typeof theme) => {
  if (streak === 0) return currentTheme.colors.border;
  if (streak < 3) return currentTheme.colors.primary;
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
  
  // Obtener el tema actual
  const { theme: currentTheme, isDarkMode } = useTheme();

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
            color={isActive ? currentTheme.colors.primary : (isDarkMode ? '#666666' : currentTheme.colors.border)}
          />
        </View>
      );
    });
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={[styles.modal, { 
          backgroundColor: isDarkMode ? '#3A3A3A' : currentTheme.colors.background,
          borderWidth: isDarkMode ? 2 : 0,
          borderColor: isDarkMode ? '#4A4A4A' : 'transparent',
          shadowColor: isDarkMode ? "#000" : "#000",
          shadowOffset: { width: 0, height: isDarkMode ? 6 : 3 },
          shadowOpacity: isDarkMode ? 0.5 : 0.2,
          shadowRadius: isDarkMode ? 12 : 8,
          elevation: isDarkMode ? 16 : 8
        }]} onPress={(e) => e.stopPropagation()}>
          {/* Botón de cerrar (cruz) */}
          <Pressable style={styles.closeButton} onPress={onClose}>
            <MaterialIcons name="close" size={24} color={isDarkMode ? '#E0E0E0' : currentTheme.colors.textSecondary} />
          </Pressable>

          <Animated.View style={{ transform: [{ scale: flameScale }] }}>
            <Flame size={90} muted={streak === 0 && currentWeekCount === 0} />
          </Animated.View>
          <Text style={[styles.streakNumber, { 
            color: isDarkMode ? '#FFFFFF' : currentTheme.colors.textPrimary,
            textShadowColor: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'transparent',
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 2
          }]}>{streak}</Text>
          <Text style={[styles.streakLabel, { 
            color: isDarkMode ? '#E0E0E0' : currentTheme.colors.textSecondary,
            fontWeight: isDarkMode ? '500' : 'normal'
          }]}>
            {streak === 1 ? "semana de racha!" : "semanas de racha!"}
          </Text>
          <Text style={[styles.streakMessage, { 
            color: isDarkMode ? '#CCCCCC' : currentTheme.colors.textSecondary,
            fontWeight: isDarkMode ? '500' : 'normal'
          }]}>{getRachaMessage(streak, currentWeekCount, weeklyGoal)}</Text>
          
          <Text style={[styles.weeklyGoalText, { 
            color: isDarkMode ? '#CCCCCC' : currentTheme.colors.textSecondary,
            fontWeight: isDarkMode ? '500' : 'normal'
          }]}>Asistencia {currentWeekCount} días por semana</Text>
          <View style={styles.progressWrapper}>{renderProgressDots()}</View>
          
          <Pressable style={[styles.ctaButton, { 
            backgroundColor: isDarkMode ? 'rgba(0, 191, 255, 0.95)' : currentTheme.colors.primary,
            shadowColor: isDarkMode ? "#000" : "#000",
            shadowOffset: { width: 0, height: isDarkMode ? 3 : 2 },
            shadowOpacity: isDarkMode ? 0.4 : 0.25,
            shadowRadius: isDarkMode ? 6 : 4,
            elevation: isDarkMode ? 8 : 4
          }]} onPress={handleMarkAttendanceWithAnimation}>
            <Text style={[styles.ctaText, { 
              color: isDarkMode ? '#FFFFFF' : currentTheme.colors.background,
              fontWeight: isDarkMode ? '600' : 'normal'
            }]}>Marcar asistencia</Text>
          </Pressable>
          
          {__DEV__ && onResetAttendance && (
            <Pressable onPress={onResetAttendance} style={[styles.resetButton, { 
              backgroundColor: isDarkMode ? '#4A4A4A' : currentTheme.colors.surface,
              borderWidth: isDarkMode ? 1 : 0,
              borderColor: isDarkMode ? '#5A5A5A' : 'transparent'
            }]}>
              <Text style={[styles.resetText, { 
                color: isDarkMode ? '#E0E0E0' : currentTheme.colors.textSecondary,
                fontWeight: isDarkMode ? '500' : 'normal'
              }]}>Reset asistencia (DEV)</Text>
            </Pressable>
          )}

          {__DEV__ && onIncrementStreak && (
            <Pressable onPress={onIncrementStreak} style={[styles.resetButton, { 
              backgroundColor: isDarkMode ? '#4A4A4A' : currentTheme.colors.surface,
              borderWidth: isDarkMode ? 1 : 0,
              borderColor: isDarkMode ? '#5A5A5A' : 'transparent'
            }]}>
              <Text style={[styles.resetText, { 
                color: isDarkMode ? '#E0E0E0' : currentTheme.colors.textSecondary,
                fontWeight: isDarkMode ? '500' : 'normal'
              }]}>Incrementar racha (DEV)</Text>
            </Pressable>
          )}

          {/* Animación de éxito */}
          {showSuccess && (
            <Animated.View 
              style={[
                styles.successOverlay,
                {
                  opacity: successAnimation,
                  transform: [{ scale: successAnimation }],
                  backgroundColor: isDarkMode ? 'rgba(30,30,30,0.92)' : 'rgba(255,255,255,0.92)',
                  borderColor: isDarkMode ? currentTheme.colors.primary : currentTheme.colors.primary,
                  borderWidth: 2,
                }
              ]}
            >
              <MaterialIcons name="check-circle" size={80} color={isDarkMode ? '#00FFB0' : currentTheme.colors.primary} />
              <Text style={[styles.successText, { 
                color: isDarkMode ? '#FFFFFF' : currentTheme.colors.textPrimary,
                fontWeight: isDarkMode ? '600' : 'normal',
                textShadowColor: isDarkMode ? 'rgba(0,0,0,0.5)' : 'transparent',
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 2
              }]}>¡Asistencia marcada!</Text>
            </Animated.View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
} 