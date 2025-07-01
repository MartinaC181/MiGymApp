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
import { 
    getAvailableClasses, 
    getCurrentUser, 
    saveUserClasses, 
    getUserClasses,
    enrollClientToClass,
    isClientEnrolledInClass
} from '../../utils/storage';

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
            // Obtener usuario actual para cargar clases específicas del gimnasio
            const currentUser = await getCurrentUser();
            const availableClasses = await getAvailableClasses(currentUser);
            const foundClass = availableClasses.find(clase => clase.id === claseId);
            
            if (foundClass) {
                setClaseInfo(foundClass);
                
                // Si es un usuario cliente, verificar si ya está inscrito
                if (currentUser && currentUser.role === 'client') {
                    const gymId = foundClass.gymId || (currentUser as any).gymId;
                    if (gymId) {
                        const isEnrolled = await isClientEnrolledInClass(currentUser.id, claseId, gymId);
                        setClaseInfo(prev => ({ ...prev, isEnrolled }));
                    }
                }
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
            if (!currentUser || currentUser.role !== 'client') {
                Alert.alert("Error", "Debes estar logueado como cliente para inscribirte");
                return;
            }

            // Determinar el gymId
            const gymId = claseInfo?.gymId || (currentUser as any).gymId;
            if (!gymId) {
                Alert.alert("Error", "No se pudo identificar el gimnasio");
                return;
            }

            // Verificar si ya está inscrito
            const isAlreadyEnrolled = await isClientEnrolledInClass(currentUser.id, claseId, gymId);
            if (isAlreadyEnrolled) {
                Alert.alert("Atención", "Ya estás inscrito en esta clase");
                return;
            }

            // Inscribir al cliente usando la nueva función
            const scheduleInfo = {
                horarios: horariosMarcados,
                diaSeleccionado: claseInfo?.horarios[diaSeleccionado]?.dia
            };

            const result = await enrollClientToClass(currentUser.id, claseId, gymId, scheduleInfo);
            
            if (result.success) {
                // Actualizar estado local
                setClaseInfo(prev => ({ ...prev, isEnrolled: true }));
                setSeleccionados({});

                Alert.alert(
                    "Inscripción exitosa",
                    `Te has inscrito correctamente a la clase de ${nombreClase}`,
                    [{ text: "Aceptar" }]
                );
            } else {
                Alert.alert("Error", result.message);
            }
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
                    source={{ uri: claseInfo?.imagen }}
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
                    style={[
                        globalStyles.Button, 
                        {marginTop: theme.spacing.lg},
                        claseInfo?.isEnrolled && { backgroundColor: theme.colors.success, opacity: 0.7 }
                    ]}
                    onPress={handleInscripcion}
                    disabled={claseInfo?.isEnrolled}
                >
                    <Text style={[globalStyles.buttonText, { color: '#FFFFFF' }]}>
                        {claseInfo?.isEnrolled ? 'Ya inscrito' : 'Inscribirse'}
                    </Text>
                </TouchableOpacity>
                
                {claseInfo?.isEnrolled && (
                    <View style={{ marginTop: theme.spacing.md, padding: theme.spacing.md, backgroundColor: theme.colors.success + '20', borderRadius: theme.borderRadius.md }}>
                        <Text style={{ color: theme.colors.success, textAlign: 'center', fontWeight: 'bold' }}>
                            ✓ Ya estás inscrito en esta clase
                        </Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}