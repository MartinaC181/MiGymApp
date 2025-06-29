import React, { useState, useEffect, useMemo } from "react";
import { View, Text, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import styles from "../styles/racha";
import theme from "../constants/theme";
import { calcularRachaSemanal, addAttendanceIfNeeded, countAttendancesThisWeek } from "../utils/racha";
import { getCurrentUser, getAttendance, saveAttendance } from "../utils/storage";
import { ClientUser } from "../data/Usuario";
import RachaModal from "./RachaModal";
import Flame from "./Flame";
import { Animated } from "react-native";

export default function Racha({ onPress }: { onPress?: () => void }) {
  const [user, setUser] = useState<ClientUser | null>(null);
  const [attendance, setAttendance] = useState<string[]>([]);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const weeklyGoal = user?.weeklyGoal || 3;

  const { currentWeekCount, streak } = useMemo(() => {
    const result = calcularRachaSemanal(attendance, weeklyGoal, new Date());
    return result;
  }, [attendance, weeklyGoal, forceUpdate]);

  const [modalVisible, setModalVisible] = useState(false);
  const [dotScale] = useState(new Animated.Value(1));

  // Cargar datos del usuario desde AsyncStorage
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = await getCurrentUser() as ClientUser;
      if (currentUser && currentUser.role === 'client') {
        const userAttendance = await getAttendance(currentUser.id);
        setUser(currentUser);
        setAttendance(userAttendance);
      } else {
        // Si no hay usuario logueado, usar valores por defecto
        setUser(null);
        setAttendance([]);
      }
    } catch (error) {
      console.error("Error cargando datos del usuario:", error);
      setUser(null);
      setAttendance([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAttendance = async () => {
    if (!user) {
      console.warn("No hay usuario logueado");
      return;
    }

    const { updated, added } = addAttendanceIfNeeded(attendance);
    if (!added) {
      return; // Ya hay asistencia para hoy
    }

    try {
      setAttendance(updated);
      await saveAttendance(user.id, updated);
    } catch (error) {
      console.error("Error guardando asistencia:", error);
      // Revertir cambio en caso de error
      setAttendance(attendance);
    }
  };

  const handleResetAttendance = async () => {
    if (!user) return;

    try {
      setAttendance([]);
      await saveAttendance(user.id, []);
      setModalVisible(false);
    } catch (error) {
      console.error("Error reseteando asistencia:", error);
    }
  };

  const handleIncrementStreak = async () => {
    if (!user) return;

    const today = new Date();
    const newAttendance = [...attendance];
    
    // Determinar qué semana agregar según la racha actual
    if (streak === 0) {
      // Si no hay racha, completar la semana actual
      const currentWeekAttendance = countAttendancesThisWeek(newAttendance, today);
      
      if (currentWeekAttendance < weeklyGoal) {
        const needed = weeklyGoal - currentWeekAttendance;
        
        for (let i = 0; i < needed; i++) {
          const dateToAdd = new Date(today);
          dateToAdd.setDate(today.getDate() + i + 1);
          const dateStr = dateToAdd.toISOString().split('T')[0];
          if (!newAttendance.includes(dateStr)) {
            newAttendance.push(dateStr);
          }
        }
      }
    } else {
      // Si ya hay racha, agregar una semana anterior más
      const weeksAgo = streak + 1; // La siguiente semana hacia atrás
      
      for (let day = 0; day < weeklyGoal; day++) {
        const pastDate = new Date(today);
        pastDate.setDate(today.getDate() - (weeksAgo * 7) + day);
        const dateStr = pastDate.toISOString().split('T')[0];
        if (!newAttendance.includes(dateStr)) {
          newAttendance.push(dateStr);
        }
      }
    }
    
    newAttendance.sort();
    
    try {
      setAttendance(newAttendance);
      await saveAttendance(user.id, newAttendance);
      // Forzar actualización
      setForceUpdate(prev => prev + 1);
    } catch (error) {
      console.error("Error incrementando racha:", error);
      // Revertir cambio en caso de error
      setAttendance(attendance);
    }
  };

  const renderProgressDots = () => {
    return Array.from({ length: weeklyGoal }).map((_, idx) => {
      const isActive = idx < currentWeekCount;
      const isLast = idx === currentWeekCount - 1;
      const Wrapper = isLast ? Animated.View : View;
      return (
        <Wrapper
          key={idx}
          style={[styles.progressDotWrapper, isLast && { transform: [{ scale: dotScale }] }]}
        >
          <MaterialIcons
            name={isActive ? "check-circle" : "radio-button-unchecked"}
            size={18}
            color={isActive ? theme.colors.primary : "#d8d8d8"}
          />
        </Wrapper>
      );
    });
  };

  // Animar dot al agregar asistencia
  useEffect(() => {
    Animated.sequence([
      Animated.timing(dotScale, { toValue: 1.4, duration: 250, useNativeDriver: true }),
      Animated.timing(dotScale, { toValue: 1, duration: 250, useNativeDriver: true }),
    ]).start();
  }, [currentWeekCount]);

  // Mostrar componente simplificado si está cargando o no hay usuario
  if (isLoading) {
    return (
      <View style={styles.card}>
        <Text>Cargando racha...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.card}>
        <View style={styles.row}>
          <Flame size={28} muted={true} />
          <Text style={styles.streakText}>0</Text>
          <Text style={styles.label}>¡Inicia sesión para ver tu racha!</Text>
        </View>
      </View>
    );
  }

  return (
    <>
      <Pressable
        onPress={onPress ? onPress : () => setModalVisible(true)}
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      >
        <View style={styles.row}>
          <Flame size={28} muted={streak === 0 && currentWeekCount === 0} />
          <Text style={styles.streakText}>{streak}</Text>
          <Text style={styles.label}>
            {streak > 0
              ? "¡Estás en Racha!"
              : currentWeekCount > 0
              ? "¡Racha en progreso!"
              : "¡Racha Perdida!"}
          </Text>
          <MaterialIcons
            name="keyboard-arrow-down"
            size={22}
            color={theme.colors.textSecondary}
            style={{ marginLeft: "auto" }}
          />
        </View>
        <View style={styles.progressWrapper}>{renderProgressDots()}</View>
      </Pressable>
      <RachaModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onMarkAttendance={handleMarkAttendance}
        onResetAttendance={handleResetAttendance}
        onIncrementStreak={handleIncrementStreak}
        streak={streak}
        weeklyGoal={weeklyGoal}
        currentWeekCount={currentWeekCount}
      />
    </>
  );
} 