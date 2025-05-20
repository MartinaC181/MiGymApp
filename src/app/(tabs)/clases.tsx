import React, { useState } from 'react';
import { 
    View, 
    Text, 
    ScrollView, 
    Image, 
    TouchableOpacity,
    Alert
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
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
                
                <View style={styles.scheduleContainer}>
                    {claseInfo.horarios.map((item, index) => (
                        <View key={index} style={styles.dayContainer}>
                            <Text style={styles.dayName}>{item.dia}</Text>
                            {item.horas.map((hora, horaIndex) => (
                                <TouchableOpacity 
                                    key={horaIndex} 
                                    style={styles.scheduleRow}
                                    onPress={() => toggleSeleccion(item.dia, hora)}
                                >
                                    <View style={styles.checkbox}>
                                        <MaterialIcons 
                                            name={seleccionados[`${item.dia}-${hora}`] ? "check-circle" : "radio-button-unchecked"} 
                                            size={22} 
                                            color={seleccionados[`${item.dia}-${hora}`] ? theme.colors.primary : "#888888"} 
                                        />
                                    </View>
                                    <Text style={styles.scheduleText}>{hora}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    ))}
                </View>
            </View>
            
            <View style={{paddingHorizontal: theme.spacing.lg, marginVertical: theme.spacing.lg}}>
                <TouchableOpacity 
                    style={globalStyles.primaryButton}
                    onPress={handleInscripcion}
                >
                    <Text style={globalStyles.buttonText}>Inscribirse</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}