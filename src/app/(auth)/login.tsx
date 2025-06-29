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
import globalStyles from "../../styles/global";
import theme from "../../constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { getUserByCredentials, ClientUser, GymUser } from "../../data/Usuario";
import { authenticateUser, initializeAppData, saveUser, saveSession } from "../../utils/storage";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    <SafeAreaView style={globalStyles.safeArea}>
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
          marginBottom: theme.spacing.xl,
        }}>
          <Image
            source={require("../../../assets/icon.png")}
            style={globalStyles.logo}
          />
        </View>

        {/* Formulario */}
        <View style={{
          width: '100%',
          maxWidth: 400,
          alignItems: 'center',
        }}>
          {/* Correo */}
          <Text style={globalStyles.label}>CORREO ELECTRÓNICO</Text>
          <TextInput
            style={globalStyles.input}
            placeholder="correo@ejemplo.com"
            placeholderTextColor="#999"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
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
            autoCapitalize="none"
            autoCorrect={false}
          />

          {/* Mensaje de error */}
          {error !== "" && (
            <Text style={[globalStyles.errorText, { marginBottom: theme.spacing.md }]}>
              {error}
            </Text>
          )}

          {/* Botón de iniciar sesión */}
          <TouchableOpacity
            style={isButtonDisabled ? globalStyles.LoginButtonDisabled : globalStyles.LoginButton}
            onPress={handleLogin}
            disabled={isButtonDisabled}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={globalStyles.buttonText}>INICIAR SESIÓN</Text>
            )}
          </TouchableOpacity>

          {/* ¿Olvidaste tu contraseña? */}
          <TouchableOpacity 
            onPress={() => router.push("/forgot-password")}
            style={{
              paddingVertical: theme.spacing.md,
              paddingHorizontal: theme.spacing.lg,
              alignItems: 'center',
              width: '100%',
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

          {/* Separador */}
          <View style={{
            height: 1,
            backgroundColor: '#E0E0E0',
            width: '100%',
            marginVertical: theme.spacing.lg,
          }} />

          {/* ¿No estás registrado? */}
          <TouchableOpacity 
            onPress={() => router.push("/user-type-selection")}
            style={{
              paddingVertical: theme.spacing.md,
              paddingHorizontal: theme.spacing.lg,
              alignItems: 'center',
              marginBottom: theme.spacing.lg,
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
          <TouchableOpacity style={[globalStyles.socialButton, { marginBottom: theme.spacing.md }]}>
            <MaterialCommunityIcons name="google" size={24} color="#DB4437" />
            <Text style={globalStyles.socialText}>Iniciar sesión con Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={globalStyles.socialButton}>
            <MaterialCommunityIcons name="facebook" size={24} color="#4267B2" />
            <Text style={globalStyles.socialText}>Iniciar sesión con Facebook</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
