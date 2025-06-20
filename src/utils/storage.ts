
import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_KEY = "atleta";

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