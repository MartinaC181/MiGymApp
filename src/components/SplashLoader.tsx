// components/SplashLoader.tsx

import React, { useEffect, useRef } from 'react';
import { View, Animated, Text, Image } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import globalStyles from '../styles/global';
import theme from '../constants/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const darkerPrimary = '#007ACC';

interface SplashLoaderProps {
  size?: number;
  message?: string;
  duration?: number;
}

const SplashLoader: React.FC<SplashLoaderProps> = ({ 
  size = 120, 
  message = 'Cargando...', 
  duration = 3000 
}) => {
  const progressValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animación del progreso circular
    Animated.timing(progressValue, {
      toValue: 1,
      duration: duration,
      useNativeDriver: false,
    }).start();
  }, [duration]);

  const strokeWidth = size * 0.08;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const strokeDashoffset = progressValue.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.loaderContainer}>
        {/* Círculo de fondo */}
        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={theme.colors.surface} // Color desde theme
            strokeWidth={strokeWidth}
            fill="none"
          />
        </Svg>

        {/* Círculo de progreso */}
        <Svg width={size} height={size} style={globalStyles.progressCircle}>
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={darkerPrimary} // Color desde theme
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </Svg>

        {/* Ícono en el centro */}
        <Image
          source={require('../assets/splash-icon.png')}
          style={{ width: 150, height: 150, position: 'absolute' }}
        />
      </View>
      <Text style={globalStyles.message}>{message}</Text>
    </View>
  );
};

export default SplashLoader;
