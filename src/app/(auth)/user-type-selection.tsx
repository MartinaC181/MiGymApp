import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import globalStyles from "../../styles/global";
import theme from "../../constants/theme";

export default function UserTypeSelection() {
  const router = useRouter();

  const handleUserTypeSelection = (userType: 'gym' | 'client') => {
    router.push(`/register?userType=${userType}`);
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={globalStyles.container}>
        {/* Logo */}
        <View style={globalStyles.logoContainer}>
          <Image
            source={require("../../../assets/icon.png")}
            style={globalStyles.logo}
          />
        </View>

        <View style={globalStyles.logoSpacer} />

        {/* Título */}
        <Text style={globalStyles.title}>
          ¿Cómo deseas registrarte?
        </Text>

        {/* Botón Gimnasio */}
        <TouchableOpacity 
          style={[globalStyles.LoginButton, { marginBottom: theme.spacing.md }]}
          onPress={() => handleUserTypeSelection('gym')}
        >
          <Text style={globalStyles.buttonText}>Gimnasio</Text>
        </TouchableOpacity>

        {/* Botón Socio */}
        <TouchableOpacity 
          style={globalStyles.LoginButton}
          onPress={() => handleUserTypeSelection('client')}
        >
          <Text style={globalStyles.buttonText}>Socio</Text>
        </TouchableOpacity>

        {/* Link para ir al login */}
        <Text style={[globalStyles.registerText, { marginTop: theme.spacing.lg }]}>
          ¿Ya tenés una cuenta?{" "}
          <Text
            style={globalStyles.textLink}
            onPress={() => router.push("/login")}
          >
            Iniciá Sesión
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
} 