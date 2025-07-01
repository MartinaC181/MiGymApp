import { StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function useNavigationStyles() {
  const { theme, isDarkMode } = useTheme();
  
  return StyleSheet.create({
    safeArea: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 10,
      overflow: 'visible',
      backgroundColor: 'transparent',
      pointerEvents: 'box-none',
    },
    container: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'flex-end',
      backgroundColor: isDarkMode ? '#0066CC' : theme.colors.primary,
      paddingVertical: theme.spacing.sm + 6,
      borderTopLeftRadius: theme.borderRadius.lg,
      borderTopRightRadius: theme.borderRadius.lg,
      pointerEvents: 'auto',
    },
    iconContainer: {
      width: 75,
      height: 75,
      borderRadius: theme.borderRadius.pill,
      backgroundColor: isDarkMode ? theme.colors.primary : theme.colors.background,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      marginTop: -24,
      marginBottom: 10,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
    },
    iconContainerActive: {
      backgroundColor: isDarkMode ? theme.colors.primary : theme.colors.background,
      transform: [{ scale: 1.08 }],
      marginTop: -70,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.25,
      shadowRadius: 12,
      elevation: 12,
    },
    iconContainerPressed: {
       backgroundColor: isDarkMode ? theme.colors.primary : theme.colors.surface,
    },
    iconPressable: {
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.borderRadius.pill,
    },
    navItemWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 0,
    },
  });
}


