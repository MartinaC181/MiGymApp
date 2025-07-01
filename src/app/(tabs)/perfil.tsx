import React, { useState, useEffect } from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, ActivityIndicator, Alert} from 'react-native';
import {useLocalSearchParams, useRouter} from 'expo-router';
import globalStyles from "../../styles/global";
import { useTheme } from '../../context/ThemeContext';
import { getCurrentUser, updateUserProfile } from '../../utils/storage';
import { ClientUser, GymUser } from '../../data/Usuario';
import pesoImg from '../../../assets/profile/bascula.png';
import alturaImg from '../../../assets/profile/altura.png';
import idealImg from '../../../assets/profile/pesoIdeal.png';
import imcImg from '../../../assets/profile/imc.png';
import perfilMirtho from '../../../assets/profile/perfilMirtho.png';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { LinearGradient } from 'expo-linear-gradient';
// eslint-disable-next-line import/no-unresolved
import * as ImagePicker from 'expo-image-picker';

const iconMap: Record<string, any> = {
    peso: pesoImg,
    altura: alturaImg,
    ideal: idealImg,
    imc: imcImg,
};

const Profile = () => {
    const router = useRouter();
    const { theme, isDarkMode } = useTheme();
    const [userData, setUserData] = useState<ClientUser | GymUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUserData();
        // Solicitar permisos al montar
        (async () => {
            await ImagePicker.requestCameraPermissionsAsync();
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        })();
    }, []);


    const loadUserData = async () => {
        try {
            const user = await getCurrentUser();
            if (user) {
                setUserData(user);
            }
        } catch (error) {
            console.error('Error cargando datos del usuario:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePickImage = async (fromCamera: boolean) => {
        try {
            const result = fromCamera
                ? await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.6 })
                : await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 0.6 });

            if (!result.canceled && userData) {
                const newUri = result.assets[0].uri;
                
                // Actualizar estado local
                setUserData({ ...userData, avatarUri: newUri } as any);

                // Usar updateUserProfile para guardar en la base de datos y actualizar la sesión
                const updatedUser = await updateUserProfile(userData.id, { avatarUri: newUri });
                
                if (updatedUser) {
                    // Actualizar el estado local con el usuario actualizado
                    setUserData(updatedUser);
                }
            }
        } catch (error) {
            console.error('Error seleccionando imagen:', error);
        }
    };

    const openPickerMenu = () => {
        Alert.alert(
            'Foto de perfil',
            'Selecciona una opción',
            [
                { text: 'Cámara', onPress: () => handlePickImage(true) },
                { text: 'Galería', onPress: () => handlePickImage(false) },
                { text: 'Cancelar', style: 'cancel' },
            ],
        );
    };

    // Si es un usuario de gimnasio, mostrar el perfil de gimnasio
    if (userData?.role === 'gym') {
        return <GymProfileView gymData={userData} />;
    }

    // Usar datos del estado o valores por defecto para clientes
    const name = userData?.name || 'Sin nombre';
    const email = userData?.email || 'Sin correo';
    const weight = (userData as any)?.weight || '0';
    const idealWeight = (userData as any)?.idealWeight || '0';
    const height = (userData as any)?.height || '0';

    const imc = (parseFloat(weight) / Math.pow(parseFloat(height) / 100, 2)).toFixed(2);
    const heightInMeters = (parseFloat(height) / 100).toFixed(2);
    
    if (loading) {
        return (
            <View style={[globalStyles.container, { justifyContent: 'center' }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>Cargando perfil...</Text>
            </View>
        );
    }

    return (
        <ScrollView 
            style={[styles.container, { backgroundColor: theme.colors.background }]} 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            <View style={[globalStyles.container, { backgroundColor: theme.colors.background }]}>
                {/* Contenedor para avatar, nombre y email */}
                <View style={[styles.profileSection, { 
                    backgroundColor: theme.colors.surface,
                    shadowColor: isDarkMode ? '#ffffff' : '#000000',
                    shadowOpacity: isDarkMode ? 0.1 : 0.1
                }]}>
                    {/* Avatar con fondo y botón de edición*/}
                    <View style={[styles.avatarWrapper, { backgroundColor: theme.colors.surface }]}>
                        <Image
                            source={userData && (userData as any).avatarUri ? { uri: (userData as any).avatarUri } : perfilMirtho}
                            style={styles.avatar}
                        />
                        <TouchableOpacity 
                            style={[styles.editIcon, { backgroundColor: theme.colors.primary, borderColor: theme.colors.surface }]}
                            onPress={openPickerMenu}>
                            <MaterialCommunityIcons name="pencil" size={16} color="white"/>
                        </TouchableOpacity>
                    </View>

                    {/* Nombre y correo */}
                    <Text style={[styles.name, { color: theme.colors.textPrimary }]}>{name}</Text>
                    <Text style={[styles.email, { color: theme.colors.textSecondary }]}>{email}</Text>
                </View>

                {/* Cuadricula */}
                <View style={styles.grid}>
                    <InfoBox 
                        icon="peso" 
                        label="Peso" 
                        value={`${weight || '---'} kg`} 
                        gradientColors={theme.colors.gradient1} 
                    />
                    <InfoBox 
                        icon="altura" 
                        label="Altura" 
                        value={`${heightInMeters || '---'} m`} 
                        gradientColors={theme.colors.gradient2} 
                    />
                    <InfoBox 
                        icon="ideal" 
                        label="Peso ideal" 
                        value={`${idealWeight || '---'} kg`} 
                        gradientColors={theme.colors.gradient3} 
                    />
                    <InfoBox 
                        icon="imc" 
                        label="IMC" 
                        value={`${imc || '---'}`} 
                        gradientColors={theme.colors.gradient4} 
                        onPress={() => router.push({
                            pathname: '/Imc',
                            params: { weight, height }
                        })} 
                    />
                </View>

                {/* Botón de editar */}
                <TouchableOpacity 
                    style={[
                        globalStyles.LoginButton, 
                        { 
                            width: 280, 
                            alignSelf: 'center', 
                            maxWidth: '100%',
                            backgroundColor: theme.colors.primary 
                        }
                    ]}
                    onPress={() => router.push('EditProfile')}
                >
                    <Text style={[globalStyles.buttonText, { color: '#000000' }]}>Editar</Text>
                </TouchableOpacity>

                {/* Botón para ver perfil del gimnasio */}
                {(userData as any)?.gymId && (
                    <TouchableOpacity 
                        style={[styles.gymButton, { 
                            width: 280, 
                            alignSelf: 'center', 
                            maxWidth: '100%',
                            backgroundColor: theme.colors.surface,
                            borderColor: theme.colors.primary
                        }]}
                        onPress={() => router.push('perfil-gimnasio')}
                    >
                        <MaterialCommunityIcons 
                            name="dumbbell" 
                            size={20} 
                            color={theme.colors.primary} 
                            style={{ marginRight: 8 }}
                        />
                        <Text style={[styles.gymButtonText, { color: theme.colors.primary }]}>Ver Perfil del Gimnasio</Text>
                    </TouchableOpacity>
                )}
            </View>
        </ScrollView>
    );
};

// Componente para mostrar el perfil de gimnasio
const GymProfileView = ({ gymData }: { gymData: any }) => {
    const router = useRouter();
    const { theme, isDarkMode } = useTheme();

    // Función para obtener el número de clientes
    const getClientCount = () => {
        return gymData.clients.length;
    };

    // Función para obtener el número de clases
    const getClassCount = () => {
        return gymData.classes.length;
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
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
            backgroundColor: 'rgba(255,255,255,0.2)',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: theme.spacing.md,
        },
        gymName: {
            fontSize: theme.typography.fontSize.title,
            fontFamily: theme.typography.fontFamily.bold,
            color: 'white',
            textAlign: 'center',
            marginBottom: theme.spacing.xs,
        },
        gymType: {
            fontSize: theme.typography.fontSize.medium,
            fontFamily: theme.typography.fontFamily.regular,
            color: 'rgba(255,255,255,0.8)',
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
            color: 'rgba(255,255,255,0.8)',
            marginBottom: 2,
        },
        infoCardValue: {
            fontSize: theme.typography.fontSize.medium,
            fontFamily: theme.typography.fontFamily.bold,
            color: 'white',
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
            color: 'white',
            marginTop: theme.spacing.xs,
        },
        statCardTitle: {
            fontSize: theme.typography.fontSize.small,
            fontFamily: theme.typography.fontFamily.medium,
            color: 'rgba(255,255,255,0.8)',
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
        editButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: theme.spacing.lg,
        },
    });

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
                    <Text style={styles.gymType}>Mi Gimnasio</Text>
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
                    />
                    
                    {gymData.phone && (
                        <InfoCard 
                            icon="phone" 
                            title="Teléfono" 
                            value={gymData.phone}
                            gradientColors={theme.colors.gradient2}
                        />
                    )}
                    
                    <InfoCard 
                        icon="email" 
                        title="Email" 
                        value={gymData.email}
                        gradientColors={theme.colors.gradient3}
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

                {/* Botón de editar */}
                <TouchableOpacity 
                    style={[globalStyles.LoginButton, styles.editButton]}
                    onPress={() => router.push('/(tabs)/EditGymProfile')}
                >
                    <MaterialCommunityIcons 
                        name="pencil" 
                        size={20} 
                        color="white" 
                        style={{ marginRight: 8 }}
                    />
                    <Text style={globalStyles.buttonText}>Editar Perfil del Gimnasio</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );

    // Componente InfoCard dentro del componente principal para acceder a styles
    function InfoCard({ icon, title, value, gradientColors }: {
        icon: string;
        title: string;
        value: string;
        gradientColors: [string, string];
    }) {
        return (
            <View style={styles.infoCard}>
                <LinearGradient
                    colors={gradientColors}
                    style={styles.infoCardGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <MaterialCommunityIcons 
                        name={icon as any} 
                        size={24} 
                        color="white" 
                    />
                    <View style={styles.infoCardContent}>
                        <Text style={styles.infoCardTitle}>{title}</Text>
                        <Text style={styles.infoCardValue}>{value}</Text>
                    </View>
                </LinearGradient>
            </View>
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
                        color="white" 
                    />
                    <Text style={styles.statCardValue}>{value}</Text>
                    <Text style={styles.statCardTitle}>{title}</Text>
                </LinearGradient>
            </View>
        );
    }
};

const InfoBox = ({icon, value, label, gradientColors, onPress}: {
    icon: 'peso' | 'altura' | 'ideal' | 'imc';
    value: string;
    label: string;
    gradientColors: [string, string];
    onPress?: () => void;
}) => (
    <TouchableOpacity 
        style={styles.box} 
        onPress={onPress}
        activeOpacity={onPress ? 0.8 : 1}
    >
        <LinearGradient
            colors={gradientColors}
            style={styles.boxGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <View style={styles.iconCircle}>
                <Image source={iconMap[icon]} style={styles.iconImage}/>
            </View>
            <Text style={styles.boxValue}>{value}</Text>
            <Text style={styles.boxLabel}>{label}</Text>
            {onPress && (
                <MaterialCommunityIcons 
                    name="chevron-right" 
                    size={16} 
                    color="rgba(255,255,255,0.8)" 
                    style={styles.chevronIcon}
                />
            )}
        </LinearGradient>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        alignItems: 'center',
        paddingTop: 24,
        paddingBottom: 32,
        padding: 24,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
    avatarWrapper: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        width: 110,
        height: 110,
        borderRadius: 55,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    editIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
    },
    name: {
        fontSize: 20,
        fontFamily: 'Roboto-Bold',
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
        fontFamily: 'Roboto-Regular',
        marginBottom: 24,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: 280,
        rowGap: 16,
        columnGap: 16,
        marginBottom: 24,
    },
    box: {
        width: 130,
        height: 120,
        borderRadius: 8,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
        overflow: 'hidden',
    },
    iconCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    iconImage: {
        width: 28,
        height: 28,
        resizeMode: 'contain',
        tintColor: 'white',
    },
    boxValue: {
        fontSize: 20,
        fontFamily: 'Roboto-Bold',
        color: 'white',
        marginTop: 4,
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    boxLabel: {
        fontSize: 12,
        fontFamily: 'Roboto-Medium',
        color: 'rgba(255,255,255,0.9)',
        marginTop: 4,
    },
    boxGradient: {
        flex: 1,
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 4,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    chevronIcon: {
        position: 'absolute',
        right: 8,
        top: 8,
    },
    gymButton: {
        borderWidth: 2,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    gymButtonText: {
        fontSize: 14,
        fontFamily: 'Roboto-Bold',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    profileSection: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        padding: 24,
        borderRadius: 16,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
        elevation: 8,
        width: '100%',
        maxWidth: 320,
    },
});

export default Profile;