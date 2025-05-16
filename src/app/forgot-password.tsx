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
import globalStyles from "../styles/global";
import { router } from "expo-router";

export default function ForgotPassword() {
  const [visible, setVisible] = useState(false);

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={globalStyles.container}>
        {/* Logo */}
        <View style={globalStyles.logoContainer}>
          <Image
            source={require("../assets/icon.png")}
            style={globalStyles.logo}
          />
        </View>

        {/* Título */}
        <Text style={globalStyles.title}>¿Olvidaste tu contraseña?</Text>

        {/* Correo */}
        <Text style={globalStyles.label}>CORREO ELECTRÓNICO</Text>
        <TextInput
          style={globalStyles.input}
          placeholder="prueba@canvaprog.com"
          placeholderTextColor="#999"
          keyboardType="email-address"
        />

        {/* Botón Enviar */}
        <TouchableOpacity
          style={globalStyles.primaryButton}
          onPress={() => setVisible(true)}
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
              style={globalStyles.loginButton}
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
