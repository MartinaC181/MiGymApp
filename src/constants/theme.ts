const lightColors = {
  primary: '#00BFFF',
  background: '#ffffff',
  textPrimary: '#111111',
  textSecondary: '#3E3E3E',
  surface: '#F4F4F4',
  success: '#B8E6B8',
  error: '#FF5A5F',
  card: '#ffffff',
  border: '#E0E0E0',
  inputBackground: '#ffffff',
  buttonBackground: '#00BFFF',
  socialButtonBackground: '#ffffff',
  shadowColor: '#000000',
};

const darkColors = {
  primary: '#00BFFF',
  background: '#0A0A0A',
  textPrimary: '#FFFFFF',
  textSecondary: '#CCCCCC',
  surface: '#2A2A2A',
  success: '#4CAF50',
  error: '#FF5252',
  card: '#1E1E1E',
  border: '#404040',
  inputBackground: '#1A1A1A',
  buttonBackground: '#00BFFF',
  socialButtonBackground: '#2A2A2A',
  shadowColor: '#000000',
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
