// src/styles/tabsLayoutStyles.ts
import { StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function useTabsLayoutStyles() {
  const { theme } = useTheme();
  
  return StyleSheet.create({
    container: {
      flex: 1,                        
      backgroundColor: theme.colors.background,
      zIndex: 0,
    },
    content: {
      flex: 1,  
      paddingBottom: 70 + theme.spacing.md,
    },
  });
}
