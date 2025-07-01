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
import { router } from "expo-router";
import { createGlobalStyles } from "../../styles/global";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import React from "react";
import { getCurrentUser, updateUserProfile } from "../../utils/storage";

export default function ResetPassword() {
  const { theme } = useTheme();
  const globalStyles = createGlobalStyles(theme);
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [visibleSuccess, setVisibleSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!password || !confirmPassword) {
      setError("Por favor, complete ambos campos.");
    } else if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
    } else {
      setError("");
      // Actualizar la contraseña en el storage
      const user = await getCurrentUser();
      if (user) {
        await updateUserProfile(user.id, { password });
      }
      setVisibleSuccess(true);

    }
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
        <Text style={globalStyles.title}>Restablecer contraseña</Text>

        {/* Nueva contraseña */}
        <Text style={globalStyles.label}>NUEVA CONTRASEÑA</Text>
        <TextInput
          style={globalStyles.input}
          placeholder="********"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Confirmar contraseña */}
        <Text style={globalStyles.label}>CONFIRME SU CONTRASEÑA</Text>
        <TextInput
          style={globalStyles.input}
          placeholder="********"
          placeholderTextColor="#999"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        {/* Mensaje de error */}
        {error !== "" && <Text style={globalStyles.errorText}>{error}</Text>}

        {/* Botón Aceptar */}
        <TouchableOpacity
          style={globalStyles.Button}
          onPress={handleSubmit}
        >
          <Text style={globalStyles.buttonText}>Aceptar</Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={visibleSuccess}
        transparent
        animationType="fade"
        onRequestClose={() => setVisibleSuccess(false)}
      >
        <View style={globalStyles.modalOverlay}>
          <View style={globalStyles.successContainer}>
            <Text style={globalStyles.successTitle}>
              ¡Su contraseña se restableció con éxito!
            </Text>

            <MaterialCommunityIcons
              name="check-circle-outline"
              size={64}
              color={theme.colors.primary}
              style={{ marginVertical: theme.spacing.lg }}
            />

            <TouchableOpacity>
                <Text style={{ color: theme.colors.textPrimary }}>Volver a <Text  style={globalStyles.successLink} onPress={() => router.replace("/login")}>iniciar sesión.</Text></Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
