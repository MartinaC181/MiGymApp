import React, { useState, useEffect, useMemo } from "react";
import { View, Text, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import styles from "../styles/racha";
import theme from "../constants/theme";
import { UsuarioAtleta as initialUser } from "../data/UsuarioAtleta";
import { calcularRachaSemanal, addAttendanceIfNeeded, countAttendancesThisWeek } from "../utils/racha";
import { loadClientData, saveClientData } from "../utils/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RachaModal from "./RachaModal";
import Flame from "./Flame";
import { Animated } from "react-native";

export default function Racha({ onPress }: { onPress?: () => void }) {
  const [user, setUser] = useState(initialUser);
  const [attendance, setAttendance] = useState<string[]>(initialUser.attendance);
  const [forceUpdate, setForceUpdate] = useState(0);
  const { weeklyGoal } = user;

  const { currentWeekCount, streak } = useMemo(() => {
    const result = calcularRachaSemanal(attendance, weeklyGoal, new Date());
    return result;
  }, [attendance, weeklyGoal, forceUpdate]);

  const [modalVisible, setModalVisible] = useState(false);
  const [dotScale] = useState(new Animated.Value(1));

  // Load persisted data on mount
  useEffect(() => {
    (async () => {
      const stored = await loadClientData();
      if (stored && stored.attendance) {
        setUser(stored);
        setAttendance(stored.attendance);
      }
    })();
  }, []);

  const handleMarkAttendance = async () => {
    const { updated, added } = addAttendanceIfNeeded(attendance);
    if (!added) {
      return; // No cerrar el modal, solo no hacer nada si ya hay asistencia
    }
    setAttendance(updated);
    const newUser = { ...user, attendance: updated } as typeof user;
    setUser(newUser);
    await saveClientData(newUser);
    // No cerrar el modal automáticamente, el usuario decide cuándo cerrar
  };

  const handleResetAttendance = async () => {
    await AsyncStorage.removeItem("atleta");
    setAttendance([]);
    setUser({ ...user, attendance: [] });
    setModalVisible(false);
  };

  const handleIncrementStreak = async () => {
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
    
    setAttendance(newAttendance);
    const newUser = { ...user, attendance: newAttendance } as typeof user;
    setUser(newUser);
    await saveClientData(newUser);
    
    // Forzar actualización
    setForceUpdate(prev => prev + 1);
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