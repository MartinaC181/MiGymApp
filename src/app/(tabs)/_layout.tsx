// app/(tabs)/_layout.tsx
import React from 'react';
import { View } from 'react-native';
import { Slot, usePathname } from 'expo-router';
import styles from '../../styles/tabsLayout';
import Navigation from '../../components/Navigation';
import Header from '../../components/Header';

export default function TabsLayout() {
  const pathname = usePathname();
  
  // Función para obtener el título basado en la ruta actual
  const getHeaderTitle = (path: string) => {
    if (path.includes('/home')) return 'Inicio';
    if (path.includes('/rutina')) return 'Rutina';
    if (path.includes('/cuota')) return 'Cuota';
    if (path.includes('/perfil')) return 'Perfil';
    if (path.includes('/Imc')) return 'IMC';
    if (path.includes('/EditProfile')) return 'Editar Perfil';
    if (path.includes('/Settings')) return 'Configuración';
    if (path.includes('/GrupoDetalle')) return 'Editar Rutina';
    if (path.includes('/facturacion')) return 'Facturación';
    return 'Mi Gym App';
  };

  return (
    <View style={styles.container}>
      <Header title={getHeaderTitle(pathname)} />
      <View style={styles.content}>
        <Slot />
      </View>
      <Navigation />
    </View>
  );
}




