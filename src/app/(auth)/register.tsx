import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Modal,
} from "react-native";
import { createGlobalStyles } from "../../styles/global";
import { useTheme } from "../../context/ThemeContext";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { UserRole, ClientUser, GymUser } from "../../data/Usuario";
import BirthDateWheel from "../../components/BirthDateWheel";
import {
  saveUser,
  saveSession,
  getGymNames,
  getGymUserByBusinessName,
  addGymClient,
} from "../../utils/storage";

function isValidEmail(email: string) {
  // Simple email regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPassword(password: string) {
  // Al menos 6 caracteres
  return password.length >= 6;
}

function isValidDni(dni: string) {
  return /^\d{7,8}$/.test(dni);
}

export default function Register() {
  const { theme } = useTheme();
  const globalStyles = createGlobalStyles(theme);

  const router = useRouter();
  const { userType } = useLocalSearchParams<{ userType?: "gym" | "client" }>();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showGymSuggestions, setShowGymSuggestions] = useState(false);
  const [gymQuery, setGymQuery] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSelectingGym, setIsSelectingGym] = useState(false);
  const [isEditingGym, setIsEditingGym] = useState(false);
  const [visibleSuccess, setVisibleSuccess] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Campos específicos para gimnasio
  const [businessName, setBusinessName] = useState("");
  const [address, setAddress] = useState("");

  // Lista de gimnasios disponibles (cargada desde AsyncStorage)
  const [gymOptions, setGymOptions] = useState<string[]>([]);

  // Campo para el DNI (solo cliente)
  const [dni, setDni] = useState("");

  useEffect(() => {
    if (!userType) {
      router.replace("/user-type-selection");
    }
  }, [userType]);

  // Cargar gimnasios desde AsyncStorage al montar el componente
  useEffect(() => {
    const loadGyms = async () => {
      try {
        const gyms = await getGymNames();
        setGymOptions(gyms);
      } catch (error) {
        console.error("Error cargando gimnasios:", error);
        // Fallback a gimnasios por defecto en caso de error
        setGymOptions([
          "Gimnasio Central",
          "FitLife Sports Club",
          "PowerGym Elite",
          "Wellness Center",
          "SportClub Premium",
        ]);
      }
    };

    loadGyms();
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

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

    if (userType === "gym") {
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
      if (!dni.trim()) {
        setError("Por favor ingresa tu DNI");
        return;
      }
      if (!isValidDni(dni)) {
        setError("El DNI debe tener entre 7 y 8 dígitos, sin puntos.");
        return;
      }
    }

    setIsLoading(true);
    setError("");

    try {
      // Crear objeto de usuario según el tipo
      const newUserId = `${userType}_${Date.now()}`;

      if (userType === "gym") {
        const newGymUser: GymUser = {
          id: newUserId,
          email,
          password,
          role: "gym",
          name,
          businessName,
          address,
          clients: [],
          classes: [],
        };

        await saveUser(newGymUser);
        await saveSession(newGymUser);

        // Recargar lista de gimnasios para futuros registros de clientes
        await reloadGyms();
      } else {
        const newClientUser: ClientUser = {
          id: newUserId,
          email,
          password,
          role: "client",
          name,
          weeklyGoal: 3,
          attendance: [],
          weeklyStreak: 0,
          gymId: selectedOption || undefined,
          birthDate: selectedDate?.toISOString() || undefined,
        };

        await saveUser(newClientUser);
        if (selectedOption) {
          // Asociar cliente al gimnasio
          const gym = await getGymUserByBusinessName(selectedOption);
          if (gym) {
            // Actualizar lista de IDs en el usuario gym
            const updatedGym: GymUser = {
              ...gym,
              clients: [...(gym.clients || []), newClientUser.id],
            };
            await saveUser(updatedGym);

            // Guardar datos completos del cliente en la lista de clientes del gimnasio
            await addGymClient(gym.id, newClientUser);
          }
        }
        await saveSession(newClientUser);
      }

      setIsLoading(false);
      setVisibleSuccess(true);

      // Cerrar modal y navegar al login después de 3 segundos
      timeoutRef.current = setTimeout(() => {
        handleGoToLogin();
      }, 3000);
    } catch (error) {
      setIsLoading(false);
      setError("Error al crear la cuenta. Intenta nuevamente.");
    }
  };

  const getButtonDisabledState = () => {
    const commonFields = !name.trim() || !email || !password || isLoading;

    if (userType === "gym") {
      return commonFields || !businessName.trim() || !address.trim();
    } else {
      return commonFields || !selectedDate || !selectedOption || !dni.trim();
    }
  };

  const isButtonDisabled = getButtonDisabledState();

  const handleGymSelect = (gym: string) => {
    setSelectedOption(gym);
    setGymQuery(""); // Limpiar el query de búsqueda al seleccionar
    setIsEditingGym(false); // Ya no está editando
    setShowGymSuggestions(false);
    setIsSelectingGym(false);
  };

  const filteredGyms = useMemo(() => {
    if (!gymQuery.trim()) {
      return gymOptions; // Mostrar todas las opciones cuando no hay búsqueda
    }
    return gymOptions.filter((gym) =>
      gym.toLowerCase().includes(gymQuery.toLowerCase())
    );
  }, [gymQuery, gymOptions]);

  const handleGymTextChange = (text: string) => {
    // Entrar en modo edición
    setIsEditingGym(true);

    // Si había un gimnasio seleccionado y el usuario empieza a escribir, limpiar la selección
    if (selectedOption && text !== selectedOption) {
      setSelectedOption(null);
    }

    setGymQuery(text);

    // Mostrar sugerencias cuando hay texto
    if (text.length > 0) {
      setShowGymSuggestions(true);
    } else {
      setShowGymSuggestions(false);
    }
  };

  const clearGymSearch = () => {
    setGymQuery("");
    setSelectedOption(null);
    setIsEditingGym(false);
    setShowGymSuggestions(false);
  };

  const handleGymFocus = () => {
    // Si hay un gimnasio seleccionado, ponerlo en el campo para que el usuario pueda editarlo
    if (selectedOption && !isEditingGym) {
      setGymQuery(selectedOption);
      setIsEditingGym(true);
    }

    // Siempre mostrar sugerencias al hacer focus si no hay texto de búsqueda
    if (gymQuery.length === 0 || selectedOption) {
      setShowGymSuggestions(true);
    }
  };

  const handleGymBlur = () => {
    // Delay para permitir que el onPress de las sugerencias funcione
    setTimeout(() => {
      // Solo cerrar si el usuario estaba editando (es decir, si abrió el menú escribiendo)
      if (isEditingGym) {
        // Si no hay texto ni selección, salir del modo edición
        if (!gymQuery && !selectedOption) {
          setIsEditingGym(false);
        }
        setShowGymSuggestions(false);
      }
    }, 200);
  };

  const handleDropdownPress = () => {
    if (showGymSuggestions) {
      setShowGymSuggestions(false);
    } else {
      // Mostrar todas las opciones
      if (selectedOption && !isEditingGym) {
        setGymQuery(selectedOption);
        setIsEditingGym(true);
      } else {
        setGymQuery("");
      }
      setShowGymSuggestions(true);
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  // Función para recargar la lista de gimnasios
  const reloadGyms = async () => {
    try {
      const gyms = await getGymNames();
      setGymOptions(gyms);
    } catch (error) {
      console.error("Error recargando gimnasios:", error);
    }
  };

  const handleGoToLogin = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setVisibleSuccess(false);
    router.replace("/login");
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <ScrollView
        style={[styles.scrollView, { backgroundColor: theme.colors.surface }]}
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
          {userType === "gym" ? "Registrar Gimnasio" : "Crea una nueva cuenta"}
        </Text>

        <Text style={globalStyles.label}>
          {userType === "gym" ? "NOMBRE DEL RESPONSABLE" : "NOMBRE Y APELLIDO"}
        </Text>
        <TextInput
          style={globalStyles.input}
          placeholder={userType === "gym" ? "Juan Pérez" : "Mirtho Legrand"}
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
        />

        {userType === "gym" && (
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

        <Text style={[globalStyles.label, { color: theme.colors.textPrimary }]}>
          DNI <Text style={{ color: '#999' }}>(sin puntos)</Text>
        </Text>
        <TextInput
          style={globalStyles.input}
          placeholder="12345678"
          placeholderTextColor="#999"
          keyboardType="number-pad"
          value={dni}
          onChangeText={setDni}
        />
        {dni && (
          <Text style={{ color: '#999', fontSize: 12, marginTop: 4 }}>
            Requerido para facturación. No compartiremos tus datos con nadie.
          </Text>
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

        {userType === "gym" ? (
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
            <TouchableOpacity
              style={globalStyles.pickerContainer}
              onPress={() => setShowDatePicker(true)}
            >
              <Text
                style={
                  selectedDate
                    ? globalStyles.pickerText
                    : globalStyles.pickerTextPlaceholder
                }
              >
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
            <View style={globalStyles.autocompleteContainer}>
              <View
                style={[
                  showGymSuggestions && filteredGyms.length > 0
                    ? globalStyles.autocompleteInputContainerFocused
                    : globalStyles.autocompleteInputContainer,
                ]}
              >
                <View style={globalStyles.autocompleteInputWrapper}>
                  <MaterialIcons
                    name="fitness-center"
                    size={20}
                    color={
                      selectedOption && !isEditingGym
                        ? theme.colors.primary
                        : "#999"
                    }
                  />
                  <TextInput
                    style={[
                      globalStyles.autocompleteInput,
                      selectedOption &&
                        !isEditingGym && { color: theme.colors.textPrimary },
                    ]}
                    placeholder="Seleccionar gimnasio"
                    placeholderTextColor="#999"
                    value={isEditingGym ? gymQuery : selectedOption || gymQuery}
                    onChangeText={handleGymTextChange}
                    onFocus={handleGymFocus}
                    onBlur={handleGymBlur}
                  />
                  {gymQuery.length > 0 || isEditingGym ? (
                    <TouchableOpacity
                      onPress={clearGymSearch}
                      style={globalStyles.autocompleteIcon}
                    >
                      <MaterialIcons name="clear" size={20} color="#999" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={handleDropdownPress}
                      style={globalStyles.autocompleteIcon}
                    >
                      <MaterialCommunityIcons
                        name={
                          showGymSuggestions ? "chevron-up" : "chevron-down"
                        }
                        size={20}
                        color="#999"
                      />
                    </TouchableOpacity>
                  )}
                </View>
                {showGymSuggestions && filteredGyms.length > 0 && (
                  <View style={globalStyles.suggestionsContainer}>
                    <ScrollView
                      nestedScrollEnabled={true}
                      showsVerticalScrollIndicator={false}
                      style={{ maxHeight: 200 }}
                    >
                      {filteredGyms.map((gym, index) => (
                        <TouchableOpacity
                          key={gym}
                          style={[
                            index === filteredGyms.length - 1
                              ? globalStyles.suggestionItemLast
                              : globalStyles.suggestionItem,
                            selectedOption === gym && {
                              backgroundColor: theme.colors.surface,
                            },
                          ]}
                          onPress={() => handleGymSelect(gym)}
                        >
                          <MaterialIcons
                            name="fitness-center"
                            size={18}
                            color={
                              selectedOption === gym
                                ? theme.colors.primary
                                : theme.colors.textSecondary
                            }
                          />
                          <Text
                            style={[
                              globalStyles.suggestionText,
                              selectedOption === gym && {
                                color: theme.colors.primary,
                                fontFamily: theme.typography.fontFamily.bold,
                              },
                            ]}
                          >
                            {gym}
                          </Text>
                          {selectedOption === gym && (
                            <MaterialIcons
                              name="check"
                              size={18}
                              color={theme.colors.primary}
                              style={{ marginLeft: "auto" }}
                            />
                          )}
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            </View>
          </>
        )}

        {error ? <Text style={globalStyles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          style={
            isButtonDisabled
              ? globalStyles.LoginButtonDisabled
              : globalStyles.LoginButton
          }
          onPress={handleSend}
          disabled={isButtonDisabled}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text
              style={[
                globalStyles.buttonText,
                !isButtonDisabled &&
                  theme.colors.background === "#2A2A2A" && { color: "#FFFFFF" },
                !isButtonDisabled &&
                  theme.colors.background === "#F8F9FA" && { color: "#333333" },
                isButtonDisabled &&
                  theme.colors.background === "#2A2A2A" && { color: "#666666" },
                isButtonDisabled &&
                  theme.colors.background === "#F8F9FA" && { color: "#999999" },
              ]}
            >
              Registrarse
            </Text>
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

        <Text
          style={[globalStyles.registerText, { marginTop: theme.spacing.xs }]}
        >
          ¿Querés cambiar el tipo de usuario?{" "}
          <Text
            style={globalStyles.textLink}
            onPress={() => router.push("/user-type-selection")}
          >
            Volver
          </Text>
        </Text>
      </ScrollView>

      <BirthDateWheel
        isVisible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onDateSelect={handleDateSelect}
        initialDate={selectedDate}
      />

      <Modal
        visible={visibleSuccess}
        transparent
        animationType="fade"
        onRequestClose={() => setVisibleSuccess(false)}
      >
        <View style={globalStyles.modalOverlay}>
          <View
            style={{
              backgroundColor: theme.colors.background,
              borderRadius: theme.borderRadius.lg,
              padding: theme.spacing.xl,
              alignItems: "center",
              width: "90%",
              maxWidth: 400,
              minHeight: 300,
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: theme.typography.fontSize.title,
                fontFamily: theme.typography.fontFamily.bold,
                color: theme.colors.textPrimary,
                textAlign: "center",
                marginBottom: theme.spacing.lg,
              }}
            >
              ¡Tu cuenta se creó con éxito!
            </Text>

            <MaterialCommunityIcons
              name="check-circle-outline"
              size={80}
              color={theme.colors.primary}
              style={{ marginBottom: theme.spacing.xl }}
            />

            <TouchableOpacity
              onPress={handleGoToLogin}
              style={{
                paddingVertical: theme.spacing.lg,
                paddingHorizontal: theme.spacing.xl,
                alignItems: "center",
                width: "100%",
              }}
            >
              <Text
                style={{
                  fontSize: theme.typography.fontSize.medium,
                  fontFamily: theme.typography.fontFamily.regular,
                  color: theme.colors.textSecondary,
                  textAlign: "center",
                  lineHeight: 24,
                }}
              >
                Ahora podés{"\n"}
                <Text
                  style={{
                    color: theme.colors.primary,
                    fontFamily: theme.typography.fontFamily.bold,
                    textDecorationLine: "underline",
                    fontSize: theme.typography.fontSize.medium,
                  }}
                >
                  iniciar sesión
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    alignItems: "center",
    paddingTop: 48,
    paddingBottom: 32,
  },
});
