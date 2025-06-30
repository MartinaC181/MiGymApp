import { StyleSheet } from 'react-native';
import { lightTheme } from '../constants/theme';

// Factoría de estilos que recibe el tema actual y si es modo oscuro
export const createGestionGimnasioStyles = (theme: typeof lightTheme, isDarkMode: boolean = false) => StyleSheet.create({
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
        backgroundColor: isDarkMode ? theme.colors.surfaceLight : theme.colors.background,
        borderRadius: theme.borderRadius.lg,
        marginBottom: theme.spacing.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
        ...(isDarkMode && { borderWidth: 1, borderColor: '#444' }),
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
        backgroundColor: theme.colors.surface,
    },
    accionButtonText: {
        fontSize: theme.typography.fontSize.small,
        fontFamily: theme.typography.fontFamily.medium,
        color: '#FFFFFF',
    },
    eliminarButtonText: {
        fontSize: theme.typography.fontSize.small,
        fontFamily: theme.typography.fontFamily.medium,
        color: theme.colors.textSecondary,
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
    
    // === Estilos para Búsqueda y Filtros ===
    searchAndFiltersContainer: {
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: theme.spacing.md,
        backgroundColor: theme.colors.surface,
    },
    searchWrapper: {
        position: 'relative',
        marginBottom: theme.spacing.md,
        width: '100%',
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.lg,
        paddingHorizontal: theme.spacing.md,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 6,
        borderWidth: 1,
        borderColor: '#E8E8E8',
        minHeight: 48,
    },
    searchContainerFocused: {
        borderWidth: 2,
        borderColor: theme.colors.primary,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    searchInput: {
        flex: 1,
        height: 40,
        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily.regular,
        color: theme.colors.textPrimary,
        paddingRight: theme.spacing.sm,
    },
    searchIcon: {
        marginRight: theme.spacing.xs,
    },
    clearSearchButton: {
        padding: theme.spacing.xs,
        borderRadius: theme.borderRadius.sm,
        backgroundColor: '#F5F5F5',
    },
    
    // Contenedor de filtros
    filtersContainer: {
        marginBottom: theme.spacing.sm,
    },
    filtersTitle: {
        fontSize: theme.typography.fontSize.small,
        fontFamily: theme.typography.fontFamily.medium,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.sm,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    
    // Filtros horizontales
    filtersRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: theme.spacing.sm,
        rowGap: theme.spacing.sm,
        marginBottom: theme.spacing.xs,
    },
    filterChip: {
        paddingVertical: theme.spacing.xs,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.borderRadius.pill,
        borderWidth: 1.5,
        borderColor: '#E0E0E0',
        backgroundColor: theme.colors.background,
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
    },
    filterChipActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    filterChipText: {
        fontSize: theme.typography.fontSize.small,
        fontFamily: theme.typography.fontFamily.medium,
        color: theme.colors.textSecondary,
    },
    filterChipTextActive: {
        color: '#FFFFFF',
    },
    filterChipCount: {
        fontSize: theme.typography.fontSize.small,
        fontFamily: theme.typography.fontFamily.bold,
        color: theme.colors.textSecondary,
        backgroundColor: '#F0F0F0',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 10,
        minWidth: 20,
        textAlign: 'center',
    },
    filterChipCountActive: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        color: '#FFFFFF',
    },
    
    // Filtros de días (para clases)
    diasFiltersContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: theme.spacing.xs,
        rowGap: theme.spacing.xs,
    },
    diaFilterChip: {
        paddingVertical: theme.spacing.xs,
        paddingHorizontal: theme.spacing.sm,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        backgroundColor: theme.colors.background,
        minWidth: 42,
        alignItems: 'center',
    },
    diaFilterChipActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    diaFilterText: {
        fontSize: theme.typography.fontSize.small,
        fontFamily: theme.typography.fontFamily.medium,
        color: theme.colors.textSecondary,
    },
    diaFilterTextActive: {
        color: '#FFFFFF',
    },
    
    // Contador de resultados
    resultsCounter: {
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: theme.spacing.sm,
    },
    resultsText: {
        fontSize: theme.typography.fontSize.small,
        fontFamily: theme.typography.fontFamily.regular,
        color: theme.colors.textSecondary,
    },
    resultsTextHighlight: {
        fontFamily: theme.typography.fontFamily.bold,
        color: theme.colors.primary,
    },
    
    // Botón para limpiar filtros
    clearFiltersContainer: {
        paddingHorizontal: theme.spacing.lg,
        marginBottom: theme.spacing.sm,
    },
    clearFiltersButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme.spacing.xs,
        paddingHorizontal: theme.spacing.md,
        backgroundColor: '#F8F8F8',
        borderRadius: theme.borderRadius.md,
        gap: theme.spacing.xs,
        alignSelf: 'flex-start',
    },
    clearFiltersText: {
        fontSize: theme.typography.fontSize.small,
        fontFamily: theme.typography.fontFamily.medium,
        color: theme.colors.textSecondary,
    },
    
    // Estados especiales de búsqueda
    searchEmptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme.spacing.xl * 1.5,
        paddingHorizontal: theme.spacing.lg,
    },
    searchEmptyTitle: {
        fontSize: theme.typography.fontSize.large,
        fontFamily: theme.typography.fontFamily.bold,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.xs,
        textAlign: 'center',
    },
    searchEmptySubtitle: {
        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily.regular,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
        opacity: 0.8,
    },

    // === Estilos centralizados para modales overlay ===
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.lg,
    },
    modalCard: {
        backgroundColor: isDarkMode ? theme.colors.surfaceLight : theme.colors.background,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg,
        width: '100%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 12,
        ...(isDarkMode && { borderWidth: 1, borderColor: '#444' }),
    },

    // === Estilos centralizados para botones ===
    // Botones principales de acción
    primaryButton: {
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borderRadius.md,
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.lg,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: theme.spacing.xs,
    },
    primaryButtonText: {
        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily.medium,
        color: '#FFFFFF',
    },

    // Botones secundarios
    secondaryButton: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.lg,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    secondaryButtonText: {
        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily.medium,
        color: theme.colors.textSecondary,
    },

    // Botones de cancelar centralizados
    centralCancelButton: {
        flex: 1,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        paddingVertical: theme.spacing.sm,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    centralCancelButtonText: {
        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily.medium,
        color: theme.colors.textSecondary,
    },

    // Botones de guardar centralizados
    centralSaveButton: {
        flex: 1,
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borderRadius.md,
        paddingVertical: theme.spacing.sm,
        alignItems: 'center',
    },
    centralSaveButtonText: {
        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily.medium,
        color: '#FFFFFF',
    },

    // Botones de cancelar con borde rojo (para casos especiales)
    cancelButtonDanger: {
        flex: 1,
        marginRight: theme.spacing.sm,
        backgroundColor: theme.colors.surface,
        borderWidth: 2,
        borderColor: theme.colors.error,
        borderRadius: theme.borderRadius.md,
        paddingVertical: theme.spacing.sm,
        alignItems: 'center',
    },
    cancelButtonDangerText: {
        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily.medium,
        color: theme.colors.error,
    },

    // === Estilos centralizados para inputs ===
    // Input básico
    baseInput: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily.regular,
        color: theme.colors.textPrimary,
        backgroundColor: '#FFFFFF',
    },

    // Input con fondo blanco
    whiteInput: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily.regular,
        color: theme.colors.textPrimary,
        backgroundColor: '#FFFFFF',
    },

    // TextArea centralizado
    centralTextAreaInput: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily.regular,
        color: theme.colors.textPrimary,
        backgroundColor: theme.colors.surface,
        height: 100,
        textAlignVertical: 'top',
    },

    // === Estilos centralizados para contenedores ===
    // Contenedor de botones horizontales
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: theme.spacing.md,
        marginTop: theme.spacing.lg,
    },

    // Contenedor de botones con margen superior extra
    buttonsContainerXL: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: theme.spacing.md,
        marginTop: theme.spacing.xl,
    },

    // Input container con margen
    inputContainer: {
        marginBottom: theme.spacing.md,
    },

    // Input container con margen grande
    inputContainerLarge: {
        marginBottom: theme.spacing.lg,
    },

    // === Títulos y labels centralizados ===
    // Modal title centrado
    modalTitleCentered: {
        fontSize: theme.typography.fontSize.large,
        fontFamily: theme.typography.fontFamily.bold,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.lg,
        textAlign: 'center',
    },

    // Section title para formularios centralizados
    centralFormSectionTitle: {
        fontSize: theme.typography.fontSize.large,
        fontFamily: theme.typography.fontFamily.bold,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.md,
    },

    // Input label básico
    baseInputLabel: {
        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily.medium,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.sm,
    },

    // Input label pequeño
    smallInputLabel: {
        fontSize: theme.typography.fontSize.small,
        fontFamily: theme.typography.fontFamily.medium,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.xs,
    },

    // Required label (con asterisco rojo)
    requiredInputLabel: {
        fontSize: theme.typography.fontSize.small,
        fontFamily: theme.typography.fontFamily.medium,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.xs,
    },
    requiredLabelHighlight: {
        color: theme.colors.error,
    },

    loadingText: {
        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily.regular,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginTop: theme.spacing.md,
    },
    errorTitle: {
        fontSize: theme.typography.fontSize.large,
        fontFamily: theme.typography.fontFamily.bold,
        color: theme.colors.error,
        textAlign: 'center',
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.sm,
    },
    centralErrorText: {
        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily.regular,
        color: theme.colors.error,
        textAlign: 'center',
    },
});

export default createGestionGimnasioStyles(lightTheme); 