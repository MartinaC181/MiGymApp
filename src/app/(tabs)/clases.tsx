import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    ScrollView, 
    Image, 
    TouchableOpacity,
    Alert,
    Dimensions
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
import { useLocalSearchParams } from 'expo-router';
import useClasesStyles from '../../styles/clases';
import globalStyles from '../../styles/global';
import { useTheme } from '../../context/ThemeContext';
import { getAvailableClasses, getCurrentUser, saveUserClasses, getUserClasses } from '../../utils/storage';

export default function ClaseDetalle() {
    const params = useLocalSearchParams();
    const claseId = params.id ? parseInt(params.id.toString()) : 1;
    const nombreClase = params.nombre?.toString() || "Clase";
    const imagenClase = params.imagen?.toString();
    
    // Estados
    const [claseInfo, setClaseInfo] = useState(null);
    const [seleccionados, setSeleccionados] = useState({});
    const [diaSeleccionado, setDiaSeleccionado] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // Estilos y tema
    const styles = useClasesStyles();
    const { theme } = useTheme();

    // Cargar información de la clase desde AsyncStorage
    useEffect(() => {
        loadClaseInfo();
    }, [claseId]);

    const loadClaseInfo = async () => {
        try {
            const availableClasses = await getAvailableClasses();
            const foundClass = availableClasses.find(clase => clase.id === claseId);
            
            if (foundClass) {
                setClaseInfo(foundClass);
            } else {
                // Fallback si no se encuentra la clase
                setClaseInfo({
                    descripcion: "Información de la clase no disponible.",
                    horarios: [
                        {dia: "Lunes", horas: ["Horario no disponible"]},
                    ]
                });
            }
        } catch (error) {
            console.error("Error cargando información de la clase:", error);
            setClaseInfo({
                descripcion: "Error cargando información de la clase.",
                horarios: [
                    {dia: "Lunes", horas: ["Error de carga"]},
                ]
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    // Toggle selección de horario
    const toggleSeleccion = (dia, hora) => {
        const key = `${dia}-${hora}`;
        setSeleccionados(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };
    
    // Función para inscribirse
    const handleInscripcion = async () => {
        const horariosMarcados = Object.keys(seleccionados).filter(key => seleccionados[key]);
        
        if (horariosMarcados.length === 0) {
            Alert.alert("Atención", "Por favor selecciona al menos un horario");
            return;
        }

        try {
            // Obtener usuario actual
            const currentUser = await getCurrentUser();
            if (!currentUser) {
                Alert.alert("Error", "Debes estar logueado para inscribirte");
                return;
            }

            // Obtener clases del usuario
            const userClasses = await getUserClasses(currentUser.id);
            
            // Crear nueva inscripción
            const newInscription = {
                claseId: claseId,
                nombreClase: nombreClase,
                horarios: horariosMarcados,
                fechaInscripcion: new Date().toISOString()
            };

            // Agregar nueva inscripción
            const updatedClasses = [...userClasses, newInscription];
            await saveUserClasses(currentUser.id, updatedClasses);

            Alert.alert(
                "Inscripción exitosa",
                `Te has inscrito correctamente a la clase de ${nombreClase}`,
                [{ text: "Aceptar" }]
            );
        } catch (error) {
            console.error("Error guardando inscripción:", error);
            Alert.alert("Error", "No se pudo completar la inscripción");
        }
    };

    if (isLoading) {
        return (
            <View style={[globalStyles.container, { justifyContent: 'center', backgroundColor: theme.colors.background }]}>
                <Text style={{ color: theme.colors.textPrimary }}>Cargando información de la clase...</Text>
            </View>
        );
    }

    if (!claseInfo || !claseInfo.horarios || claseInfo.horarios.length === 0) {
        return (
            <View style={[globalStyles.container, { justifyContent: 'center', backgroundColor: theme.colors.background }]}>
                <Text style={{ color: theme.colors.textPrimary }}>No hay información disponible para esta clase</Text>
            </View>
        );
    }

    return (
        <ScrollView style={[globalStyles.safeArea, { backgroundColor: theme.colors.background }]}>
            <View style={styles.headerImage}>
                <Image 
                    source={{ uri: imagenClase || 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5' }} 
                    style={styles.headerImage} 
                    resizeMode="cover"
                />
                <View style={styles.overlay}>
                    <View style={styles.classTitleContainer}>
                        <Text style={styles.classTitle}>{nombreClase.toUpperCase()}</Text>
                        <Text style={styles.classDescription}>{claseInfo.descripcion}</Text>
                    </View>
                </View>
            </View>
            
            <View style={styles.contentContainer}>
                <Text style={[globalStyles.title, { color: theme.colors.textPrimary }]}>Días y horarios</Text>
                
                {/* Selector de días como pestañas */}
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    style={styles.diasTabsScroll}
                >
                    {claseInfo.horarios.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.diaTab,
                                index === diaSeleccionado && styles.diaTabActive
                            ]}
                            onPress={() => setDiaSeleccionado(index)}
                        >
                            <Text 
                                style={[
                                    styles.diaTabText,
                                    index === diaSeleccionado && styles.diaTabTextActive
                                ]}
                            >
                                {item.dia}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                
                {/* Horarios del día seleccionado */}
                <View style={styles.horariosContainer}>
                    {claseInfo.horarios[diaSeleccionado].horas.map((hora, horaIndex) => {
                        const dia = claseInfo.horarios[diaSeleccionado].dia;
                        const key = `${dia}-${hora}`;
                        return (
                            <TouchableOpacity 
                                key={horaIndex}
                                style={[
                                    styles.horarioCard,
                                    seleccionados[key] && styles.horarioCardSelected
                                ]}
                                onPress={() => toggleSeleccion(dia, hora)}
                            >
                                <Text style={[
                                    styles.horarioCardText,
                                    seleccionados[key] && styles.horarioCardTextSelected
                                ]}>
                                    {hora}
                                </Text>
                                <MaterialIcons 
                                    name={seleccionados[key] ? "check-circle" : "add-circle-outline"} 
                                    size={24} 
                                    color={seleccionados[key] ? "#FFFFFF" : theme.colors.primary} 
                                />
                            </TouchableOpacity>
                        );
                    })}
                </View>
                
                {/* Botón inscribirse */}
                <TouchableOpacity 
                    style={[globalStyles.Button, {marginTop: theme.spacing.lg}]}
                    onPress={handleInscripcion}
                >
                    <Text style={[globalStyles.buttonText, { color: '#FFFFFF' }]}>Inscribirse</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}