import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator, StyleSheet, ScrollView } from "react-native";
import globalStyles from "../../styles/global";
import theme from "../../constants/theme";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import { UserRole } from "../../data/Usuario";

function isValidEmail(email: string) {
  // Simple email regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPassword(password: string) {
  // Al menos 6 caracteres
  return password.length >= 6;
}

export default function Register() {
  const router = useRouter();
  const { userType } = useLocalSearchParams<{ userType?: 'gym' | 'client' }>();
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Campos específicos para gimnasio
  const [businessName, setBusinessName] = useState("");
  const [address, setAddress] = useState("");
  
  useEffect(() => {
    if (!userType) {
      router.replace("/user-type-selection");
    }
  }, [userType]);

  const handleSend = async () => {
    if (!name.trim()) {
      setError("Por favor ingresa tu nombre completo");
      return;
    }
    
    if (!isValidEmail(email)) {
      setError("Por favor ingresa un correo válido");
      return;
    }

    if (!isValidPassword(password)) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

   
    if (userType === 'gym') {
      if (!businessName.trim()) {
        setError("Por favor ingresa el nombre del gimnasio");
        return;
      }
      if (!address.trim()) {
        setError("Por favor ingresa la dirección");
        return;
      }
    } else {
      if (!selectedDate) {
        setError("Por favor selecciona tu fecha de nacimiento");
        return;
      }
      if (!selectedOption) {
        setError("Por favor selecciona un gimnasio");
        return;
      }
    }

    setIsLoading(true);
    setError("");

    // Simular proceso de registro
    setTimeout(() => {
      setIsLoading(false);
      router.push("/login");
    }, 2000);
  };

  const getButtonDisabledState = () => {
    const commonFields = !name.trim() || !email || !password || isLoading;
    
    if (userType === 'gym') {
      return commonFields || !businessName.trim() || !address.trim();
    } else {
      return commonFields || !selectedDate || !selectedOption;
    }
  };

  const isButtonDisabled = getButtonDisabledState();

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={globalStyles.logoContainer}>
          <Image
            source={require("../../../assets/icon.png")}
            style={globalStyles.logo}
          />
        </View>
        <Text style={globalStyles.title}>
          {userType === 'gym' ? 'Registrar Gimnasio' : 'Crea una nueva cuenta'}
        </Text>

        <Text style={globalStyles.label}>
          {userType === 'gym' ? 'NOMBRE DEL RESPONSABLE' : 'NOMBRE Y APELLIDO'}
        </Text>
        <TextInput
          style={globalStyles.input}
          placeholder={userType === 'gym' ? "Juan Pérez" : "Mirtho Legrand"}
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
        />
        
        {userType === 'gym' && (
          <>
            <Text style={globalStyles.label}>NOMBRE DEL GIMNASIO</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="FitCenter Plus"
              placeholderTextColor="#999"
              value={businessName}
              onChangeText={setBusinessName}
            />
          </>
        )}

        <Text style={globalStyles.label}>CORREO ELECTRÓNICO</Text>
        <TextInput
          style={globalStyles.input}
          placeholder="correo@ejemplo.com"
          placeholderTextColor="#999"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={globalStyles.label}>CONTRASEÑA</Text>
        <TextInput
          style={globalStyles.input}
          placeholder="********"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {userType === 'gym' ? (
          <>
            <Text style={globalStyles.label}>DIRECCIÓN</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="Av. Corrientes 1234, CABA"
              placeholderTextColor="#999"
              value={address}
              onChangeText={setAddress}
            />


          </>
        ) : (
          <>
            <Text style={globalStyles.label}>FECHA DE NACIMIENTO</Text>
            <TouchableOpacity style={globalStyles.pickerContainer}>
              <Text style={selectedDate ? globalStyles.pickerText : globalStyles.pickerTextPlaceholder}>
                {selectedDate
                  ? selectedDate.toLocaleDateString("es-ES")
                  : "Seleccionar"}
              </Text>
              <MaterialCommunityIcons
                name="calendar-outline"
                size={20}
                color={theme.colors.primary}
              />
            </TouchableOpacity>

            <Text style={globalStyles.label}>GIMNASIO</Text>
            <TouchableOpacity style={globalStyles.pickerContainer}>
              <Text style={selectedOption ? globalStyles.pickerText : globalStyles.pickerTextPlaceholder}>
                {selectedOption ? selectedOption : "Seleccionar"}
              </Text>
              <MaterialIcons
                name="arrow-drop-down"
                size={24}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          </>
        )}
        
        {error ? (
          <Text style={globalStyles.errorText}>{error}</Text>
        ) : null}
        
        <TouchableOpacity 
          style={isButtonDisabled ? globalStyles.LoginButtonDisabled : globalStyles.LoginButton} 
          onPress={handleSend}
          disabled={isButtonDisabled}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={globalStyles.buttonText}>Registrarse</Text>
          )}
        </TouchableOpacity>

        <Text style={globalStyles.registerText}>
          ¿Ya estás registrado?{" "}
          <Text
            style={globalStyles.textLink}
            onPress={() => router.push("/login")}
          >
            Iniciar Sesión
          </Text>
        </Text>

        <Text style={[globalStyles.registerText, { marginTop: theme.spacing.xs }]}>
          ¿Querés cambiar el tipo de usuario?{" "}
          <Text
            style={globalStyles.textLink}
            onPress={() => router.push("/user-type-selection")}
          >
            Volver
          </Text>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    alignItems: "center",
    paddingTop: theme.spacing.xl * 1.5, 
    paddingBottom: theme.spacing.xl,
  },
});
