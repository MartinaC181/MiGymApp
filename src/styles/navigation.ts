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
    paddingVertical: theme.spacing.sm + 10, // un poco más de espacio interno
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
  },
  iconContainer: {
    width: 65,
    height: 65,
    borderRadius: theme.borderRadius.pill,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
 
    marginTop: -60,   
    elevation: 9,
    marginBottom: 4,
  },
  iconContainerPressed: {
     backgroundColor: theme.colors.surface,
  },
  iconText: {
    fontSize: theme.typography.fontSize.medium,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  navItemWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
  },
});


