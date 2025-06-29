import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { lightTheme, darkTheme } from '../constants/theme';
import { saveThemePreference, loadThemePreference } from '../utils/storage';

interface ThemeContextType {
  isDarkMode: boolean;
  theme: typeof lightTheme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSavedTheme();
  }, []);

  const loadSavedTheme = async () => {
    try {
      const savedTheme = await loadThemePreference();
      setIsDarkMode(savedTheme);
    } catch (error) {
      console.warn('Error al cargar el tema guardado:', error);
      // Si hay error, usar modo claro por defecto
      setIsDarkMode(false);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    
    // Guardar de forma asíncrona pero no esperar
    saveThemePreference(newTheme).catch((error) => {
      console.error('Error al guardar tema:', error);
    });
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  // Si está cargando, mostrar un estado por defecto en lugar de null
  if (isLoading) {
    return (
      <ThemeContext.Provider value={{ isDarkMode: false, theme: lightTheme, toggleTheme }}>
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}; 