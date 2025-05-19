import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import globalStyles from "../styles/global";
import theme from "../constants/theme";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";

export default function Register() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={globalStyles.container}>
        <View style={globalStyles.logoContainer}>
          <Image
            source={require("../../assets/icon.png")}
            style={globalStyles.logo}
          />
        </View>
        <Text style={globalStyles.title}>Crea una nueva cuenta</Text>

        <Text style={globalStyles.label}>NOMBRE Y APELLIDO</Text>
        <TextInput
          style={globalStyles.input}
          placeholder="Mirtho Legrand"
          placeholderTextColor="#999"
        />

        <Text style={globalStyles.label}>CORREO ELECTRÓNICO</Text>
        <TextInput
          style={globalStyles.input}
          placeholder="correo@ejemplo.com"
          placeholderTextColor="#999"
          keyboardType="email-address"
        />

        <Text style={globalStyles.label}>CONTRASEÑA</Text>
        <TextInput
          style={globalStyles.input}
          placeholder="********"
          placeholderTextColor="#999"
          secureTextEntry
        />

        <Text style={globalStyles.label}>FECHA DE NACIMIENTO</Text>
        <View style={globalStyles.pickerContainer}>
          <Text style={globalStyles.pickerText}>
            {selectedDate ? selectedDate.toLocaleDateString("es-ES") : "Seleccionar"}
          </Text>
          <MaterialCommunityIcons
            name="calendar-outline"
            size={20}
            color={theme.colors.primary}
          />
        </View>

        <Text style={globalStyles.label}>GIMNASIO</Text>
        <View style={globalStyles.pickerContainer}>
          <Text style={globalStyles.pickerText}>
            {selectedOption ? selectedOption : "Seleccionar"}
          </Text>
          <MaterialIcons
            name="arrow-drop-down"
            size={24}
            color={theme.colors.primary}
          />
        </View>

        <Text style={globalStyles.registerText}>
          ¿Ya estás registrado?{" "}
          <Text
            style={globalStyles.textLink}
            onPress={() => router.push("/login")}
          >
            Iniciar Sesión
          </Text>
        </Text>

        <TouchableOpacity style={globalStyles.loginButton}>
          <Text style={globalStyles.buttonText}>Registrarse</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
