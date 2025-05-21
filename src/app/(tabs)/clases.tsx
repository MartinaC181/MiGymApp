import React, { useState } from 'react';
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
import styles from '../../styles/clases';
import globalStyles from '../../styles/global';
import theme from '../../constants/theme';

// Datos de ejemplo para los horarios disponibles
const horariosPorClase = {
    1: { // FUNCIONAL HIIT
        descripcion: "Entrenamiento de alta intensidad que combina fuerza y cardio para mejorar resistencia, quemar grasa y tonificar el cuerpo.",
        horarios: [
            {dia: "Lunes", horas: ["08:00 a 10:00", "14:00 a 16:00"]},
            {dia: "Martes", horas: ["08:00 a 10:00", "14:00 a 16:00"]},
            {dia: "Miércoles", horas: ["08:00 a 10:00", "14:00 a 16:00"]},
            {dia: "Jueves", horas: ["08:00 a 10:00", "14:00 a 16:00"]},
            {dia: "Viernes", horas: ["08:00 a 10:00", "14:00 a 16:00"]},
        ]
    },
    // ... resto de clases igual que antes
};

export default function ClaseDetalle() {
    const params = useLocalSearchParams();
    const claseId = params.id ? parseInt(params.id.toString()) : 1;
    const nombreClase = params.nombre?.toString() || "Clase";
    const imagenClase = params.imagen?.toString();
    
    // Obtener la información de la clase según el ID
    const claseInfo = horariosPorClase[claseId] || horariosPorClase[1];
    
    // Estado para los horarios seleccionados
    const [seleccionados, setSeleccionados] = useState({});
    
    // Añadir estado para el día seleccionado
    const [diaSeleccionado, setDiaSeleccionado] = useState(0);
    
    // Toggle selección de horario
    const toggleSeleccion = (dia, hora) => {
        const key = `${dia}-${hora}`;
        setSeleccionados(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };
    
    // Función para inscribirse
    const handleInscripcion = () => {
        const horariosMarcados = Object.keys(seleccionados).filter(key => seleccionados[key]);
        
        if (horariosMarcados.length === 0) {
            Alert.alert("Atención", "Por favor selecciona al menos un horario");
            return;
        }
        
        Alert.alert(
            "Inscripción exitosa",
            `Te has inscrito correctamente a la clase de ${nombreClase}`,
            [{ text: "Aceptar" }]
        );
    };

    return (
        <ScrollView style={globalStyles.safeArea}>
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
                <Text style={globalStyles.title}>Días y horarios</Text>
                
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
                    <Text style={globalStyles.buttonText}>Inscribirse</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}