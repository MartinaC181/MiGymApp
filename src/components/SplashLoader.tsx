import React, { useEffect, useRef } from 'react';
import { View, Animated, Image, StatusBar } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';
import { createGlobalStyles } from '../styles/global';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface SplashLoaderProps {
  size?: number;
  message?: string;
  duration?: number;
}

const SplashLoader: React.FC<SplashLoaderProps> = ({ 
  size = 120, 
  duration = 2000 
}) => {
  const { theme, isDarkMode } = useTheme();
  const globalStyles = createGlobalStyles(theme);
  const progressValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressValue, {
      toValue: 1,
      duration: duration,
      useNativeDriver: false,
    }).start();
  }, [duration]);

  const strokeWidth = size * 0.06;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const strokeDashoffset = progressValue.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  return (
    <>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <View style={globalStyles.containerLoad}>
        <View style={globalStyles.loaderContainer}>

          <Svg width={size} height={size}>
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={isDarkMode ? '#3A3A3A' : theme.colors.surface} 
              strokeWidth={strokeWidth}
              fill="none"
            />
          </Svg>

          <Svg width={size} height={size} style={globalStyles.progressCircle}>
            <AnimatedCircle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={'#0472bb'}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </Svg>

          <Image
            source={require('../../assets/splash-icon.png')}
            style={{ 
              width: 150, 
              height: 150, 
              position: 'absolute',
              opacity: isDarkMode ? 0.95 : 1
            }}
          />
        </View>
      </View>
    </>
  );
};

export default SplashLoader;
