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
    
    // Buscar usuario por ID en los valores de la base de datos
    const user = Object.values(usersDB).find(u => u.id === userId);
    
    if (user) {
      const updatedUser = { ...user, ...updates } as ClientUser | GymUser;
      
      // Guardar usando el email como clave (como hace saveUser)
      usersDB[user.email] = updatedUser;
      await AsyncStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(usersDB));
      
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

export const getAvailableClasses = async (currentUser?: ClientUser | GymUser | null) => {
  try {
    // Obtener clases hardcodeadas (por defecto)
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

    // Si es un usuario cliente y tiene gymId, obtener las clases de su gimnasio
    if (currentUser && currentUser.role === 'client' && (currentUser as ClientUser).gymId) {
      const clientUser = currentUser as ClientUser;
      const gymClasses = await getGymClasses(clientUser.gymId!);
      let formattedClasses: any[] = [];
      if (gymClasses && gymClasses.length > 0) {
        formattedClasses = gymClasses
          .filter((clase: any) => clase.activa)
          .map((clase: any) => convertGymClassToHomeFormat(clase));
      }
      // Unir hardcodeadas + gym, evitando duplicados por id
      const allClasses = [...defaultClasses, ...formattedClasses];
      const uniqueClasses = allClasses.filter((clase, idx, arr) =>
        idx === arr.findIndex(c => c.id === clase.id)
      );
      return uniqueClasses;
    }

    // Fallback: obtener solo las hardcodeadas
    return defaultClasses;
  } catch (error) {
    console.error("Error obteniendo clases disponibles:", error);
    return [];
  }
};

// Nueva función para convertir las clases del gimnasio al formato esperado por el home
const convertGymClassToHomeFormat = (gymClass: any) => {
  // Mapeo de días de la semana
  const diasMap: { [key: string]: string } = {
    lunes: "Lunes",
    martes: "Martes",
    miercoles: "Miércoles",
    jueves: "Jueves",
    viernes: "Viernes",
    sabado: "Sábado",
    domingo: "Domingo"
  };

  // Generar imagen por defecto basada en el nombre de la clase
  const getDefaultImage = (nombre: string): string => {
    const nombreLower = nombre.toLowerCase();
    
    if (nombreLower.includes('funcional') || nombreLower.includes('hit') || nombreLower.includes('hiit')) {
      return "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
    }
    if (nombreLower.includes('crossfit') || nombreLower.includes('cross')) {
      return "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
    }
    if (nombreLower.includes('yoga')) {
      return "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
    }
    if (nombreLower.includes('spinning') || nombreLower.includes('bike') || nombreLower.includes('ciclo')) {
      return "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
    }
    if (nombreLower.includes('pilates')) {
      return "https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
    }
    if (nombreLower.includes('boxeo') || nombreLower.includes('box')) {
      return "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
    }
    if (nombreLower.includes('natacion') || nombreLower.includes('aqua')) {
      return "https://images.unsplash.com/photo-1530549387789-4c1017266635?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
    }
    if (nombreLower.includes('zumba') || nombreLower.includes('baile')) {
      return "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
    }
    if (nombreLower.includes('pesas') || nombreLower.includes('musculacion') || nombreLower.includes('fuerza')) {
      return "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
    }
    if (nombreLower.includes('cardio') || nombreLower.includes('aerobico')) {
      return "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
    }
    
    // Imagen por defecto genérica para ejercicio
    return "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
  };

  // Convertir diasHorarios del gimnasio al formato esperado por el home
  const horarios = Object.entries(gymClass.diasHorarios || {})
    .filter(([dia, horarios]) => Array.isArray(horarios) && horarios.length > 0)
    .map(([dia, horarios]) => ({
      dia: diasMap[dia] || dia.charAt(0).toUpperCase() + dia.slice(1),
      horas: (horarios as string[]).map(horario => {
        // Convertir formato "08:00-10:00" a "08:00 a 10:00"
        if (horario.includes('-')) {
          const [inicio, fin] = horario.split('-');
          return `${inicio} a ${fin}`;
        }
        return horario;
      })
    }));

  return {
    id: gymClass.id,
    nombre: gymClass.nombre,
    imagen: gymClass.imagen || getDefaultImage(gymClass.nombre),
    descripcion: gymClass.descripcion,
    horarios: horarios,
    cupoMaximo: gymClass.cupoMaximo,
    activa: gymClass.activa,
    // Información adicional del gimnasio
    isGymClass: true,
    gymId: gymClass.gymId
  };
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

// === FUNCIONES DE CUOTAS DEL GIMNASIO ===

export const getGymQuotaSettings = async (gymId: string) => {
  try {
    const key = `@MiGymApp:gymQuota:${gymId}`;
    const quotaSettings = await AsyncStorage.getItem(key);
    
    if (quotaSettings) {
      return JSON.parse(quotaSettings);
    }
    
    // Configuración por defecto
    const defaultSettings = {
      monto: 10213.89,
      descripcion: "Membresía mensual del gimnasio",
      fechaActualizacion: new Date().toISOString(),
    };
    
    await AsyncStorage.setItem(key, JSON.stringify(defaultSettings));
    return defaultSettings;
  } catch (error) {
    console.error("Error obteniendo configuración de cuota del gimnasio:", error);
    return {
      monto: 10213.89,
      descripcion: "Membresía mensual del gimnasio",
      fechaActualizacion: new Date().toISOString(),
    };
  }
};

export const updateGymQuotaSettings = async (gymId: string, quotaSettings: any) => {
  try {
    const key = `@MiGymApp:gymQuota:${gymId}`;
    quotaSettings.fechaActualizacion = new Date().toISOString();
    await AsyncStorage.setItem(key, JSON.stringify(quotaSettings));
    
    // Actualizar todos los clientes del gimnasio con el nuevo monto
    const clients = await getGymClients(gymId);
    for (const client of clients) {
      const currentPaymentInfo = await getUserPaymentInfo(client.id);
      currentPaymentInfo.monto = quotaSettings.monto;
      await updateUserPaymentInfo(client.id, currentPaymentInfo);
    }
    
    return true;
  } catch (error) {
    console.error("Error actualizando configuración de cuota del gimnasio:", error);
    return false;
  }
};

export const getGymPaymentHistory = async (gymId: string) => {
  try {
    const clients = await getGymClients(gymId);
    const paymentHistory = [];
    
    for (const client of clients) {
      const paymentInfo = await getUserPaymentInfo(client.id);
      
      // Si tiene historial de pagos, incluirlo
      if (paymentInfo.historialPagos) {
        paymentHistory.push(...paymentInfo.historialPagos.map((pago: any) => ({
          ...pago,
          clientId: client.id,
          clientName: client.name,
          clientEmail: client.email,
          clientDni: client.dni || 'No especificado'
        })));
      }
      
      // Si tiene un pago completado actual, incluirlo
      if (!paymentInfo.pendiente && paymentInfo.fechaPago) {
        paymentHistory.push({
          id: `current_${client.id}`,
          clientId: client.id,
          clientName: client.name,
          clientEmail: client.email,
          clientDni: client.dni || 'No especificado',
          monto: paymentInfo.monto,
          fechaPago: paymentInfo.fechaPago,
          metodoPago: paymentInfo.metodoPago || 'Mercado Pago',
          numeroFactura: paymentInfo.numeroFactura,
          periodo: paymentInfo.periodo,
          estado: 'completado'
        });
      }
    }
    
    // Ordenar por fecha de pago (más recientes primero)
    paymentHistory.sort((a, b) => new Date(b.fechaPago).getTime() - new Date(a.fechaPago).getTime());
    
    return paymentHistory;
  } catch (error) {
    console.error("Error obteniendo historial de pagos del gimnasio:", error);
    return [];
  }
};

export const getGymPaymentsSummary = async (gymId: string) => {
  try {
    const clients = await getGymClients(gymId);
    let totalRecaudado = 0;
    let pagosPendientes = 0;
    let pagosCompletados = 0;
    
    for (const client of clients) {
      const paymentInfo = await getUserPaymentInfo(client.id);
      
      if (paymentInfo.pendiente) {
        pagosPendientes += paymentInfo.monto;
      } else {
        pagosCompletados++;
        totalRecaudado += paymentInfo.monto;
      }
    }
    
    return {
      totalClientes: clients.length,
      totalRecaudado,
      pagosPendientes,
      pagosCompletados,
      clientesConDeuda: clients.filter(c => c.isPaymentUpToDate === false).length
    };
  } catch (error) {
    console.error("Error obteniendo resumen de pagos del gimnasio:", error);
    return {
      totalClientes: 0,
      totalRecaudado: 0,
      pagosPendientes: 0,
      pagosCompletados: 0,
      clientesConDeuda: 0
    };
  }
};

// === FUNCIONES DE CUOTAS Y PAGOS ===

export const getUserPaymentInfo = async (userId: string) => {
  try {
    const key = `${STORAGE_KEYS.USER_PAYMENTS}:${userId}`;
    const payment = await AsyncStorage.getItem(key);
    
    if (payment) {
      const paymentData = JSON.parse(payment);
      
      // Obtener el usuario para saber a qué gimnasio pertenece
      const user = await getCurrentUser();
      if (user && user.role === 'client' && user.gymId) {
        // Obtener la configuración de cuota del gimnasio
        const gymQuotaSettings = await getGymQuotaSettings(user.gymId);
        paymentData.monto = gymQuotaSettings.monto; // Usar el monto del gimnasio
      }
      
      return paymentData;
    }
    
    // Datos por defecto si no hay información de pago
    let defaultMonto = 10213.89;
    
    // Intentar obtener el monto del gimnasio si el usuario es cliente
    const user = await getCurrentUser();
    if (user && user.role === 'client' && user.gymId) {
      try {
        const gymQuotaSettings = await getGymQuotaSettings(user.gymId);
        defaultMonto = gymQuotaSettings.monto;
      } catch (error) {
        console.log("No se pudo obtener configuración del gimnasio, usando monto por defecto");
      }
    }
    
    const defaultPayment = {
      pendiente: true,
      monto: defaultMonto,
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
    // Asegurar que la clase incluya el gymId
    const classWithGymId = {
      ...newClass,
      gymId: gymUserId
    };
    
    const existingClasses = await getGymClasses(gymUserId);
    const updatedClasses = [...existingClasses, classWithGymId];
    return await saveGymClasses(gymUserId, updatedClasses);
  } catch (error) {
    console.error("Error agregando clase del gimnasio:", error);
    return false;
  }
};

export const updateGymClass = async (gymUserId: string, classId: number, updatedClass: any) => {
  try {
    // Asegurar que la clase actualizada incluya el gymId
    const classWithGymId = {
      ...updatedClass,
      gymId: gymUserId
    };
    
    const existingClasses = await getGymClasses(gymUserId);
    const updatedClasses = existingClasses.map((clase: any) => 
      clase.id === classId ? classWithGymId : clase
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

// === FUNCIONES DE CLIENTES (SOCIOS) DE GIMNASIO ===

export const saveGymClients = async (gymUserId: string, clients: any[]) => {
  try {
    const key = `@MiGymApp:gymClients:${gymUserId}`;
    await AsyncStorage.setItem(key, JSON.stringify(clients));
    return true;
  } catch (error) {
    console.error("Error guardando clientes del gimnasio:", error);
    return false;
  }
};

export const getGymClients = async (gymUserId: string) => {
  try {
    const key = `@MiGymApp:gymClients:${gymUserId}`;
    const clients = await AsyncStorage.getItem(key);
    return clients ? JSON.parse(clients) : [];
  } catch (error) {
    console.error("Error obteniendo clientes del gimnasio:", error);
    return [];
  }
};

export const addGymClient = async (gymUserId: string, newClient: any) => {
  try {
    const existingClients = await getGymClients(gymUserId);
    const updatedClients = [...existingClients, newClient];
    return await saveGymClients(gymUserId, updatedClients);
  } catch (error) {
    console.error("Error agregando cliente del gimnasio:", error);
    return false;
  }
};

export const updateGymClient = async (gymUserId: string, clientId: string, updatedClient: any) => {
  try {
    const existingClients = await getGymClients(gymUserId);
    const updatedClients = existingClients.map((client: any) =>
      client.id === clientId ? updatedClient : client
    );
    return await saveGymClients(gymUserId, updatedClients);
  } catch (error) {
    console.error("Error actualizando cliente del gimnasio:", error);
    return false;
  }
};

export const deleteGymClient = async (gymUserId: string, clientId: string) => {
  try {
    const existingClients = await getGymClients(gymUserId);
    const updatedClients = existingClients.filter((client: any) => client.id !== clientId);
    return await saveGymClients(gymUserId, updatedClients);
  } catch (error) {
    console.error("Error eliminando cliente del gimnasio:", error);
    return false;
  }
};

export const getGymUserByBusinessName = async (businessName: string): Promise<GymUser | null> => {
  try {
    const usersDB = await getUsersDB();
    
    // Buscar por businessName exacto
    let gym = Object.values(usersDB).find(u => (u as GymUser).role === 'gym' && (u as GymUser).businessName === businessName) as GymUser | undefined;
    if (gym) return gym;
    
    // Buscar por email (para casos donde el businessName cambió pero el email sigue siendo el mismo)
    if (businessName.includes('@')) {
      gym = Object.values(usersDB).find(u => (u as GymUser).role === 'gym' && (u as GymUser).email === businessName) as GymUser | undefined;
      if (gym) return gym;
    }
    
    // Buscar por ID (para casos donde el gymId es realmente un ID)
    if (businessName.includes('_')) {
      gym = Object.values(usersDB).find(u => u.id === businessName && (u as GymUser).role === 'gym') as GymUser | undefined;
      if (gym) return gym;
    }

    // Buscar por coincidencia parcial en businessName (para casos donde el nombre cambió ligeramente)
    gym = Object.values(usersDB).find(u => {
      if ((u as GymUser).role !== 'gym') return false;
      const gymBusinessName = (u as GymUser).businessName?.toLowerCase() || '';
      const searchName = businessName.toLowerCase();
      
      // Verificar si el businessName actual contiene el nombre buscado o viceversa
      return gymBusinessName.includes(searchName) || searchName.includes(gymBusinessName);
    }) as GymUser | undefined;
    if (gym) return gym;

    // Buscar por email del administrador del gimnasio (para casos donde el cliente tiene el email del admin guardado)
    const gymUsers = Object.values(usersDB).filter(u => (u as GymUser).role === 'gym') as GymUser[];
    for (const gymUser of gymUsers) {
      if (gymUser.email === businessName) {
        return gymUser;
      }
    }

    // Fallback: si no existe en la base registrada, devolver uno por defecto
    const defaultGyms: Record<string, Partial<GymUser>> = {
      "Gimnasio Central": {
        businessName: "Gimnasio Central",
        address: "Av. 9 de Julio 1500, CABA",
        phone: "+54 11 5555-1234",
        description: "Gimnasio moderno en el corazón de la ciudad con equipamiento de última generación y clases personalizadas.",
        subscriptionPlan: "premium",
      },
      "FitLife Sports Club": {
        businessName: "FitLife Sports Club",
        address: "Av. Santa Fe 2000, CABA",
        phone: "+54 11 2345-6789",
        description: "Club deportivo completo con piscina, canchas de tenis y gimnasio de alta calidad.",
        subscriptionPlan: "pro",
      },
      "PowerGym Elite": {
        businessName: "PowerGym Elite",
        address: "Av. Córdoba 1800, CABA",
        phone: "+54 11 3456-7890",
        description: "Gimnasio especializado en entrenamiento de fuerza y musculación con equipos profesionales.",
        subscriptionPlan: "basic",
      },
      "Wellness Center": {
        businessName: "Wellness Center",
        address: "Av. Callao 1200, CABA",
        phone: "+54 11 4567-8901",
        description: "Centro de bienestar integral con yoga, pilates, spa y gimnasio funcional.",
        subscriptionPlan: "premium",
      },
      "SportClub Premium": {
        businessName: "SportClub Premium",
        address: "Av. Libertador 2500, CABA",
        phone: "+54 11 5678-9012",
        description: "Club deportivo premium con instalaciones de lujo y servicios exclusivos.",
        subscriptionPlan: "premium",
      },
    };

    const def = defaultGyms[businessName];
    if (def) {
      return {
        id: `default_${businessName.toLowerCase().replace(/\s+/g, '_')}`,
        email: `${businessName.toLowerCase().replace(/\s+/g, '')}@gym.com`,
        password: 'default_password',
        role: 'gym',
        name: `Admin ${businessName}`,
        businessName: def.businessName!,
        address: def.address,
        phone: def.phone,
        description: def.description,
        clients: [],
        classes: [],
        subscriptionPlan: def.subscriptionPlan,
      };
    }
    return null;
  } catch (error) {
    console.error('Error buscando gimnasio por nombre:', error);
    return null;
  }
};

// ==================== TIMER & STOPWATCH STORAGE ====================

export interface TimerState {
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  isRunning: boolean;
  isPaused: boolean;
  lastSaveTime?: number; // timestamp para calcular tiempo transcurrido
}

export interface StopwatchState {
  centiseconds: number;
  isRunning: boolean;
  laps: number[];
  lastSaveTime?: number; // timestamp para calcular tiempo transcurrido
}

// Guardar estado del temporizador
export const saveTimerState = async (state: TimerState) => {
  try {
    const stateWithTimestamp = {
      ...state,
      lastSaveTime: Date.now()
    };
    await AsyncStorage.setItem('@MiGymApp:timerState', JSON.stringify(stateWithTimestamp));
  } catch (error) {
    console.error('Error saving timer state:', error);
  }
};

// Cargar estado del temporizador
export const loadTimerState = async (): Promise<TimerState | null> => {
  try {
    const state = await AsyncStorage.getItem('@MiGymApp:timerState');
    if (!state) return null;
    
    const parsedState: TimerState = JSON.parse(state);
    
    // Si el timer estaba corriendo, calcular el tiempo transcurrido
    if (parsedState.isRunning && parsedState.lastSaveTime) {
      const timeElapsed = Math.floor((Date.now() - parsedState.lastSaveTime) / 1000);
      const newTotalSeconds = Math.max(0, parsedState.totalSeconds - timeElapsed);
      
      return {
        ...parsedState,
        totalSeconds: newTotalSeconds,
        hours: Math.floor(newTotalSeconds / 3600),
        minutes: Math.floor((newTotalSeconds % 3600) / 60),
        seconds: newTotalSeconds % 60,
        isRunning: newTotalSeconds > 0 ? parsedState.isRunning : false,
      };
    }
    
    return parsedState;
  } catch (error) {
    console.error('Error loading timer state:', error);
    return null;
  }
};

// Limpiar estado del temporizador
export const clearTimerState = async () => {
  try {
    await AsyncStorage.removeItem('@MiGymApp:timerState');
  } catch (error) {
    console.error('Error clearing timer state:', error);
  }
};

// Guardar estado del cronómetro
export const saveStopwatchState = async (state: StopwatchState) => {
  try {
    const stateWithTimestamp = {
      ...state,
      lastSaveTime: Date.now()
    };
    await AsyncStorage.setItem('@MiGymApp:stopwatchState', JSON.stringify(stateWithTimestamp));
  } catch (error) {
    console.error('Error saving stopwatch state:', error);
  }
};

// Cargar estado del cronómetro
export const loadStopwatchState = async (): Promise<StopwatchState | null> => {
  try {
    const state = await AsyncStorage.getItem('@MiGymApp:stopwatchState');
    if (!state) return null;
    
    const parsedState: StopwatchState = JSON.parse(state);
    
    // Si el cronómetro estaba corriendo, calcular el tiempo transcurrido
    if (parsedState.isRunning && parsedState.lastSaveTime) {
      const timeElapsed = Math.floor((Date.now() - parsedState.lastSaveTime) / 10); // centiseconds
      const newCentiseconds = parsedState.centiseconds + timeElapsed;
      
      return {
        ...parsedState,
        centiseconds: newCentiseconds,
      };
    }
    
    return parsedState;
  } catch (error) {
    console.error('Error loading stopwatch state:', error);
    return null;
  }
};

// Limpiar estado del cronómetro
export const clearStopwatchState = async () => {
  try {
    await AsyncStorage.removeItem('@MiGymApp:stopwatchState');
  } catch (error) {
    console.error('Error clearing stopwatch state:', error);
  }
};

// === FUNCIONES DE INSCRIPCIONES A CLASES ===

// Función para inscribir a un cliente a una clase específica
export const enrollClientToClass = async (clientId: string, classId: number, gymId: string, scheduleInfo?: any) => {
  try {
    const key = `@MiGymApp:clientEnrollments:${clientId}`;
    const enrollments = await AsyncStorage.getItem(key);
    const currentEnrollments = enrollments ? JSON.parse(enrollments) : [];
    
    // Verificar si ya está inscrito en esta clase
    const isAlreadyEnrolled = currentEnrollments.some((enrollment: any) => 
      enrollment.classId === classId && enrollment.gymId === gymId
    );
    
    if (isAlreadyEnrolled) {
      return { success: false, message: 'Ya estás inscrito en esta clase' };
    }
    
    // Agregar nueva inscripción
    const newEnrollment = {
      classId,
      gymId,
      enrollmentDate: new Date().toISOString(),
      scheduleInfo: scheduleInfo || null,
      status: 'active'
    };
    
    currentEnrollments.push(newEnrollment);
    await AsyncStorage.setItem(key, JSON.stringify(currentEnrollments));
    
    return { success: true, message: 'Inscripción exitosa' };
  } catch (error) {
    console.error('Error inscribiendo cliente a clase:', error);
    return { success: false, message: 'Error al procesar la inscripción' };
  }
};

// Función para obtener las inscripciones de un cliente
export const getClientEnrollments = async (clientId: string) => {
  try {
    const key = `@MiGymApp:clientEnrollments:${clientId}`;
    const enrollments = await AsyncStorage.getItem(key);
    return enrollments ? JSON.parse(enrollments) : [];
  } catch (error) {
    console.error('Error obteniendo inscripciones del cliente:', error);
    return [];
  }
};

// Función para cancelar inscripción a una clase
export const cancelEnrollment = async (clientId: string, classId: number, gymId: string) => {
  try {
    const key = `@MiGymApp:clientEnrollments:${clientId}`;
    const enrollments = await AsyncStorage.getItem(key);
    const currentEnrollments = enrollments ? JSON.parse(enrollments) : [];
    
    // Filtrar la inscripción a cancelar
    const updatedEnrollments = currentEnrollments.filter((enrollment: any) => 
      !(enrollment.classId === classId && enrollment.gymId === gymId)
    );
    
    await AsyncStorage.setItem(key, JSON.stringify(updatedEnrollments));
    return { success: true, message: 'Inscripción cancelada' };
  } catch (error) {
    console.error('Error cancelando inscripción:', error);
    return { success: false, message: 'Error al cancelar la inscripción' };
  }
};

// Función para verificar si un cliente está inscrito en una clase
export const isClientEnrolledInClass = async (clientId: string, classId: number, gymId: string) => {
  try {
    const enrollments = await getClientEnrollments(clientId);
    return enrollments.some((enrollment: any) => 
      enrollment.classId === classId && enrollment.gymId === gymId && enrollment.status === 'active'
    );
  } catch (error) {
    console.error('Error verificando inscripción:', error);
    return false;
  }
};

// Función para obtener las clases en las que está inscrito un cliente con detalles completos
export const getClientEnrolledClassesWithDetails = async (clientId: string) => {
  try {
    const enrollments = await getClientEnrollments(clientId);
    const enrolledClasses = [];
    
    for (const enrollment of enrollments) {
      if (enrollment.status === 'active') {
        // Obtener las clases del gimnasio correspondiente
        const gymClasses = await getGymClasses(enrollment.gymId);
        const classDetails = gymClasses.find((clase: any) => clase.id === enrollment.classId);
        
        if (classDetails) {
          enrolledClasses.push({
            ...classDetails,
            enrollmentInfo: enrollment
          });
        }
      }
    }
    
    return enrolledClasses;
  } catch (error) {
    console.error('Error obteniendo clases inscritas con detalles:', error);
    return [];
  }
};

