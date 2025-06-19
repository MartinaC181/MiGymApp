import { useState, useEffect } from 'react';
import SplashLoader from '../components/SplashLoader';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Index() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      router.push('/login');
    }, 3000); // Tiempo suficiente para ver la animación

    return () => clearTimeout(timer); 
  }, []);

  return isLoading ? (
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
