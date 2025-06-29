import React, { useState, useEffect } from 'react';
import { View, Keyboard } from 'react-native';
import { Slot, usePathname } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import useTabsLayoutStyles from '../../styles/tabsLayout';
import Navigation from '../../components/Navigation';
import Header from '../../components/Header';

export default function TabsLayout() {
  const pathname = usePathname();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const styles = useTabsLayoutStyles();
  
  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  // Función para obtener el título basado en la ruta actual
  const getHeaderTitle = (path: string) => {
    if (path.includes('/home')) return 'Inicio';
    if (path.includes('/clases')) return 'Clases';
    if (path.includes('/rutina')) return 'Rutina';
    if (path.includes('/entrenamiento')) return 'Entrenamiento';
    if (path.includes('/cuota')) return 'Cuota';
    if (path.includes('/perfil')) return 'Perfil';
    if (path.includes('/Imc')) return 'IMC';
    if (path.includes('/EditProfile')) return 'Editar Perfil';
    if (path.includes('/Settings')) return 'Configuración';
    if (path.includes('/GrupoDetalle')) return 'Editar Rutina';
    if (path.includes('/facturacion')) return 'Facturación';
    if (path.includes('/temporizador')) return 'Temporizador';
    if (path.includes('/calculadora-rpm')) return 'Calculadora 1RM';
    return 'Mi Gym App';
  };

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <Header title={getHeaderTitle(pathname)} showBack />
      <View style={styles.content}>
        <Slot />
      </View>
      {!keyboardVisible && <Navigation />}
    </SafeAreaView>
  );
}




