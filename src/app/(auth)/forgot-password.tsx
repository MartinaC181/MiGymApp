import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Modal,
} from "react-native";
import { useState } from "react";
import { createGlobalStyles } from "../../styles/global";
import { router } from "expo-router";
import React from "react";
import { useTheme } from "../../context/ThemeContext";

function isValidEmail(email: string) {
  // Simple email regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function ForgotPassword() {
  const { theme } = useTheme();
  const globalStyles = createGlobalStyles(theme);
  
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSend = () => {
    if (!isValidEmail(email)) {
      setError("Por favor ingresa un correo válido.");
      return;
    }
    setError("");
    setVisible(true);
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

        {/* Título */}
        <Text style={globalStyles.title}>¿Olvidaste tu contraseña?</Text>

        {/* Correo */}
        <Text style={globalStyles.label}>INGRESA TU CORREO</Text>

        <TextInput
          style={globalStyles.input}
          placeholder="prueba@canvaprog.com"
          placeholderTextColor={theme.colors.textSecondary}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        {error ? (
          <Text style={[globalStyles.errorText, { marginBottom: 8 }]}>{error}</Text>
        ) : null}

        {/* Botón Enviar */}
        <TouchableOpacity
          style={globalStyles.Button}
          onPress={handleSend}
        >
          <Text style={globalStyles.buttonText}>Enviar</Text>
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <View style={globalStyles.modalOverlay}>
          <View style={globalStyles.modalContainer}>
            <Text style={globalStyles.modalTitle}>Mensaje enviado</Text>
            <Text style={globalStyles.modalText}>
              Te hemos enviado un correo electrónico con un enlace para
              restablecer tu contraseña
            </Text>
            <TouchableOpacity
              style={globalStyles.Button}
              onPress={() => {
                setVisible(false);
                router.push("/reset-password");
              }}
            >
              <Text style={globalStyles.buttonText}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
