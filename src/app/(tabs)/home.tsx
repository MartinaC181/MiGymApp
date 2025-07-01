import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { 
    View, 
    Text, 
    TextInput, 
    ScrollView, 
    Image, 
    TouchableOpacity,
    Animated,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import styles, { CARD_WIDTH, CARD_SPACING } from "../../styles/home";
import globalStyles from "../../styles/global";
import Racha from "../../components/Racha";
import MisClases from "../../components/MisClases";
import theme from "../../constants/theme";
import { getCurrentUser, getAvailableClasses } from "../../utils/storage";
import { ClientUser } from "../../data/Usuario";
import { useTheme } from "../../context/ThemeContext";

export default function Home() {
    // Estado para controlar el slide activo
    const [activeSlide, setActiveSlide] = useState(0);
    // Estado para el texto de búsqueda
    const [searchText, setSearchText] = useState("");
    // Estado para mostrar/ocultar sugerencias
    const [showSuggestions, setShowSuggestions] = useState(false);
    // Estado para las clases cargadas desde AsyncStorage
    const [clases, setClases] = useState([]);
    // Estado para el usuario actual
    const [currentUser, setCurrentUser] = useState<ClientUser | null>(null);
    // Animación para las cards
    const fadeAnim = new Animated.Value(1);
    const router = useRouter();
    
    // Obtener el tema actual
    const { theme: currentTheme, isDarkMode } = useTheme();

    // Cargar datos desde AsyncStorage al montar el componente
    useEffect(() => {
        loadData();
    }, []);

    // Animación cuando cambia el slide activo
    useEffect(() => {
        Animated.sequence([
            Animated.timing(fadeAnim, {
                toValue: 0.8,
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
            }),
        ]).start();
    }, [activeSlide]);

    const loadData = async () => {
        try {
            // Cargar clases disponibles
            const availableClases = await getAvailableClasses();
            setClases(availableClases);

            // Cargar usuario actual
            const user = await getCurrentUser() as ClientUser;
            setCurrentUser(user);
        } catch (error) {
            console.error("Error cargando datos del home:", error);
        }
    };

    // Filtrar clases basado en el texto de búsqueda
    const filteredClases = clases.filter(clase =>
        clase.nombre.toLowerCase().startsWith(searchText.toLowerCase())
    );

    // Generar sugerencias de autocompletado en orden alfabético
    const suggestions = clases
        .filter(clase => 
            clase.nombre.toLowerCase().startsWith(searchText.toLowerCase()) && 
            searchText.length > 0
        )
        .sort((a, b) => a.nombre.localeCompare(b.nombre)) // Ordenar alfabéticamente
        .slice(0, 3); // Mostrar máximo 3 sugerencias

    // Función mejorada para manejar el cambio de slide
    const handleScroll = (event) => {
        const slideIndex = Math.round(
            event.nativeEvent.contentOffset.x / (CARD_WIDTH + CARD_SPACING)
        );
        if (slideIndex >= 0 && slideIndex < filteredClases.length) {
            setActiveSlide(slideIndex);
        }
    };
    
    const handleVerMas = (clase) => {
        router.push({
            pathname: "/clases",
            params: { 
                id: clase.id,
                nombre: clase.nombre,
                imagen: clase.imagen
            }
        });
    };

    // Función para limpiar la búsqueda
    const clearSearch = () => {
        setSearchText("");
        setActiveSlide(0);
        setShowSuggestions(false);
    };

    // Función para seleccionar una sugerencia
    const selectSuggestion = (suggestion) => {
        setSearchText(suggestion.nombre);
        setShowSuggestions(false);
    };

    // Función para manejar el cambio de texto
    const handleTextChange = (text) => {
        setSearchText(text);
        setShowSuggestions(text.length > 0);
    };

    // Obtener el nombre del usuario o mostrar un saludo genérico
    const getUserName = () => {
        if (currentUser?.name) {
            const firstName = currentUser.name.split(' ')[0];
            return firstName;
        }
        return "Usuario";
    };

    // Envuelve todo el contenido en un ScrollView vertical para permitir desplazamiento
    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: currentTheme.colors.background }}
            contentContainerStyle={[styles.homeContainer, { paddingBottom: theme.spacing.xl }]}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
        >
            <View style={styles.greetingContainer}>
                <Text style={[styles.greeting, { color: currentTheme.colors.primary }]}>Hola, <Text style={[styles.name, { color: currentTheme.colors.primary }]}>{getUserName()}!</Text></Text>
                <Text style={[styles.subGreeting, { color: currentTheme.colors.textSecondary }]}>¿Listo para entrenar?</Text>
            </View>

            {/* Racha asistencia */}
            <View style={styles.rachaContainer}>
                <Racha />
            </View>

            {/* Mis Clases */}
            <MisClases />

            {/* Contenedor relativo para posicionar las sugerencias */}
            <View style={styles.searchWrapper}>
                <View style={[styles.searchContainer, { 
                    backgroundColor: isDarkMode ? '#2A2A2A' : currentTheme.colors.surface,
                    borderWidth: isDarkMode ? 1 : 1,
                    borderColor: isDarkMode ? '#404040' : currentTheme.colors.border,
                    shadowColor: isDarkMode ? "#000" : "#000",
                    shadowOffset: { width: 0, height: isDarkMode ? 4 : 2 },
                    shadowOpacity: isDarkMode ? 0.3 : 0.1,
                    shadowRadius: isDarkMode ? 8 : 4,
                    elevation: isDarkMode ? 8 : 2,
                }]}>
                    <TextInput
                        style={[styles.searchInput, { 
                            backgroundColor: isDarkMode ? '#2A2A2A' : currentTheme.colors.surface,
                            color: isDarkMode ? '#E0E0E0' : currentTheme.colors.textPrimary,
                            borderColor: isDarkMode ? '#404040' : currentTheme.colors.border,
                            fontSize: isDarkMode ? 15 : 14,
                        }]}
                        placeholder="Buscar clase"
                        placeholderTextColor={isDarkMode ? '#888888' : currentTheme.colors.textSecondary}
                        value={searchText}
                        onChangeText={handleTextChange}
                    />
                    {searchText.length > 0 ? (
                        <TouchableOpacity onPress={clearSearch} style={styles.searchIcon}>
                            <MaterialIcons name="close" size={24} color={isDarkMode ? '#888888' : currentTheme.colors.textSecondary} />
                        </TouchableOpacity>
                    ) : (
                    <MaterialIcons name="search" size={24} color={isDarkMode ? '#888888' : currentTheme.colors.textSecondary} style={styles.searchIcon} />
                    )}
                </View>

                {/* Sugerencias de autocompletado - Posicionadas absolutamente */}
                {showSuggestions && suggestions.length > 0 && (
                    <View style={[styles.suggestionsContainer, { 
                        backgroundColor: isDarkMode ? '#2A2A2A' : currentTheme.colors.surface,
                        borderTopWidth: 1,
                        borderTopColor: isDarkMode ? '#404040' : currentTheme.colors.border,
                        shadowColor: isDarkMode ? "#000" : "#000",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: isDarkMode ? 0.4 : 0.2,
                        shadowRadius: isDarkMode ? 8 : 6,
                        elevation: isDarkMode ? 10 : 6,
                        borderRadius: isDarkMode ? 8 : 0,
                        borderBottomLeftRadius: isDarkMode ? 8 : 0,
                        borderBottomRightRadius: isDarkMode ? 8 : 0,
                    }]}>
                        {suggestions.map((suggestion, index) => (
                            <TouchableOpacity
                                key={suggestion.id}
                                style={[styles.suggestionItem, { 
                                    backgroundColor: isDarkMode ? '#2A2A2A' : currentTheme.colors.surface,
                                    borderBottomWidth: index < suggestions.length - 1 ? 1 : 0,
                                    borderBottomColor: isDarkMode ? '#404040' : currentTheme.colors.border,
                                    paddingVertical: isDarkMode ? 12 : 8,
                                    paddingHorizontal: isDarkMode ? 20 : 16,
                                }]}
                                onPress={() => selectSuggestion(suggestion)}
                            >
                                <MaterialIcons 
                                    name="fitness-center" 
                                    size={20} 
                                    color={isDarkMode ? '#00BFFF' : currentTheme.colors.primary} 
                                />
                                <Text style={[styles.suggestionText, { 
                                    color: isDarkMode ? '#E0E0E0' : currentTheme.colors.textPrimary,
                                    marginLeft: isDarkMode ? 12 : 8,
                                    fontSize: isDarkMode ? 15 : 14,
                                    fontFamily: isDarkMode ? 'Roboto-Medium' : 'Roboto-Regular',
                                }]}>{suggestion.nombre}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>

            {filteredClases.length > 0 ? (
                <>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={CARD_WIDTH + CARD_SPACING} // Snap perfecto con el nuevo cálculo
                decelerationRate="fast"
                contentContainerStyle={styles.carouselContent}
                onScroll={handleScroll}
                scrollEventThrottle={16} // Mejor performance del scroll
            >
                {filteredClases.map((clase, index) => (
                    <View 
                        key={clase.id} 
                        style={index === filteredClases.length - 1 ? styles.lastCardContainer : styles.cardContainer}
                    >
                        <View style={[styles.cardShadow, {
                            shadowColor: isDarkMode ? "#000" : "#000",
                            backgroundColor: isDarkMode ? "#2A2A2A" : "#000",
                            borderWidth: isDarkMode ? 1 : 0,
                            borderColor: isDarkMode ? currentTheme.colors.border : 'transparent',
                            shadowOffset: { width: 0, height: isDarkMode ? 4 : 3 },
                            shadowOpacity: isDarkMode ? 0.3 : 0.2,
                            shadowRadius: isDarkMode ? 8 : 6,
                            elevation: isDarkMode ? 10 : 6
                        }]}> 
                            <View style={styles.card}>
                                <Image
                                    source={{ uri: clase.imagen }}
                                    style={styles.cardImage}
                                />
                                <View style={[styles.cardOverlay, { 
                                    backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.4)'
                                }]} />
                                <View style={styles.cardContent}>
                                    <Text style={[styles.cardTitle, { 
                                        color: isDarkMode ? '#E0E0E0' : currentTheme.colors.background,
                                        textShadowColor: isDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.8)',
                                        textShadowOffset: { width: 1, height: 1 },
                                        textShadowRadius: isDarkMode ? 4 : 3
                                    }]}>{clase.nombre}</Text>
                                    <TouchableOpacity 
                                        style={[styles.verMasButton, { 
                                            backgroundColor: isDarkMode ? 'rgba(0, 191, 255, 0.95)' : 'rgba(0, 191, 255, 0.9)',
                                            shadowColor: isDarkMode ? "#000" : "#000",
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: isDarkMode ? 0.4 : 0.25,
                                            shadowRadius: isDarkMode ? 6 : 4,
                                            elevation: isDarkMode ? 8 : 4
                                        }]}
                                        onPress={() => handleVerMas(clase)}
                                    >
                                        <Text style={[styles.verMasText, { color: currentTheme.colors.background }]}>Ver más</Text>
                                        <MaterialIcons name="keyboard-arrow-down" size={20} color={currentTheme.colors.background} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>

            <View style={styles.pagination}>
                {filteredClases.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.paginationDot,
                            { backgroundColor: currentTheme.colors.border },
                            index === activeSlide && [styles.paginationDotActive, { backgroundColor: currentTheme.colors.primary }],
                        ]}
                    />
                ))}
            </View>
                </>
            ) : (
                <View style={styles.noResultsContainer}>
                    <MaterialIcons name="search-off" size={64} color={currentTheme.colors.textSecondary} />
                    <Text style={[styles.noResultsText, { color: currentTheme.colors.textSecondary }]}>No se encontraron clases</Text>
                    <Text style={[styles.noResultsSubtext, { color: currentTheme.colors.textSecondary }]}>
                        Intenta con otro término de búsqueda
                    </Text>
                </View>
            )}
        </ScrollView>
    );
}

