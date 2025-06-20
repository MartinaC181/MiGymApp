import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import globalStyles from "../../styles/global";
import { SafeAreaView } from "react-native-safe-area-context";
import { UsuarioAtleta } from "../../data/UsuarioAtleta";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (email !== UsuarioAtleta.email && password !== UsuarioAtleta.password) {
      setError("Correo y contraseña incorrectos");
    } else if (email !== UsuarioAtleta.email) {
      setError("Correo incorrecto");
    } else if (password !== UsuarioAtleta.password) {
      setError("Contraseña incorrecta");
    } else {
      setError("");
      router.push("/home");
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
          style={globalStyles.LoginButton}
          onPress={handleLogin}

        >
          <Text style={globalStyles.buttonText}>Iniciar Sesión</Text>
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
            onPress={() => router.push("/register")}
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
