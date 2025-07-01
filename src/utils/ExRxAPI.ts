import AsyncStorage from '@react-native-async-storage/async-storage';
import { EXRX_API_TOKEN, EXRX_API_URL } from '../../config.json';

// Configuración de la API
const EXRX_API_CONFIG = {
  baseURL: EXRX_API_URL,
  bearerToken: EXRX_API_TOKEN,
  timeout: 10000
};

// Tipos de datos para los ejercicios
export interface Exercise {
  id: string;
  name: string;
  classification: string;
  targetMuscle: string;
  apparatus: string;
  apparatusGroup: string;
  instructions: {
    preparation: string;
    execution: string;
  };
  utility: string;
  mechanics: string;
  force: string;
  difficulty?: number;
  media?: {
    videoUrl?: string;
    thumbnailUrl?: string;
    imageUrl?: string;
  };
}

export interface ExerciseFilter {
  targetMuscle?: string;
  apparatus?: string;
  apparatusGroup?: string;
  mechanics?: string;
  force?: string;
  limit?: number;
}

// Mapeo de grupos musculares de la app a los de la API
const MUSCLE_GROUP_MAPPING = {
  'Piernas': ['Quadriceps', 'Hamstrings', 'Calves', 'Glutes'],
  'Brazos': ['Biceps', 'Triceps', 'Forearms'],
  'Pecho': ['Pectorals'],
  'Espalda': ['Latissimus Dorsi', 'Rhomboids', 'Middle Trapezius', 'Lower Trapezius'],
  'Hombros': ['Anterior Deltoid', 'Middle Deltoid', 'Posterior Deltoid'],
  'Core': ['Rectus Abdominis', 'Obliques']
};

// Cache keys
const CACHE_KEYS = {
  EXERCISES: '@ExRx:exercises',
  MUSCLE_GROUPS: '@ExRx:muscleGroups',
  LAST_UPDATE: '@ExRx:lastUpdate'
};

// Duración del cache (24 horas)
const CACHE_DURATION = 24 * 60 * 60 * 1000;

class ExRxAPIService {
  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    try {
      // Crear un AbortController para manejar timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), EXRX_API_CONFIG.timeout);

      const response = await fetch(`${EXRX_API_CONFIG.baseURL}${endpoint}`, {
        ...options,
        headers: {
          'Authorization': `Bearer ${EXRX_API_CONFIG.bearerToken}`,
          'Content-Type': 'application/json',
          ...options.headers
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('ExRx API Error:', error);
      throw error;
    }
  }

  // Obtener ejercicios por grupo muscular
  async getExercisesByMuscleGroup(muscleGroup: string): Promise<Exercise[]> {
    try {
      // Primero verificar cache
      const cachedExercises = await this.getCachedExercises(muscleGroup);
      if (cachedExercises) {
        return cachedExercises;
      }

      const targetMuscles = MUSCLE_GROUP_MAPPING[muscleGroup] || [muscleGroup];
      let allExercises: Exercise[] = [];

      // Hacer consultas para cada músculo objetivo
      for (const muscle of targetMuscles) {
        const data = await this.makeRequest('/exercises', {
          method: 'POST',
          body: JSON.stringify({
            query: {
              targetMuscle: muscle,
              limit: 50
            }
          })
        });

        if (data.exercises) {
          allExercises = [...allExercises, ...data.exercises];
        }
      }

      // Cachear los resultados
      await this.cacheExercises(muscleGroup, allExercises);
      return allExercises;
    } catch (error) {
      console.error(`Error obteniendo ejercicios para ${muscleGroup}:`, error);
      
      // Si falla la API, devolver ejercicios mock
      return this.getMockExercises(muscleGroup);
    }
  }

  // Buscar ejercicios por nombre
  async searchExercises(searchTerm: string): Promise<Exercise[]> {
    try {
      const data = await this.makeRequest('/exercises/search', {
        method: 'POST',
        body: JSON.stringify({
          name: searchTerm,
          limit: 20
        })
      });

      return data.exercises || [];
    } catch (error) {
      console.error('Error buscando ejercicios:', error);
      return [];
    }
  }

  // Obtener ejercicios filtrados
  async getFilteredExercises(filter: ExerciseFilter): Promise<Exercise[]> {
    try {
      const data = await this.makeRequest('/exercises/filter', {
        method: 'POST',
        body: JSON.stringify(filter)
      });

      return data.exercises || [];
    } catch (error) {
      console.error('Error obteniendo ejercicios filtrados:', error);
      return [];
    }
  }

  // Funciones de cache
  private async getCachedExercises(muscleGroup: string): Promise<Exercise[] | null> {
    try {
      const cacheKey = `${CACHE_KEYS.EXERCISES}:${muscleGroup}`;
      const lastUpdate = await AsyncStorage.getItem(CACHE_KEYS.LAST_UPDATE);
      
      if (lastUpdate) {
        const timeDiff = Date.now() - parseInt(lastUpdate);
        if (timeDiff < CACHE_DURATION) {
          const cachedData = await AsyncStorage.getItem(cacheKey);
          if (cachedData) {
            return JSON.parse(cachedData);
          }
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error obteniendo cache:', error);
      return null;
    }
  }

  private async cacheExercises(muscleGroup: string, exercises: Exercise[]) {
    try {
      const cacheKey = `${CACHE_KEYS.EXERCISES}:${muscleGroup}`;
      await AsyncStorage.setItem(cacheKey, JSON.stringify(exercises));
      await AsyncStorage.setItem(CACHE_KEYS.LAST_UPDATE, Date.now().toString());
    } catch (error) {
      console.error('Error cacheando ejercicios:', error);
    }
  }

  // Datos mock para cuando la API no esté disponible
  private getMockExercises(muscleGroup: string): Exercise[] {
    const mockExercises = {
      'Piernas': [
        {
          id: 'mock_1',
          name: 'Sentadillas',
          classification: 'Peso Corporal',
          targetMuscle: 'Cuádriceps',
          apparatus: 'Peso Corporal',
          apparatusGroup: 'Peso Corporal',
          instructions: {
            preparation: 'Colócate de pie con los pies separados al ancho de los hombros.',
            execution: 'Baja como si fueras a sentarte en una silla, manteniendo el pecho erguido. Regresa a la posición inicial.'
          },
          utility: 'Básico',
          mechanics: 'Compuesto',
          force: 'Empuje'
        },
        {
          id: 'mock_2',
          name: 'Zancadas',
          classification: 'Peso Corporal',
          targetMuscle: 'Cuádriceps',
          apparatus: 'Peso Corporal',
          apparatusGroup: 'Peso Corporal',
          instructions: {
            preparation: 'Colócate de pie con los pies juntos.',
            execution: 'Da un paso largo hacia adelante y baja hasta que ambas rodillas formen ángulos de 90 grados.'
          },
          utility: 'Básico',
          mechanics: 'Compuesto',
          force: 'Empuje'
        }
      ],
      'Brazos': [
        {
          id: 'mock_3',
          name: 'Flexiones de brazos',
          classification: 'Peso Corporal',
          targetMuscle: 'Pectorales',
          apparatus: 'Peso Corporal',
          apparatusGroup: 'Peso Corporal',
          instructions: {
            preparation: 'Colócate en posición de plancha con las manos al ancho de los hombros.',
            execution: 'Baja el cuerpo hasta que el pecho casi toque el suelo, luego empuja hacia arriba.'
          },
          utility: 'Básico',
          mechanics: 'Compuesto',
          force: 'Empuje'
        }
      ],
      'Pecho': [
        {
          id: 'mock_4',
          name: 'Press de banca',
          classification: 'Peso Libre',
          targetMuscle: 'Pectorales',
          apparatus: 'Barra',
          apparatusGroup: 'Peso Libre',
          instructions: {
            preparation: 'Acuéstate en el banco con los pies firmes en el suelo.',
            execution: 'Baja la barra controladamente hasta el pecho, luego empuja hacia arriba.'
          },
          utility: 'Básico',
          mechanics: 'Compuesto',
          force: 'Empuje'
        }
      ],
      'Espalda': [
        {
          id: 'mock_5',
          name: 'Dominadas',
          classification: 'Peso Corporal',
          targetMuscle: 'Latissimus Dorsi',
          apparatus: 'Barra de dominadas',
          apparatusGroup: 'Peso Corporal',
          instructions: {
            preparation: 'Cuelga de la barra con las manos separadas al ancho de los hombros.',
            execution: 'Tira hacia arriba hasta que el mentón pase la barra, luego baja controladamente.'
          },
          utility: 'Básico',
          mechanics: 'Compuesto',
          force: 'Tirón'
        }
      ]
    };

    return mockExercises[muscleGroup] || [];
  }

  // Limpiar cache
  async clearCache() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const exrxKeys = keys.filter(key => key.startsWith('@ExRx:'));
      await AsyncStorage.multiRemove(exrxKeys);
      console.log('Cache de ExRx limpiado');
    } catch (error) {
      console.error('Error limpiando cache:', error);
    }
  }
}

// Instancia singleton del servicio
export const exrxAPI = new ExRxAPIService();

// Función helper para obtener todos los grupos musculares disponibles
export const getAvailableMuscleGroups = () => {
  return Object.keys(MUSCLE_GROUP_MAPPING);
};

// Función helper para validar si el token está configurado
export const isAPIConfigured = () => {
  return EXRX_API_CONFIG.bearerToken !== 'YOUR_EXRX_API_TOKEN_HERE' && EXRX_API_CONFIG.bearerToken.trim() !== '';
}; 