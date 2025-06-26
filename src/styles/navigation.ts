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
    alignItems: 'flex-end',
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm + 4,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
  },
  iconContainer: {
    width: 75,
    height: 75,
    borderRadius: theme.borderRadius.pill,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    marginTop: -46,
    marginBottom: 4,
    elevation: 15,
  },
  iconContainerActive: {
    backgroundColor: theme.colors.background,
    elevation: 15,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    transform: [{ scale: 1.08 }],
    marginTop: -50,
  },
  iconContainerPressed: {
     backgroundColor: theme.colors.surface,
  },
  iconPressable: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.pill,
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
  activeIndicator: {
    position: 'absolute',
    bottom: -8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
});


