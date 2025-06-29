import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    ScrollView, 
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import theme from '../../../constants/theme';
import globalStyles from '../../../styles/global';
import { useAuth } from '../../../hooks/useAuth';

export default function GestionSocios() {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    // Simular carga inicial
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    // Mostrar indicador de carga
    if (isLoading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={styles.sectionTitle}>Cargando socios...</Text>
            </View>
        );
    }

    // Verificar que el usuario sea de tipo gimnasio
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

                <View style={styles.contentContainer}>
                    {/* Estado vacío temporal */}
                    <View style={styles.emptyStateContainer}>
                        <MaterialIcons 
                            name="people-outline" 
                            size={64} 
                            color="#E0E0E0" 
                        />
                        <Text style={styles.emptyStateTitle}>
                            Próximamente
                        </Text>
                        <Text style={styles.emptyStateSubtitle}>
                            La gestión de socios estará disponible pronto.{'\n'}
                            Podrás ver, agregar y administrar todos los socios de tu gimnasio.
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Botón flotante placeholder para futuras funcionalidades */}
            <TouchableOpacity style={styles.fabButton} disabled>
                <MaterialIcons name="person-add" size={24} color="#FFFFFF" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.surface,
    },
    scrollView: {
        flex: 1,
    },
    headerSection: {
        padding: theme.spacing.lg,
        paddingBottom: theme.spacing.md,
    },
    sectionTitle: {
        fontSize: theme.typography.fontSize.title,
        fontFamily: theme.typography.fontFamily.bold,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.xs,
    },
    sectionSubtitle: {
        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily.regular,
        color: theme.colors.textSecondary,
    },
    contentContainer: {
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: 120, 
    },
    emptyStateContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme.spacing.xl * 2,
        paddingHorizontal: theme.spacing.lg,
    },
    emptyStateTitle: {
        fontSize: theme.typography.fontSize.large,
        fontFamily: theme.typography.fontFamily.bold,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.lg,
        marginBottom: theme.spacing.sm,
        textAlign: 'center',
    },
    emptyStateSubtitle: {
        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily.regular,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
    },
    fabButton: {
        position: 'absolute',
        bottom: 50, 
        right: theme.spacing.lg,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#CCCCCC', // Gris para indicar que está deshabilitado
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
});
