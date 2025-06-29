import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { 
    View, 
    Text, 
    TextInput, 
    ScrollView, 
    Image, 
    TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import styles, { CARD_WIDTH, CARD_SPACING } from "../../styles/home";
import globalStyles from "../../styles/global";
import Racha from "../../components/Racha";
import theme from "../../constants/theme";
import { getCurrentUser, getAvailableClasses } from "../../utils/storage";
import { ClientUser } from "../../data/Usuario";

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
    const router = useRouter();

    // Cargar datos desde AsyncStorage al montar el componente
    useEffect(() => {
        loadData();
    }, []);

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

    return (
        <View style={[globalStyles.container, styles.homeContainer]}>
            <View style={styles.greetingContainer}>
                <Text style={styles.greeting}>Hola, <Text style={styles.name}>{getUserName()}!</Text></Text>
                <Text style={styles.subGreeting}>¿Listo para entrenar?</Text>
            </View>

            {/* Racha asistencia */}
            <View style={styles.rachaContainer}>
                <Racha />
            </View>

            {/* Contenedor relativo para posicionar las sugerencias */}
            <View style={styles.searchWrapper}>
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar clase"
                        placeholderTextColor="#999"
                        value={searchText}
                        onChangeText={handleTextChange}
                    />
                    {searchText.length > 0 ? (
                        <TouchableOpacity onPress={clearSearch} style={styles.searchIcon}>
                            <MaterialIcons name="close" size={24} color="#999" />
                        </TouchableOpacity>
                    ) : (
                    <MaterialIcons name="search" size={24} color="#999" style={styles.searchIcon} />
                    )}
                </View>

                {/* Sugerencias de autocompletado - Posicionadas absolutamente */}
                {showSuggestions && suggestions.length > 0 && (
                    <View style={styles.suggestionsContainer}>
                        {suggestions.map((suggestion) => (
                            <TouchableOpacity
                                key={suggestion.id}
                                style={styles.suggestionItem}
                                onPress={() => selectSuggestion(suggestion)}
                            >
                                <MaterialIcons name="fitness-center" size={20} color={theme.colors.primary} />
                                <Text style={styles.suggestionText}>{suggestion.nombre}</Text>
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
                        <View style={styles.card}>
                            <Image
                                source={{ uri: clase.imagen }}
                                style={styles.cardImage}
                            />
                            <View style={styles.cardOverlay} />
                            <View style={styles.cardContent}>
                                <Text style={styles.cardTitle}>{clase.nombre}</Text>
                                <TouchableOpacity 
                                    style={styles.verMasButton}
                                    onPress={() => handleVerMas(clase)}
                                >
                                    <Text style={styles.verMasText}>Ver más</Text>
                                    <MaterialIcons name="keyboard-arrow-down" size={20} color="#FFFFFF" />
                                </TouchableOpacity>
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
                            index === activeSlide && styles.paginationDotActive,
                        ]}
                    />
                ))}
            </View>
                </>
            ) : (
                <View style={styles.noResultsContainer}>
                    <MaterialIcons name="search-off" size={64} color="#999" />
                    <Text style={styles.noResultsText}>No se encontraron clases</Text>
                    <Text style={styles.noResultsSubtext}>
                        Intenta con otro término de búsqueda
                    </Text>
                </View>
            )}
        </View>
    );
}

