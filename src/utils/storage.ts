import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_KEY = "atleta";
const THEME_KEY = "theme_preference";

export const saveClientData = async (user: unknown) => {
  try {
    const json = JSON.stringify(user);
    await AsyncStorage.setItem(USER_KEY, json);
  } catch (err) {
    console.warn("Error al guardar datos:", err);
  }
};

export const loadClientData = async () => {
  try {
    const json = await AsyncStorage.getItem(USER_KEY);
    return json ? JSON.parse(json) : null;
  } catch (err) {
    console.warn("Error al leer datos:", err);
    return null;
  }
};

export const clearClientData = async () => {
  try {
    await AsyncStorage.removeItem(USER_KEY);
  } catch (err) {
    console.warn("Error al limpiar datos:", err);
  }
};

// Funciones para manejar el tema
export const saveThemePreference = async (isDarkMode: boolean) => {
  try {
    await AsyncStorage.setItem(THEME_KEY, JSON.stringify(isDarkMode));
  } catch (err) {
    console.warn("Error al guardar preferencia de tema:", err);
  }
};

export const loadThemePreference = async (): Promise<boolean> => {
  try {
    const themePreference = await AsyncStorage.getItem(THEME_KEY);
    return themePreference ? JSON.parse(themePreference) : false;
  } catch (err) {
    console.warn("Error al leer preferencia de tema:", err);
    return false; // Por defecto modo claro
  }
};