import React, { useEffect, useRef } from 'react';
import { View, Animated, Image } from 'react-native';
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
  duration = 3000 
}) => {
  const progressValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {

    Animated.timing(progressValue, {
      toValue: 1,
      duration: duration,
      useNativeDriver: false,
    }).start();
  }, [duration]);

  const strokeWidth = size * 0.07;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const strokeDashoffset = progressValue.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  return (
    <View style={globalStyles.containerLoad}>
      <View style={globalStyles.loaderContainer}>

        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={theme.colors.surface} 
            strokeWidth={strokeWidth}
            fill="none"
          />
        </Svg>

 
        <Svg width={size} height={size} style={globalStyles.progressCircle}>
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={darkerPrimary} 
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </Svg>

    
        <Image
          source={require('../../assets/splash-icon.png')}
          style={{ width: 150, height: 150, position: 'absolute' }}
        />
      </View>
    </View>
  );
};

export default SplashLoader;
