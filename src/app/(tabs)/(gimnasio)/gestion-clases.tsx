import React, { useState } from 'react';
import { 
    View, 
    Text, 
    ScrollView, 
    TouchableOpacity,
    Alert,
    Modal,
    TextInput,
    Switch
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import theme from '../../../constants/theme';
import globalStyles from '../../../styles/global';
import styles from '../../../styles/gestion-clases';

// Definir tipos para las clases
interface Clase {
    id: number;
    nombre: string;
    descripcion: string;
    diasHorarios: { [key: string]: string[] };
    activa: boolean;
    cupoMaximo: number;
}

// Datos de ejemplo de clases existentes
const clasesIniciales: Clase[] = [
    {
        id: 1,
        nombre: "FUNCIONAL HIIT",
        descripcion: "Entrenamiento de alta intensidad que combina fuerza y cardio",
        diasHorarios: {
            lunes: ["08:00-10:00", "14:00-16:00"],
            martes: ["08:00-10:00", "14:00-16:00"],
            miercoles: ["08:00-10:00", "14:00-16:00"],
            jueves: ["08:00-10:00", "14:00-16:00"],
            viernes: ["08:00-10:00", "14:00-16:00"]
        },
        activa: true,
        cupoMaximo: 20
    },
    {
        id: 2,
        nombre: "CROSSFIT",
        descripcion: "Entrenamiento funcional de alta intensidad",
        diasHorarios: {
            lunes: ["09:00-10:30"],
            miercoles: ["09:00-10:30"],
            viernes: ["09:00-10:30"]
        },
        activa: true,
        cupoMaximo: 15
    },
    {
        id: 3,
        nombre: "YOGA",
        descripcion: "Práctica de yoga para flexibilidad y relajación",
        diasHorarios: {
            martes: ["18:00-19:30"],
            jueves: ["18:00-19:30"],
            sabado: ["10:00-11:30"]
        },
        activa: false,
        cupoMaximo: 25
    }
];

const diasSemana = [
    { key: 'lunes', label: 'Lunes' },
    { key: 'martes', label: 'Martes' },
    { key: 'miercoles', label: 'Miércoles' },
    { key: 'jueves', label: 'Jueves' },
    { key: 'viernes', label: 'Viernes' },
    { key: 'sabado', label: 'Sábado' },
    { key: 'domingo', label: 'Domingo' }
];

export default function GestionClases() {
    const [clases, setClases] = useState<Clase[]>(clasesIniciales);
    const [modalVisible, setModalVisible] = useState(false);
    const [editandoClase, setEditandoClase] = useState<Clase | null>(null);
    
    // Estados del formulario
    const [nombreClase, setNombreClase] = useState('');
    const [descripcionClase, setDescripcionClase] = useState('');
    const [cupoMaximo, setCupoMaximo] = useState('');
    const [claseActiva, setClaseActiva] = useState(true);
    const [diasSeleccionados, setDiasSeleccionados] = useState({});
    const [horariosInput, setHorariosInput] = useState({});

    const abrirModalNuevaClase = () => {
        resetearFormulario();
        setEditandoClase(null);
        setModalVisible(true);
    };

    const abrirModalEditarClase = (clase: Clase) => {
        setNombreClase(clase.nombre);
        setDescripcionClase(clase.descripcion);
        setCupoMaximo(clase.cupoMaximo.toString());
        setClaseActiva(clase.activa);
        
        // Configurar días y horarios
        const diasConfig = {};
        const horariosConfig = {};
        
        diasSemana.forEach(dia => {
            const tieneHorarios = clase.diasHorarios[dia.key] && clase.diasHorarios[dia.key].length > 0;
            diasConfig[dia.key] = tieneHorarios;
            if (tieneHorarios) {
                horariosConfig[dia.key] = clase.diasHorarios[dia.key].join(', ');
            }
        });
        
        setDiasSeleccionados(diasConfig);
        setHorariosInput(horariosConfig);
        setEditandoClase(clase);
        setModalVisible(true);
    };

    const resetearFormulario = () => {
        setNombreClase('');
        setDescripcionClase('');
        setCupoMaximo('');
        setClaseActiva(true);
        setDiasSeleccionados({});
        setHorariosInput({});
    };

    const toggleDia = (diaKey) => {
        setDiasSeleccionados(prev => ({
            ...prev,
            [diaKey]: !prev[diaKey]
        }));
        
        // Si se deselecciona un día, limpiar sus horarios
        if (diasSeleccionados[diaKey]) {
            setHorariosInput(prev => ({
                ...prev,
                [diaKey]: ''
            }));
        }
    };

    const actualizarHorario = (diaKey, horarios) => {
        setHorariosInput(prev => ({
            ...prev,
            [diaKey]: horarios
        }));
    };

    const validarFormulario = () => {
        if (!nombreClase.trim()) {
            Alert.alert('Error', 'El nombre de la clase es requerido');
            return false;
        }
        
        if (!descripcionClase.trim()) {
            Alert.alert('Error', 'La descripción es requerida');
            return false;
        }
        
        if (!cupoMaximo || isNaN(parseInt(cupoMaximo))) {
            Alert.alert('Error', 'El cupo máximo debe ser un número válido');
            return false;
        }
        
        const diasConHorarios = Object.keys(diasSeleccionados).filter(dia => diasSeleccionados[dia]);
        if (diasConHorarios.length === 0) {
            Alert.alert('Error', 'Debe seleccionar al menos un día');
            return false;
        }
        
        // Validar que todos los días seleccionados tengan horarios
        for (const dia of diasConHorarios) {
            if (!horariosInput[dia] || !horariosInput[dia].trim()) {
                Alert.alert('Error', `Debe especificar horarios para ${diasSemana.find(d => d.key === dia)?.label}`);
                return false;
            }
        }
        
        return true;
    };

    const guardarClase = () => {
        if (!validarFormulario()) return;
        
        // Procesar horarios
        const diasHorarios: { [key: string]: string[] } = {};
        Object.keys(diasSeleccionados).forEach(dia => {
            if (diasSeleccionados[dia] && horariosInput[dia]) {
                diasHorarios[dia] = horariosInput[dia]
                    .split(',')
                    .map(h => h.trim())
                    .filter(h => h.length > 0);
            }
        });
        
        const nuevaClase: Clase = {
            id: editandoClase ? editandoClase.id : Date.now(),
            nombre: nombreClase.trim(),
            descripcion: descripcionClase.trim(),
            cupoMaximo: parseInt(cupoMaximo),
            activa: claseActiva,
            diasHorarios
        };
        
        if (editandoClase) {
            setClases(prev => prev.map(c => c.id === editandoClase.id ? nuevaClase : c));
        } else {
            setClases(prev => [...prev, nuevaClase]);
        }
        
        setModalVisible(false);
        resetearFormulario();
        
        Alert.alert(
            'Éxito', 
            editandoClase ? 'Clase actualizada correctamente' : 'Clase creada correctamente'
        );
    };

    const eliminarClase = (clase: Clase) => {
        Alert.alert(
            'Confirmar eliminación',
            `¿Estás seguro que querés eliminar la clase "${clase.nombre}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                { 
                    text: 'Eliminar', 
                    style: 'destructive',
                    onPress: () => {
                        setClases(prev => prev.filter(c => c.id !== clase.id));
                        Alert.alert('Éxito', 'Clase eliminada correctamente');
                    }
                }
            ]
        );
    };

    const toggleEstadoClase = (clase: Clase) => {
        const nuevoEstado = !clase.activa;
        setClases(prev => prev.map(c => 
            c.id === clase.id ? { ...c, activa: nuevoEstado } : c
        ));
        
        Alert.alert(
            'Éxito', 
            `Clase ${nuevoEstado ? 'activada' : 'desactivada'} correctamente`
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.headerSection}>
                    <Text style={styles.sectionTitle}>Clases Disponibles</Text>
                    <Text style={styles.sectionSubtitle}>
                        Gestiona las clases de tu gimnasio
                    </Text>
                </View>

                <View style={styles.clasesContainer}>
                    {clases.map((clase) => (
                        <View key={clase.id} style={styles.claseCard}>
                            <View style={styles.claseHeader}>
                                <View style={styles.claseInfo}>
                                    <Text style={styles.claseNombre}>{clase.nombre}</Text>
                                    <Text style={styles.claseDescripcion}>{clase.descripcion}</Text>
                                    <View style={styles.claseMetadata}>
                                        <View style={styles.metadataItem}>
                                            <MaterialIcons name="people" size={16} color={theme.colors.textSecondary} />
                                            <Text style={styles.metadataText}>Cupo: {clase.cupoMaximo}</Text>
                                        </View>
                                        <View style={[styles.estadoBadge, clase.activa ? styles.estadoActivo : styles.estadoInactivo]}>
                                            <Text style={[styles.estadoTexto, clase.activa ? styles.estadoTextoActivo : styles.estadoTextoInactivo]}>
                                                {clase.activa ? 'Activa' : 'Inactiva'}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.horariosResumen}>
                                <Text style={styles.horariosLabel}>Horarios:</Text>
                                <View style={styles.horariosChips}>
                                    {Object.entries(clase.diasHorarios).map(([dia, horarios]) => (
                                        <View key={dia} style={styles.diaChip}>
                                            <Text style={styles.diaChipTexto}>
                                                {diasSemana.find(d => d.key === dia)?.label}: {horarios.join(', ')}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            <View style={styles.accionesContainer}>
                                <TouchableOpacity 
                                    style={[styles.accionButton, styles.editarButton]}
                                    onPress={() => abrirModalEditarClase(clase)}
                                >
                                    <MaterialIcons name="edit" size={20} color="#FFFFFF" />
                                    <Text style={styles.accionButtonText}>Editar</Text>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                    style={[styles.accionButton, clase.activa ? styles.desactivarButton : styles.activarButton]}
                                    onPress={() => toggleEstadoClase(clase)}
                                >
                                    <MaterialIcons 
                                        name={clase.activa ? "pause" : "play-arrow"} 
                                        size={20} 
                                        color="#FFFFFF" 
                                    />
                                    <Text style={styles.accionButtonText}>
                                        {clase.activa ? 'Desactivar' : 'Activar'}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                    style={[styles.accionButton, styles.eliminarButton]}
                                    onPress={() => eliminarClase(clase)}
                                >
                                    <MaterialIcons name="delete" size={20} color="#FFFFFF" />
                                    <Text style={styles.accionButtonText}>Eliminar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* Botón flotante para agregar nueva clase */}
            <TouchableOpacity 
                style={styles.fabButton}
                onPress={abrirModalNuevaClase}
            >
                <MaterialIcons name="add" size={28} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Modal para crear/editar clase */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setModalVisible(false)}
            >
                <SafeAreaView style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity 
                            onPress={() => setModalVisible(false)}
                            style={styles.modalCloseButton}
                        >
                            <MaterialIcons name="close" size={24} color={theme.colors.textSecondary} />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>
                            {editandoClase ? 'Editar Clase' : 'Nueva Clase'}
                        </Text>
                        <TouchableOpacity 
                            onPress={guardarClase}
                            style={styles.modalSaveButton}
                        >
                            <Text style={styles.modalSaveText}>Guardar</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalContent}>
                        <View style={styles.formSection}>
                            <Text style={styles.formSectionTitle}>Información General</Text>
                            
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Nombre de la clase</Text>
                                <TextInput
                                    style={styles.textInput}
                                    value={nombreClase}
                                    onChangeText={setNombreClase}
                                    placeholder="Ej: FUNCIONAL HIIT"
                                    placeholderTextColor="#999"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Descripción</Text>
                                <TextInput
                                    style={[styles.textInput, styles.textAreaInput]}
                                    value={descripcionClase}
                                    onChangeText={setDescripcionClase}
                                    placeholder="Describe los beneficios y características de la clase"
                                    placeholderTextColor="#999"
                                    multiline
                                    numberOfLines={3}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Cupo máximo</Text>
                                <TextInput
                                    style={styles.textInput}
                                    value={cupoMaximo}
                                    onChangeText={setCupoMaximo}
                                    placeholder="20"
                                    placeholderTextColor="#999"
                                    keyboardType="numeric"
                                />
                            </View>

                            <View style={styles.switchContainer}>
                                <Text style={styles.inputLabel}>Clase activa</Text>
                                <Switch
                                    value={claseActiva}
                                    onValueChange={setClaseActiva}
                                    trackColor={{ false: '#E0E0E0', true: theme.colors.primary }}
                                    thumbColor={claseActiva ? '#FFFFFF' : '#F4F3F4'}
                                />
                            </View>
                        </View>

                        <View style={styles.formSection}>
                            <Text style={styles.formSectionTitle}>Días y Horarios</Text>
                            <Text style={styles.formSectionSubtitle}>
                                Selecciona los días y especifica los horarios (formato: 08:00-10:00, 14:00-16:00)
                            </Text>
                            
                            {diasSemana.map((dia) => (
                                <View key={dia.key} style={styles.diaContainer}>
                                    <TouchableOpacity 
                                        style={styles.diaHeader}
                                        onPress={() => toggleDia(dia.key)}
                                    >
                                        <View style={styles.diaCheckbox}>
                                            <MaterialIcons 
                                                name={diasSeleccionados[dia.key] ? "check-box" : "check-box-outline-blank"} 
                                                size={24} 
                                                color={diasSeleccionados[dia.key] ? theme.colors.primary : "#999"} 
                                            />
                                            <Text style={[styles.diaLabel, diasSeleccionados[dia.key] && styles.diaLabelSelected]}>
                                                {dia.label}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                    
                                    {diasSeleccionados[dia.key] && (
                                        <TextInput
                                            style={styles.horarioInput}
                                            value={horariosInput[dia.key] || ''}
                                            onChangeText={(text) => actualizarHorario(dia.key, text)}
                                            placeholder="08:00-10:00, 14:00-16:00"
                                            placeholderTextColor="#999"
                                        />
                                    )}
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </Modal>
        </View>
    );
}
