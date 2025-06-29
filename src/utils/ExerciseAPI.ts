import AsyncStorage from '@react-native-async-storage/async-storage';
import { RAPIDAPI_KEY, EXERCISEDB_API_URL } from '../../config.json';

// Configuración de la API de ExerciseDB
const EXERCISEDB_CONFIG = {
  baseURL: EXERCISEDB_API_URL,
  rapidApiKey: RAPIDAPI_KEY,
  timeout: 10000
};

// Tipos de datos para ExerciseDB
export interface Exercise {
  id: string;
  name: string;
  bodyPart: string;
  target: string;
  equipment: string;
  gifUrl: string;
  secondaryMuscles: string[];
  instructions: string[];
}

export interface ExerciseFilter {
  bodyPart?: string;
  target?: string;
  equipment?: string;
  limit?: number;
}

// Mapeo de grupos musculares de la app a bodyParts de ExerciseDB
const BODY_PART_MAPPING = {
  'Piernas': ['upper legs', 'lower legs'],
  'Brazos': ['upper arms', 'lower arms'],
  'Pecho': ['chest'],
  'Espalda': ['back'],
  'Hombros': ['shoulders'],
  'Core': ['waist']
};

// Cache keys
const CACHE_KEYS = {
  EXERCISES: '@ExerciseDB:exercises',
  LAST_UPDATE: '@ExerciseDB:lastUpdate'
};

// Duración del cache (24 horas)
const CACHE_DURATION = 24 * 60 * 60 * 1000;

class ExerciseDBService {
  private async makeRequest(endpoint: string): Promise<any> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), EXERCISEDB_CONFIG.timeout);

      const response = await fetch(`${EXERCISEDB_CONFIG.baseURL}${endpoint}`, {
        headers: {
          'X-RapidAPI-Key': EXERCISEDB_CONFIG.rapidApiKey,
          'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('ExerciseDB API Error:', error);
      throw error;
    }
  }

  async getExercisesByMuscleGroup(muscleGroup: string): Promise<Exercise[]> {
    try {
      // Verificar cache primero
      const cachedExercises = await this.getCachedExercises(muscleGroup);
      if (cachedExercises) {
        return cachedExercises;
      }

      const bodyParts = BODY_PART_MAPPING[muscleGroup] || [muscleGroup.toLowerCase()];
      let allExercises: Exercise[] = [];

      // Obtener ejercicios para cada parte del cuerpo
      for (const bodyPart of bodyParts) {
        try {
          const exercises = await this.makeRequest(`/exercises/bodyPart/${bodyPart}`);
          if (exercises && Array.isArray(exercises)) {
            allExercises = [...allExercises, ...exercises.slice(0, 15)];
          }
        } catch (error) {
          console.error(`Error obteniendo ejercicios para ${bodyPart}:`, error);
        }
      }

      // Eliminar duplicados
      const uniqueExercises = allExercises.filter((exercise, index, self) => 
        index === self.findIndex(e => e.id === exercise.id)
      );

      // Cachear resultados
      await this.cacheExercises(muscleGroup, uniqueExercises);
      return uniqueExercises;
    } catch (error) {
      console.error(`Error obteniendo ejercicios para ${muscleGroup}:`, error);
      return this.getMockExercises(muscleGroup);
    }
  }

  async searchExercises(searchTerm: string): Promise<Exercise[]> {
    try {
      // Buscar por nombre
      const exerciseByName = await this.makeRequest(`/exercises/name/${searchTerm.toLowerCase()}`);
      if (exerciseByName && Array.isArray(exerciseByName)) {
        return exerciseByName;
      }

      // Si no encuentra, buscar en todos limitado
      const allExercises = await this.makeRequest('/exercises?limit=100');
      if (allExercises && Array.isArray(allExercises)) {
        return allExercises.filter(exercise => 
          exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          exercise.target.toLowerCase().includes(searchTerm.toLowerCase())
        ).slice(0, 20);
      }

      return [];
    } catch (error) {
      console.error('Error buscando ejercicios:', error);
      return [];
    }
  }

  async getFilteredExercises(filter: ExerciseFilter): Promise<Exercise[]> {
    try {
      let endpoint = '/exercises';
      
      if (filter.bodyPart) {
        endpoint = `/exercises/bodyPart/${filter.bodyPart}`;
      } else if (filter.target) {
        endpoint = `/exercises/target/${filter.target}`;
      } else if (filter.equipment) {
        endpoint = `/exercises/equipment/${filter.equipment}`;
      }

      const exercises = await this.makeRequest(endpoint);
      
      if (exercises && Array.isArray(exercises)) {
        const limit = filter.limit || 50;
        return exercises.slice(0, limit);
      }

      return [];
    } catch (error) {
      console.error('Error obteniendo ejercicios filtrados:', error);
      return [];
    }
  }

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

  private getMockExercises(muscleGroup: string): Exercise[] {
    const mockExercises = {
      'Piernas': [
        {
          id: 'mock_1',
          name: 'Sentadillas',
          bodyPart: 'upper legs',
          target: 'quads',
          equipment: 'body weight',
          gifUrl: 'https://v2.exercisedb.io/image/IjJNgQlVvhOcAi',
          secondaryMuscles: ['glutes', 'hamstrings'],
          instructions: [
            'Colócate de pie con los pies separados al ancho de los hombros.',
            'Baja como si fueras a sentarte en una silla, manteniendo el pecho erguido.',
            'Desciende hasta que tus muslos estén paralelos al suelo.',
            'Regresa a la posición inicial empujando a través de los talones.'
          ]
        },
        {
          id: 'mock_2',
          name: 'Zancadas',
          bodyPart: 'upper legs',
          target: 'quads',
          equipment: 'body weight',
          gifUrl: 'https://v2.exercisedb.io/image/IjJNgQlVvhOcAi',
          secondaryMuscles: ['glutes', 'hamstrings'],
          instructions: [
            'Colócate de pie con los pies juntos.',
            'Da un paso largo hacia adelante con una pierna.',
            'Baja hasta que ambas rodillas formen ángulos de 90 grados.',
            'Regresa a la posición inicial y repite con la otra pierna.'
          ]
        }
      ],
      'Brazos': [
        {
          id: 'mock_3',
          name: 'Flexiones de brazos',
          bodyPart: 'upper arms',
          target: 'pectorals',
          equipment: 'body weight',
          gifUrl: 'https://v2.exercisedb.io/image/IjJNgQlVvhOcAi',
          secondaryMuscles: ['triceps', 'shoulders'],
          instructions: [
            'Colócate en posición de plancha con las manos al ancho de los hombros.',
            'Mantén el cuerpo recto desde la cabeza hasta los talones.',
            'Baja el cuerpo hasta que el pecho casi toque el suelo.',
            'Empuja hacia arriba hasta la posición inicial.'
          ]
        }
      ],
      'Pecho': [
        {
          id: 'mock_4',
          name: 'Press de banca',
          bodyPart: 'chest',
          target: 'pectorals',
          equipment: 'barbell',
          gifUrl: 'https://v2.exercisedb.io/image/IjJNgQlVvhOcAi',
          secondaryMuscles: ['triceps', 'shoulders'],
          instructions: [
            'Acuéstate en el banco con los pies firmes en el suelo.',
            'Agarra la barra con las manos separadas al ancho de los hombros.',
            'Baja la barra controladamente hasta el pecho.',
            'Empuja la barra hacia arriba hasta extender completamente los brazos.'
          ]
        }
      ],
      'Espalda': [
        {
          id: 'mock_5',
          name: 'Dominadas',
          bodyPart: 'back',
          target: 'lats',
          equipment: 'body weight',
          gifUrl: 'https://v2.exercisedb.io/image/IjJNgQlVvhOcAi',
          secondaryMuscles: ['biceps', 'rhomboids'],
          instructions: [
            'Cuelga de la barra con las manos separadas al ancho de los hombros.',
            'Mantén el cuerpo recto y los brazos completamente extendidos.',
            'Tira hacia arriba hasta que el mentón pase la barra.',
            'Baja controladamente hasta la posición inicial.'
          ]
        }
      ]
    };

    return mockExercises[muscleGroup] || [];
  }

  async clearCache() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const exerciseDBKeys = keys.filter(key => key.startsWith('@ExerciseDB:'));
      await AsyncStorage.multiRemove(exerciseDBKeys);
      console.log('Cache de ExerciseDB limpiado');
    } catch (error) {
      console.error('Error limpiando cache:', error);
    }
  }
}

// Instancia singleton del servicio
export const exerciseAPI = new ExerciseDBService();

// Función helper para obtener todos los grupos musculares disponibles
export const getAvailableMuscleGroups = () => {
  return Object.keys(BODY_PART_MAPPING);
};

// Función helper para obtener equipamientos comunes
export const getCommonEquipment = () => {
  return [
    'body weight',
    'dumbbell', 
    'barbell',
    'cable',
    'machine',
    'resistance band',
    'kettlebell'
  ];
};

// Función helper para validar si la API está configurada
export const isAPIConfigured = () => {
  return EXERCISEDB_CONFIG.rapidApiKey && EXERCISEDB_CONFIG.rapidApiKey.trim() !== '';
}; 