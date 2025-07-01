import React, { useState, useEffect, useMemo } from 'react';
import { 
    View, 
    Text, 
    ScrollView, 
    TouchableOpacity,
    Alert,
    TextInput
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { createGestionGimnasioStyles } from '../../styles/gestion-gimnasio';
import { Clase, diasSemana } from '../../types/Clase';
import ClassFormModal from '../../components/ClassFormModal';
import FloatingActionButton from '../../components/FloatingActionButton';
import { useAuth } from '../../hooks/useAuth';
import { 
    getGymClasses, 
    addGymClass, 
    updateGymClass, 
    deleteGymClass 
} from '../../utils/storage';

export default function GestionClases() {
    const { user } = useAuth();
    const [clases, setClases] = useState<Clase[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [editandoClase, setEditandoClase] = useState<Clase | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Estados para búsqueda y filtros
    const [searchText, setSearchText] = useState('');
    const [searchFocused, setSearchFocused] = useState(false);
    const [filtroEstado, setFiltroEstado] = useState<'todas' | 'activas' | 'inactivas'>('todas');
    const [diasSeleccionados, setDiasSeleccionados] = useState<Set<string>>(new Set());

    // === Tema dinámico ===
    const { theme } = useTheme();
    const styles = useMemo(() => createGestionGimnasioStyles(theme), [theme]);

    // Cargar clases del AsyncStorage al montar el componente
    useEffect(() => {
        loadClasesFromStorage();
    }, [user]);

    // Lógica de filtrado usando useMemo para optimizar rendimiento
    const clasesFiltradas = useMemo(() => {
        let resultado = clases;

        // Filtrar por texto de búsqueda
        if (searchText.trim()) {
            const searchLower = searchText.toLowerCase().trim();
            resultado = resultado.filter(clase => 
                clase.nombre.toLowerCase().includes(searchLower) ||
                clase.descripcion.toLowerCase().includes(searchLower)
            );
        }

        // Filtrar por estado
        if (filtroEstado !== 'todas') {
            resultado = resultado.filter(clase => {
                if (filtroEstado === 'activas') {
                    return clase.activa;
                } else if (filtroEstado === 'inactivas') {
                    return !clase.activa;
                }
                return true;
            });
        }

        // Filtrar por días seleccionados
        if (diasSeleccionados.size > 0) {
            resultado = resultado.filter(clase => {
                return Array.from(diasSeleccionados).some(dia => 
                    clase.diasHorarios[dia] && clase.diasHorarios[dia].length > 0
                );
            });
        }

        return resultado;
    }, [clases, searchText, filtroEstado, diasSeleccionados]);

    // Contadores para los filtros
    const contadores = useMemo(() => {
        const activas = clases.filter(c => c.activa).length;
        const inactivas = clases.filter(c => !c.activa).length;
        
        // Contar clases por día
        const contadoresDias: { [key: string]: number } = {};
        diasSemana.forEach(dia => {
            contadoresDias[dia.key] = clases.filter(clase => 
                clase.diasHorarios[dia.key] && clase.diasHorarios[dia.key].length > 0
            ).length;
        });

        return { activas, inactivas, total: clases.length, dias: contadoresDias };
    }, [clases]);

    const loadClasesFromStorage = async () => {
        if (!user || user.role !== 'gym') {
            setIsLoading(false);
            return;
        }

        try {
            const clasesGuardadas = await getGymClasses(user.id);
            setClases(clasesGuardadas);
        } catch (error) {
            console.error('Error cargando clases:', error);
            Alert.alert('Error', 'No se pudieron cargar las clases');
        } finally {
            setIsLoading(false);
        }
    };

    const abrirModalNuevaClase = () => {
        setEditandoClase(null);
        setModalVisible(true);
    };

    const abrirModalEditarClase = (clase: Clase) => {
        setEditandoClase(clase);
        setModalVisible(true);
    };

    const cerrarModal = () => {
        setModalVisible(false);
        setEditandoClase(null);
    };

    const guardarClase = async (clase: Clase) => {
        if (!user || user.role !== 'gym') {
            Alert.alert('Error', 'Usuario no autorizado');
            return;
        }

        try {
            if (editandoClase) {
                // Editar clase existente
                const success = await updateGymClass(user.id, editandoClase.id, clase);
                if (success) {
                    setClases(prev => prev.map(c => c.id === editandoClase.id ? clase : c));
                } else {
                    Alert.alert('Error', 'No se pudo actualizar la clase');
                }
            } else {
                // Agregar nueva clase
                const success = await addGymClass(user.id, clase);
                if (success) {
                    setClases(prev => [...prev, clase]);
                } else {
                    Alert.alert('Error', 'No se pudo crear la clase');
                }
            }
        } catch (error) {
            console.error('Error guardando clase:', error);
            Alert.alert('Error', 'Ocurrió un error al guardar la clase');
        }
        
        cerrarModal();
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
                    onPress: async () => {
                        if (!user || user.role !== 'gym') {
                            Alert.alert('Error', 'Usuario no autorizado');
                            return;
                        }

                        try {
                            const success = await deleteGymClass(user.id, clase.id);
                            if (success) {
                                setClases(prev => prev.filter(c => c.id !== clase.id));
                                Alert.alert('Éxito', 'Clase eliminada correctamente');
                            } else {
                                Alert.alert('Error', 'No se pudo eliminar la clase');
                            }
                        } catch (error) {
                            console.error('Error eliminando clase:', error);
                            Alert.alert('Error', 'Ocurrió un error al eliminar la clase');
                        }
                    }
                }
            ]
        );
    };

    const toggleEstadoClase = async (clase: Clase) => {
        if (!user || user.role !== 'gym') {
            Alert.alert('Error', 'Usuario no autorizado');
            return;
        }

        try {
            const claseActualizada = { ...clase, activa: !clase.activa };
            const success = await updateGymClass(user.id, clase.id, claseActualizada);
            
            if (success) {
                setClases(prev => prev.map(c => 
                    c.id === clase.id ? claseActualizada : c
                ));
                
                Alert.alert(
                    'Éxito', 
                    `Clase ${claseActualizada.activa ? 'activada' : 'desactivada'} correctamente`
                );
            } else {
                Alert.alert('Error', 'No se pudo actualizar el estado de la clase');
            }
        } catch (error) {
            console.error('Error actualizando estado de clase:', error);
            Alert.alert('Error', 'Ocurrió un error al actualizar la clase');
        }
    };

    // Funciones para manejo de búsqueda y filtros
    const handleSearchChange = (text: string) => {
        setSearchText(text);
    };

    const clearSearch = () => {
        setSearchText('');
        setSearchFocused(false);
    };

    const toggleDiaFilter = (diaKey: string) => {
        setDiasSeleccionados(prev => {
            const newSet = new Set(prev);
            if (newSet.has(diaKey)) {
                newSet.delete(diaKey);
            } else {
                newSet.add(diaKey);
            }
            return newSet;
        });
    };

    const clearAllFilters = () => {
        setSearchText('');
        setFiltroEstado('todas');
        setDiasSeleccionados(new Set());
        setSearchFocused(false);
    };

    const isFilterActive = () => {
        return searchText.trim() !== '' || filtroEstado !== 'todas' || diasSeleccionados.size > 0;
    };

    // Mostrar indicador de carga
    if (isLoading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={styles.sectionTitle}>Cargando clases...</Text>
            </View>
        );
    }

    // Verificar que el usuario sea de tipo gimnasio
    if (!user || user.role !== 'gym') {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={styles.sectionTitle}>Acceso no autorizado</Text>
                <Text style={styles.sectionSubtitle}>
                    Solo los usuarios de gimnasio pueden gestionar clases
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.headerSection}>
                    <Text style={styles.sectionTitle}>Clases Disponibles</Text>
                    <Text style={styles.sectionSubtitle}>
                        Gestiona las clases de tu gimnasio
                    </Text>
                </View>

                {/* Sección de búsqueda y filtros */}
                <View style={styles.searchAndFiltersContainer}>
                    {/* Input de búsqueda */}
                    <View style={styles.searchWrapper}>
                        <View style={[
                            styles.searchContainer, 
                            searchFocused && styles.searchContainerFocused
                        ]}>
                            <MaterialIcons name="search" size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Buscar clases por nombre o descripción..."
                                placeholderTextColor={theme.colors.textSecondary}
                                value={searchText}
                                onChangeText={handleSearchChange}
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => setSearchFocused(false)}
                            />
                            {searchText.length > 0 && (
                                <TouchableOpacity onPress={clearSearch} style={styles.clearSearchButton}>
                                    <MaterialIcons name="close" size={18} color={theme.colors.textSecondary} />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    {/* Filtros por estado */}
                    <View style={styles.filtersContainer}>
                        <Text style={styles.filtersTitle}>Filtrar por estado</Text>
                        <View style={styles.filtersRow}>
                            <TouchableOpacity
                                style={[
                                    styles.filterChip,
                                    filtroEstado === 'todas' && styles.filterChipActive
                                ]}
                                onPress={() => setFiltroEstado('todas')}
                            >
                                <Text style={[
                                    styles.filterChipText,
                                    filtroEstado === 'todas' && styles.filterChipTextActive
                                ]}>
                                    Todas
                                </Text>
                                <Text style={[
                                    styles.filterChipCount,
                                    filtroEstado === 'todas' && styles.filterChipCountActive
                                ]}>
                                    {contadores.total}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.filterChip,
                                    filtroEstado === 'activas' && styles.filterChipActive
                                ]}
                                onPress={() => setFiltroEstado('activas')}
                            >
                                <MaterialIcons name="play-circle-filled" size={16} color={
                                    filtroEstado === 'activas' ? '#FFFFFF' : theme.colors.success
                                } />
                                <Text style={[
                                    styles.filterChipText,
                                    filtroEstado === 'activas' && styles.filterChipTextActive
                                ]}>
                                    Activas
                                </Text>
                                <Text style={[
                                    styles.filterChipCount,
                                    filtroEstado === 'activas' && styles.filterChipCountActive
                                ]}>
                                    {contadores.activas}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.filterChip,
                                    filtroEstado === 'inactivas' && styles.filterChipActive
                                ]}
                                onPress={() => setFiltroEstado('inactivas')}
                            >
                                <MaterialIcons name="pause-circle-filled" size={16} color={
                                    filtroEstado === 'inactivas' ? '#FFFFFF' : '#FFCC80'
                                } />
                                <Text style={[
                                    styles.filterChipText,
                                    filtroEstado === 'inactivas' && styles.filterChipTextActive
                                ]}>
                                    Inactivas
                                </Text>
                                <Text style={[
                                    styles.filterChipCount,
                                    filtroEstado === 'inactivas' && styles.filterChipCountActive
                                ]}>
                                    {contadores.inactivas}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Filtros por días */}
                    <View style={styles.filtersContainer}>
                        <Text style={styles.filtersTitle}>Filtrar por día de la semana</Text>
                        <View style={styles.diasFiltersContainer}>
                            {diasSemana.map(dia => (
                                <TouchableOpacity
                                    key={dia.key}
                                    style={[
                                        styles.diaFilterChip,
                                        diasSeleccionados.has(dia.key) && styles.diaFilterChipActive
                                    ]}
                                    onPress={() => toggleDiaFilter(dia.key)}
                                >
                                    <Text style={[
                                        styles.diaFilterText,
                                        diasSeleccionados.has(dia.key) && styles.diaFilterTextActive
                                    ]}>
                                        {dia.label.slice(0, 3)}
                                    </Text>
                                    {contadores.dias[dia.key] > 0 && (
                                        <Text style={[
                                            styles.filterChipCount,
                                            diasSeleccionados.has(dia.key) && styles.filterChipCountActive,
                                            { fontSize: 10, marginTop: 2 }
                                        ]}>
                                            {contadores.dias[dia.key]}
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>

                {/* Contador de resultados */}
                {isFilterActive() && (
                    <View style={styles.resultsCounter}>
                        <Text style={styles.resultsText}>
                            Mostrando <Text style={styles.resultsTextHighlight}>{clasesFiltradas.length}</Text> de {contadores.total} clases
                        </Text>
                    </View>
                )}

                {/* Botón para limpiar filtros */}
                {isFilterActive() && (
                    <View style={styles.clearFiltersContainer}>
                        <TouchableOpacity style={styles.clearFiltersButton} onPress={clearAllFilters}>
                            <MaterialIcons name="clear-all" size={16} color={theme.colors.textSecondary} />
                            <Text style={styles.clearFiltersText}>Limpiar filtros</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <View style={styles.clasesContainer}>
                    {clases.length === 0 ? (
                        <View style={styles.emptyStateContainer}>
                            <MaterialIcons 
                                name="fitness-center" 
                                size={64} 
                                color="#E0E0E0" 
                            />
                            <Text style={styles.emptyStateTitle}>
                                No hay clases creadas
                            </Text>
                            <Text style={styles.emptyStateSubtitle}>
                                Tocá el botón "Nueva Clase" para crear tu primera clase
                            </Text>
                        </View>
                    ) : clasesFiltradas.length === 0 ? (
                        <View style={styles.searchEmptyContainer}>
                            <MaterialIcons 
                                name="search-off" 
                                size={48} 
                                color={theme.colors.textSecondary} 
                            />
                            <Text style={styles.searchEmptyTitle}>
                                No se encontraron clases
                            </Text>
                            <Text style={styles.searchEmptySubtitle}>
                                Intentá ajustar los filtros o el término de búsqueda
                            </Text>
                        </View>
                    ) : (
                        clasesFiltradas.map((clase) => (
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
                                        {Object.entries(clase.diasHorarios).map(([dia, horarios]) => {
                                            const nombreDia = diasSemana.find(d => d.key === dia)?.label;
                                            const cantidadHorarios = horarios.length;
                                            
                                            // Si hay muchos horarios (más de 3), mostrar resumen
                                            if (cantidadHorarios > 3) {
                                                const primerHorario = horarios[0];
                                                const ultimoHorario = horarios[horarios.length - 1];
                                                const horaInicio = primerHorario.split('-')[0];
                                                const horaFin = ultimoHorario.split('-')[1];
                                                
                                                return (
                                                    <View key={dia} style={styles.diaChip}>
                                                        <Text style={styles.diaChipTexto}>
                                                            {nombreDia}: {horaInicio}-{horaFin} ({cantidadHorarios} clases)
                                                        </Text>
                                                    </View>
                                                );
                                            } else {
                                                // Mostrar horarios normalmente si son pocos
                                                return (
                                                    <View key={dia} style={styles.diaChip}>
                                                        <Text style={styles.diaChipTexto}>
                                                            {nombreDia}: {horarios.join(', ')}
                                                        </Text>
                                                    </View>
                                                );
                                            }
                                        })}
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
                                        <MaterialIcons name="delete" size={20} color={theme.colors.textSecondary} />
                                        <Text style={styles.eliminarButtonText}>Eliminar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>

            {/* Botón flotante para agregar nueva clase */}
            <FloatingActionButton 
                onPress={abrirModalNuevaClase}
                showLabel={false}
            />

            {/* Modal para crear/editar clase */}
            <ClassFormModal
                visible={modalVisible}
                onClose={cerrarModal}
                onSave={guardarClase}
                editingClass={editandoClase}
            />
        </View>
    );
}
