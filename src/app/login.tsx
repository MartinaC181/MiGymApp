import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

import globalStyles from "../styles/global";
import theme from "../constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Logo */}
        <View style={globalStyles.logoContainer}>
          <Image
            source={require("../assets/icon.png")}
            style={globalStyles.logo}
          />
        </View>

        {/* Correo */}
        <Text style={globalStyles.label}>CORREO ELECTRÓNICO</Text>
        <TextInput
          style={globalStyles.input}
          placeholder="correo@ejemplo.com"
          placeholderTextColor="#999"
          keyboardType="email-address"
        />

        {/* Contraseña */}
        <Text style={globalStyles.label}>CONTRASEÑA</Text>
        <TextInput
          style={globalStyles.input}
          placeholder="********"
          placeholderTextColor="#999"
          secureTextEntry
        />

        {/* Botón */}
        <TouchableOpacity
          style={globalStyles.loginButton}
          onPress={() => router.push("/home")}
        >
          <Text style={globalStyles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>

        {/* ¿Olvidaste tu contraseña? */}
        <TouchableOpacity>
          <Text style={globalStyles.forgotPassword}
          onPress={() => router.push("/forgot-password")}>
            ¿Olvidaste la contraseña?
          </Text>
        </TouchableOpacity>

        {/* Registro */}
        <Text style={globalStyles.registerText}>
          ¿No estás registrado todavía?{" "}
          <Text
            style={globalStyles.textLink}
            onPress={() => router.push("/register")}
          >
            Regístrate
          </Text>
        </Text>

        {/* Google */}
        <TouchableOpacity style={globalStyles.socialButton}>
          <MaterialCommunityIcons name="google" size={24} color="#DB4437" />
          <Text style={globalStyles.socialText}>Iniciar sesión con Google</Text>
        </TouchableOpacity>

        {/* Facebook */}
        <TouchableOpacity style={globalStyles.socialButton}>
          <MaterialCommunityIcons name="facebook" size={24} color="#4267B2" />
          <Text style={globalStyles.socialText}>
            Iniciar sesión con Facebook
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.surface, // fondo gris claro
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    justifyContent: "center",
  },
});
