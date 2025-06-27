// Tipos de usuario
export type UserRole = 'client' | 'gym';

// Interface para clientes del gimnasio
export interface ClientUser {
  id: string;
  email: string;
  password: string;
  role: 'client';
  name: string;
  weeklyGoal: number;
  attendance: string[];
  weeklyStreak: number;
  gymId?: string; // ID del gimnasio al que pertenece
  birthDate?: string;
  membershipType?: string;
}

// Interface para gimnasios
export interface GymUser {
  id: string;
  email: string;
  password: string;
  role: 'gym';
  name: string;
  businessName: string;
  address?: string;
  phone?: string;
  description?: string;
  clients: string[]; // IDs de clientes
  classes: string[]; // IDs de clases
  subscriptionPlan?: string;
}

// Usuario cliente existente
export const UsuarioAtleta: ClientUser = {
  id: "client_1",
  email: "mirtho@gmail.com",
  password: "123456",     
  role: "client",         
  name: "Mirtho Legrand",         
  weeklyGoal: 3,          
  attendance: [
    "2024-06-03",
    "2024-06-05",
    "2024-06-07",
  ], 
  weeklyStreak: 1,
  gymId: "gym_1",
  birthDate: "1990-05-15",
  membershipType: "premium"
};

// Usuario gimnasio de ejemplo
export const UsuarioGimnasio: GymUser = {
  id: "gym_1",
  email: "gimnasio@ejemplo.com",
  password: "123456",
  role: "gym",
  name: "Admin Gimnasio",
  businessName: "FitCenter Plus",
  address: "Av. Corrientes 1234, CABA",
  phone: "+54 11 1234-5678",
  description: "Gimnasio moderno con equipamiento de última generación",
  clients: ["client_1"],
  classes: [],
  subscriptionPlan: "pro"
};

// Función helper para determinar el tipo de usuario
export const getUserByCredentials = (email: string, password: string): ClientUser | GymUser | null => {
  if (UsuarioAtleta.email === email && UsuarioAtleta.password === password) {
    return UsuarioAtleta;
  }
  if (UsuarioGimnasio.email === email && UsuarioGimnasio.password === password) {
    return UsuarioGimnasio;
  }
  return null;
};