import React from "react";
import { View, Text, Pressable } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import styles from "../styles/racha";
import theme from "../constants/theme";
import { UsuarioAtleta } from "../data/UsuarioAtleta";
import { calcularRachaSemanal } from "../utils/racha";

const flameColor = (streak: number) => {
  if (streak === 0) return "#d8d8d8"; // apagado
  if (streak < 3) return theme.colors.primary;
  return "#FF5722"; // naranja intenso cuando hay buena racha
};

export default function Racha({ onPress }: { onPress?: () => void }) {
  const { attendance, weeklyGoal } = UsuarioAtleta;
  const { currentWeekCount, streak } = calcularRachaSemanal(
    attendance,
    weeklyGoal,
    new Date()
  );

  const renderProgressDots = () => {
    return Array.from({ length: weeklyGoal }).map((_, idx) => (
      <View
        key={idx}
        style={[
          styles.progressDot,
          idx < currentWeekCount && styles.progressDotActive,
        ]}
      />
    ));
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.row}>
        <MaterialCommunityIcons
          name="fire"
          size={24}
          color={flameColor(streak)}
          style={{ textShadowColor: "rgba(0,0,0,0.3)", textShadowRadius: 4 }}
        />
        <Text style={styles.streakText}>{streak}</Text>
        <Text style={styles.label}>
          {streak > 0 ? "¡Estás en Racha!" : "¡Racha Perdida!"}
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
  );
} 