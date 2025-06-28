import React, { useState, useEffect } from 'react';
import SplashLoader from '../components/SplashLoader';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../hooks/useAuth';

export default function Index() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, checkAuthStatus } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      // Esperar un mínimo de 2 segundos para mostrar el splash
      const minSplashTime = new Promise(resolve => setTimeout(resolve, 2000));
      
      // Verificar autenticación
      await checkAuthStatus();
      
      // Esperar que termine el tiempo mínimo del splash
      await minSplashTime;
      
      // Redirigir según el estado de autenticación
      if (isAuthenticated) {
        router.replace('/home');
      } else {
        router.replace('/login');
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  return isLoading || authLoading ? (
    <View style={styles.container}>
      <SplashLoader size={150}/>
    </View>
  ) : null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  }
});
