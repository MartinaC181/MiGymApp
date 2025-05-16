// src/constants/theme.ts

// 1. Paleta de colores
export const colors = {
  primary:   '#536a86', // textos y elementos destacados
  secondary: '#bac4e0', // fondos de secciones y acentos suaves
  background: '#FFFFFF', // fondos generales
  surface:   '#F6FEDB', // tarjetas o secciones diferenciadas
  accent:    '#E07A5F', // botones y llamadas a la acción
  text:      '#333333', // texto principal
  muted:     '#888888', // texto secundario
};

// 2. Tipografías
export const typography = {
  fontFamily: {
    heading: 'Amiri_400Regular', // nombre de spa / títulos grandes
    body:    'Roboto_400Regular', // textos corridos y formularios
  },
  fontSize: {
    h1:    32,  // pantallas splash / títulos principales
    h2:    24,  // headings de sección
    body:  16,  // párrafos y botones
    label: 14,  // inputs y textos de ayuda
    small: 12,  // disclaimers y microcopy
  },
};

// 3. Espaciados (márgenes y paddings)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

// 4. Radios de borde
export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  round: 999, // para botones o avatares circulares
};

// 5. Sombras genéricas
export const shadows = {
  light: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
};

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
};
