import { StyleSheet } from 'react-native';
import theme from '../constants/theme';

export default StyleSheet.create({
    headerImage: {
        width: '100%',
        height: 180,
        position: 'relative',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.lg,
    },
    classTitleContainer: {
        width: '100%',
    },
    classTitle: {
        fontSize: 28,
        fontFamily: theme.typography.fontFamily.bold,
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: theme.spacing.sm,
    },
    classDescription: {
        fontSize: theme.typography.fontSize.medium,
        color: '#FFFFFF',
        textAlign: 'center',
        fontFamily: theme.typography.fontFamily.regular,
    },
    contentContainer: {
        padding: theme.spacing.lg,
    },
    scheduleContainer: {
        marginBottom: theme.spacing.lg,
    },
    dayContainer: {
        marginBottom: theme.spacing.md,
    },
    dayName: {
        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily.medium,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.xs,
    },
    scheduleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    checkbox: {
        marginRight: theme.spacing.sm,
    },
    scheduleText: {
        fontSize: theme.typography.fontSize.small,
        color: theme.colors.textSecondary,
        fontFamily: theme.typography.fontFamily.regular,
    },
});