import AsyncStorage from "@react-native-async-storage/async-storage";
import { ClientUser, GymUser, UsuarioAtleta, UsuarioGimnasio } from "../data/Usuario";

// Keys para AsyncStorage
const STORAGE_KEYS = {
  // Usuarios y sesión
  CURRENT_USER: "@MiGymApp:currentUser",
  USERS_DB: "@MiGymApp:usersDB",
  SESSION: "@MiGymApp:session",
  
  // Datos del usuario
  USER_PROFILE: "@MiGymApp:userProfile",
  USER_ATTENDANCE: "@MiGymApp:attendance",
  USER_CLASSES: "@MiGymApp:userClasses",
  USER_ROUTINES: "@MiGymApp:userRoutines",
  USER_PAYMENTS: "@MiGymApp:userPayments",
  
  // Configuración
  THEME: "@MiGymApp:theme",
  PREFERENCES: "@MiGymApp:preferences"
};

// === FUNCIONES DE SESIÓN Y AUTENTICACIÓN ===

export const saveSession = async (user: ClientUser | GymUser) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify({
      user,
      loginDate: new Date().toISOString(),
      isAuthenticated: true
    }));
    await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } catch (error) {
    console.error("Error guardando sesión:", error);
  }
};

export const getSession = async () => {
  try {
    const session = await AsyncStorage.getItem(STORAGE_KEYS.SESSION);
    return session ? JSON.parse(session) : null;
  } catch (error) {
    console.error("Error obteniendo sesión:", error);
    return null;
  }
};

export const clearSession = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.SESSION);
    await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  } catch (error) {
    console.error("Error limpiando sesión:", error);
  }
};

export const isAuthenticated = async () => {
  const session = await getSession();
  return session?.isAuthenticated || false;
};

// === FUNCIONES DE USUARIOS ===

export const saveUser = async (user: ClientUser | GymUser) => {
  try {
    // Obtener base de datos de usuarios existente
    const usersDB = await getUsersDB();
    
    // Agregar o actualizar usuario
    usersDB[user.email] = user;
    
    // Guardar base de datos actualizada
    await AsyncStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(usersDB));
    return true;
  } catch (error) {
    console.error("Error guardando usuario:", error);
    return false;
  }
};

export const getUsersDB = async (): Promise<Record<string, ClientUser | GymUser>> => {
  try {
    const db = await AsyncStorage.getItem(STORAGE_KEYS.USERS_DB);
    return db ? JSON.parse(db) : {};
  } catch (error) {
    console.error("Error obteniendo base de datos de usuarios:", error);
    return {};
  }
};

// Nueva función para obtener gimnasios registrados
export const getRegisteredGyms = async (): Promise<GymUser[]> => {
  try {
    const usersDB = await getUsersDB();
    const gymUsers = Object.values(usersDB).filter(user => user.role === 'gym') as GymUser[];
    return gymUsers;
  } catch (error) {
    console.error("Error obteniendo gimnasios registrados:", error);
    return [];
  }
};

// Nueva función para obtener nombres de gimnasios para el selector
export const getGymNames = async (): Promise<string[]> => {
  try {
    const registeredGyms = await getRegisteredGyms();
    const gymNames = registeredGyms.map(gym => gym.businessName);
    
    // Agregar gimnasios por defecto si no hay ninguno registrado
    const defaultGyms = [
      "Gimnasio Central",
      "FitLife Sports Club", 
      "PowerGym Elite",
      "Wellness Center",
      "SportClub Premium"
    ];
    
    // Si no hay gimnasios registrados, usar los por defecto
    if (gymNames.length === 0) {
      return defaultGyms;
    }
    
    // Combinar gimnasios registrados con algunos por defecto
    const allGyms = [...gymNames, ...defaultGyms];
    // Eliminar duplicados
    return [...new Set(allGyms)];
  } catch (error) {
    console.error("Error obteniendo nombres de gimnasios:", error);
    return [
      "Gimnasio Central",
      "FitLife Sports Club", 
      "PowerGym Elite",
      "Wellness Center",
      "SportClub Premium"
    ];
  }
};

export const getUserByEmail = async (email: string): Promise<ClientUser | GymUser | null> => {
  try {
    const usersDB = await getUsersDB();
    return usersDB[email] || null;
  } catch (error) {
    console.error("Error obteniendo usuario por email:", error);
    return null;
  }
};

export const authenticateUser = async (email: string, password: string): Promise<ClientUser | GymUser | null> => {
  try {
    const user = await getUserByEmail(email);
    if (user && user.password === password) {
      await saveSession(user);
      return user;
    }
    return null;
  } catch (error) {
    console.error("Error autenticando usuario:", error);
    return null;
  }
};

// === FUNCIONES DE PERFIL ===

export const updateUserProfile = async (userId: string, updates: Partial<ClientUser | GymUser>) => {
  try {
    const usersDB = await getUsersDB();
    const user = Object.values(usersDB).find(u => u.id === userId);
    
    if (user) {
      const updatedUser = { ...user, ...updates } as ClientUser | GymUser;
      await saveUser(updatedUser);
      
      // Si es el usuario actual, actualizar sesión
      const currentUser = await getCurrentUser();
      if (currentUser?.id === userId) {
        await saveSession(updatedUser);
      }
      
      return updatedUser;
    }
    return null;
  } catch (error) {
    console.error("Error actualizando perfil:", error);
    return null;
  }
};

export const getCurrentUser = async (): Promise<ClientUser | GymUser | null> => {
  try {
    const user = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error obteniendo usuario actual:", error);
    return null;
  }
};

// === FUNCIONES DE CLASES ===

export const saveUserClasses = async (userId: string, classes: any[]) => {
  try {
    const key = `${STORAGE_KEYS.USER_CLASSES}:${userId}`;
    await AsyncStorage.setItem(key, JSON.stringify(classes));
    return true;
  } catch (error) {
    console.error("Error guardando clases:", error);
    return false;
  }
};

export const getUserClasses = async (userId: string) => {
  try {
    const key = `${STORAGE_KEYS.USER_CLASSES}:${userId}`;
    const classes = await AsyncStorage.getItem(key);
    return classes ? JSON.parse(classes) : [];
  } catch (error) {
    console.error("Error obteniendo clases:", error);
    return [];
  }
};

// === FUNCIONES DE CLASES DISPONIBLES ===

export const getAvailableClasses = async () => {
  try {
    const classes = await AsyncStorage.getItem('@MiGymApp:availableClasses');
    if (classes) {
      return JSON.parse(classes);
    }
    
    // Datos por defecto si no hay clases guardadas
    const defaultClasses = [
      {
        id: 1,
        nombre: "FUNCIONAL HIT",
        imagen: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        descripcion: "Entrenamiento de alta intensidad que combina fuerza y cardio para mejorar resistencia, quemar grasa y tonificar el cuerpo.",
        horarios: [
          {dia: "Lunes", horas: ["08:00 a 10:00", "14:00 a 16:00"]},
          {dia: "Martes", horas: ["08:00 a 10:00", "14:00 a 16:00"]},
          {dia: "Miércoles", horas: ["08:00 a 10:00", "14:00 a 16:00"]},
          {dia: "Jueves", horas: ["08:00 a 10:00", "14:00 a 16:00"]},
          {dia: "Viernes", horas: ["08:00 a 10:00", "14:00 a 16:00"]},
        ]
      },
      {
        id: 2,
        nombre: "CROSSFIT",
        imagen: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        descripcion: "Entrenamiento funcional de alta intensidad que mejora fuerza, resistencia y flexibilidad.",
        horarios: [
          {dia: "Lunes", horas: ["10:00 a 12:00", "16:00 a 18:00"]},
          {dia: "Miércoles", horas: ["10:00 a 12:00", "16:00 a 18:00"]},
          {dia: "Viernes", horas: ["10:00 a 12:00", "16:00 a 18:00"]},
        ]
      },
      {
        id: 3,
        nombre: "YOGA",
        imagen: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        descripcion: "Práctica que combina posturas, respiración y meditación para el bienestar físico y mental.",
        horarios: [
          {dia: "Martes", horas: ["09:00 a 10:30", "18:00 a 19:30"]},
          {dia: "Jueves", horas: ["09:00 a 10:30", "18:00 a 19:30"]},
          {dia: "Sábado", horas: ["09:00 a 10:30"]},
        ]
      },
      {
        id: 4,
        nombre: "SPINNING",
        imagen: "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        descripcion: "Ciclismo indoor de alta energía que mejora la resistencia cardiovascular.",
        horarios: [
          {dia: "Lunes", horas: ["07:00 a 08:00", "19:00 a 20:00"]},
          {dia: "Miércoles", horas: ["07:00 a 08:00", "19:00 a 20:00"]},
          {dia: "Viernes", horas: ["07:00 a 08:00", "19:00 a 20:00"]},
        ]
      },
      {
        id: 5,
        nombre: "PILATES",
        imagen: "https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        descripcion: "Ejercicios de bajo impacto que fortalecen el core y mejoran la postura.",
        horarios: [
          {dia: "Martes", horas: ["10:30 a 12:00", "17:00 a 18:30"]},
          {dia: "Jueves", horas: ["10:30 a 12:00", "17:00 a 18:30"]},
        ]
      },
    ];
    
    // Guardar las clases por defecto
    await AsyncStorage.setItem('@MiGymApp:availableClasses', JSON.stringify(defaultClasses));
    return defaultClasses;
  } catch (error) {
    console.error("Error obteniendo clases disponibles:", error);
    return [];
  }
};

export const saveAvailableClasses = async (classes: any[]) => {
  try {
    await AsyncStorage.setItem('@MiGymApp:availableClasses', JSON.stringify(classes));
    return true;
  } catch (error) {
    console.error("Error guardando clases disponibles:", error);
    return false;
  }
};

// === FUNCIONES DE CUOTAS Y PAGOS ===

export const getUserPaymentInfo = async (userId: string) => {
  try {
    const key = `${STORAGE_KEYS.USER_PAYMENTS}:${userId}`;
    const payment = await AsyncStorage.getItem(key);
    
    if (payment) {
      return JSON.parse(payment);
    }
    
    // Datos por defecto si no hay información de pago
    const defaultPayment = {
      pendiente: true,
      monto: 10213.89,
      fechaVencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 días desde hoy
      numeroFactura: `#${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      fechaEmision: new Date().toISOString(),
      periodo: new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
    };
    
    // Guardar información por defecto
    await AsyncStorage.setItem(key, JSON.stringify(defaultPayment));
    return defaultPayment;
  } catch (error) {
    console.error("Error obteniendo información de pago:", error);
    return {
      pendiente: false,
      monto: 0,
      fechaVencimiento: new Date().toISOString(),
      numeroFactura: '#2024-000',
      fechaEmision: new Date().toISOString(),
      periodo: 'N/A'
    };
  }
};

export const updateUserPaymentInfo = async (userId: string, paymentInfo: any) => {
  try {
    const key = `${STORAGE_KEYS.USER_PAYMENTS}:${userId}`;
    await AsyncStorage.setItem(key, JSON.stringify(paymentInfo));
    return true;
  } catch (error) {
    console.error("Error actualizando información de pago:", error);
    return false;
  }
};

export const processPayment = async (userId: string, paymentData: any) => {
  try {
    // Simular procesamiento de pago
    const success = Math.random() > 0.1; // 90% de éxito
    
    if (success) {
      // Actualizar estado de pago como completado
      const paymentInfo = await getUserPaymentInfo(userId);
      paymentInfo.pendiente = false;
      paymentInfo.fechaPago = new Date().toISOString();
      paymentInfo.metodoPago = paymentData.metodo || 'Tarjeta de crédito';
      
      await updateUserPaymentInfo(userId, paymentInfo);
      return { success: true, message: 'Pago procesado correctamente' };
    } else {
      return { success: false, message: 'Error procesando el pago' };
    }
  } catch (error) {
    console.error("Error procesando pago:", error);
    return { success: false, message: 'Error técnico' };
  }
};

// === FUNCIONES DE RUTINAS ===

export const saveUserRoutines = async (userId: string, routines: any[]) => {
  try {
    const key = `${STORAGE_KEYS.USER_ROUTINES}:${userId}`;
    await AsyncStorage.setItem(key, JSON.stringify(routines));
    return true;
  } catch (error) {
    console.error("Error guardando rutinas:", error);
    return false;
  }
};

export const getUserRoutines = async (userId: string) => {
  try {
    const key = `${STORAGE_KEYS.USER_ROUTINES}:${userId}`;
    const routines = await AsyncStorage.getItem(key);
    return routines ? JSON.parse(routines) : [];
  } catch (error) {
    console.error("Error obteniendo rutinas:", error);
    return [];
  }
};

// === FUNCIONES DE PAGOS ===

export const savePaymentStatus = async (userId: string, paymentData: any) => {
  try {
    const key = `${STORAGE_KEYS.USER_PAYMENTS}:${userId}`;
    await AsyncStorage.setItem(key, JSON.stringify(paymentData));
    return true;
  } catch (error) {
    console.error("Error guardando estado de pago:", error);
    return false;
  }
};

export const getPaymentStatus = async (userId: string) => {
  try {
    const key = `${STORAGE_KEYS.USER_PAYMENTS}:${userId}`;
    const payment = await AsyncStorage.getItem(key);
    return payment ? JSON.parse(payment) : null;
  } catch (error) {
    console.error("Error obteniendo estado de pago:", error);
    return null;
  }
};

// === FUNCIONES DE ASISTENCIA (migración del código anterior) ===

export const saveAttendance = async (userId: string, attendance: string[]) => {
  try {
    const key = `${STORAGE_KEYS.USER_ATTENDANCE}:${userId}`;
    await AsyncStorage.setItem(key, JSON.stringify(attendance));
    return true;
  } catch (error) {
    console.error("Error guardando asistencia:", error);
    return false;
  }
};

export const getAttendance = async (userId: string): Promise<string[]> => {
  try {
    const key = `${STORAGE_KEYS.USER_ATTENDANCE}:${userId}`;
    const attendance = await AsyncStorage.getItem(key);
    return attendance ? JSON.parse(attendance) : [];
  } catch (error) {
    console.error("Error obteniendo asistencia:", error);
    return [];
  }
};

// === FUNCIONES DE CONFIGURACIÓN ===

export const savePreferences = async (preferences: any) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
    return true;
  } catch (error) {
    console.error("Error guardando preferencias:", error);
    return false;
  }
};

export const getPreferences = async () => {
  try {
    const prefs = await AsyncStorage.getItem(STORAGE_KEYS.PREFERENCES);
    return prefs ? JSON.parse(prefs) : {};
  } catch (error) {
    console.error("Error obteniendo preferencias:", error);
    return {};
  }
};

// === FUNCIONES DE UTILIDAD ===

export const clearAllData = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const appKeys = keys.filter(key => key.startsWith("@MiGymApp:"));
    await AsyncStorage.multiRemove(appKeys);
    console.log("Todos los datos de la app han sido eliminados");
  } catch (error) {
    console.error("Error limpiando datos:", error);
  }
};

// === MIGRACIÓN: Mantener compatibilidad con código anterior ===

// Estas funciones mantienen compatibilidad con el código existente
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

// === INICIALIZACIÓN ===

// Función para inicializar datos de ejemplo si es la primera vez
export const initializeAppData = async () => {
  try {
    const usersDB = await getUsersDB();
    
    // Si no hay usuarios, crear los usuarios de ejemplo
    if (Object.keys(usersDB).length === 0) {
      await saveUser(UsuarioAtleta);
      await saveUser(UsuarioGimnasio);
      console.log("Usuarios de ejemplo inicializados");
    }
  } catch (error) {
    console.error("Error inicializando datos:", error);
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

// === FUNCIONES DE CLASES DE GIMNASIO ===

export const saveGymClasses = async (gymUserId: string, classes: any[]) => {
  try {
    const key = `@MiGymApp:gymClasses:${gymUserId}`;
    await AsyncStorage.setItem(key, JSON.stringify(classes));
    return true;
  } catch (error) {
    console.error("Error guardando clases del gimnasio:", error);
    return false;
  }
};

export const getGymClasses = async (gymUserId: string) => {
  try {
    const key = `@MiGymApp:gymClasses:${gymUserId}`;
    const classes = await AsyncStorage.getItem(key);
    return classes ? JSON.parse(classes) : [];
  } catch (error) {
    console.error("Error obteniendo clases del gimnasio:", error);
    return [];
  }
};

export const addGymClass = async (gymUserId: string, newClass: any) => {
  try {
    const existingClasses = await getGymClasses(gymUserId);
    const updatedClasses = [...existingClasses, newClass];
    return await saveGymClasses(gymUserId, updatedClasses);
  } catch (error) {
    console.error("Error agregando clase del gimnasio:", error);
    return false;
  }
};

export const updateGymClass = async (gymUserId: string, classId: number, updatedClass: any) => {
  try {
    const existingClasses = await getGymClasses(gymUserId);
    const updatedClasses = existingClasses.map((clase: any) => 
      clase.id === classId ? updatedClass : clase
    );
    return await saveGymClasses(gymUserId, updatedClasses);
  } catch (error) {
    console.error("Error actualizando clase del gimnasio:", error);
    return false;
  }
};

export const deleteGymClass = async (gymUserId: string, classId: number) => {
  try {
    const classes = await getGymClasses(gymUserId);
    const updatedClasses = classes.filter((_, index) => index !== classId);
    await saveGymClasses(gymUserId, updatedClasses);
    return true;
  } catch (error) {
    console.error("Error eliminando clase:", error);
    return false;
  }
};

// Nueva función para obtener información del gimnasio por nombre
export const getGymByBusinessName = async (businessName: string): Promise<GymUser | null> => {
  try {
    // Primero buscar en gimnasios registrados
    const registeredGyms = await getRegisteredGyms();
    const gym = registeredGyms.find(gym => gym.businessName === businessName);
    
    if (gym) {
      return gym;
    }
    
    // Si no se encuentra, crear un gimnasio por defecto basado en el nombre
    const defaultGyms: Record<string, Partial<GymUser>> = {
      "Gimnasio Central": {
        businessName: "Gimnasio Central",
        address: "Av. 9 de Julio 1500, CABA",
        phone: "+54 11 5555-1234",
        description: "Gimnasio moderno en el corazón de la ciudad con equipamiento de última generación y clases personalizadas.",
        subscriptionPlan: "premium"
      },
      "FitLife Sports Club": {
        businessName: "FitLife Sports Club",
        address: "Av. Santa Fe 2000, CABA",
        phone: "+54 11 2345-6789",
        description: "Club deportivo completo con piscina, canchas de tenis y gimnasio de alta calidad.",
        subscriptionPlan: "pro"
      },
      "PowerGym Elite": {
        businessName: "PowerGym Elite",
        address: "Av. Córdoba 1800, CABA",
        phone: "+54 11 3456-7890",
        description: "Gimnasio especializado en entrenamiento de fuerza y musculación con equipos profesionales.",
        subscriptionPlan: "basic"
      },
      "Wellness Center": {
        businessName: "Wellness Center",
        address: "Av. Callao 1200, CABA",
        phone: "+54 11 4567-8901",
        description: "Centro de bienestar integral con yoga, pilates, spa y gimnasio funcional.",
        subscriptionPlan: "premium"
      },
      "SportClub Premium": {
        businessName: "SportClub Premium",
        address: "Av. Libertador 2500, CABA",
        phone: "+54 11 5678-9012",
        description: "Club deportivo premium con instalaciones de lujo y servicios exclusivos.",
        subscriptionPlan: "premium"
      }
    };
    
    const defaultGym = defaultGyms[businessName];
    if (defaultGym) {
      // Crear un objeto GymUser completo con datos por defecto
      const mockGymUser: GymUser = {
        id: `default_${businessName.toLowerCase().replace(/\s+/g, '_')}`,
        email: `${businessName.toLowerCase().replace(/\s+/g, '')}@gym.com`,
        password: "default_password",
        role: 'gym',
        name: `Admin ${businessName}`,
        businessName: defaultGym.businessName!,
        address: defaultGym.address,
        phone: defaultGym.phone,
        description: defaultGym.description,
        clients: [], // Se podría poblar con clientes reales si es necesario
        classes: [], // Se podría poblar con clases reales si es necesario
        subscriptionPlan: defaultGym.subscriptionPlan
      };
      
      return mockGymUser;
    }
    
    return null;
  } catch (error) {
    console.error("Error obteniendo gimnasio por nombre:", error);
    return null;
  }
};