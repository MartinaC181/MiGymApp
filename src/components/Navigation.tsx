// src/components/Navigation.tsx
import React, { useEffect, useState } from 'react';
import { View, Pressable, Text, Keyboard } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles/navigation';
import theme from '../constants/theme';

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Añadir listeners para el teclado
  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  // Función auxiliar para crear cada botón con su texto
  const NavItem = ({
    iconName,
    route,
  }: {
    iconName: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
    route: string;
  }) => {
    const isActive = pathname === route;
    
    return (
      <View style={styles.navItemWrapper}>
        <Pressable
          style={({ pressed }) => [
            styles.iconContainer,
            isActive && styles.iconContainerActive,
            pressed ? styles.iconContainerPressed : {},
          ]}
          onPress={() => router.push(route)}
        >
          <MaterialCommunityIcons
            name={iconName}
            size={36}
            color={theme.colors.primary}
          />
        </Pressable>
      </View>
    );
  };

  // Si el teclado está visible, no mostrar la navegación
  if (keyboardVisible) {
    return null;
  }

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <View style={styles.container}>
        <NavItem iconName="home" route="/home" />
        <NavItem iconName="weight-lifter" route="/rutina" />
        <NavItem iconName="wallet" route="/cuota" />
        <NavItem iconName="account" route="/perfil" />
      </View>
    </SafeAreaView>
  );
}


