import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import React, { useEffect, useState } from 'react';

export default function LoadingPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simula un tiempo de carga de 3 segundos
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer); 
  }, []);

  if (isLoading) {
    // Pantalla de carga
    return (
      <View style={styles.container}>
        <Image
          source={require('./assets/logo.png')}
          style={{
            width: 200,
            height: 200,
            borderRadius: 20,
            marginTop: -200,
          }}
        />
        <View
          style={{
            marginTop: 100,
            width: 250,
            height: 40,
            backgroundColor: '#ccc',
            borderRadius: 15,
            opacity: 0.5,
          }}
        />
        <View
          style={{
            marginTop: 30,
            width: 250,
            height: 40,
            backgroundColor: '#ccc',
            borderRadius: 15,
            opacity: 0.5,
          }}
        />
        <View
          style={{
            marginTop: 30,
            width: 200,
            height: 30,
            backgroundColor: '#ccc',
            borderRadius: 15,
            opacity: 0.5,
          }}
        />
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>¡Bienvenido a MiGymApp!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6fc',
    alignItems: 'center',
    justifyContent: 'center',
  },
});