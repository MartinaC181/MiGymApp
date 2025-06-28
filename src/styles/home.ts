import { StyleSheet, Dimensions } from 'react-native';
import theme from '../constants/theme';
import globalStyles from './global';

const { width } = Dimensions.get('window');
// Rediseño del carrusel para snap perfecto
export const CARD_WIDTH = width * 0.75; // 75% del ancho para mejor centrado
export const CARD_SPACING = 20; // Espacio entre cards
export const SIDE_SPACING = (width - CARD_WIDTH) / 2; // Espaciado lateral para centrado perfecto

const styles = StyleSheet.create({
    homeContainer: {
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        padding: 0,
    },
    greetingContainer: {
        marginTop: theme.spacing.lg,
        marginBottom: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
    },
    rachaContainer: {
        marginBottom: theme.spacing.md,
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
    searchWrapper: {
        ...globalStyles.searchWrapper,
    },
    searchContainer: {
        ...globalStyles.searchContainer,
        marginHorizontal: theme.spacing.lg,
    },
    searchInput: {
        ...globalStyles.searchInput,
    },
    searchIcon: {
        ...globalStyles.searchIcon,
    },
    // Rediseño completo del carrusel
    carouselContent: {
        paddingLeft: SIDE_SPACING,
        paddingRight: SIDE_SPACING,
        paddingTop: 0,
        paddingBottom: theme.spacing.sm,
    },
    cardContainer: {
        width: CARD_WIDTH,
        marginRight: CARD_SPACING,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Último card sin margen derecho
    lastCardContainer: {
        width: CARD_WIDTH,
        marginRight: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: '100%',
        height: 320,
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
        position: 'relative',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 6,
        backgroundColor: '#000',
    },
    cardImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        backgroundColor: '#777777',
    },
    cardOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        borderRadius: theme.borderRadius.lg,
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
        fontSize: 36,
        fontFamily: theme.typography.fontFamily.bold,
        textAlign: "center",
        color: theme.colors.background,
        marginBottom: theme.spacing.md,
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    verMasButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: theme.spacing.xs,
        marginBottom: theme.spacing.md,
        backgroundColor: 'rgba(0, 191, 255, 0.9)',
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: theme.borderRadius.pill,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4,
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
        marginTop: theme.spacing.lg,
        marginBottom: theme.spacing.xl,
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
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    noResultsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        marginTop: theme.spacing.xl,
    },
    noResultsText: {
        fontSize: theme.typography.fontSize.large,
        fontFamily: theme.typography.fontFamily.bold,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.sm,
    },
    noResultsSubtext: {
        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily.regular,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        opacity: 0.7,
    },
    suggestionsContainer: {
        ...globalStyles.suggestionsContainer,
        left: theme.spacing.lg,
        right: theme.spacing.lg,
    },
    suggestionItem: {
        ...globalStyles.suggestionItem,
    },
    suggestionText: {
        ...globalStyles.suggestionText,
    },
});

export default styles;