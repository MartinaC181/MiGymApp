import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme } from '../constants/theme';

interface ThemeContextType {
  isDarkMode: boolean;
  theme: typeof lightTheme;
  toggleTheme: () => void;
  timerState: 'selection' | 'timer' | 'stopwatch';
  setTimerState: (state: 'selection' | 'timer' | 'stopwatch') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [timerState, setTimerState] = useState<'selection' | 'timer' | 'stopwatch'>('selection');

  useEffect(() => {
    loadSavedTheme();
  }, []);

  const loadSavedTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('@MiGymApp:theme');
      if (savedTheme !== null) {
        setIsDarkMode(JSON.parse(savedTheme));
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    AsyncStorage.setItem('@MiGymApp:theme', JSON.stringify(newTheme));
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ 
      isDarkMode, 
      theme, 
      toggleTheme, 
      timerState, 
      setTimerState 
    }}>
      {children}
    </ThemeContext.Provider>
  );
}; 