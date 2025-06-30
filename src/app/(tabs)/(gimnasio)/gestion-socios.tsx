import React, { useState, useEffect, useMemo } from 'react';
import { 
    View, 
    Text, 
    ScrollView, 
    TouchableOpacity,
    Alert,
    StyleSheet,
    TextInput
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import styles from '../../../styles/gestion-gimnasio';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../hooks/useAuth';
import { ClientUser } from '../../../data/Usuario';
import ClientFormModal from '../../../components/ClientFormModal';
import { 
    getGymClients,
    updateGymClient,
    deleteGymClient
} from '../../../utils/storage';

export default function GestionSocios() {
    const { user } = useAuth();
    const { theme, isDarkMode } = useTheme();
    const [socios, setSocios] = useState<ClientUser[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingClient, setEditingClient] = useState<ClientUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Maneja IDs de clientes con acordeón expandido
    const [expandedClientIds, setExpandedClientIds] = useState<Set<string>>(new Set());

    // Estados para búsqueda y filtros
    const [searchText, setSearchText] = useState('');
    const [searchFocused, setSearchFocused] = useState(false);
    const [filtroEstadoPago, setFiltroEstadoPago] = useState<'todos' | 'al-dia' | 'vencida'>('todos');

    // Clientes de ejemplo para mostrar interfaz más poblada
    const exampleClients: ClientUser[] = [
        {
            id: 'ej_1',
            email: 'juan.perez@example.com',
            password: '',
            role: 'client',
            name: 'Juan Pérez',
            weeklyGoal: 3,
            attendance: [],
            weeklyStreak: 0,
            dni: '30.345.678',
            isPaymentUpToDate: true,
        },
        {
            id: 'ej_2',
            email: 'maria.gonzalez@example.com',
            password: '',
            role: 'client',
            name: 'María González',
            weeklyGoal: 3,
            attendance: [],
            weeklyStreak: 0,
            dni: '27.987.654',
            isPaymentUpToDate: false,
        },
        {
            id: 'ej_3',
            email: 'lucas.fernandez@example.com',
            password: '',
            role: 'client',
            name: 'Lucas Fernández',
            weeklyGoal: 3,
            attendance: [],
            weeklyStreak: 0,
            dni: '38.456.789',
            isPaymentUpToDate: true,
        },
        {
            id: 'ej_4',
            email: 'carolina.ruiz@example.com',
            password: '',
            role: 'client',
            name: 'Carolina Ruiz',
            weeklyGoal: 3,
            attendance: [],
            weeklyStreak: 0,
            dni: '33.123.456',
            isPaymentUpToDate: true,
        },
        {
            id: 'ej_5',
            email: 'diego.navarro@example.com',
            password: '',
            role: 'client',
            name: 'Diego Navarro',
            weeklyGoal: 3,
            attendance: [],
            weeklyStreak: 0,
            dni: '31.654.321',
            isPaymentUpToDate: false,
        }
    ];

    // Cargar socios al montar
    useEffect(() => {
        loadClientsFromStorage();
    }, [user]);

    // Lógica de filtrado usando useMemo para optimizar rendimiento
    const sociosFiltrados = useMemo(() => {
        let resultado = socios;

        // Filtrar por texto de búsqueda
        if (searchText.trim()) {
            const searchLower = searchText.toLowerCase().trim();
            resultado = resultado.filter(socio => 
                socio.name.toLowerCase().includes(searchLower) ||
                socio.email.toLowerCase().includes(searchLower) ||
                (socio.dni && socio.dni.toLowerCase().includes(searchLower))
            );
        }

        // Filtrar por estado de pago
        if (filtroEstadoPago !== 'todos') {
            resultado = resultado.filter(socio => {
                if (filtroEstadoPago === 'al-dia') {
                    return socio.isPaymentUpToDate;
                } else if (filtroEstadoPago === 'vencida') {
                    return !socio.isPaymentUpToDate;
                }
                return true;
            });
        }

        return resultado;
    }, [socios, searchText, filtroEstadoPago]);

    // Contadores para los filtros
    const contadores = useMemo(() => {
        const alDia = socios.filter(s => s.isPaymentUpToDate).length;
        const vencida = socios.filter(s => !s.isPaymentUpToDate).length;
        return { alDia, vencida, total: socios.length };
    }, [socios]);

    const loadClientsFromStorage = async () => {
        if (!user || user.role !== 'gym') {
            setIsLoading(false);
            return;
        }
        try {
            const clients = await getGymClients(user.id);

            // Si no hay clientes guardados, usar ejemplos
            if (clients.length === 0) {
                setSocios(exampleClients);
            } else {
                setSocios([...clients, ...exampleClients]);
            }
        } catch (error) {
            console.error('Error cargando socios:', error);
            Alert.alert('Error', 'No se pudieron cargar los socios');
        } finally {
            setIsLoading(false);
        }
    };

    const abrirModalEditarSocio = (client: ClientUser) => {
        setEditingClient(client);
        setModalVisible(true);
    };

    const cerrarModal = () => {
        setModalVisible(false);
        setEditingClient(null);
    };

    const guardarSocio = async (client: ClientUser) => {
        if (!user || user.role !== 'gym') {
            Alert.alert('Error', 'Usuario no autorizado');
            return;
        }

        if (!editingClient) {
            Alert.alert('Acción no permitida', 'No se pueden crear nuevos socios.');
            cerrarModal();
            return;
        }

        try {
            const success = await updateGymClient(user.id, editingClient.id, client);
            if (success) {
                setSocios(prev => prev.map(c => c.id === editingClient.id ? client : c));
            } else {
                Alert.alert('Error', 'No se pudo actualizar el socio');
            }
        } catch (error) {
            console.error('Error guardando socio:', error);
            Alert.alert('Error', 'Ocurrió un error al guardar el socio');
        }

        cerrarModal();
    };

    const eliminarSocio = (client: ClientUser) => {
        Alert.alert(
            'Confirmar eliminación',
            `¿Estás seguro que querés eliminar al socio "${client.name}"?`,
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
                            const success = await deleteGymClient(user.id, client.id);
                            if (success) {
                                setSocios(prev => prev.filter(s => s.id !== client.id));
                                Alert.alert('Éxito', 'Socio eliminado correctamente');
                            } else {
                                Alert.alert('Error', 'No se pudo eliminar el socio');
                            }
                        } catch (error) {
                            console.error('Error eliminando socio:', error);
                            Alert.alert('Error', 'Ocurrió un error al eliminar el socio');
                        }
                    }
                }
            ]
        );
    };

    const toggleExpand = (clientId: string) => {
        setExpandedClientIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(clientId)) {
                newSet.delete(clientId);
            } else {
                newSet.add(clientId);
            }
            return newSet;
        });
    };

    // Funciones para manejo de búsqueda y filtros
    const handleSearchChange = (text: string) => {
        setSearchText(text);
    };

    const clearSearch = () => {
        setSearchText('');
        setSearchFocused(false);
    };

    const clearAllFilters = () => {
        setSearchText('');
        setFiltroEstadoPago('todos');
        setSearchFocused(false);
    };

    const isFilterActive = () => {
        return searchText.trim() !== '' || filtroEstadoPago !== 'todos';
    };

    // Indicador carga
    if (isLoading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }]}>
                <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Cargando socios...</Text>
            </View>
        );
    }

    // Verificar rol
    if (!user || user.role !== 'gym') {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }]}>
                <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Acceso no autorizado</Text>
                <Text style={[styles.sectionSubtitle, { color: theme.colors.textSecondary }]}>
                    Solo los usuarios de gimnasio pueden gestionar socios
                </Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.headerSection}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Gestión de Socios</Text>
                    <Text style={[styles.sectionSubtitle, { color: theme.colors.textSecondary }]}>
                        Administra los socios de tu gimnasio
                    </Text>
                </View>

                {/* Sección de búsqueda y filtros */}
                <View style={[styles.searchAndFiltersContainer, { backgroundColor: theme.colors.surface }]}>
                    {/* Input de búsqueda */}
                    <View style={styles.searchWrapper}>
                        <View style={[
                            styles.searchContainer, 
                            { 
                                backgroundColor: theme.colors.background,
                                borderColor: isDarkMode ? theme.colors.border : '#E8E8E8',
                                shadowColor: theme.colors.shadowColor,
                            },
                            searchFocused && {
                                borderWidth: 2,
                                borderColor: theme.colors.primary,
                                shadowColor: theme.colors.primary,
                                shadowOffset: { width: 0, height: 6 },
                                shadowOpacity: 0.15,
                                shadowRadius: 12,
                                elevation: 8,
                            }
                        ]}>
                            <MaterialIcons name="search" size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
                            <TextInput
                                style={[styles.searchInput, { color: theme.colors.textPrimary }]}
                                placeholder="Buscar por nombre, email o DNI..."
                                placeholderTextColor={theme.colors.textSecondary}
                                value={searchText}
                                onChangeText={handleSearchChange}
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => setSearchFocused(false)}
                            />
                            {searchText.length > 0 && (
                                <TouchableOpacity onPress={clearSearch} style={[styles.clearSearchButton, { backgroundColor: isDarkMode ? theme.colors.surfaceDark : '#F5F5F5' }]}>
                                    <MaterialIcons name="close" size={18} color={theme.colors.textSecondary} />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    {/* Filtros */}
                    <View style={styles.filtersContainer}>
                        <Text style={[styles.filtersTitle, { color: theme.colors.textSecondary }]}>Filtrar por estado de cuota</Text>
                        <View style={styles.filtersRow}>
                            <TouchableOpacity
                                style={[
                                    styles.filterChip,
                                    { 
                                        backgroundColor: theme.colors.background,
                                        borderColor: isDarkMode ? theme.colors.border : '#E0E0E0',
                                    },
                                    filtroEstadoPago === 'todos' && {
                                        backgroundColor: theme.colors.primary,
                                        borderColor: theme.colors.primary,
                                    }
                                ]}
                                onPress={() => setFiltroEstadoPago('todos')}
                            >
                                <Text style={[
                                    styles.filterChipText,
                                    { color: theme.colors.textSecondary },
                                    filtroEstadoPago === 'todos' && { color: '#FFFFFF' }
                                ]}>
                                    Todos
                                </Text>
                                <Text style={[
                                    styles.filterChipCount,
                                    { 
                                        color: theme.colors.textSecondary,
                                        backgroundColor: isDarkMode ? theme.colors.surfaceDark : '#F0F0F0',
                                    },
                                    filtroEstadoPago === 'todos' && {
                                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                        color: '#FFFFFF',
                                    }
                                ]}>
                                    {contadores.total}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.filterChip,
                                    { 
                                        backgroundColor: theme.colors.background,
                                        borderColor: isDarkMode ? theme.colors.border : '#E0E0E0',
                                    },
                                    filtroEstadoPago === 'al-dia' && {
                                        backgroundColor: theme.colors.primary,
                                        borderColor: theme.colors.primary,
                                    }
                                ]}
                                onPress={() => setFiltroEstadoPago('al-dia')}
                            >
                                <MaterialIcons name="check-circle" size={16} color={
                                    filtroEstadoPago === 'al-dia' ? '#FFFFFF' : theme.colors.success
                                } />
                                <Text style={[
                                    styles.filterChipText,
                                    { color: theme.colors.textSecondary },
                                    filtroEstadoPago === 'al-dia' && { color: '#FFFFFF' }
                                ]}>
                                    Al día
                                </Text>
                                <Text style={[
                                    styles.filterChipCount,
                                    { 
                                        color: theme.colors.textSecondary,
                                        backgroundColor: isDarkMode ? theme.colors.surfaceDark : '#F0F0F0',
                                    },
                                    filtroEstadoPago === 'al-dia' && {
                                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                        color: '#FFFFFF',
                                    }
                                ]}>
                                    {contadores.alDia}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.filterChip,
                                    { 
                                        backgroundColor: theme.colors.background,
                                        borderColor: isDarkMode ? theme.colors.border : '#E0E0E0',
                                    },
                                    filtroEstadoPago === 'vencida' && {
                                        backgroundColor: theme.colors.primary,
                                        borderColor: theme.colors.primary,
                                    }
                                ]}
                                onPress={() => setFiltroEstadoPago('vencida')}
                            >
                                <MaterialIcons name="error" size={16} color={
                                    filtroEstadoPago === 'vencida' ? '#FFFFFF' : '#FF8A80'
                                } />
                                <Text style={[
                                    styles.filterChipText,
                                    { color: theme.colors.textSecondary },
                                    filtroEstadoPago === 'vencida' && { color: '#FFFFFF' }
                                ]}>
                                    Vencida
                                </Text>
                                <Text style={[
                                    styles.filterChipCount,
                                    { 
                                        color: theme.colors.textSecondary,
                                        backgroundColor: isDarkMode ? theme.colors.surfaceDark : '#F0F0F0',
                                    },
                                    filtroEstadoPago === 'vencida' && {
                                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                        color: '#FFFFFF',
                                    }
                                ]}>
                                    {contadores.vencida}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Contador de resultados */}
                {isFilterActive() && (
                    <View style={styles.resultsCounter}>
                        <Text style={[styles.resultsText, { color: theme.colors.textSecondary }]}>
                            Mostrando <Text style={[styles.resultsTextHighlight, { color: theme.colors.primary }]}>{sociosFiltrados.length}</Text> de {contadores.total} socios
                        </Text>
                    </View>
                )}

                {/* Botón para limpiar filtros */}
                {isFilterActive() && (
                    <View style={styles.clearFiltersContainer}>
                        <TouchableOpacity 
                            style={[styles.clearFiltersButton, { backgroundColor: isDarkMode ? theme.colors.surfaceDark : '#F8F8F8' }]} 
                            onPress={clearAllFilters}
                        >
                            <MaterialIcons name="clear-all" size={16} color={theme.colors.textSecondary} />
                            <Text style={[styles.clearFiltersText, { color: theme.colors.textSecondary }]}>Limpiar filtros</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <View style={[styles.clasesContainer, { marginTop: 16 }]}>
                    {socios.length === 0 ? (
                        <View style={styles.emptyStateContainer}>
                            <MaterialIcons 
                                name="people-outline" 
                                size={64} 
                                color={isDarkMode ? '#404040' : '#E0E0E0'} 
                            />
                            <Text style={[styles.emptyStateTitle, { color: theme.colors.textSecondary }]}>
                                    No hay socios asociados todavía
                            </Text>
                            <Text style={[styles.emptyStateSubtitle, { color: theme.colors.textSecondary }]}>
                                    Los socios se crean cuando se registran en tu gimnasio.
                            </Text>
                        </View>
                    ) : sociosFiltrados.length === 0 ? (
                        <View style={styles.searchEmptyContainer}>
                            <MaterialIcons 
                                name="search-off" 
                                size={48} 
                                color={theme.colors.textSecondary} 
                            />
                            <Text style={[styles.searchEmptyTitle, { color: theme.colors.textSecondary }]}>
                                No se encontraron socios
                            </Text>
                            <Text style={[styles.searchEmptySubtitle, { color: theme.colors.textSecondary }]}>
                                Intentá ajustar los filtros o el término de búsqueda
                            </Text>
                        </View>
                    ) : (
                        sociosFiltrados.map(client => {
                            const isExpanded = expandedClientIds.has(client.id);
                            return (
                                <View key={client.id} style={[styles.claseCard, { 
                                    backgroundColor: isDarkMode ? theme.colors.surface : theme.colors.background,
                                    shadowColor: theme.colors.shadowColor,
                                }]}>
                                    {/* Cabecera del acordeón - más compacta */}
                                    <TouchableOpacity
                                        style={[localStyles.accordionHeader, { backgroundColor: isDarkMode ? theme.colors.surface : theme.colors.background }]}
                                        onPress={() => toggleExpand(client.id)}
                                        activeOpacity={0.7}
                                    >
                                        <View style={styles.claseInfo}>
                                            <Text style={[localStyles.clientName, { color: theme.colors.textPrimary }]}>{client.name}</Text>
                                        </View>
                                        
                                        <View style={[
                                            styles.estadoBadge, 
                                            client.isPaymentUpToDate ? styles.estadoActivo : localStyles.estadoVencido
                                        ]}>
                                            <Text style={[
                                                styles.estadoTexto, 
                                                client.isPaymentUpToDate ? styles.estadoTextoActivo : localStyles.estadoTextoVencido
                                            ]}>
                                                {client.isPaymentUpToDate ? 'Al día' : 'Vencida'}
                                            </Text>
                                        </View>
                                        
                                        <MaterialIcons 
                                            name={isExpanded ? 'expand-less' : 'expand-more'} 
                                            size={24} 
                                            color={theme.colors.textSecondary} 
                                        />
                                    </TouchableOpacity>

                                    {/* Contenido expandido - información adicional y botones */}
                                    {isExpanded && (
                                        <>
                                            <View style={[localStyles.expandedInfo, { backgroundColor: isDarkMode ? theme.colors.surfaceLight : '#FAFAFA' }]}>
                                                <View style={[styles.metadataItem, localStyles.expandedItem]}>
                                                    <MaterialIcons name="email" size={16} color={theme.colors.textSecondary} />
                                                    <Text style={[styles.metadataText, { color: theme.colors.textSecondary }]}>{client.email}</Text>
                                                </View>
                                                <View style={[styles.metadataItem, localStyles.expandedItem]}>
                                                    <MaterialIcons name="badge" size={16} color={theme.colors.textSecondary} />
                                                    <Text style={[styles.metadataText, { color: theme.colors.textSecondary }]}>DNI: {client.dni || 'No especificado'}</Text>
                                                </View>
                                            </View>
                                            <View style={styles.accionesContainer}>
                                                <TouchableOpacity 
                                                    style={[styles.accionButton, styles.editarButton]}
                                                    onPress={() => abrirModalEditarSocio(client)}
                                                >
                                                    <MaterialIcons name="edit" size={20} color="#FFFFFF" />
                                                    <Text style={styles.accionButtonText}>Editar</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity 
                                                    style={[styles.accionButton, styles.eliminarButton, { backgroundColor: theme.colors.surface }]}
                                                    onPress={() => eliminarSocio(client)}
                                                >
                                                    <MaterialIcons name="delete" size={20} color={theme.colors.textSecondary} />
                                                    <Text style={[styles.eliminarButtonText, { color: theme.colors.textSecondary }]}>Eliminar</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </>
                                    )}
                                </View>
                            );
                        })
                    )}
                </View>
            </ScrollView>

            {/* Modal */}
            <ClientFormModal 
                visible={modalVisible}
                onClose={cerrarModal}
                onSave={guardarSocio}
                editingClient={editingClient}
            />
        </View>
    );
}

// === Estilos locales para la vista de socios ===
const localStyles = StyleSheet.create({
    accordionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    clientName: {
        fontSize: 14,
        fontFamily: 'Roboto-Bold',
    },
    expandedInfo: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        gap: 16,
    },
    expandedItem: {
        marginBottom: 8,
    },
    estadoVencido: {
        backgroundColor: '#FFCDD2', // Rojo pastel
    },
    estadoTextoVencido: {
        color: '#C62828', // Texto rojo oscuro para contraste
    },
});
