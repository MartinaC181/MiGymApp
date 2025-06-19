// src/components/Navigation.tsx
import React, { useEffect, useState } from 'react';
import { View, Pressable, Text, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles/navigation';
import theme from '../constants/theme';

export default function Navigation() {
  const router = useRouter();
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
    label,
  }: {
    iconName: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
    route: string;
    label: string;
  }) => (
    <View style={styles.navItemWrapper}>
      <Pressable
        style={({ pressed }) => [
          styles.iconContainer,
          pressed ? styles.iconContainerPressed : {},
        ]}
        onPress={() => router.push(route)}
      >
        <MaterialCommunityIcons
          name={iconName}
          size={32}
          color={theme.colors.primary}
        />
      </Pressable>
      <Text style={styles.iconText}>{label}</Text>
    </View>
  );

  // Si el teclado está visible, no mostrar la navegación
  if (keyboardVisible) {
    return null;
  }

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <View style={styles.container}>
        <NavItem iconName="home" route="/home" label="Inicio" />
        <NavItem iconName="weight-lifter" route="/rutina" label="Rutina" />
        <NavItem iconName="wallet" route="/cuota" label="Cuota" />
        <NavItem iconName="account" route="/perfil" label="Perfil" />
      </View>
    </SafeAreaView>
  );
}


