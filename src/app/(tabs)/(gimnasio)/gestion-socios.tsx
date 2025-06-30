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
import theme from '../../../constants/theme';
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
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={styles.sectionTitle}>Cargando socios...</Text>
            </View>
        );
    }

    // Verificar rol
    if (!user || user.role !== 'gym') {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={styles.sectionTitle}>Acceso no autorizado</Text>
                <Text style={styles.sectionSubtitle}>
                    Solo los usuarios de gimnasio pueden gestionar socios
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.headerSection}>
                    <Text style={styles.sectionTitle}>Gestión de Socios</Text>
                    <Text style={styles.sectionSubtitle}>
                        Administra los socios de tu gimnasio
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
                                placeholder="Buscar por nombre, email o DNI..."
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

                    {/* Filtros */}
                    <View style={styles.filtersContainer}>
                        <Text style={styles.filtersTitle}>Filtrar por estado de cuota</Text>
                        <View style={styles.filtersRow}>
                            <TouchableOpacity
                                style={[
                                    styles.filterChip,
                                    filtroEstadoPago === 'todos' && styles.filterChipActive
                                ]}
                                onPress={() => setFiltroEstadoPago('todos')}
                            >
                                <Text style={[
                                    styles.filterChipText,
                                    filtroEstadoPago === 'todos' && styles.filterChipTextActive
                                ]}>
                                    Todos
                                </Text>
                                <Text style={[
                                    styles.filterChipCount,
                                    filtroEstadoPago === 'todos' && styles.filterChipCountActive
                                ]}>
                                    {contadores.total}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.filterChip,
                                    filtroEstadoPago === 'al-dia' && styles.filterChipActive
                                ]}
                                onPress={() => setFiltroEstadoPago('al-dia')}
                            >
                                <MaterialIcons name="check-circle" size={16} color={
                                    filtroEstadoPago === 'al-dia' ? '#FFFFFF' : theme.colors.success
                                } />
                                <Text style={[
                                    styles.filterChipText,
                                    filtroEstadoPago === 'al-dia' && styles.filterChipTextActive
                                ]}>
                                    Al día
                                </Text>
                                <Text style={[
                                    styles.filterChipCount,
                                    filtroEstadoPago === 'al-dia' && styles.filterChipCountActive
                                ]}>
                                    {contadores.alDia}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.filterChip,
                                    filtroEstadoPago === 'vencida' && styles.filterChipActive
                                ]}
                                onPress={() => setFiltroEstadoPago('vencida')}
                            >
                                <MaterialIcons name="error" size={16} color={
                                    filtroEstadoPago === 'vencida' ? '#FFFFFF' : '#FF8A80'
                                } />
                                <Text style={[
                                    styles.filterChipText,
                                    filtroEstadoPago === 'vencida' && styles.filterChipTextActive
                                ]}>
                                    Vencida
                                </Text>
                                <Text style={[
                                    styles.filterChipCount,
                                    filtroEstadoPago === 'vencida' && styles.filterChipCountActive
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
                        <Text style={styles.resultsText}>
                            Mostrando <Text style={styles.resultsTextHighlight}>{sociosFiltrados.length}</Text> de {contadores.total} socios
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
                    {socios.length === 0 ? (
                        <View style={styles.emptyStateContainer}>
                            <MaterialIcons 
                                name="people-outline" 
                                size={64} 
                                color="#E0E0E0" 
                            />
                            <Text style={styles.emptyStateTitle}>
                                    No hay socios asociados todavía
                            </Text>
                            <Text style={styles.emptyStateSubtitle}>
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
                            <Text style={styles.searchEmptyTitle}>
                                No se encontraron socios
                            </Text>
                            <Text style={styles.searchEmptySubtitle}>
                                Intentá ajustar los filtros o el término de búsqueda
                            </Text>
                        </View>
                    ) : (
                        sociosFiltrados.map(client => {
                            const isExpanded = expandedClientIds.has(client.id);
                            return (
                                <View key={client.id} style={styles.claseCard}>
                                    {/* Cabecera del acordeón - más compacta */}
                                    <TouchableOpacity
                                        style={localStyles.accordionHeader}
                                        onPress={() => toggleExpand(client.id)}
                                        activeOpacity={0.7}
                                    >
                                        <View style={styles.claseInfo}>
                                            <Text style={localStyles.clientName}>{client.name}</Text>
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
                                            <View style={localStyles.expandedInfo}>
                                                <View style={[styles.metadataItem, localStyles.expandedItem]}>
                                                    <MaterialIcons name="email" size={16} color={theme.colors.textSecondary} />
                                                    <Text style={styles.metadataText}>{client.email}</Text>
                                                </View>
                                                <View style={[styles.metadataItem, localStyles.expandedItem]}>
                                                    <MaterialIcons name="badge" size={16} color={theme.colors.textSecondary} />
                                                    <Text style={styles.metadataText}>DNI: {client.dni || 'No especificado'}</Text>
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
                                                    style={[styles.accionButton, styles.eliminarButton]}
                                                    onPress={() => eliminarSocio(client)}
                                                >
                                                    <MaterialIcons name="delete" size={20} color={theme.colors.textSecondary} />
                                                    <Text style={styles.eliminarButtonText}>Eliminar</Text>
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
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        backgroundColor: theme.colors.background,
    },
    clientName: {
        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily.bold,
        color: theme.colors.textPrimary,
    },
    expandedInfo: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.md,
        backgroundColor: '#FAFAFA',
        gap: theme.spacing.md,
    },
    expandedItem: {
        marginBottom: theme.spacing.sm,
    },
    estadoVencido: {
        backgroundColor: '#FFCDD2', // Rojo pastel
    },
    estadoTextoVencido: {
        color: '#C62828', // Texto rojo oscuro para contraste
    },
});
