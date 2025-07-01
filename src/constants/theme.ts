const lightColors = {
  primary: '#00BFFF',
  primaryLight: '#33CCFF',
  primaryDark: '#0099CC',
  primarySoft: '#E6F7FF',
  secondary: '#0099CC',
  accent: '#66D9FF',
  background: '#F8F9FA',
  textPrimary: '#111111',
  textSecondary: '#3E3E3E',
  surface: '#F4F4F4',
  surfaceLight: '#F8F9FA',
  surfaceDark: '#E8E8E8',
  success: '#B8E6B8',
  error: '#FF5A5F',
  warning: '#FFB74D',
  info: '#64B5F6',
  card: '#ffffff',
  border: '#E0E0E0',
  borderLight: '#F0F0F0',
  inputBackground: '#ffffff',
  buttonBackground: '#00BFFF',
  socialButtonBackground: '#ffffff',
  shadowColor: '#000000',

  gradient1: ['#00BFFF', '#0099CC'] as [string, string],
  gradient2: ['#00BFFF', '#0099CC'] as [string, string],
  gradient3: ['#00BFFF', '#0099CC'] as [string, string],
  gradient4: ['#00BFFF', '#0099CC'] as [string, string],
  gradient5: ['#00BFFF', '#0099CC'] as [string, string],
  gradient6: ['#00BFFF', '#0099CC'] as [string, string],
  gradient7: ['#00BFFF', '#0099CC'] as [string, string],
};

const darkColors = {
  primary: '#00BFFF',
  primaryLight: '#33CCFF',
  primaryDark: '#0088CC',
  primarySoft: '#1A3A5F',
  secondary: '#0088CC',
  accent: '#4FC3F7',
  background: '#2A2A2A',
  textPrimary: '#FFFFFF',
  textSecondary: '#888888',
  surface: '#2A2A2A',
  surfaceLight: '#3A3A3A',
  surfaceDark: '#1A1A1A',
  success: '#4CAF50',
  error: '#FF5252',
  warning: '#FFB74D',
  info: '#64B5F6',
  card: '#1E1E1E',
  border: '#404040',
  borderLight: '#4A4A4A',
  inputBackground: '#3A3A3A',
  buttonBackground: '#00BFFF',
  socialButtonBackground: '#2A2A2A',
  shadowColor: '#000000',
  // Gradiente unificado para consistencia visual
  gradient1: ['#10344A', '#0C2434'] as [string, string],
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

const borderRadius = {
  sm: 4,
  md: 8,
  lg: 16,
  pill: 999,
};

const typography = {
  fontFamily: {
    regular: 'Roboto-Regular',
    bold: 'Roboto-Bold',
    medium: 'Roboto-Medium',
  },
  fontSize: {
    small: 12,
    medium: 14,
    large: 20,
    title: 24,
    display: 32,
  },
};

export const lightTheme = {
  colors: lightColors,
  spacing,
  borderRadius,
  typography,
};

export const darkTheme = {
  colors: darkColors,
  spacing,
  borderRadius,
  typography,
};

// Tema por defecto (modo claro)
const theme = lightTheme;

export default theme;
