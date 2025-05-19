// src/components/Navigation.tsx
import React from 'react';
import { View, Pressable, Text } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles/navigation';
import theme from '../constants/theme';

export default function Navigation() {
  const router = useRouter();

  // Función auxiliar para crear cada botón
  const NavButton = ({
    iconName,
    label,
    route,
  }: {
    iconName: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
    label: string;
    route: string;
  }) => (
    <Pressable
      style={({ pressed }) => [
        styles.iconContainer,
        pressed && styles.iconContainerPressed,
      ]}
      onPress={() => router.push(route)}
    >
      <MaterialCommunityIcons
        name={iconName}
        size={32}
        color={theme.colors.primary}
      />
      <Text style={styles.iconText}>{label}</Text>
    </Pressable>
  );

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <View style={styles.container}>
        <NavButton iconName="home"        label="Inicio" route="/home"   />
        <NavButton iconName="weight-lifter" label="Rutina" route="/rutina" />
        <NavButton iconName="wallet"      label="Cuota"  route="/cuota"  />
        <NavButton iconName="account"     label="Perfil" route="/perfil" />
      </View>
    </SafeAreaView>
  );
}


