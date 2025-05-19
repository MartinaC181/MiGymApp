// app/(tabs)/cuota.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import theme from '../../constants/theme';

export default function Cuota() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tu plan de cuotas</Text>
      {/* Aquí va el contenido de la pantalla Cuota */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 24,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.primary,
    marginBottom: 16,
  },
});
