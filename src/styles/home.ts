import { StyleSheet, Dimensions } from 'react-native';
import theme from '../constants/theme';

const { width } = Dimensions.get('window');
export const CARD_WIDTH = width * 0.85; // 85% del ancho de pantalla

const styles = StyleSheet.create({
    homeContainer: {
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        padding: 0,
    },
    greetingContainer: {
        marginTop: theme.spacing.xl,
        marginBottom: theme.spacing.lg,
        paddingHorizontal: theme.spacing.lg,
    },
    greeting: {
        fontSize: theme.typography.fontSize.large,
        fontFamily: theme.typography.fontFamily.bold,
        color: theme.colors.primary,
    },
    name: {
        color: theme.colors.primary,
    },
    subGreeting: {
        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily.regular,
        color: theme.colors.textSecondary,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.md,
        paddingHorizontal: theme.spacing.md,
        marginBottom: theme.spacing.xl,
        marginHorizontal: theme.spacing.lg,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    searchInput: {
        flex: 1,
        height: 40,
        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily.regular,
        color: theme.colors.textPrimary,
    },
    searchIcon: {
        marginLeft: theme.spacing.sm,
    },
    carousel: {
        flexGrow: 0,
    },
    carouselContent: {
        paddingLeft: theme.spacing.lg,
        paddingRight: theme.spacing.lg, // Añadir padding al final también
        paddingVertical: theme.spacing.md,
    },
    cardContainer: {
        width: CARD_WIDTH, // Usar el ancho definido para las cards
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10, // Dar espacio entre las cards
    },
    card: {
        width: '100%', // Usar todo el ancho disponible del cardContainer
        height: 370,
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
        position: 'relative',
    },
    cardImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover', // Añadir esto para asegurar que la imagen se ajuste bien
        position: 'absolute',
        backgroundColor: '#777777', // Color de fondo mientras se carga o si hay error
    },
    cardOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    cardContent: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: theme.spacing.md,
    },
    cardTitle: {
        fontSize: 40,
        fontFamily: theme.typography.fontFamily.bold,
        textAlign: "center",
        color: theme.colors.surface,
        marginBottom: theme.spacing.lg,
    },
    verMasButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: theme.spacing.xs,
        marginBottom: theme.spacing.md,
        backgroundColor: 'rgba(0, 191, 255, 0.4)',
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: theme.borderRadius.md,
    },
    verMasText: {
        fontSize: theme.typography.fontSize.small,
        fontFamily: theme.typography.fontFamily.medium,
        color: theme.colors.background,
        marginRight: 4,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: theme.spacing.md,
        marginBottom: 80, // Dar más espacio para la barra de navegación
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#CCCCCC',
        marginHorizontal: 4,
    },
    paginationDotActive: {
        backgroundColor: theme.colors.primary,
    },
});

export default styles;