import { StyleSheet } from 'react-native';
import theme from '../constants/theme';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.surface,
    },
    scrollView: {
        flex: 1,
    },
    headerSection: {
        padding: theme.spacing.lg,
        paddingBottom: theme.spacing.md,
    },
    sectionTitle: {
        fontSize: theme.typography.fontSize.title,
        fontFamily: theme.typography.fontFamily.bold,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.xs,
    },
    sectionSubtitle: {
        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily.regular,
        color: theme.colors.textSecondary,
    },
    clasesContainer: {
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: 120, // Ajustado para el nuevo FAB más cerca
    },
    claseCard: {
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.lg,
        marginBottom: theme.spacing.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    },
    claseHeader: {
        padding: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    claseInfo: {
        flex: 1,
    },
    claseNombre: {
        fontSize: theme.typography.fontSize.large,
        fontFamily: theme.typography.fontFamily.bold,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.xs,
    },
    claseDescripcion: {
        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily.regular,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.sm,
        lineHeight: 20,
    },
    claseMetadata: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    metadataItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metadataText: {
        fontSize: theme.typography.fontSize.small,
        fontFamily: theme.typography.fontFamily.medium,
        color: theme.colors.textSecondary,
        marginLeft: theme.spacing.xs,
    },
    estadoBadge: {
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 4,
        borderRadius: theme.borderRadius.pill,
    },
    estadoActivo: {
        backgroundColor: theme.colors.success,
    },
    estadoInactivo: {
        backgroundColor: '#F5E6A8',
    },
    estadoTexto: {
        fontSize: theme.typography.fontSize.small,
        fontFamily: theme.typography.fontFamily.medium,
    },
    estadoTextoActivo: {
        color: '#2D5A2D', 
    },
    estadoTextoInactivo: {
        color: '#8B7A00', 
    },
    horariosResumen: {
        padding: theme.spacing.md,
        paddingTop: 0,
    },
    horariosLabel: {
        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily.medium,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.sm,
    },
    horariosChips: {
        flexDirection: 'column',
        gap: theme.spacing.xs,
    },
    diaChip: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
    },
    diaChipTexto: {
        fontSize: theme.typography.fontSize.small,
        fontFamily: theme.typography.fontFamily.regular,
        color: theme.colors.textSecondary,
    },
    accionesContainer: {
        flexDirection: 'row',
        padding: theme.spacing.md,
        paddingTop: 0,
        gap: theme.spacing.sm,
    },
    accionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.md,
        gap: theme.spacing.xs,
    },
    editarButton: {
        backgroundColor: theme.colors.primary,
    },
    activarButton: {
        backgroundColor: '#b3dcec', 
    },
    desactivarButton: {
        backgroundColor: '#b3dcec', 
    },
    eliminarButton: {
        backgroundColor: '#b3dcec', 
    },
    accionButtonText: {
        fontSize: theme.typography.fontSize.small,
        fontFamily: theme.typography.fontFamily.medium,
        color: '#FFFFFF',
    },
    fabButton: {
        position: 'absolute',
        bottom: 90, // Más cerca de la navegación
        right: theme.spacing.lg,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    // Estilos del Modal
    modalContainer: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: theme.spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    modalCloseButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: theme.typography.fontSize.large,
        fontFamily: theme.typography.fontFamily.bold,
        color: theme.colors.textPrimary,
        flex: 1,
        textAlign: 'center',
    },
    modalSaveButton: {
        width: 80,
        alignItems: 'flex-end',
    },
    modalSaveText: {
        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily.medium,
        color: theme.colors.primary,
    },
    modalContent: {
        flex: 1,
        padding: theme.spacing.lg,
    },
    formSection: {
        marginBottom: theme.spacing.xl,
    },
    formSectionTitle: {
        fontSize: theme.typography.fontSize.large,
        fontFamily: theme.typography.fontFamily.bold,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.sm,
    },
    formSectionSubtitle: {
        fontSize: theme.typography.fontSize.small,
        fontFamily: theme.typography.fontFamily.regular,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.md,
        lineHeight: 18,
    },
    inputGroup: {
        marginBottom: theme.spacing.md,
    },
    inputLabel: {
        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily.medium,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.xs,
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily.regular,
        color: theme.colors.textPrimary,
        backgroundColor: theme.colors.background,
    },
    textAreaInput: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.md,
    },
    diaContainer: {
        marginBottom: theme.spacing.md,
    },
    diaHeader: {
        marginBottom: theme.spacing.xs,
    },
    diaCheckbox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    diaLabel: {
        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily.regular,
        color: theme.colors.textSecondary,
        marginLeft: theme.spacing.sm,
    },
    diaLabelSelected: {
        color: theme.colors.primary,
        fontFamily: theme.typography.fontFamily.medium,
    },
    horarioInput: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.sm,
        fontSize: theme.typography.fontSize.small,
        fontFamily: theme.typography.fontFamily.regular,
        color: theme.colors.textPrimary,
        backgroundColor: theme.colors.surface,
        marginLeft: theme.spacing.xl,
    },
}); 