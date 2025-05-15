// components/SplashLoader.tsx

import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Easing, Text, Image } from 'react-native';
import Svg, { Circle, G, Path } from 'react-native-svg';

interface SplashLoaderProps {
  size?: number;
  message?: string;
  onLoadComplete?: () => void;
  duration?: number;
}

const SplashLoader: React.FC<SplashLoaderProps> = ({ 
  size = 100, 
  message = "Cargando", 
  onLoadComplete,
  duration = 3000 
}) => {
  const strokeWidth = size * 0.1;
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  const [progress, setProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState('Cargando...');
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const rotateAnimation = useRef(new Animated.Value(0)).current;

  // Solo 3 pasos simplificados
  const loadingSteps = [
    { progress: 0, message: 'Cargando...' },
    { progress: 50, message: 'Inicializando...' },
    { progress: 100, message: '¡Listo!' },
  ];

  useEffect(() => {
    // Animación de rotación constante
    Animated.loop(
      Animated.timing(rotateAnimation, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Animación de progreso simplificada
    loadingSteps.forEach((step, index) => {
      const delay = (duration / (loadingSteps.length - 1)) * index;
      
      setTimeout(() => {
        setProgress(step.progress);
        setLoadingStep(step.message);
        
        Animated.timing(progressAnimation, {
          toValue: step.progress / 100,
          duration: 300,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }).start();
        
        // Llamar al callback cuando termine
        if (index === loadingSteps.length - 1 && onLoadComplete) {
          setTimeout(onLoadComplete, 600);
        }
      }, delay);
    });
  }, []);

  const AnimatedCircle = Animated.createAnimatedComponent(Circle);
  const AnimatedG = Animated.createAnimatedComponent(G);

  const dashoffset = progressAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  const rotation = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [`rotate(0, ${center}, ${center})`, `rotate(360, ${center}, ${center})`],
  });

  return (
    <View style={styles.container}>
      <View style={styles.svgContainer}>
        <Svg height={size} width={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Base Circle */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#E0E0E0"
            strokeWidth={strokeWidth}
            fill="none"
          />
          
          {/* Animated Circle */}
          <AnimatedG transform={rotation}>
            <AnimatedCircle
              cx={center}
              cy={center}
              r={radius}
              stroke="#008FFF"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={dashoffset}
              strokeLinecap="round"
            />
          </AnimatedG>
          
          {/* Logo in the center */}
          <G x={center - 15} y={center - 15}>
            <Path
              d="M15,0 C23.2843,0 30,6.71573 30,15 C30,23.2843 23.2843,30 15,30 C6.71573,30 0,23.2843 0,15 C0,6.71573 6.71573,0 15,0 Z"
              fill="#008FFF"
            />
            <Path
              d="M10,10 L20,20 M10,20 L20,10"
              stroke="white"
              strokeWidth={2}
              strokeLinecap="round"
            />
          </G>
        </Svg>
        
        {/* Logo en el centro */}
        <Image
          source={require('../assets/splash-icon.png')}
          style={{
            position: 'absolute',
            width: size * 0.5,
            height: size * 0.5,
            resizeMode: 'contain'
          }}
        />
      </View>
      
      {/* Solo el mensaje de estado */}
      <Text style={styles.messageText}>{loadingStep}</Text>
      <Text style={styles.progressText}>{progress}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  svgContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageText: {
    marginTop: 20,
    fontSize: 18,
    color: '#008FFF',
    fontWeight: '500',
  },
  progressText: {
    marginTop: 5,
    fontSize: 16,
    color: '#666',
  }
});

export default SplashLoader;
