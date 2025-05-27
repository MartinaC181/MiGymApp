// app/_layout.tsx
import React, { useEffect } from "react";
import { Slot } from "expo-router";
import { View, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";

import theme from "../constants/theme"; // ruta a tu archivo theme.ts
import { GluestackUIProvider } from "../components/ui/gluestack-ui-provider";

// Evita que el splash se oculte automáticamente hasta que carguen las fuentes
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    [theme.typography.fontFamily.regular]: Roboto_400Regular,
    [theme.typography.fontFamily.medium]: Roboto_500Medium,
    [theme.typography.fontFamily.bold]: Roboto_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Mientras no carguen las fuentes, no renderizamos nada
  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      {/* Proveedor de Gluestack UI para temas y estilos */}
      <GluestackUIProvider>
        <View style={styles.container}>
          <Slot />
        </View>
      </GluestackUIProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});

// export default function Layout() {
//     return (
//         <View style={styles.container}>
//             <Slot />
//         </View>
//     );
// }
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'white'
//     }
// });
