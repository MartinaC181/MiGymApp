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
        alignItems: 'center',
    },
    scheduleContainer: {
        marginBottom: theme.spacing.lg,
        },
    dayContainer: {
        marginBottom: theme.spacing.md,
        justifyContent: 'center',
    },
    dayName: {
        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily.medium,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.xs,
        textAlign: 'center',
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
    daySection: {
        marginBottom: theme.spacing.md,
    },
    horasChipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 4,
    },
    horaChip: {
        backgroundColor: theme.colors.background,
        borderWidth: 1,
        borderColor: theme.colors.primary,
        borderRadius: theme.borderRadius.pill,
        paddingVertical: 6,
        paddingHorizontal: 12,
        marginRight: 8,
        marginBottom: 8,
    },
    horaChipSelected: {
        backgroundColor: theme.colors.primary,
    },
    horaChipText: {
        fontSize: theme.typography.fontSize.small,
        color: theme.colors.primary,
        fontFamily: theme.typography.fontFamily.medium,
    },
    horaChipTextSelected: {
        color: '#FFFFFF',
    },
    tableContainer: {
        borderWidth: 1,
        borderColor: '#EEEEEE',
        borderRadius: theme.borderRadius.md,
        overflow: 'hidden',
        marginBottom: theme.spacing.lg,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },
    tableCell: {
        padding: 10,
    },
    tableHeader: {
        backgroundColor: theme.colors.primary,
    },
    tableHeaderText: {
        color: '#FFFFFF',
        fontFamily: theme.typography.fontFamily.medium,
        fontSize: theme.typography.fontSize.small,
    },
    dayNameTable: {
        fontFamily: theme.typography.fontFamily.medium,
        fontSize: theme.typography.fontSize.small,
        color: theme.colors.textPrimary,
    },
    horarioSeleccionContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    horarioRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
        marginBottom: 4,
        marginTop: 4,
    },
    horarioText: {
        marginLeft: 4,
        fontSize: 13,
        color: theme.colors.textSecondary,
    },
    diasTabsScroll: {
        marginBottom: theme.spacing.md,
    },
    diaTab: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: 10,
        marginRight: 2,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    diaTabActive: {
        borderBottomColor: theme.colors.primary,
    },
    diaTabText: {
        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily.medium,
        color: theme.colors.textSecondary,
    },
    diaTabTextActive: {
        color: theme.colors.primary,
    },
    horariosContainer: {
        marginVertical: theme.spacing.md,
    },
    horarioCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
        borderWidth: 1,
        borderColor: '#EEEEEE',
        borderRadius: theme.borderRadius.md,
        padding: 16,
        marginBottom: 10,
    },
    horarioCardSelected: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    horarioCardText: {
        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily.medium,
        color: theme.colors.textPrimary,
    },
    horarioCardTextSelected: {
        color: '#FFFFFF',
    }
});