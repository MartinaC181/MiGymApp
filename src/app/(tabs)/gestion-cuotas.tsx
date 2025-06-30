import React, { useState, useEffect, useMemo } from 'react';
import { 
    View, 
    Text, 
    ScrollView, 
    TouchableOpacity,
    Alert,
    StyleSheet,
    TextInput,
    Modal,
    ActivityIndicator
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { createGestionGimnasioStyles } from '../../styles/gestion-gimnasio';
import { useAuth } from '../../hooks/useAuth';
import { 
    getGymQuotaSettings,
    updateGymQuotaSettings,
    getGymPaymentHistory,
    getGymPaymentsSummary
} from '../../utils/storage';
import { SafeAreaView } from 'react-native-safe-area-context';

interface PaymentRecord {
    id: string;
    clientId: string;
    clientName: string;
    clientEmail: string;
    clientDni: string;
    monto: number;
    fechaPago: string;
    metodoPago: string;
    numeroFactura: string;
    periodo: string;
    estado: string;
}

export default function GestionCuotas() {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [quotaSettings, setQuotaSettings] = useState<any>(null);
    const [paymentHistory, setPaymentHistory] = useState<PaymentRecord[]>([]);
    const [paymentsSummary, setPaymentsSummary] = useState<any>(null);

    // Estados para el modal de edición de monto
    const [editingQuota, setEditingQuota] = useState(false);
    const [newAmount, setNewAmount] = useState('');
    const [newDescription, setNewDescription] = useState('');

    // Estados para acordeón de pagos
    const [expandedPaymentIds, setExpandedPaymentIds] = useState<Set<string>>(new Set());

    // Estados para búsqueda y filtros
    const [searchText, setSearchText] = useState('');
    const [searchFocused, setSearchFocused] = useState(false);
    const [filtroEstado, setFiltroEstado] = useState<'todos' | 'completados' | 'pendientes'>('todos');

    // Estados del modal de edición
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [saving, setSaving] = useState(false);

    // Datos de ejemplo para mostrar interfaz poblada
    const examplePayments: PaymentRecord[] = [
        {
            id: 'pago_1',
            clientId: 'ej_1',
            clientName: 'Juan Pérez',
            clientEmail: 'juan.perez@example.com',
            clientDni: '30.345.678',
            monto: 10213.89,
            fechaPago: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            metodoPago: 'Mercado Pago',
            numeroFactura: '#2024-001',
            periodo: 'Enero 2024',
            estado: 'completado'
        },
        {
            id: 'pago_2',
            clientId: 'ej_3',
            clientName: 'Lucas Fernández',
            clientEmail: 'lucas.fernandez@example.com',
            clientDni: '38.456.789',
            monto: 10213.89,
            fechaPago: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
            metodoPago: 'Tarjeta de crédito',
            numeroFactura: '#2024-002',
            periodo: 'Enero 2024',
            estado: 'completado'
        },
        {
            id: 'pago_3',
            clientId: 'ej_4',
            clientName: 'Carolina Ruiz',
            clientEmail: 'carolina.ruiz@example.com',
            clientDni: '33.123.456',
            monto: 10213.89,
            fechaPago: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
            metodoPago: 'Mercado Pago',
            numeroFactura: '#2024-003',
            periodo: 'Diciembre 2023',
            estado: 'completado'
        }
    ];

    // === Tema dinámico ===
    const { theme } = useTheme();
    const styles = useMemo(() => createGestionGimnasioStyles(theme), [theme]);

    // Estilos locales dependientes del tema
    const localStyles = useMemo(() => StyleSheet.create({
        quotaAmountContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: theme.spacing.md,
            paddingVertical: theme.spacing.xs,
        },
        quotaAmountValue: {
            fontSize: theme.typography.fontSize.display,
            fontFamily: theme.typography.fontFamily.bold,
            color: theme.colors.primary,
        },
        quotaDescriptionValue: {
            fontSize: theme.typography.fontSize.medium,
            fontFamily: theme.typography.fontFamily.regular,
            color: theme.colors.textPrimary,
        },
        editQuotaButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors.primary,
            borderRadius: theme.borderRadius.md,
            paddingVertical: theme.spacing.sm,
            gap: theme.spacing.xs,
        },
        editQuotaButtonText: {
            fontSize: theme.typography.fontSize.medium,
            fontFamily: theme.typography.fontFamily.medium,
            color: '#FFFFFF',
        },
        summaryGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: theme.spacing.sm,
        },
        summaryCard: {
            flex: 1,
            minWidth: '45%',
            backgroundColor: theme.colors.surface,
            borderRadius: theme.borderRadius.md,
            padding: theme.spacing.md,
            alignItems: 'center',
            gap: theme.spacing.xs,
        },
        summaryCardValue: {
            fontSize: theme.typography.fontSize.medium,
            fontFamily: theme.typography.fontFamily.bold,
            color: theme.colors.textPrimary,
        },
        summaryCardLabel: {
            fontSize: theme.typography.fontSize.small,
            fontFamily: theme.typography.fontFamily.regular,
            color: theme.colors.textSecondary,
            textAlign: 'center',
        },
        accordionHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: theme.spacing.sm,
            paddingHorizontal: theme.spacing.md,
            backgroundColor: theme.colors.background,
        },
        paymentClientName: {
            fontSize: theme.typography.fontSize.medium,
            fontFamily: theme.typography.fontFamily.bold,
            color: theme.colors.textPrimary,
        },
        paymentAmount: {
            fontSize: theme.typography.fontSize.small,
            fontFamily: theme.typography.fontFamily.medium,
            color: theme.colors.primary,
            marginTop: 2,
        },
        paymentStatus: {
            alignItems: 'flex-end',
            gap: theme.spacing.xs,
        },
        paymentDate: {
            fontSize: theme.typography.fontSize.small,
            fontFamily: theme.typography.fontFamily.regular,
            color: theme.colors.textSecondary,
        },
        estadoPendiente: {
            backgroundColor: '#FFF3E0',
        },
        estadoTextoPendiente: {
            color: '#F57C00',
        },
        expandedInfo: {
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.md,
            backgroundColor: theme.colors.surfaceLight ?? '#FAFAFA',
            gap: theme.spacing.sm,
        },
        expandedRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing.sm,
        },
        expandedLabel: {
            fontSize: theme.typography.fontSize.small,
            fontFamily: theme.typography.fontFamily.medium,
            color: theme.colors.textSecondary,
            minWidth: 60,
        },
        expandedValue: {
            fontSize: theme.typography.fontSize.small,
            fontFamily: theme.typography.fontFamily.regular,
            color: theme.colors.textPrimary,
            flex: 1,
        },
        quotaSearchAndFiltersContainer: {
            paddingTop: theme.spacing.sm,
            paddingBottom: theme.spacing.md,
            backgroundColor: theme.colors.surface,
        },
        quotaSearchWrapper: {
            position: 'relative',
            marginBottom: theme.spacing.md,
            width: '100%',
            paddingHorizontal: theme.spacing.lg,
        },
        quotaFiltersContainer: {
            marginBottom: theme.spacing.sm,
            paddingHorizontal: theme.spacing.lg,
        },
        quotaResultsCounter: {
            paddingBottom: theme.spacing.sm,
            paddingHorizontal: theme.spacing.lg,
        },
        quotaClearFiltersContainer: {
            marginBottom: theme.spacing.sm,
            paddingHorizontal: theme.spacing.lg,
        },
        quotaHistoryTitle: {
            fontSize: theme.typography.fontSize.title,
            fontFamily: theme.typography.fontFamily.bold,
            color: theme.colors.textPrimary,
            marginTop: theme.spacing.md,
            marginBottom: theme.spacing.md,
            paddingHorizontal: theme.spacing.lg,
        },
        quotaPaymentsContainer: {
            paddingHorizontal: theme.spacing.lg,
            paddingBottom: 120,
        },
        quotaPaymentCard: {
            backgroundColor: theme.colors.background,
            borderRadius: theme.borderRadius.lg,
            marginBottom: theme.spacing.md,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
            overflow: 'hidden',
        },
        headerSectionOverride: {
            paddingTop: theme.spacing.lg,
            paddingBottom: theme.spacing.sm,
        },
        clasesContainerOverride: {
            paddingBottom: theme.spacing.sm,
        },
    }), [theme]);

    useEffect(() => {
        loadQuotaData();
    }, [user]);

    // Lógica de filtrado usando useMemo para optimizar rendimiento
    const pagosFiltrados = useMemo(() => {
        let resultado = paymentHistory;

        // Filtrar por texto de búsqueda
        if (searchText.trim()) {
            const searchLower = searchText.toLowerCase().trim();
            resultado = resultado.filter(pago => 
                pago.clientName.toLowerCase().includes(searchLower) ||
                pago.clientEmail.toLowerCase().includes(searchLower) ||
                pago.clientDni.toLowerCase().includes(searchLower) ||
                pago.numeroFactura.toLowerCase().includes(searchLower)
            );
        }

        // Filtrar por estado
        if (filtroEstado !== 'todos') {
            resultado = resultado.filter(pago => {
                if (filtroEstado === 'completados') {
                    return pago.estado === 'completado';
                } else if (filtroEstado === 'pendientes') {
                    return pago.estado === 'pendiente';
                }
                return true;
            });
        }

        return resultado;
    }, [paymentHistory, searchText, filtroEstado]);

    // Contadores para los filtros
    const contadores = useMemo(() => {
        const completados = paymentHistory.filter(p => p.estado === 'completado').length;
        const pendientes = paymentHistory.filter(p => p.estado === 'pendiente').length;
        return { completados, pendientes, total: paymentHistory.length };
    }, [paymentHistory]);

    const loadQuotaData = async () => {
        if (!user || user.role !== 'gym') {
            setIsLoading(false);
            return;
        }

        try {
            // Cargar configuración de cuota
            const quota = await getGymQuotaSettings(user.id);
            setQuotaSettings(quota);

            // Cargar historial de pagos
            const history = await getGymPaymentHistory(user.id);
            
            // Si no hay pagos guardados, usar ejemplos
            if (history.length === 0) {
                setPaymentHistory(examplePayments);
            } else {
                setPaymentHistory([...history, ...examplePayments]);
            }

            // Cargar resumen de pagos
            const summary = await getGymPaymentsSummary(user.id);
            setPaymentsSummary(summary);

        } catch (error) {
            console.error('Error cargando datos de cuotas:', error);
            Alert.alert('Error', 'No se pudieron cargar los datos de cuotas');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditQuota = () => {
        if (quotaSettings) {
            setNewAmount(quotaSettings.monto.toString());
            setNewDescription(quotaSettings.descripcion);
            setEditModalVisible(true);
        }
    };

    const handleUpdateQuota = async () => {
        if (!user || user.role !== 'gym') {
            Alert.alert('Error', 'Usuario no autorizado');
            return;
        }

        const amount = parseFloat(newAmount);
        if (isNaN(amount) || amount <= 0) {
            Alert.alert('Error', 'Por favor ingresa un monto válido');
            return;
        }

        if (!newDescription.trim()) {
            Alert.alert('Error', 'La descripción es obligatoria');
            return;
        }

        setSaving(true);
        try {
            const updatedSettings = {
                monto: amount,
                descripcion: newDescription.trim(),
            };

            const success = await updateGymQuotaSettings(user.id, updatedSettings);
            if (success) {
                setQuotaSettings(updatedSettings);
                setEditModalVisible(false);
                setNewAmount('');
                setNewDescription('');
                Alert.alert('Éxito', 'Configuración de cuota actualizada correctamente');
                
                // Recargar datos
                loadQuotaData();
            } else {
                Alert.alert('Error', 'No se pudo actualizar la configuración');
            }
        } catch (error) {
            console.error('Error actualizando cuota:', error);
            Alert.alert('Error', 'Ocurrió un error al actualizar la cuota');
        } finally {
            setSaving(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return `$${amount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;
    };

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch (error) {
            return 'Fecha inválida';
        }
    };

    const toggleExpandPayment = (paymentId: string) => {
        setExpandedPaymentIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(paymentId)) {
                newSet.delete(paymentId);
            } else {
                newSet.add(paymentId);
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
        setFiltroEstado('todos');
        setSearchFocused(false);
    };

    const isFilterActive = () => {
        return searchText.trim() !== '' || filtroEstado !== 'todos';
    };

    // Mostrar indicador de carga
    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                    <Text style={styles.loadingText}>Cargando gestión de cuotas...</Text>
                </View>
            </SafeAreaView>
        );
    }

    // Verificar que el usuario sea de tipo gimnasio
    if (!user || user.role !== 'gym') {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={styles.sectionTitle}>Acceso no autorizado</Text>
                <Text style={styles.sectionSubtitle}>
                    Solo los usuarios de gimnasio pueden gestionar cuotas
                </Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['right', 'bottom', 'left']}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={[styles.headerSection, localStyles.headerSectionOverride]}>
                    <Text style={styles.sectionTitle}>Gestión de Cuotas</Text>
                    <Text style={styles.sectionSubtitle}>
                        Administra los precios y visualiza el historial de pagos de tus socios
                    </Text>
                </View>

                {/* Sección de configuración de cuota */}
                <View style={[styles.clasesContainer, localStyles.clasesContainerOverride]}>
                    <View style={styles.claseCard}>
                        <View style={styles.claseHeader}>
                            <View style={styles.claseInfo}>
                                <Text style={styles.claseNombre}>Configuración de Cuota</Text>
                                <Text style={styles.claseDescripcion}>
                                    Configura el monto y descripción de la cuota mensual que se aplicará a todos los socios.
                                </Text>
                            </View>
                        </View>
                        
                        <View style={[styles.horariosResumen, { paddingTop: theme.spacing.md }]}>
                            {quotaSettings ? (
                                <>
                                    <View style={localStyles.quotaAmountContainer}>
                                        <Text style={styles.horariosLabel}>Monto actual</Text>
                                        <Text style={localStyles.quotaAmountValue}>
                                            {formatCurrency(quotaSettings.monto)}
                                        </Text>
                                    </View>
                                    
                                    <View style={{ marginBottom: theme.spacing.md }}>
                                        <Text style={styles.horariosLabel}>Descripción</Text>
                                        <Text style={localStyles.quotaDescriptionValue}>
                                            {quotaSettings.descripcion}
                                        </Text>
                                    </View>
                                    
                                    <TouchableOpacity 
                                        style={localStyles.editQuotaButton}
                                        onPress={handleEditQuota}
                                    >
                                        <MaterialIcons name="edit" size={20} color="#FFFFFF" />
                                        <Text style={localStyles.editQuotaButtonText}>Editar Configuración</Text>
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <View style={styles.emptyStateContainer}>
                                    <MaterialIcons name="settings" size={48} color={theme.colors.textSecondary} />
                                    <Text style={styles.emptyStateTitle}>Sin configuración</Text>
                                    <Text style={styles.emptyStateSubtitle}>
                                        Configura el monto de la cuota mensual para empezar
                                    </Text>
                                    <TouchableOpacity 
                                        style={[styles.primaryButton, { marginTop: theme.spacing.lg }]}
                                        onPress={handleEditQuota}
                                    >
                                        <MaterialIcons name="add" size={20} color="#FFFFFF" />
                                        <Text style={styles.primaryButtonText}>Configurar Cuota</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Resumen de pagos */}
                    {paymentsSummary && (
                        <View style={[styles.claseCard, { marginBottom: theme.spacing.lg }]}>
                            <View style={styles.claseHeader}>
                                <View style={styles.claseInfo}>
                                    <Text style={styles.claseNombre}>Resumen de Pagos</Text>
                                </View>
                            </View>
                            <View style={styles.horariosResumen}>
                                <View style={localStyles.summaryGrid}>
                                    <View style={localStyles.summaryCard}>
                                        <MaterialIcons name="people" size={20} color={theme.colors.primary} />
                                        <Text style={localStyles.summaryCardValue}>{paymentsSummary.totalClientes}</Text>
                                        <Text style={localStyles.summaryCardLabel}>Total Clientes</Text>
                                    </View>
                                    
                                    <View style={localStyles.summaryCard}>
                                        <MaterialIcons name="trending-up" size={20} color={theme.colors.success} />
                                        <Text style={localStyles.summaryCardValue}>
                                            {formatCurrency(paymentsSummary.totalRecaudado)}
                                        </Text>
                                        <Text style={localStyles.summaryCardLabel}>Recaudado</Text>
                                    </View>
                                    
                                    <View style={localStyles.summaryCard}>
                                        <MaterialIcons name="schedule" size={20} color="#FFA726" />
                                        <Text style={localStyles.summaryCardValue}>
                                            {formatCurrency(paymentsSummary.pagosPendientes)}
                                        </Text>
                                        <Text style={localStyles.summaryCardLabel}>Pendientes</Text>
                                    </View>
                                    
                                    <View style={localStyles.summaryCard}>
                                        <MaterialIcons name="check-circle" size={20} color={theme.colors.success} />
                                        <Text style={localStyles.summaryCardValue}>{paymentsSummary.pagosCompletados}</Text>
                                        <Text style={localStyles.summaryCardLabel}>Completados</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )}
                </View>

                    {/* Sección de búsqueda y filtros - ancho completo */}
                    <View style={localStyles.quotaSearchAndFiltersContainer}>
                        {/* Input de búsqueda */}
                        <View style={localStyles.quotaSearchWrapper}>
                            <View style={[
                                styles.searchContainer, 
                                searchFocused && styles.searchContainerFocused
                            ]}>
                                <MaterialIcons name="search" size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
                                <TextInput
                                    style={styles.searchInput}
                                    placeholder="Buscar por cliente, email, DNI o factura..."
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
                        <View style={localStyles.quotaFiltersContainer}>
                            <Text style={styles.filtersTitle}>Filtrar por estado</Text>
                            <View style={styles.filtersRow}>
                                <TouchableOpacity
                                    style={[
                                        styles.filterChip,
                                        filtroEstado === 'todos' && styles.filterChipActive
                                    ]}
                                    onPress={() => setFiltroEstado('todos')}
                                >
                                    <Text style={[
                                        styles.filterChipText,
                                        filtroEstado === 'todos' && styles.filterChipTextActive
                                    ]}>
                                        Todos
                                    </Text>
                                    <Text style={[
                                        styles.filterChipCount,
                                        filtroEstado === 'todos' && styles.filterChipCountActive
                                    ]}>
                                        {contadores.total}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.filterChip,
                                        filtroEstado === 'completados' && styles.filterChipActive
                                    ]}
                                    onPress={() => setFiltroEstado('completados')}
                                >
                                    <MaterialIcons name="check-circle" size={16} color={
                                        filtroEstado === 'completados' ? '#FFFFFF' : theme.colors.success
                                    } />
                                    <Text style={[
                                        styles.filterChipText,
                                        filtroEstado === 'completados' && styles.filterChipTextActive
                                    ]}>
                                        Completados
                                    </Text>
                                    <Text style={[
                                        styles.filterChipCount,
                                        filtroEstado === 'completados' && styles.filterChipCountActive
                                    ]}>
                                        {contadores.completados}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.filterChip,
                                        filtroEstado === 'pendientes' && styles.filterChipActive
                                    ]}
                                    onPress={() => setFiltroEstado('pendientes')}
                                >
                                    <MaterialIcons name="schedule" size={16} color={
                                        filtroEstado === 'pendientes' ? '#FFFFFF' : '#FFA726'
                                    } />
                                    <Text style={[
                                        styles.filterChipText,
                                        filtroEstado === 'pendientes' && styles.filterChipTextActive
                                    ]}>
                                        Pendientes
                                    </Text>
                                    <Text style={[
                                        styles.filterChipCount,
                                        filtroEstado === 'pendientes' && styles.filterChipCountActive
                                    ]}>
                                        {contadores.pendientes}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Contador de resultados */}
                        {isFilterActive() && (
                            <View style={localStyles.quotaResultsCounter}>
                                <Text style={styles.resultsText}>
                                    Mostrando <Text style={styles.resultsTextHighlight}>{pagosFiltrados.length}</Text> de {contadores.total} pagos
                                </Text>
                            </View>
                        )}

                        {/* Botón para limpiar filtros */}
                        {isFilterActive() && (
                            <View style={localStyles.quotaClearFiltersContainer}>
                                <TouchableOpacity style={styles.clearFiltersButton} onPress={clearAllFilters}>
                                    <MaterialIcons name="clear-all" size={16} color={theme.colors.textSecondary} />
                                    <Text style={styles.clearFiltersText}>Limpiar filtros</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* Título del historial */}
                        <Text style={localStyles.quotaHistoryTitle}>
                            Historial de Pagos
                        </Text>
                    </View>

                    {/* Contenedor de acordeones de pagos - ancho completo */}
                    <View style={localStyles.quotaPaymentsContainer}>
                    
                    {paymentHistory.length === 0 ? (
                        <View style={styles.emptyStateContainer}>
                            <MaterialIcons 
                                name="payment" 
                                size={64} 
                                color="#E0E0E0" 
                            />
                            <Text style={styles.emptyStateTitle}>
                                No hay pagos registrados
                            </Text>
                            <Text style={styles.emptyStateSubtitle}>
                                Los pagos aparecerán aquí cuando los clientes realicen sus pagos
                            </Text>
                        </View>
                    ) : pagosFiltrados.length === 0 ? (
                        <View style={styles.searchEmptyContainer}>
                            <MaterialIcons 
                                name="search-off" 
                                size={48} 
                                color={theme.colors.textSecondary} 
                            />
                            <Text style={styles.searchEmptyTitle}>
                                No se encontraron pagos
                            </Text>
                            <Text style={styles.searchEmptySubtitle}>
                                Intentá ajustar los filtros o el término de búsqueda
                            </Text>
                        </View>
                    ) : (
                        pagosFiltrados.map(pago => {
                            const isExpanded = expandedPaymentIds.has(pago.id);
                            return (
                                <View key={pago.id} style={localStyles.quotaPaymentCard}>
                                    {/* Cabecera del acordeón */}
                                    <TouchableOpacity
                                        style={localStyles.accordionHeader}
                                        onPress={() => toggleExpandPayment(pago.id)}
                                        activeOpacity={0.7}
                                    >
                                        <View style={styles.claseInfo}>
                                            <Text style={localStyles.paymentClientName}>{pago.clientName}</Text>
                                            <Text style={localStyles.paymentAmount}>
                                                {formatCurrency(pago.monto)}
                                            </Text>
                                        </View>
                                        
                                        <View style={localStyles.paymentStatus}>
                                            <Text style={localStyles.paymentDate}>
                                                {formatDate(pago.fechaPago)}
                                            </Text>
                                            <View style={[
                                                styles.estadoBadge,
                                                pago.estado === 'completado' ? styles.estadoActivo : localStyles.estadoPendiente
                                            ]}>
                                                <Text style={[
                                                    styles.estadoTexto,
                                                    pago.estado === 'completado' ? styles.estadoTextoActivo : localStyles.estadoTextoPendiente
                                                ]}>
                                                    {pago.estado === 'completado' ? 'Completado' : 'Pendiente'}
                                                </Text>
                                            </View>
                                        </View>
                                        
                                        <MaterialIcons 
                                            name={isExpanded ? 'expand-less' : 'expand-more'} 
                                            size={24} 
                                            color={theme.colors.textSecondary} 
                                        />
                                    </TouchableOpacity>

                                    {/* Contenido expandido */}
                                    {isExpanded && (
                                        <View style={localStyles.expandedInfo}>
                                            <View style={localStyles.expandedRow}>
                                                <MaterialIcons name="email" size={16} color={theme.colors.textSecondary} />
                                                <Text style={localStyles.expandedLabel}>Email:</Text>
                                                <Text style={localStyles.expandedValue}>{pago.clientEmail}</Text>
                                            </View>
                                            
                                            <View style={localStyles.expandedRow}>
                                                <MaterialIcons name="badge" size={16} color={theme.colors.textSecondary} />
                                                <Text style={localStyles.expandedLabel}>DNI:</Text>
                                                <Text style={localStyles.expandedValue}>{pago.clientDni}</Text>
                                            </View>
                                            
                                            <View style={localStyles.expandedRow}>
                                                <MaterialIcons name="receipt" size={16} color={theme.colors.textSecondary} />
                                                <Text style={localStyles.expandedLabel}>Factura:</Text>
                                                <Text style={localStyles.expandedValue}>{pago.numeroFactura}</Text>
                                            </View>
                                            
                                            <View style={localStyles.expandedRow}>
                                                <MaterialIcons name="payment" size={16} color={theme.colors.textSecondary} />
                                                <Text style={localStyles.expandedLabel}>Método:</Text>
                                                <Text style={localStyles.expandedValue}>{pago.metodoPago}</Text>
                                            </View>
                                            
                                            <View style={localStyles.expandedRow}>
                                                <MaterialIcons name="date-range" size={16} color={theme.colors.textSecondary} />
                                                <Text style={localStyles.expandedLabel}>Período:</Text>
                                                <Text style={localStyles.expandedValue}>{pago.periodo}</Text>
                                            </View>
                                        </View>
                                    )}
                                </View>
                            );
                        })
                    )}
                </View>
            </ScrollView>
            
            {/* Modal de edición */}
            <Modal
                visible={editModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => !saving && setEditModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitleCentered}>
                            {quotaSettings ? 'Editar Configuración' : 'Configurar Cuota'}
                        </Text>
                        
                        <View style={styles.inputContainer}>
                            <Text style={styles.baseInputLabel}>Monto de la cuota *</Text>
                            <TextInput
                                style={styles.whiteInput}
                                value={newAmount}
                                onChangeText={setNewAmount}
                                placeholder="Ej: 15000"
                                placeholderTextColor={theme.colors.textSecondary}
                                keyboardType="numeric"
                                editable={!saving}
                            />
                        </View>
                        
                        <View style={styles.inputContainer}>
                            <Text style={styles.baseInputLabel}>Descripción *</Text>
                            <TextInput
                                style={[styles.whiteInput, { height: 80, textAlignVertical: 'top' }]}
                                value={newDescription}
                                onChangeText={setNewDescription}
                                placeholder="Ej: Cuota mensual de acceso al gimnasio"
                                placeholderTextColor={theme.colors.textSecondary}
                                multiline
                                numberOfLines={3}
                                editable={!saving}
                            />
                        </View>
                        
                        <View style={styles.buttonsContainer}>
                            <TouchableOpacity 
                                style={styles.centralCancelButton}
                                onPress={() => {
                                    if (!saving) {
                                        setEditModalVisible(false);
                                        setNewAmount('');
                                        setNewDescription('');
                                    }
                                }}
                                disabled={saving}
                            >
                                <Text style={styles.centralCancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={styles.centralSaveButton}
                                onPress={handleUpdateQuota}
                                disabled={saving}
                            >
                                {saving ? (
                                    <ActivityIndicator size="small" color="#FFFFFF" />
                                ) : (
                                    <Text style={styles.centralSaveButtonText}>Guardar</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
} 