// src/styles/navigation.ts
import { StyleSheet } from 'react-native';
import theme from '../constants/theme';

export default StyleSheet.create({
  safeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    overflow: 'visible',
    backgroundColor: 'transparent',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',     // alinéa al fondo para luego "tirar" hacia arriba
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm + 8, // un poco más de espacio interno
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    overflow: 'visible',
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: theme.borderRadius.pill,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    // **desplaza hacia arriba:**
    marginTop: -45,             // prueba con -12; ajusta valor al diseño exacto
    // borderWidth: 1, borderColor: 'red',  // ya no hace falta
  },
  iconContainerPressed: {
    opacity: 0.6,
  },
  iconText: {
    fontSize: theme.typography.fontSize.small,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.textPrimary,
    marginTop: 4,
  },
});


