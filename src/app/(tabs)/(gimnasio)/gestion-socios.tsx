import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    ScrollView, 
    TouchableOpacity,
    Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import styles from '../../../styles/gestion-gimnasio';
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

    // Cargar socios al montar
    useEffect(() => {
        loadClientsFromStorage();
    }, [user]);

    const loadClientsFromStorage = async () => {
        if (!user || user.role !== 'gym') {
            setIsLoading(false);
            return;
        }
        try {
            const clients = await getGymClients(user.id);
            setSocios(clients);
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
                    ) : (
                        socios.map(client => (
                            <View key={client.id} style={styles.claseCard}>
                                <View style={styles.claseHeader}>
                                    <View style={styles.claseInfo}>
                                        <Text style={styles.claseNombre}>{client.name}</Text>
                                        <Text style={styles.claseDescripcion}>{client.email}</Text>
                                        {client.membershipType && (
                                            <Text style={styles.metadataText}>Membresía: {client.membershipType}</Text>
                                        )}
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
                                        <MaterialIcons name="delete" size={20} color="#FFFFFF" />
                                        <Text style={styles.accionButtonText}>Eliminar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
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
