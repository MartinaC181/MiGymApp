import { useState, useEffect } from 'react';
import { getSession, getCurrentUser, clearSession, getRegisteredGyms, saveUser } from '../utils/storage';
import { ClientUser, GymUser } from '../data/Usuario';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<ClientUser | GymUser | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const session = await getSession();
      const currentUser = await getCurrentUser();
      
      if (session?.isAuthenticated && currentUser) {
        setIsAuthenticated(true);
        setUser(currentUser);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await clearSession();
    setIsAuthenticated(false);
    setUser(null);
  };

  return {
    isLoading,
    isAuthenticated,
    user,
    logout,
    checkAuthStatus
  };
};

export async function registerClient({ name, email, password, gymName, ...rest }) {
  // Buscar el gimnasio por nombre
  const gyms = await getRegisteredGyms();
  const gym = gyms.find(g => g.businessName.trim().toLowerCase() === gymName.trim().toLowerCase());
  const gymId = gym ? gym.id : null;

  if (!gymId) {
    throw new Error('No se encontró el gimnasio seleccionado');
  }

  // Crear el usuario cliente con gymId correcto
  const newClient = {
    id: `client_${Date.now()}`,
    name,
    email,
    password,
    role: 'client' as const,
    gymId, // Asociar por id
    weeklyGoal: 3,
    weeklyStreak: 0,
    attendance: [],
    ...rest
  };
  // Guardar usuario (usa la lógica existente)
  await saveUser(newClient);
  return newClient;
} 