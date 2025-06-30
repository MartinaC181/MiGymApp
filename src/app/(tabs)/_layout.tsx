import React, { useState, useEffect } from 'react';
import { View, Keyboard } from 'react-native';
import { Slot, usePathname } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import useTabsLayoutStyles from '../../styles/tabsLayout';
import Navigation from '../../components/Navigation';
import Header from '../../components/Header';
import { useTheme } from '../../context/ThemeContext';

export default function TabsLayout() {
  const pathname = usePathname();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const styles = useTabsLayoutStyles();
  const { timerState, setTimerState } = useTheme();
  
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
    // Si estamos en temporizador, mostrar título dinámico según el estado
    if (path.includes('/temporizador')) {
      if (timerState === 'timer') return 'Temporizador';
      if (timerState === 'stopwatch') return 'Cronómetro';
      return 'Reloj';
    }
    
    if (path.includes('/home')) return 'Inicio';
    if (path.includes('/clases')) return 'Clases';
    if (path.includes('/rutina')) return 'Rutina';
    if (path.includes('/entrenamiento')) return 'Entrenamiento';
    if (path.includes('/cuota')) return 'Cuota';
    if (path.includes('/perfil')) return 'Perfil';
    if (path.includes('/perfil-gimnasio')) return 'Perfil del Gimnasio';
    if (path.includes('/Imc')) return 'IMC';
    if (path.includes('/EditProfile')) return 'Editar Perfil';
    if (path.includes('/Settings')) return 'Configuración';
    if (path.includes('/GrupoDetalle')) return 'Editar Rutina';
    if (path.includes('/facturacion')) return 'Facturación';
    if (path.includes('/gestion-clases')) return 'Gestión de Clases';
    if (path.includes('/gestion-socios')) return 'Gestión de Socios';
    if (path.includes('/gestion-cuotas')) return 'Gestión de Cuotas';
    if (path.includes('/socios')) return 'Socios';
    if (path.includes('/calculadora-rpm')) return 'Calculadora 1RM';

    return 'Mi Gym App';
  };

  // Función para manejar el botón de volver
  const handleBack = () => {
    // Si estamos en temporizador y hay una herramienta activa, volver a la selección
    if (pathname.includes('/temporizador') && timerState !== 'selection') {
      setTimerState('selection');
      return;
    }
    // Comportamiento normal para otras pantallas
    return null; // Esto permitirá que el Header maneje la navegación normal
  };

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <Header 
        title={getHeaderTitle(pathname)} 
        showBack 
        onBackPress={handleBack}
      />
      <View style={styles.content}>
        <Slot />
      </View>
      {!keyboardVisible && <Navigation />}
    </SafeAreaView>
  );
}




