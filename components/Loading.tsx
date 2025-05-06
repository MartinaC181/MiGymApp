import { useEffect, useState, } from 'react';
import { View, Image, ActivityIndicator, StyleSheet, StatusBar } from 'react-native';

export function Loading() {
    const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer); 
  }, []);

  if (isLoading) {
    
    return (
      <View style={styles.container}>
        <Image
          source={require('../assets/logo.png')}
          style={{
            width: 200,
            height: 200,
            borderRadius: 20,
            marginTop: -300, 
          }}
        />
        <ActivityIndicator
          style={{
            marginTop: 20, 
          }}
          size="large"
          color="#121212"
        />
        <View
          style={{
            marginTop: 40, 
            marginBottom: 10, 
            width: 250,
            height: 40,
            backgroundColor: '#ccc',
            borderRadius: 15,
            opacity: 0.5,
          }}
        />
        <View
          style={{
            marginTop: 20, // Reducir el margen superior
            marginBottom: 10, // Aumentar el margen inferior
            width: 250,
            height: 40,
            backgroundColor: '#ccc',
            borderRadius: 15,
            opacity: 0.5,
          }}
        />
        <View
          style={{
            marginTop: 20, // Reducir el margen superior
            marginBottom: 500, // Aumentar el margen inferior
            width: 200,
            height: 30,
            backgroundColor: '#ccc',
            borderRadius: 15,
            opacity: 0.5,
          }}
        />
        <StatusBar barStyle="default" />
      </View>
        );
    }
}

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#f4f6fc',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 450,
        paddingBottom: 450,
      },
    });