import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getCurrentUser,
  getUsersDB,
  getSession,
  saveAttendance,
  getAttendance,
  savePreferences,
  getPreferences,
  clearAllData,
  updateUserProfile,
  getRegisteredGyms,
  getGymNames,
  getAvailableClasses,
  getUserPaymentInfo,
  processPayment,
  saveUserClasses,
  getUserClasses
} from '../../utils/storage';
import theme from '../../constants/theme';
import globalStyles from '../../styles/global';

export default function DebugStorage() {
  const [debugInfo, setDebugInfo] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [allKeys, setAllKeys] = useState<readonly string[]>([]);

  useEffect(() => {
    loadDebugInfo();
  }, []);

  const loadDebugInfo = async () => {
    try {
      // Obtener todas las keys de AsyncStorage
      const keys = await AsyncStorage.getAllKeys();
      setAllKeys(keys);

      // Obtener usuario actual
      const user = await getCurrentUser();
      setCurrentUser(user);

      // Obtener información de gimnasios
      const registeredGyms = await getRegisteredGyms();
      const gymNames = await getGymNames();

      // Obtener clases disponibles
      const availableClasses = await getAvailableClasses();

      // Crear info de debug
      let info = '=== ESTADO ACTUAL DE ASYNCSTORAGE ===\n\n';
      info += `📱 Total de keys almacenadas: ${keys.length}\n`;
      info += `👤 Usuario logueado: ${user ? user.name : 'Ninguno'}\n`;
      info += `📧 Email: ${user ? user.email : 'N/A'}\n`;
      info += `🎭 Rol: ${user ? user.role : 'N/A'}\n`;
      info += `🏢 Gimnasios registrados: ${registeredGyms.length}\n`;
      info += `📝 Opciones de gimnasio: ${gymNames.length}\n`;
      info += `🏃 Clases disponibles: ${availableClasses.length}\n\n`;

      info += '🔑 Keys en AsyncStorage:\n';
      for (const key of keys) {
        info += `  • ${key}\n`;
      }

      setDebugInfo(info);
    } catch (error) {
      setDebugInfo(`Error cargando debug info: ${error.message}`);
    }
  };

  const testClasses = async () => {
    try {
      const availableClasses = await getAvailableClasses();
      
      let classInfo = '=== CLASES DISPONIBLES ===\n\n';
      classInfo += `📊 Total clases: ${availableClasses.length}\n\n`;
      
      availableClasses.forEach((clase, index) => {
        classInfo += `${index + 1}. ${clase.nombre}\n`;
        classInfo += `   📝 Descripción: ${clase.descripcion?.substring(0, 50)}...\n`;
        classInfo += `   📅 Días disponibles: ${clase.horarios?.length || 0}\n\n`;
      });
      
      Alert.alert('🏃 Clases Disponibles', classInfo);
    } catch (error) {
      Alert.alert('❌ Error', `Error obteniendo clases: ${error.message}`);
    }
  };

  const testPayments = async () => {
    if (!currentUser) {
      Alert.alert('Error', 'Necesitas estar logueado para probar pagos');
      return;
    }

    try {
      const paymentInfo = await getUserPaymentInfo(currentUser.id);
      
      let paymentDetails = '=== INFORMACIÓN DE PAGO ===\n\n';
      paymentDetails += `💰 Monto: $${paymentInfo.monto.toLocaleString('es-AR', { minimumFractionDigits: 2 })}\n`;
      paymentDetails += `📋 Estado: ${paymentInfo.pendiente ? 'PENDIENTE' : 'PAGADO'}\n`;
      paymentDetails += `📅 Período: ${paymentInfo.periodo}\n`;
      paymentDetails += `📄 Factura: ${paymentInfo.numeroFactura}\n`;
      
      if (paymentInfo.fechaVencimiento) {
        const vencimiento = new Date(paymentInfo.fechaVencimiento).toLocaleDateString('es-ES');
        paymentDetails += `⏰ Vencimiento: ${vencimiento}\n`;
      }
      
      Alert.alert('💳 Info de Pagos', paymentDetails);
    } catch (error) {
      Alert.alert('❌ Error', `Error obteniendo info de pagos: ${error.message}`);
    }
  };

  const testUserClasses = async () => {
    if (!currentUser) {
      Alert.alert('Error', 'Necesitas estar logueado para probar clases de usuario');
      return;
    }

    try {
      const userClasses = await getUserClasses(currentUser.id);
      
      let classesInfo = '=== CLASES DEL USUARIO ===\n\n';
      classesInfo += `📊 Total inscripciones: ${userClasses.length}\n\n`;
      
      if (userClasses.length > 0) {
        userClasses.forEach((clase, index) => {
          classesInfo += `${index + 1}. ${clase.nombreClase}\n`;
          classesInfo += `   🕐 Horarios: ${clase.horarios?.length || 0}\n`;
          const fecha = new Date(clase.fechaInscripcion).toLocaleDateString('es-ES');
          classesInfo += `   📅 Inscrito: ${fecha}\n\n`;
        });
      } else {
        classesInfo += 'No hay clases registradas\n';
      }
      
      Alert.alert('🏃 Clases del Usuario', classesInfo);
    } catch (error) {
      Alert.alert('❌ Error', `Error obteniendo clases del usuario: ${error.message}`);
    }
  };

  const testPaymentFlow = async () => {
    if (!currentUser) {
      Alert.alert('Error', 'Necesitas estar logueado para probar flujo de pago');
      return;
    }

    try {
      const paymentData = {
        metodo: 'Tarjeta de crédito',
        tarjeta: '****1234',
        nombre: 'Test User',
        monto: 1000
      };

      const result = await processPayment(currentUser.id, paymentData);
      
      Alert.alert(
        result.success ? '✅ Pago Exitoso' : '❌ Pago Fallido',
        `Resultado: ${result.message}\n\nEste es un test del flujo de pago con AsyncStorage.`
      );
      
      // Recargar info después del test
      loadDebugInfo();
    } catch (error) {
      Alert.alert('❌ Error', `Error en flujo de pago: ${error.message}`);
    }
  };

  const testUserRegistration = async () => {
    Alert.alert(
      'Test Registro',
      'Ve a la pantalla de registro y crea un usuario. Luego vuelve aquí y presiona "Actualizar Info" para ver si se guardó correctamente.'
    );
  };

  const testGymFlow = async () => {
    Alert.alert(
      '🏢 Test Flujo de Gimnasios',
      'Sigue estos pasos:\n\n' +
      '1. Ve a "Registro" → "Gimnasio"\n' +
      '2. Crea un nuevo gimnasio\n' +
      '3. Vuelve aquí y presiona "Test Gimnasios"\n' +
      '4. Ve a "Registro" → "Socio"\n' +
      '5. ¡Deberías ver el gimnasio recién creado en la lista!\n\n' +
      'Esto confirma que los gimnasios se guardan y cargan correctamente desde AsyncStorage.'
    );
  };

  const testLogin = async () => {
    Alert.alert(
      'Test Login',
      'Ve a la pantalla de login e inicia sesión. Luego vuelve aquí para ver si la sesión se mantiene.'
    );
  };

  const testAttendance = async () => {
    if (!currentUser) {
      Alert.alert('Error', 'Necesitas estar logueado para probar asistencias');
      return;
    }

    try {
      // Agregar asistencia de hoy
      const today = new Date().toISOString().split('T')[0];
      const currentAttendance = await getAttendance(currentUser.id);
      const newAttendance = [...currentAttendance, today];
      
      await saveAttendance(currentUser.id, newAttendance);
      
      Alert.alert('✅ Éxito', `Asistencia agregada. Total: ${newAttendance.length} días`);
      loadDebugInfo();
    } catch (error) {
      Alert.alert('❌ Error', `No se pudo guardar asistencia: ${error.message}`);
    }
  };

  const testPreferences = async () => {
    try {
      const testPrefs = {
        theme: 'dark',
        notifications: true,
        language: 'es',
        testDate: new Date().toISOString()
      };

      await savePreferences(testPrefs);
      const savedPrefs = await getPreferences();
      
      Alert.alert(
        '✅ Éxito', 
        `Preferencias guardadas y recuperadas:\n${JSON.stringify(savedPrefs, null, 2)}`
      );
    } catch (error) {
      Alert.alert('❌ Error', `Error con preferencias: ${error.message}`);
    }
  };

  const testUserUpdate = async () => {
    if (!currentUser) {
      Alert.alert('Error', 'Necesitas estar logueado para probar actualizaciones');
      return;
    }

    try {
      const updates = {
        weight: '75',
        height: '1.75',
        lastUpdate: new Date().toISOString()
      } as any;

      const updatedUser = await updateUserProfile(currentUser.id, updates);
      
      if (updatedUser) {
        Alert.alert('✅ Éxito', 'Perfil actualizado correctamente');
        setCurrentUser(updatedUser);
        loadDebugInfo();
      } else {
        Alert.alert('❌ Error', 'No se pudo actualizar el perfil');
      }
    } catch (error) {
      Alert.alert('❌ Error', `Error actualizando perfil: ${error.message}`);
    }
  };

  const testGyms = async () => {
    try {
      // Obtener gimnasios registrados
      const registeredGyms = await getRegisteredGyms();
      const gymNames = await getGymNames();
      
      let gymInfo = '=== GIMNASIOS REGISTRADOS ===\n\n';
      gymInfo += `📊 Total gimnasios registrados: ${registeredGyms.length}\n\n`;
      
      if (registeredGyms.length > 0) {
        gymInfo += '🏢 Gimnasios registrados:\n';
        registeredGyms.forEach((gym, index) => {
          gymInfo += `${index + 1}. ${gym.businessName}\n`;
          gymInfo += `   📧 Email: ${gym.email}\n`;
          gymInfo += `   📍 Dirección: ${gym.address || 'No especificada'}\n`;
          gymInfo += `   👥 Clientes: ${gym.clients.length}\n\n`;
        });
      }
      
      gymInfo += '\n🔽 Lista de gimnasios disponibles para registro:\n';
      gymNames.forEach((name, index) => {
        gymInfo += `${index + 1}. ${name}\n`;
      });
      
      Alert.alert('🏢 Info de Gimnasios', gymInfo);
    } catch (error) {
      Alert.alert('❌ Error', `Error obteniendo gimnasios: ${error.message}`);
    }
  };

  const testPersistence = async () => {
    Alert.alert(
      '🔄 Test de Persistencia',
      'Ahora cierra la app completamente y vuelve a abrirla. Los datos deberían persistir.',
      [
        { text: 'Entendido', style: 'default' }
      ]
    );
  };

  const viewAllData = async () => {
    try {
      let allData = '=== TODOS LOS DATOS GUARDADOS ===\n\n';
      
      for (const key of allKeys) {
        try {
          const value = await AsyncStorage.getItem(key);
          allData += `🔑 ${key}:\n`;
          allData += `${value ? JSON.stringify(JSON.parse(value), null, 2) : 'null'}\n\n`;
        } catch (e) {
          allData += `🔑 ${key}: [Error leyendo datos]\n\n`;
        }
      }

      Alert.alert('📊 Todos los Datos', allData);
    } catch (error) {
      Alert.alert('❌ Error', `Error obteniendo datos: ${error.message}`);
    }
  };

  const clearAllStorageData = async () => {
    Alert.alert(
      '🗑️ ¿Limpiar TODO?',
      'Esto eliminará TODOS los datos de AsyncStorage. ¿Estás seguro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'SÍ, Eliminar TODO',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllData();
              Alert.alert('✅ Limpieza Completa', 'Todos los datos han sido eliminados');
              loadDebugInfo();
              setCurrentUser(null);
            } catch (error) {
              Alert.alert('❌ Error', `Error limpiando datos: ${error.message}`);
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.surface }}>
      <View style={{ padding: theme.spacing.lg }}>
        
        <Text style={[globalStyles.title, { marginBottom: theme.spacing.lg }]}>
          🧪 Debug AsyncStorage
        </Text>

        {/* Info Debug */}
        <View style={[globalStyles.card, { marginBottom: theme.spacing.lg }]}>
          <Text style={{ 
            fontFamily: 'monospace', 
            fontSize: 12, 
            color: theme.colors.textSecondary 
          }}>
            {debugInfo}
          </Text>
        </View>

        {/* Botones de prueba */}
        <Text style={[globalStyles.subtitle, { marginBottom: theme.spacing.md }]}>
          🧪 Pruebas de Funcionalidad
        </Text>

        <TouchableOpacity 
          style={[globalStyles.LoginButton, { marginBottom: theme.spacing.sm }]}
          onPress={testUserRegistration}
        >
          <Text style={globalStyles.buttonText}>Test Registro Usuario</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[globalStyles.LoginButton, { marginBottom: theme.spacing.sm }]}
          onPress={testLogin}
        >
          <Text style={globalStyles.buttonText}>Test Login</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[globalStyles.LoginButton, { marginBottom: theme.spacing.sm }]}
          onPress={testAttendance}
        >
          <Text style={globalStyles.buttonText}>Test Asistencia</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[globalStyles.LoginButton, { marginBottom: theme.spacing.sm }]}
          onPress={testPreferences}
        >
          <Text style={globalStyles.buttonText}>Test Preferencias</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[globalStyles.LoginButton, { marginBottom: theme.spacing.sm }]}
          onPress={testUserUpdate}
        >
          <Text style={globalStyles.buttonText}>Test Actualizar Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[globalStyles.LoginButton, { marginBottom: theme.spacing.sm }]}
          onPress={testGyms}
        >
          <Text style={globalStyles.buttonText}>Test Gimnasios</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[globalStyles.LoginButton, { marginBottom: theme.spacing.sm }]}
          onPress={testClasses}
        >
          <Text style={globalStyles.buttonText}>🏃 Test Clases</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[globalStyles.LoginButton, { marginBottom: theme.spacing.sm }]}
          onPress={testPayments}
        >
          <Text style={globalStyles.buttonText}>💳 Test Pagos</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[globalStyles.LoginButton, { marginBottom: theme.spacing.sm }]}
          onPress={testUserClasses}
        >
          <Text style={globalStyles.buttonText}>📚 Test Clases Usuario</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[globalStyles.LoginButton, { marginBottom: theme.spacing.sm }]}
          onPress={testPaymentFlow}
        >
          <Text style={globalStyles.buttonText}>💰 Test Flujo Pago</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[globalStyles.LoginButton, { marginBottom: theme.spacing.sm }]}
          onPress={testGymFlow}
        >
          <Text style={globalStyles.buttonText}>🏢 Test Flujo Completo</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[globalStyles.LoginButton, { marginBottom: theme.spacing.sm }]}
          onPress={testPersistence}
        >
          <Text style={globalStyles.buttonText}>Test Persistencia</Text>
        </TouchableOpacity>

        {/* Botones de utilidad */}
        <Text style={[globalStyles.subtitle, { marginTop: theme.spacing.lg, marginBottom: theme.spacing.md }]}>
          🔧 Utilidades
        </Text>

        <TouchableOpacity 
          style={[globalStyles.Button, { backgroundColor: theme.colors.primary, marginBottom: theme.spacing.sm, width: '100%' }]}
          onPress={loadDebugInfo}
        >
          <Text style={globalStyles.buttonText}>🔄 Actualizar Info</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[globalStyles.Button, { backgroundColor: '#34D399', marginBottom: theme.spacing.sm, width: '100%' }]}
          onPress={viewAllData}
        >
          <Text style={globalStyles.buttonText}>📊 Ver Todos los Datos</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[globalStyles.Button, { backgroundColor: '#EF4444', marginBottom: theme.spacing.xl, width: '100%' }]}
          onPress={clearAllStorageData}
        >
          <Text style={globalStyles.buttonText}>🗑️ Limpiar TODO</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
} 