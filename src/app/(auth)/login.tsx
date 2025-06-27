import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import globalStyles from "../../styles/global";
import theme from "../../constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { getUserByCredentials, ClientUser, GymUser } from "../../data/Usuario";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Por favor completa todos los campos");
      return;
    }

    setIsLoading(true);
    setError("");

    // Simular delay de carga
    setTimeout(() => {
      const user = getUserByCredentials(email, password);
      
      if (!user) {
        setError("Correo o contraseña incorrectos");
      } else {
        setError("");

        if (user.role === 'gym') {
     
          router.push("/home");
        } else {

          router.push("/home");
        }
      }
      setIsLoading(false);
    }, 1000);
  };

  const isButtonDisabled = isLoading || !email || !password;

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

        {/* Título invisible para alineación */}
        <View style={globalStyles.logoSpacer} />

        {/* Correo */}
        <Text style={globalStyles.label}>CORREO ELECTRÓNICO</Text>
        <TextInput
          style={globalStyles.input}
          placeholder="correo@ejemplo.com"
          placeholderTextColor="#999"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        {/* Contraseña */}
        <Text style={globalStyles.label}>CONTRASEÑA</Text>
        <TextInput
          style={globalStyles.input}
          placeholder="********"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {/* Mensaje de error */}
        {error !== "" && <Text style={globalStyles.errorText}>{error}</Text>}

        {/* Botón */}
        <TouchableOpacity
          style={isButtonDisabled ? globalStyles.LoginButtonDisabled : globalStyles.LoginButton}
          onPress={handleLogin}
          disabled={isButtonDisabled}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
          <Text style={globalStyles.buttonText}>Iniciar Sesión</Text>
          )}
        </TouchableOpacity>

        {/* ¿Olvidaste tu contraseña? */}
        <TouchableOpacity>
          <Text
            style={globalStyles.forgotPassword}
            onPress={() => router.push("/forgot-password")}
          >
            ¿Olvidaste la contraseña?
          </Text>
        </TouchableOpacity>

        {/* Registro */}
        <Text style={globalStyles.registerText}>
          ¿No estás registrado todavía?{" "}
          <Text
            style={globalStyles.textLink}
            onPress={() => router.push("/user-type-selection")}
          >
            Regístrate
          </Text>
        </Text>

        
        <TouchableOpacity style={globalStyles.socialButton}>
          <MaterialCommunityIcons name="google" size={24} color="#DB4437" />
          <Text style={globalStyles.socialText}>Iniciar sesión con Google</Text>
        </TouchableOpacity>

        
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
