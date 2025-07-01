import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, ActivityIndicator, Linking, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import globalStyles from "../../styles/global";
import { useTheme } from '../../context/ThemeContext';
import { getCurrentUser, getGymUserByBusinessName } from '../../utils/storage';
import { ClientUser, GymUser } from '../../data/Usuario';
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';

const GymProfile = () => {
    const router = useRouter();
    const { theme, isDarkMode } = useTheme();
    const [userData, setUserData] = useState<ClientUser | null>(null);
    const [gymData, setGymData] = useState<GymUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadGymData();
    }, []);

    const loadGymData = async () => {
        try {
            const user = await getCurrentUser() as ClientUser;
            if (user && user.gymId) {
                setUserData(user);
                const gym = await getGymUserByBusinessName(user.gymId);
                setGymData(gym);
            }
        } catch (error) {
            console.error('Error cargando datos del gimnasio:', error);
        } finally {
            setLoading(false);
        }
    };

    // Función para obtener el número de clientes (simulado para gimnasios por defecto)
    const getClientCount = () => {
        if (!gymData) return 0;
        
        // Si es un gimnasio por defecto, mostrar un número simulado
        if (gymData.id.startsWith('default_')) {
            const gymNames = ["Gimnasio Central", "FitLife Sports Club", "PowerGym Elite", "Wellness Center", "SportClub Premium"];
            const simulatedCounts = [45, 78, 32, 56, 89];
            const index = gymNames.indexOf(gymData.businessName);
            return index >= 0 ? simulatedCounts[index] : 25;
        }
        
        return gymData.clients.length;
    };

    // Función para obtener el número de clases (simulado para gimnasios por defecto)
    const getClassCount = () => {
        if (!gymData) return 0;
        
        // Si es un gimnasio por defecto, mostrar un número simulado
        if (gymData.id.startsWith('default_')) {
            const gymNames = ["Gimnasio Central", "FitLife Sports Club", "PowerGym Elite", "Wellness Center", "SportClub Premium"];
            const simulatedCounts = [12, 18, 8, 15, 22];
            const index = gymNames.indexOf(gymData.businessName);
            return index >= 0 ? simulatedCounts[index] : 10;
        }
        
        return gymData.classes.length;
    };

    // Función para abrir el email
    const handleEmailPress = async () => {
        if (!gymData?.email) {
            Alert.alert('Error', 'No hay email disponible para este gimnasio');
            return;
        }

        try {
            const url = `mailto:${gymData.email}?subject=Consulta sobre ${gymData.businessName}&body=Hola, me gustaría obtener más información sobre sus servicios.`;
            const supported = await Linking.canOpenURL(url);
            
            if (supported) {
                await Linking.openURL(url);
            } else {
                Alert.alert('Error', 'No se puede abrir la aplicación de email');
            }
        } catch (error) {
            Alert.alert('Error', 'No se pudo abrir el email');
        }
    };

    // Función para abrir el teléfono
    const handlePhonePress = async () => {
        if (!gymData?.phone) {
            Alert.alert('Error', 'No hay teléfono disponible para este gimnasio');
            return;
        }

        try {
            // Limpiar el número de teléfono (remover espacios, guiones, etc.)
            const cleanPhone = gymData.phone.replace(/[\s\-\(\)]/g, '');
            const url = `tel:${cleanPhone}`;
            const supported = await Linking.canOpenURL(url);
            
            if (supported) {
                await Linking.openURL(url);
            } else {
                Alert.alert('Error', 'No se puede abrir la aplicación de teléfono');
            }
        } catch (error) {
            Alert.alert('Error', 'No se pudo abrir el teléfono');
        }
    };

    // Función para abrir la dirección en maps
    const handleAddressPress = async () => {
        if (!gymData?.address) {
            Alert.alert('Error', 'No hay dirección disponible para este gimnasio');
            return;
        }

        try {
            const encodedAddress = encodeURIComponent(gymData.address);
            const url = `https://maps.google.com/?q=${encodedAddress}`;
            const supported = await Linking.canOpenURL(url);
            
            if (supported) {
                await Linking.openURL(url);
            } else {
                Alert.alert('Error', 'No se puede abrir la aplicación de mapas');
            }
        } catch (error) {
            Alert.alert('Error', 'No se pudo abrir la aplicación de mapas');
        }
    };

    // Función para contactar al gimnasio
    const handleContactPress = async () => {
        if (!gymData?.phone) {
            Alert.alert('Error', 'No hay información de contacto disponible');
            return;
        }

        try {
            // Limpiar el número de teléfono
            const cleanPhone = gymData.phone.replace(/[\s\-\(\)]/g, '');
            
            // Intentar abrir WhatsApp primero
            const whatsappUrl = `whatsapp://send?phone=${cleanPhone}&text=Hola, me gustaría obtener más información sobre ${gymData.businessName}`;
            const canOpenWhatsApp = await Linking.canOpenURL(whatsappUrl);
            
            if (canOpenWhatsApp) {
                await Linking.openURL(whatsappUrl);
            } else {
                // Si no hay WhatsApp, abrir el teléfono
                const phoneUrl = `tel:${cleanPhone}`;
                const canOpenPhone = await Linking.canOpenURL(phoneUrl);
                
                if (canOpenPhone) {
                    await Linking.openURL(phoneUrl);
                } else {
                    Alert.alert('Error', 'No se puede abrir WhatsApp ni el teléfono');
                }
            }
        } catch (error) {
            Alert.alert('Error', 'No se pudo abrir la aplicación de contacto');
        }
    };

    // Estilos dinámicos que usan el tema
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        loadingText: {
            marginTop: theme.spacing.md,
            fontSize: theme.typography.fontSize.medium,
            color: theme.colors.textSecondary,
            fontFamily: theme.typography.fontFamily.regular,
        },
        noGymTitle: {
            fontSize: theme.typography.fontSize.large,
            fontFamily: theme.typography.fontFamily.bold,
            color: theme.colors.textPrimary,
            marginTop: theme.spacing.md,
            textAlign: 'center',
        },
        noGymText: {
            fontSize: theme.typography.fontSize.medium,
            fontFamily: theme.typography.fontFamily.regular,
            color: theme.colors.textSecondary,
            marginTop: theme.spacing.sm,
            textAlign: 'center',
            paddingHorizontal: theme.spacing.lg,
        },
        header: {
            height: 200,
            marginBottom: theme.spacing.lg,
        },
        headerGradient: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: theme.spacing.xl,
        },
        logoContainer: {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: theme.colors.surface,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: theme.spacing.md,
        },
        gymName: {
            fontSize: theme.typography.fontSize.title,
            fontFamily: theme.typography.fontFamily.bold,
            color: theme.colors.textPrimary,
            textAlign: 'center',
            marginBottom: theme.spacing.xs,
        },
        gymType: {
            fontSize: theme.typography.fontSize.medium,
            fontFamily: theme.typography.fontFamily.regular,
            color: theme.colors.textSecondary,
            textAlign: 'center',
        },
        content: {
            padding: theme.spacing.lg,
        },
        section: {
            marginBottom: theme.spacing.xl,
        },
        sectionTitle: {
            fontSize: theme.typography.fontSize.large,
            fontFamily: theme.typography.fontFamily.bold,
            color: theme.colors.textPrimary,
            marginBottom: theme.spacing.md,
        },
        infoCard: {
            marginBottom: theme.spacing.md,
            borderRadius: theme.borderRadius.md,
            overflow: 'hidden',
            shadowColor: isDarkMode ? "#ffffff" : "#000000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isDarkMode ? 0.1 : 0.1,
            shadowRadius: 4,
            elevation: 3,
        },
        infoCardGradient: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: theme.spacing.md,
        },
        infoCardContent: {
            marginLeft: theme.spacing.md,
            flex: 1,
        },
        infoCardTitle: {
            fontSize: theme.typography.fontSize.small,
            fontFamily: theme.typography.fontFamily.medium,
            color: theme.colors.textSecondary,
            marginBottom: 2,
        },
        infoCardValue: {
            fontSize: theme.typography.fontSize.medium,
            fontFamily: theme.typography.fontFamily.bold,
            color: theme.colors.textPrimary,
        },
        infoCardChevron: {
            marginLeft: 'auto',
            alignSelf: 'center',
        },
        descriptionCard: {
            backgroundColor: theme.colors.surface,
            padding: theme.spacing.md,
            borderRadius: theme.borderRadius.md,
            borderLeftWidth: 4,
            borderLeftColor: theme.colors.primary,
        },
        descriptionText: {
            fontSize: theme.typography.fontSize.medium,
            fontFamily: theme.typography.fontFamily.regular,
            color: theme.colors.textPrimary,
            lineHeight: 22,
        },
        statsContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        statCard: {
            flex: 1,
            marginHorizontal: theme.spacing.xs,
            borderRadius: theme.borderRadius.md,
            overflow: 'hidden',
            shadowColor: isDarkMode ? "#ffffff" : "#000000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isDarkMode ? 0.1 : 0.1,
            shadowRadius: 4,
            elevation: 3,
        },
        statCardGradient: {
            alignItems: 'center',
            padding: theme.spacing.md,
        },
        statCardValue: {
            fontSize: theme.typography.fontSize.title,
            fontFamily: theme.typography.fontFamily.bold,
            color: theme.colors.textPrimary,
            marginTop: theme.spacing.xs,
        },
        statCardTitle: {
            fontSize: theme.typography.fontSize.small,
            fontFamily: theme.typography.fontFamily.medium,
            color: theme.colors.textSecondary,
            marginTop: 2,
        },
        planCard: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.colors.surface,
            padding: theme.spacing.md,
            borderRadius: theme.borderRadius.md,
            borderLeftWidth: 4,
            borderLeftColor: theme.colors.primary,
        },
        planText: {
            fontSize: theme.typography.fontSize.medium,
            fontFamily: theme.typography.fontFamily.bold,
            color: theme.colors.textPrimary,
            marginLeft: theme.spacing.sm,
        },
        contactButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: theme.spacing.lg,
        },
    });

    if (loading) {
        return (
            <View style={[globalStyles.container, { justifyContent: 'center' }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>Cargando perfil del gimnasio...</Text>
            </View>
        );
    }

    if (!userData?.gymId) {
        return (
            <View style={[globalStyles.container, { justifyContent: 'center' }]}>
                <MaterialCommunityIcons 
                    name="dumbbell" 
                    size={64} 
                    color={theme.colors.textSecondary} 
                />
                <Text style={styles.noGymTitle}>No tienes gimnasio asignado</Text>
                <Text style={styles.noGymText}>
                    Contacta con el administrador para asignarte a un gimnasio
                </Text>
            </View>
        );
    }

    if (!gymData) {
        return (
            <View style={[globalStyles.container, { justifyContent: 'center' }]}>
                <MaterialCommunityIcons 
                    name="alert-circle-outline" 
                    size={64} 
                    color={theme.colors.error} 
                />
                <Text style={styles.noGymTitle}>Gimnasio no encontrado</Text>
                <Text style={styles.noGymText}>
                    No se pudo cargar la información del gimnasio
                </Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header con logo del gimnasio */}
            <View style={styles.header}>
                <LinearGradient
                    colors={theme.colors.gradient1}
                    style={styles.headerGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={styles.logoContainer}>
                        <MaterialCommunityIcons 
                            name="dumbbell" 
                            size={48} 
                            color="white" 
                        />
                    </View>
                    <Text style={styles.gymName}>{gymData.businessName}</Text>
                    <Text style={styles.gymType}>Tu Gimnasio</Text>
                </LinearGradient>
            </View>

            {/* Información del gimnasio */}
            <View style={styles.content}>
                {/* Información de contacto */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Información de Contacto</Text>
                    
                    <InfoCard 
                        icon="map-marker" 
                        title="Dirección" 
                        value={gymData.address || "No especificada"}
                        gradientColors={theme.colors.gradient1}
                        onPress={handleAddressPress}
                    />
                    
                    {gymData.phone && (
                        <InfoCard 
                            icon="phone" 
                            title="Teléfono" 
                            value={gymData.phone}
                            gradientColors={theme.colors.gradient2}
                            onPress={handlePhonePress}
                        />
                    )}
                    
                    <InfoCard 
                        icon="email" 
                        title="Email" 
                        value={gymData.email}
                        gradientColors={theme.colors.gradient3}
                        onPress={handleEmailPress}
                    />
                </View>

                {/* Descripción */}
                {gymData.description && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Descripción</Text>
                        <View style={styles.descriptionCard}>
                            <Text style={styles.descriptionText}>{gymData.description}</Text>
                        </View>
                    </View>
                )}

                {/* Estadísticas */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Estadísticas</Text>
                    <View style={styles.statsContainer}>
                        <StatCard 
                            icon="account-group" 
                            title="Clientes" 
                            value={`${getClientCount()}`}
                            gradientColors={theme.colors.gradient4}
                        />
                        <StatCard 
                            icon="dumbbell" 
                            title="Clases" 
                            value={`${getClassCount()}`}
                            gradientColors={theme.colors.gradient5}
                        />
                    </View>
                </View>

                {/* Plan de suscripción */}
                {gymData.subscriptionPlan && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Plan de Suscripción</Text>
                        <View style={styles.planCard}>
                            <MaterialCommunityIcons 
                                name="crown" 
                                size={24} 
                                color={theme.colors.primary} 
                            />
                            <Text style={styles.planText}>
                                Plan {gymData.subscriptionPlan.toUpperCase()}
                            </Text>
                        </View>
                    </View>
                )}

                {/* Botón de contacto */}
                <TouchableOpacity 
                    style={[globalStyles.LoginButton, styles.contactButton]}
                    onPress={handleContactPress}
                >
                    <MaterialCommunityIcons 
                        name="message-text" 
                        size={20} 
                        color="white" 
                        style={{ marginRight: 8 }}
                    />
                    <Text style={globalStyles.buttonText}>Contactar Gimnasio</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );

    // Componente InfoCard dentro del componente principal para acceder a styles
    function InfoCard({ icon, title, value, gradientColors, onPress }: {
        icon: string;
        title: string;
        value: string;
        gradientColors: [string, string];
        onPress?: () => void;
    }) {
        return (
            <TouchableOpacity 
                style={styles.infoCard} 
                activeOpacity={onPress ? 0.8 : 1} 
                onPress={onPress}
                disabled={!onPress}
            >
                <LinearGradient
                    colors={gradientColors}
                    style={styles.infoCardGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <MaterialCommunityIcons 
                        name={icon as any} 
                        size={24} 
                        color={theme.colors.primary} 
                    />
                    <View style={styles.infoCardContent}>
                        <Text style={styles.infoCardTitle}>{title}</Text>
                        <Text style={styles.infoCardValue}>{value}</Text>
                    </View>
                    {onPress && (
                        <MaterialCommunityIcons 
                            name="chevron-right" 
                            size={20} 
                            color={theme.colors.textSecondary} 
                            style={styles.infoCardChevron}
                        />
                    )}
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    // Componente StatCard dentro del componente principal para acceder a styles
    function StatCard({ icon, title, value, gradientColors }: {
        icon: string;
        title: string;
        value: string;
        gradientColors: [string, string];
    }) {
        return (
            <View style={styles.statCard}>
                <LinearGradient
                    colors={gradientColors}
                    style={styles.statCardGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <MaterialCommunityIcons 
                        name={icon as any} 
                        size={32} 
                        color={theme.colors.primary} 
                    />
                    <Text style={styles.statCardValue}>{value}</Text>
                    <Text style={styles.statCardTitle}>{title}</Text>
                </LinearGradient>
            </View>
        );
    }
};

export default GymProfile; 