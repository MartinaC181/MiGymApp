import React, { useState, useEffect } from 'react';
import {
    Modal,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Switch,
    Alert
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clase, ClaseFormData, diasSemana } from '../types/Clase';
import theme from '../constants/theme';
import styles from '../styles/gestion-gimnasio';
import globalStyles from '../styles/global';

interface ClassFormModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (clase: Clase) => void;
    editingClass?: Clase | null;
    title?: string;
}

export default function ClassFormModal({
    visible,
    onClose,
    onSave,
    editingClass = null,
    title
}: ClassFormModalProps) {
    // Estados del formulario
    const [formData, setFormData] = useState<ClaseFormData>({
        nombre: '',
        descripcion: '',
        cupoMaximo: '',
        activa: true,
        diasSeleccionados: {},
        horariosInput: {}
    });

    // Estados para manejo de errores
    const [errors, setErrors] = useState<{[key: string]: string}>({});
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Nuevo estado para modalidad de clase mejorada
    const [modalidadClase, setModalidadClase] = useState<'personalizada' | 'flexible'>('personalizada');
    const [horarioInicio, setHorarioInicio] = useState('08:00');
    const [horarioFin, setHorarioFin] = useState('22:00');
    const [duracionClase, setDuracionClase] = useState('60'); // en minutos
    const [diasFlexibles, setDiasFlexibles] = useState<{ [key: string]: boolean }>({});

    // Resetear formulario cuando se abre/cierra el modal
    useEffect(() => {
        if (visible) {
            setErrors({}); // Limpiar errores
            if (editingClass) {
                // Cargar datos de la clase a editar
                const diasConfig: { [key: string]: boolean } = {};
                const horariosConfig: { [key: string]: string } = {};
                
                diasSemana.forEach(dia => {
                    const tieneHorarios = editingClass.diasHorarios[dia.key] && editingClass.diasHorarios[dia.key].length > 0;
                    diasConfig[dia.key] = tieneHorarios;
                    if (tieneHorarios) {
                        horariosConfig[dia.key] = editingClass.diasHorarios[dia.key].join(', ');
                    }
                });

                setFormData({
                    nombre: editingClass.nombre,
                    descripcion: editingClass.descripcion,
                    cupoMaximo: editingClass.cupoMaximo.toString(),
                    activa: editingClass.activa,
                    diasSeleccionados: diasConfig,
                    horariosInput: horariosConfig
                });
                setModalidadClase('personalizada');
            } else {
                // Resetear formulario para nueva clase
                setFormData({
                    nombre: '',
                    descripcion: '',
                    cupoMaximo: '',
                    activa: true,
                    diasSeleccionados: {},
                    horariosInput: {}
                });
                setModalidadClase('personalizada');
                setHorarioInicio('08:00');
                setHorarioFin('22:00');
                setDuracionClase('60');
                setDiasFlexibles({});
            }
        }
    }, [visible, editingClass]);

    const updateFormData = (field: keyof ClaseFormData, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Limpiar error del campo cuando el usuario empiece a escribir
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const clearFieldError = (field: string) => {
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const toggleDia = (diaKey: string) => {
        const newDiasSeleccionados = {
            ...formData.diasSeleccionados,
            [diaKey]: !formData.diasSeleccionados[diaKey]
        };
        
        setFormData(prev => ({
            ...prev,
            diasSeleccionados: newDiasSeleccionados
        }));
        
        // Si se deselecciona un día, limpiar sus horarios
        if (formData.diasSeleccionados[diaKey]) {
            setFormData(prev => ({
                ...prev,
                horariosInput: {
                    ...prev.horariosInput,
                    [diaKey]: ''
                }
            }));
        }

        // Limpiar error de días si se selecciona alguno
        if (!newDiasSeleccionados[diaKey] === false) {
            clearFieldError('dias');
        }
    };

    const toggleDiaFlexible = (diaKey: string) => {
        const newDiasFlexibles = {
            ...diasFlexibles,
            [diaKey]: !diasFlexibles[diaKey]
        };
        setDiasFlexibles(newDiasFlexibles);

        // Limpiar error de días si se selecciona alguno
        if (newDiasFlexibles[diaKey]) {
            clearFieldError('dias');
        }
    };

    const actualizarHorario = (diaKey: string, horarios: string) => {
        setFormData(prev => ({
            ...prev,
            horariosInput: {
                ...prev.horariosInput,
                [diaKey]: horarios
            }
        }));
    };

    const generarHorariosDiarios = () => {
        const inicio = parseInt(horarioInicio.split(':')[0]);
        const fin = parseInt(horarioFin.split(':')[0]);
        const duracion = parseInt(duracionClase);
        const horarios: string[] = [];
        
        for (let hora = inicio; hora < fin; hora += Math.ceil(duracion / 60)) {
            const horaFin = hora + Math.ceil(duracion / 60);
            if (horaFin <= fin) {
                const formatoInicio = `${hora.toString().padStart(2, '0')}:00`;
                const formatoFin = `${horaFin.toString().padStart(2, '0')}:00`;
                horarios.push(`${formatoInicio}-${formatoFin}`);
            }
        }
        
        return horarios;
    };

    const validarFormulario = (): boolean => {
        const newErrors: {[key: string]: string} = {};

        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre de la clase es requerido';
        }
        
        if (!formData.descripcion.trim()) {
            newErrors.descripcion = 'La descripción es requerida';
        }
        
        if (!formData.cupoMaximo || isNaN(parseInt(formData.cupoMaximo))) {
            newErrors.cupoMaximo = 'El cupo máximo debe ser un número válido';
        }
        
        if (modalidadClase === 'personalizada') {
            const diasConHorarios = Object.keys(formData.diasSeleccionados).filter(
                dia => formData.diasSeleccionados[dia]
            );
            if (diasConHorarios.length === 0) {
                newErrors.dias = 'Debe seleccionar al menos un día';
            }
            
            // Validar que todos los días seleccionados tengan horarios
            for (const dia of diasConHorarios) {
                if (!formData.horariosInput[dia] || !formData.horariosInput[dia].trim()) {
                    newErrors[`horario_${dia}`] = `Debe especificar horarios para ${diasSemana.find(d => d.key === dia)?.label}`;
                }
            }
        } else {
            // Validar horarios flexibles
            const diasSeleccionados = Object.keys(diasFlexibles).filter(dia => diasFlexibles[dia]);
            if (diasSeleccionados.length === 0) {
                newErrors.dias = 'Debe seleccionar al menos un día';
            }
            
            if (!duracionClase || isNaN(parseInt(duracionClase))) {
                newErrors.duracionClase = 'La duración debe ser un número válido en minutos';
            }
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validarFormulario()) return;
        
        // Procesar horarios según modalidad
        let diasHorarios: { [key: string]: string[] } = {};
        
        if (modalidadClase === 'personalizada') {
            Object.keys(formData.diasSeleccionados).forEach(dia => {
                if (formData.diasSeleccionados[dia] && formData.horariosInput[dia]) {
                    diasHorarios[dia] = formData.horariosInput[dia]
                        .split(',')
                        .map(h => h.trim())
                        .filter(h => h.length > 0);
                }
            });
        } else {
            // Modalidad flexible - solo días seleccionados con horarios generados
            const horariosGenerados = generarHorariosDiarios();
            Object.keys(diasFlexibles).forEach(dia => {
                if (diasFlexibles[dia]) {
                    diasHorarios[dia] = horariosGenerados;
                }
            });
        }
        
        const clase: Clase = {
            id: editingClass ? editingClass.id : Date.now(),
            nombre: formData.nombre.trim(),
            descripcion: formData.descripcion.trim(),
            cupoMaximo: parseInt(formData.cupoMaximo),
            activa: formData.activa,
            diasHorarios
        };
        
        onSave(clase);
        
        // Mostrar modal de éxito
        setShowSuccessModal(true);
    };

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
        onClose(); // Cerrar también el modal principal
    };

    const modalTitle = title || (editingClass ? 'Editar Clase' : 'Nueva Clase');

    // Modal de éxito
    const SuccessModal = () => (
        <Modal
            visible={showSuccessModal}
            transparent
            animationType="fade"
            onRequestClose={handleCloseSuccessModal}
        >
            <View style={globalStyles.modalOverlay}>
                <View style={globalStyles.successContainer}>
                    <Text style={globalStyles.successTitle}>
                        {editingClass ? '¡Clase actualizada con éxito!' : '¡Clase creada con éxito!'}
                    </Text>

                    <MaterialCommunityIcons
                        name="check-circle-outline"
                        size={64}
                        color={theme.colors.primary}
                        style={{ marginVertical: theme.spacing.lg }}
                    />

                    <TouchableOpacity onPress={handleCloseSuccessModal}>
                        <Text style={globalStyles.successLink}>
                            Continuar
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    return (
        <>
            <Modal
                visible={visible}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={onClose}
            >
                <SafeAreaView style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity 
                            onPress={onClose}
                            style={styles.modalCloseButton}
                        >
                            <MaterialIcons name="close" size={24} color={theme.colors.textSecondary} />
                        </TouchableOpacity>
                        <View style={styles.modalTitleContainer}>
                            <Text style={styles.modalTitle}>
                                {modalTitle}
                            </Text>
                        </View>
                        <View style={styles.modalSpacerButton} />
                    </View>

                    <ScrollView style={styles.modalContent}>
                        <View style={styles.formSection}>
                            <Text style={styles.formSectionTitle}>Información General</Text>
                            
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Nombre de la clase</Text>
                                <TextInput
                                    style={[
                                        styles.textInput,
                                        errors.nombre && styles.inputError
                                    ]}
                                    value={formData.nombre}
                                    onChangeText={(text) => updateFormData('nombre', text)}
                                    placeholder="Ej: FUNCIONAL HIIT"
                                    placeholderTextColor="#999"
                                />
                                {errors.nombre && (
                                    <Text style={styles.errorText}>{errors.nombre}</Text>
                                )}
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Descripción</Text>
                                <TextInput
                                    style={[
                                        styles.textInput, 
                                        styles.textAreaInput,
                                        errors.descripcion && styles.inputError
                                    ]}
                                    value={formData.descripcion}
                                    onChangeText={(text) => updateFormData('descripcion', text)}
                                    placeholder="Describe los beneficios y características de la clase"
                                    placeholderTextColor="#999"
                                    multiline
                                    numberOfLines={3}
                                />
                                {errors.descripcion && (
                                    <Text style={styles.errorText}>{errors.descripcion}</Text>
                                )}
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Cupo máximo</Text>
                                <TextInput
                                    style={[
                                        styles.textInput,
                                        errors.cupoMaximo && styles.inputError
                                    ]}
                                    value={formData.cupoMaximo}
                                    onChangeText={(text) => updateFormData('cupoMaximo', text)}
                                    placeholder="20"
                                    placeholderTextColor="#999"
                                    keyboardType="numeric"
                                />
                                {errors.cupoMaximo && (
                                    <Text style={styles.errorText}>{errors.cupoMaximo}</Text>
                                )}
                            </View>

                            <View style={styles.switchContainer}>
                                <Text style={styles.inputLabel}>Clase activa</Text>
                                <Switch
                                    value={formData.activa}
                                    onValueChange={(value) => updateFormData('activa', value)}
                                    trackColor={{ false: '#E0E0E0', true: theme.colors.primary }}
                                    thumbColor={formData.activa ? '#FFFFFF' : '#F4F3F4'}
                                />
                            </View>
                        </View>

                        <View style={styles.formSection}>
                            <Text style={styles.formSectionTitle}>Configuración de Horarios</Text>
                            
                            {/* Selector de modalidad */}
                            <View style={styles.modalidadContainer}>
                                <TouchableOpacity
                                    style={[
                                        styles.modalidadButton,
                                        modalidadClase === 'personalizada' && styles.modalidadButtonActive
                                    ]}
                                    onPress={() => setModalidadClase('personalizada')}
                                >
                                    <MaterialIcons 
                                        name="schedule" 
                                        size={20} 
                                        color={modalidadClase === 'personalizada' ? theme.colors.primary : '#999'} 
                                    />
                                    <Text style={[
                                        styles.modalidadText,
                                        modalidadClase === 'personalizada' && styles.modalidadTextActive
                                    ]}>
                                        Horarios Específicos
                                    </Text>
                                </TouchableOpacity>
                                
                                <TouchableOpacity
                                    style={[
                                        styles.modalidadButton,
                                        modalidadClase === 'flexible' && styles.modalidadButtonActive
                                    ]}
                                    onPress={() => setModalidadClase('flexible')}
                                >
                                    <MaterialIcons 
                                        name="today" 
                                        size={20} 
                                        color={modalidadClase === 'flexible' ? theme.colors.primary : '#999'} 
                                    />
                                    <Text style={[
                                        styles.modalidadText,
                                        modalidadClase === 'flexible' && styles.modalidadTextActive
                                    ]}>
                                        Horarios Automáticos
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {modalidadClase === 'personalizada' ? (
                                <>
                                    <Text style={styles.formSectionSubtitle}>
                                        Selecciona los días y especifica los horarios (formato: 08:00-10:00, 14:00-16:00)
                                    </Text>
                                    
                                    {errors.dias && (
                                        <Text style={styles.errorText}>{errors.dias}</Text>
                                    )}
                                    
                                    {diasSemana.map((dia) => (
                                        <View key={dia.key} style={styles.diaContainer}>
                                            <TouchableOpacity 
                                                style={styles.diaHeader}
                                                onPress={() => toggleDia(dia.key)}
                                            >
                                                <View style={styles.diaCheckbox}>
                                                    <MaterialIcons 
                                                        name={formData.diasSeleccionados[dia.key] ? "check-box" : "check-box-outline-blank"} 
                                                        size={24} 
                                                        color={formData.diasSeleccionados[dia.key] ? theme.colors.primary : "#999"} 
                                                    />
                                                    <Text style={[
                                                        styles.diaLabel, 
                                                        formData.diasSeleccionados[dia.key] && styles.diaLabelSelected
                                                    ]}>
                                                        {dia.label}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                            
                                            {formData.diasSeleccionados[dia.key] && (
                                                <>
                                                    <TextInput
                                                        style={[
                                                            styles.horarioInput,
                                                            errors[`horario_${dia.key}`] && styles.inputError
                                                        ]}
                                                        value={formData.horariosInput[dia.key] || ''}
                                                        onChangeText={(text) => {
                                                            actualizarHorario(dia.key, text);
                                                            clearFieldError(`horario_${dia.key}`);
                                                        }}
                                                        placeholder="08:00-10:00, 14:00-16:00"
                                                        placeholderTextColor="#999"
                                                    />
                                                    {errors[`horario_${dia.key}`] && (
                                                        <Text style={[styles.errorText, { marginLeft: theme.spacing.xl }]}>
                                                            {errors[`horario_${dia.key}`]}
                                                        </Text>
                                                    )}
                                                </>
                                            )}
                                        </View>
                                    ))}
                                </>
                            ) : (
                                <>
                                    <Text style={styles.formSectionSubtitle}>
                                        Selecciona los días que opera tu gimnasio y configura horarios automáticos
                                    </Text>
                                    
                                    {/* Selector de días para modo flexible */}
                                    <View style={styles.diasFlexiblesContainer}>
                                        <Text style={styles.inputLabel}>Días de funcionamiento</Text>
                                        <View style={styles.diasFlexiblesGrid}>
                                            {diasSemana.map((dia) => (
                                                <TouchableOpacity
                                                    key={dia.key}
                                                    style={[
                                                        styles.diaFlexibleButton,
                                                        diasFlexibles[dia.key] && styles.diaFlexibleButtonActive
                                                    ]}
                                                    onPress={() => toggleDiaFlexible(dia.key)}
                                                >
                                                    <Text style={[
                                                        styles.diaFlexibleText,
                                                        diasFlexibles[dia.key] && styles.diaFlexibleTextActive
                                                    ]}>
                                                        {dia.label.substring(0, 3)}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                        {errors.dias && (
                                            <Text style={styles.errorText}>{errors.dias}</Text>
                                        )}
                                    </View>
                                    
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.inputLabel}>Horario de inicio (primera clase del día)</Text>
                                        <TextInput
                                            style={styles.textInput}
                                            value={horarioInicio}
                                            onChangeText={setHorarioInicio}
                                            placeholder="08:00"
                                            placeholderTextColor="#999"
                                        />
                                    </View>

                                    <View style={styles.inputGroup}>
                                        <Text style={styles.inputLabel}>Horario de fin (última clase del día)</Text>
                                        <TextInput
                                            style={styles.textInput}
                                            value={horarioFin}
                                            onChangeText={setHorarioFin}
                                            placeholder="22:00"
                                            placeholderTextColor="#999"
                                        />
                                    </View>

                                    <View style={styles.inputGroup}>
                                        <Text style={styles.inputLabel}>Duración de cada clase (minutos)</Text>
                                        <TextInput
                                            style={[
                                                styles.textInput,
                                                errors.duracionClase && styles.inputError
                                            ]}
                                            value={duracionClase}
                                            onChangeText={(text) => {
                                                setDuracionClase(text);
                                                clearFieldError('duracionClase');
                                            }}
                                            placeholder="60"
                                            placeholderTextColor="#999"
                                            keyboardType="numeric"
                                        />
                                        {errors.duracionClase && (
                                            <Text style={styles.errorText}>{errors.duracionClase}</Text>
                                        )}
                                    </View>

                                    {Object.keys(diasFlexibles).some(dia => diasFlexibles[dia]) && (
                                        <View style={styles.previsualizacionContainer}>
                                            <Text style={styles.previsualizacionTitle}>Vista previa de horarios:</Text>
                                            <Text style={styles.previsualizacionText}>
                                                {generarHorariosDiarios().join(', ')}
                                            </Text>
                                        </View>
                                    )}
                                </>
                            )}
                        </View>
                    </ScrollView>

                    {/* Botón de guardar usando estilos existentes */}
                    <View style={styles.modalFooter}>
                        <TouchableOpacity 
                            style={globalStyles.LoginButton}
                            onPress={handleSave}
                        >
                            <Text style={globalStyles.buttonText}>
                                {editingClass ? 'ACTUALIZAR CLASE' : 'CREAR CLASE'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </Modal>

            {/* Modal de éxito */}
            <SuccessModal />
        </>
    );
} 