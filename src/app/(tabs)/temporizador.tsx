import React, { useState, useEffect } from "react";
import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import globalStyles from "../../styles/global";
import homeStyles from "../../styles/home";
import { useTheme } from "../../context/ThemeContext";
import Timer from "../../components/Timer";
import Stopwatch from "../../components/Stopwatch";

type TimerType = 'selection' | 'timer' | 'stopwatch';

export default function TemporizadorScreen() {
  const { theme, isDarkMode, timerState, setTimerState } = useTheme();

  const handleSelection = (type: TimerType) => {
    setTimerState(type);
  };

  // Reset timer state when component unmounts or when back is pressed
  useEffect(() => {
    return () => {
      setTimerState('selection');
    };
  }, []);

  // Si hay una selección activa, mostrar el componente correspondiente
  if (timerState !== 'selection') {
    return (
      <View style={[{ flex: 1, backgroundColor: theme.colors.background }]}>
        <ScrollView 
          contentContainerStyle={{ 
            flexGrow: 1, 
            justifyContent: 'center', 
            alignItems: 'center', 
            padding: theme.spacing.lg,
            backgroundColor: theme.colors.background
          }}
        >
          <View style={{ width: '100%', alignItems: 'center' }}>
            {timerState === 'timer' ? (
              <Timer initialHours={0} initialMinutes={1} initialSeconds={0} />
            ) : (
              <Stopwatch />
            )}
          </View>
        </ScrollView>
      </View>
    );
  }

  // Pantalla de selección
  return (
    <View style={[globalStyles.safeArea, { flex: 1, backgroundColor: theme.colors.background }]}>
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={dynamicStyles(theme, isDarkMode).scrollContent}
        showsVerticalScrollIndicator={false}
      >
      {/* Header Section - usando estilos unificados */}
      <View style={homeStyles.greetingContainer}>
        <Text style={homeStyles.greeting}>
          Herramientas de Tiempo
        </Text>
        <Text style={[homeStyles.subGreeting, { color: theme.colors.textSecondary }]}>
          Elige la herramienta que necesitas para tu entrenamiento
        </Text>
      </View>

      {/* Options */}
      <View style={dynamicStyles(theme, isDarkMode).optionsContainer}>
        {/* Temporizador Option */}
        <TouchableOpacity
          style={dynamicStyles(theme, isDarkMode).optionCard}
          onPress={() => handleSelection('timer')}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={theme.colors.gradient1}
            style={dynamicStyles(theme, isDarkMode).cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={dynamicStyles(theme, isDarkMode).cardHeader}>
              <View style={[dynamicStyles(theme, isDarkMode).iconContainer, { backgroundColor: theme.colors.primary }]}>
                <MaterialCommunityIcons 
                  name="timer" 
                  size={32} 
                  color="white" 
                />
              </View>
            </View>
            
            <View style={dynamicStyles(theme, isDarkMode).cardContent}>
              <Text style={dynamicStyles(theme, isDarkMode).cardTitle}>Temporizador</Text>
              <Text style={dynamicStyles(theme, isDarkMode).cardDescription}>
                Controla el tiempo de tus series y descansos
              </Text>
              
              <View style={dynamicStyles(theme, isDarkMode).featuresContainer}>
                <View style={dynamicStyles(theme, isDarkMode).featureItem}>
                  <MaterialCommunityIcons name="clock-outline" size={16} color={theme.colors.textPrimary} />
                  <Text style={dynamicStyles(theme, isDarkMode).featureText}>Cuenta regresiva</Text>
                </View>
                <View style={dynamicStyles(theme, isDarkMode).featureItem}>
                  <MaterialCommunityIcons name="bell-outline" size={16} color={theme.colors.textPrimary} />
                  <Text style={dynamicStyles(theme, isDarkMode).featureText}>Alarma al finalizar</Text>
                </View>
                <View style={dynamicStyles(theme, isDarkMode).featureItem}>
                  <MaterialCommunityIcons name="tune" size={16} color={theme.colors.textPrimary} />
                  <Text style={dynamicStyles(theme, isDarkMode).featureText}>Tiempo personalizable</Text>
                </View>
              </View>
            </View>
            
            <View style={dynamicStyles(theme, isDarkMode).cardFooter}>
              <Text style={dynamicStyles(theme, isDarkMode).actionText}>Usar Temporizador</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color={theme.colors.textPrimary} />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Cronómetro Option */}
        <TouchableOpacity
          style={dynamicStyles(theme, isDarkMode).optionCard}
          onPress={() => handleSelection('stopwatch')}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={theme.colors.gradient1}
            style={dynamicStyles(theme, isDarkMode).cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={dynamicStyles(theme, isDarkMode).cardHeader}>
              <View style={[dynamicStyles(theme, isDarkMode).iconContainer, { backgroundColor: theme.colors.primary }]}>
                <MaterialCommunityIcons 
                  name="timer-sand" 
                  size={32} 
                  color="white" 
                />
              </View>
            </View>
            
            <View style={dynamicStyles(theme, isDarkMode).cardContent}>
              <Text style={dynamicStyles(theme, isDarkMode).cardTitle}>Cronómetro</Text>
              <Text style={dynamicStyles(theme, isDarkMode).cardDescription}>
                Mide el tiempo de tus ejercicios y vueltas
              </Text>
              
              <View style={dynamicStyles(theme, isDarkMode).featuresContainer}>
                <View style={dynamicStyles(theme, isDarkMode).featureItem}>
                  <MaterialCommunityIcons name="play-outline" size={16} color={theme.colors.textPrimary} />
                  <Text style={dynamicStyles(theme, isDarkMode).featureText}>Cuenta progresiva</Text>
                </View>
                <View style={dynamicStyles(theme, isDarkMode).featureItem}>
                  <MaterialCommunityIcons name="flag-outline" size={16} color={theme.colors.textPrimary} />
                  <Text style={dynamicStyles(theme, isDarkMode).featureText}>Registro de vueltas</Text>
                </View>
                <View style={dynamicStyles(theme, isDarkMode).featureItem}>
                  <MaterialCommunityIcons name="speedometer" size={16} color={theme.colors.textPrimary} />
                  <Text style={dynamicStyles(theme, isDarkMode).featureText}>Precisión de centésimas</Text>
                </View>
              </View>
            </View>
            
            <View style={dynamicStyles(theme, isDarkMode).cardFooter}>
              <Text style={dynamicStyles(theme, isDarkMode).actionText}>Usar Cronómetro</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color={theme.colors.textPrimary} />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Info Section */}
      <View style={dynamicStyles(theme, isDarkMode).infoSection}>
        <Text style={dynamicStyles(theme, isDarkMode).infoTitle}>💡 Consejo</Text>
        <Text style={dynamicStyles(theme, isDarkMode).infoText}>
          Usa el temporizador para controlar tus tiempos de descanso entre series, 
          y el cronómetro para medir el tiempo de ejecución de ejercicios específicos.
        </Text>
      </View>
        </ScrollView>
      </View>
  );
}

const dynamicStyles = (theme: any, isDarkMode: boolean) => StyleSheet.create({
  scrollContent: {
    paddingBottom: 32,
  },
  optionsContainer: {
    paddingHorizontal: 24,
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  optionCard: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: isDarkMode ? 6 : 4 },
    shadowOpacity: isDarkMode ? 0.4 : 0.15,
    shadowRadius: isDarkMode ? 12 : 8,
    elevation: isDarkMode ? 12 : 6,
  },
  cardGradient: {
    padding: theme.spacing.lg,
    minHeight: 180,
  },
  cardHeader: {
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    flex: 1,
    marginBottom: theme.spacing.md,
  },
  cardTitle: {
    fontSize: theme.typography.fontSize.large,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  cardDescription: {
    fontSize: theme.typography.fontSize.medium,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
    lineHeight: 20,
  },
  featuresContainer: {
    gap: theme.spacing.xs,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  featureText: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.medium,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionText: {
    fontSize: theme.typography.fontSize.medium,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.textPrimary,
  },
  infoSection: {
    marginHorizontal: 24,
    backgroundColor: isDarkMode ? 'rgba(0, 191, 255, 0.1)' : 'rgba(0, 191, 255, 0.05)',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: isDarkMode ? 'rgba(0, 191, 255, 0.2)' : 'rgba(0, 191, 255, 0.1)',
  },
  infoTitle: {
    fontSize: theme.typography.fontSize.medium,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  infoText: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
});
