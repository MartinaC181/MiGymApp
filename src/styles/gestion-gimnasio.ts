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
        paddingBottom: 120, 
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
        backgroundColor: theme.colors.success,
    },
    desactivarButton: {
        backgroundColor: '#F5E6A8',
    },
    eliminarButton: {
        backgroundColor: '#F8BDBD',
    },
    accionButtonText: {
        fontSize: theme.typography.fontSize.small,
        fontFamily: theme.typography.fontFamily.medium,
        color: '#FFFFFF',
    },
    fabButton: {
        position: 'absolute',
        bottom: 50, 
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
    modalTitleContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalTitle: {
        fontSize: theme.typography.fontSize.large,
        fontFamily: theme.typography.fontFamily.bold,
        color: theme.colors.textPrimary,
    },
    modalSpacerButton: {
        width: 40,
        height: 40,
    },
    modalSaveButton: {
        width: 80,
        alignItems: 'flex-end',
    },
    modalSaveText: {
        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily.bold,
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
        marginBottom: theme.spacing.md,
    },
    formSectionSubtitle: {
        fontSize: theme.typography.fontSize.small,
        fontFamily: theme.typography.fontFamily.regular,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.lg,
        lineHeight: 20,
    },
    inputGroup: {
        marginBottom: theme.spacing.lg,
    },
    inputLabel: {
        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily.medium,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.sm,
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
    inputError: {
        borderColor: '#FF6B6B',
        borderWidth: 2,
    },
    errorText: {
        fontSize: theme.typography.fontSize.small,
        fontFamily: theme.typography.fontFamily.regular,
        color: '#FF6B6B',
        marginTop: theme.spacing.xs,
    },
    textAreaInput: {
        height: 80,
        textAlignVertical: 'top',
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.lg,
    },
    diaContainer: {
        marginBottom: theme.spacing.lg,
    },
    diaHeader: {
        marginBottom: theme.spacing.sm,
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
        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily.regular,
        color: theme.colors.textPrimary,
        backgroundColor: '#F8F8F8',
        marginLeft: theme.spacing.xl,
    },
    // Nuevos estilos para modalidad de clase
    modalidadContainer: {
        flexDirection: 'row',
        marginBottom: theme.spacing.lg,
        borderRadius: theme.borderRadius.md,
        backgroundColor: '#F8F8F8',
        padding: theme.spacing.xs,
    },
    modalidadButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.borderRadius.sm,
        gap: theme.spacing.xs,
    },
    modalidadButtonActive: {
        backgroundColor: theme.colors.background,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    modalidadText: {
        fontSize: theme.typography.fontSize.small,
        fontFamily: theme.typography.fontFamily.regular,
        color: '#999',
    },
    modalidadTextActive: {
        color: theme.colors.primary,
        fontFamily: theme.typography.fontFamily.medium,
    },
    previsualizacionContainer: {
        backgroundColor: '#F0F0F0',
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        marginTop: theme.spacing.md,
    },
    previsualizacionTitle: {
        fontSize: theme.typography.fontSize.small,
        fontFamily: theme.typography.fontFamily.medium,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.xs,
    },
    previsualizacionText: {
        fontSize: theme.typography.fontSize.small,
        fontFamily: theme.typography.fontFamily.regular,
        color: theme.colors.textPrimary,
        lineHeight: 18,
    },
    modalFooter: {
        padding: theme.spacing.lg,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    // Nuevos estilos para selector flexible de días
    diasFlexiblesContainer: {
        marginBottom: theme.spacing.lg,
    },
    diasFlexiblesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.sm,
        marginTop: theme.spacing.sm,
    },
    diaFlexibleButton: {
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        backgroundColor: theme.colors.background,
        minWidth: 50,
        alignItems: 'center',
    },
    diaFlexibleButtonActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    diaFlexibleText: {
        fontSize: theme.typography.fontSize.small,
        fontFamily: theme.typography.fontFamily.medium,
        color: theme.colors.textSecondary,
    },
    diaFlexibleTextActive: {
        color: '#FFFFFF',
    },
    // Estilos para estado vacío
    emptyStateContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme.spacing.xl * 2,
        paddingHorizontal: theme.spacing.lg,
    },
    emptyStateTitle: {
        fontSize: theme.typography.fontSize.large,
        fontFamily: theme.typography.fontFamily.bold,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.lg,
        marginBottom: theme.spacing.sm,
        textAlign: 'center',
    },
    emptyStateSubtitle: {
        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily.regular,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
    },
}); 