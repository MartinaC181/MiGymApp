import React from 'react'
import { View, StatusBar, StyleSheet } from 'react-native'
import { Slot } from 'expo-router'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useTheme } from '../../context/ThemeContext'

export default function AuthLayout() {
  const { theme, isDarkMode } = useTheme()

  return (
    <SafeAreaProvider>
      {/* StatusBar acorde al fondo para pantallas de autenticación */}
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />

      {/* Contenedor que hereda el mismo color de fondo */}
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Slot />
      </View>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}) 