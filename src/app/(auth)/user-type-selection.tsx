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
        <TouchableOpacity 
          onPress={() => router.push("/login")}
          style={{
            paddingVertical: 16,
            paddingHorizontal: 20,
            alignItems: 'center',
            marginTop: theme.spacing.lg
          }}
        >
          <Text style={globalStyles.registerText}>
            ¿Ya tenés una cuenta?{" "}
            <Text style={globalStyles.textLink}>
              Iniciá Sesión
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
} 