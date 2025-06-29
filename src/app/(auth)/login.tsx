import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { createGlobalStyles } from "../../styles/global";
import { useTheme } from "../../context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { getUserByCredentials, ClientUser, GymUser } from "../../data/Usuario";
import { authenticateUser, initializeAppData, saveUser, saveSession } from "../../utils/storage";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { theme, isDarkMode } = useTheme();

  // Crear estilos dinámicos basados en el tema actual
  const styles = createGlobalStyles(theme);

  // Inicializar datos de la app al cargar
  React.useEffect(() => {
    initializeAppData();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Por favor completa todos los campos");
      return;
    }

    setIsLoading(true);
    setError("");

    // Autenticar usuario usando AsyncStorage
    try {
      const user = await authenticateUser(email, password);
      
      if (!user) {
        // Si no existe en AsyncStorage, intentar con usuarios hardcodeados
        const hardcodedUser = getUserByCredentials(email, password);
        if (hardcodedUser) {
          // Guardar en AsyncStorage para próximas veces
          await saveUser(hardcodedUser);
          await saveSession(hardcodedUser);
          
          // Redirigir según el tipo de usuario
          if (hardcodedUser.role === 'gym') {
            router.push("/(gimnasio)/gestion-socios");
          } else {
            router.push("/home");
          }
        } else {
          setError("Correo o contraseña incorrectos");
        }
      } else {
        setError("");
        
        // Redirigir según el tipo de usuario
        if (user.role === 'gym') {
          router.push("/(gimnasio)/gestion-socios");
        } else {
          router.push("/home");
        }
      }
    } catch (error) {
      setError("Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  const isButtonDisabled = isLoading || !email || !password;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: theme.spacing.lg,
          paddingTop: 60,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View style={{
          alignItems: "center",
          marginBottom: theme.spacing.lg,
        }}>
          <Image
            source={require("../../../assets/icon.png")}
            style={styles.logo}
          />
        </View>

        {/* Formulario */}
        <View style={{
          width: '100%',
          maxWidth: 400,
          alignItems: 'center',
        }}>
          {/* Correo */}
          <Text style={styles.label}>CORREO ELECTRÓNICO</Text>
          <TextInput
            style={[styles.input, {
              backgroundColor: theme.colors.inputBackground,
              borderColor: theme.colors.border,
              shadowColor: theme.colors.shadowColor,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }]}
            placeholder="correo@ejemplo.com"
            placeholderTextColor={theme.colors.textSecondary}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
          />

          {/* Contraseña */}
          <Text style={[styles.label, { marginTop: theme.spacing.sm }]}>CONTRASEÑA</Text>
          <View style={{ position: 'relative', width: '100%' }}>
            <TextInput
              style={[styles.input, {
                backgroundColor: theme.colors.inputBackground,
                borderColor: theme.colors.border,
                shadowColor: theme.colors.shadowColor,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
                paddingRight: 50, // Espacio para el icono
              }]}
              placeholder="********"
              placeholderTextColor={theme.colors.textSecondary}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />

            {/* Mostrar/ocultar contraseña */}
            <TouchableOpacity
              style={{
                position: 'absolute',
                right: theme.spacing.md,
                top: 10,
                height: 25,
                width: 25,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => setShowPassword(!showPassword)}
            >
              <MaterialCommunityIcons 
                name={showPassword ? "eye-off" : "eye"} 
                size={24} 
                color={theme.colors.textSecondary} 
              />
            </TouchableOpacity>
          </View>

          {/* Mensaje de error */}
          {error !== "" && (
            <Text style={[styles.errorText, { marginTop: theme.spacing.xs, marginBottom: theme.spacing.xs }]}>
              {error}
            </Text>
          )}

          {/* Botón de iniciar sesión */}
          <TouchableOpacity
            style={[isButtonDisabled ? styles.LoginButtonDisabled : styles.LoginButton, { 
              marginTop: theme.spacing.md,
              shadowColor: theme.colors.shadowColor,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: isButtonDisabled ? (isDarkMode ? 0.1 : 0.05) : (isDarkMode ? 0.3 : 0.15),
              shadowRadius: 8,
              elevation: isButtonDisabled ? (isDarkMode ? 2 : 1) : (isDarkMode ? 6 : 4),
            }]}
            onPress={handleLogin}
            disabled={isButtonDisabled}
          >
            {isLoading ? (
              <ActivityIndicator color={theme.colors.background} />
            ) : (
              <Text style={[styles.buttonText, {
                color: isButtonDisabled ? (isDarkMode ? '#888888' : '#666666') : theme.colors.background,
              }]}>
                INICIAR SESIÓN
              </Text>
            )}
          </TouchableOpacity>

          {/* ¿Olvidaste tu contraseña? */}
          <TouchableOpacity 
            onPress={() => router.push("/forgot-password")}
            style={{
              paddingVertical: theme.spacing.xs,
              paddingHorizontal: theme.spacing.lg,
              alignItems: 'center',
              width: '100%',
              marginTop: theme.spacing.xs,
            }}
          >
            <Text style={{
              color: theme.colors.textSecondary,
              fontSize: theme.typography.fontSize.medium,
              textAlign: "center",
              textDecorationLine: "underline",
              fontFamily: theme.typography.fontFamily.regular,
            }}>
              ¿Olvidaste la contraseña?
            </Text>
          </TouchableOpacity>

          {/* ¿No estás registrado? */}
          <TouchableOpacity 
            onPress={() => router.push("/user-type-selection")}
            style={{
              paddingVertical: theme.spacing.xs,
              paddingHorizontal: theme.spacing.lg,
              alignItems: 'center',
              marginTop: theme.spacing.sm,
              marginBottom: theme.spacing.md,
              width: '100%',
            }}
          >
            <Text style={{
              textAlign: "center",
              color: theme.colors.textSecondary,
              fontSize: theme.typography.fontSize.medium,
              fontFamily: theme.typography.fontFamily.regular,
              lineHeight: 22,
            }}>
              ¿No estás registrado todavía?{"\n"}
              <Text style={{
                color: theme.colors.primary,
                fontFamily: theme.typography.fontFamily.bold,
                textDecorationLine: "underline",
              }}>
                Regístrate aquí
              </Text>
            </Text>
          </TouchableOpacity>

          {/* Botones de redes sociales */}
          <TouchableOpacity style={[styles.socialButton, { 
            marginBottom: theme.spacing.sm,
            backgroundColor: theme.colors.socialButtonBackground,
            shadowColor: theme.colors.shadowColor,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
          }]}>
            <MaterialCommunityIcons name="google" size={24} color="#DB4437" />
            <Text style={styles.socialText}>Iniciar sesión con Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.socialButton, {
            backgroundColor: theme.colors.socialButtonBackground,
            shadowColor: theme.colors.shadowColor,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
          }]}>
            <MaterialCommunityIcons name="facebook" size={24} color="#4267B2" />
            <Text style={styles.socialText}>Iniciar sesión con Facebook</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
