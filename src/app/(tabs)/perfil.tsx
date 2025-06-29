import React, { useState, useEffect } from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {useLocalSearchParams, useRouter} from 'expo-router';
import globalStyles from "../../styles/global";
import { useTheme } from '../../context/ThemeContext';
import { getCurrentUser } from '../../utils/storage';
import { ClientUser } from '../../data/Usuario';
import pesoImg from '../../../assets/profile/bascula.png';
import alturaImg from '../../../assets/profile/altura.png';
import idealImg from '../../../assets/profile/pesoIdeal.png';
import imcImg from '../../../assets/profile/imc.png';
import perfilMirtho from '../../../assets/profile/perfilMirtho.png';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { LinearGradient } from 'expo-linear-gradient';


const iconMap: Record<string, any> = {
    peso: pesoImg,
    altura: alturaImg,
    ideal: idealImg,
    imc: imcImg,
};

const Profile = () => {
    const router = useRouter();
    const { theme, isDarkMode } = useTheme();
    const [userData, setUserData] = useState<ClientUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const user = await getCurrentUser() as ClientUser;
            if (user) {
                setUserData(user);
            }
        } catch (error) {
            console.error('Error cargando datos del usuario:', error);
        } finally {
            setLoading(false);
        }
    };

    // Usar datos del estado o valores por defecto
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
                <Text>Cargando...</Text>
            </View>
        );
    }

    return (
        <View style={[globalStyles.container, { backgroundColor: theme.colors.background }]}>
            {/* Contenedor para avatar, nombre y email */}
            <View style={[styles.profileSection, { 
                backgroundColor: theme.colors.surface,
                shadowColor: isDarkMode ? '#ffffff' : '#000000',
                shadowOpacity: isDarkMode ? 0.1 : 0.1
            }]}>
                {/* Avatar con fondo y botón de edición*/}
                <View style={[styles.avatarWrapper, { backgroundColor: theme.colors.surface }]}>
                    <Image source={perfilMirtho} style={styles.avatar}/>
                    <TouchableOpacity 
                        style={[styles.editIcon, { backgroundColor: theme.colors.primary, borderColor: theme.colors.surface }]}
                        onPress={() => router.push('EditProfile')}>
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
                    gradientColors={isDarkMode ? ['#2d3748', '#4a5568'] : ['#667eea', '#764ba2']} 
                />
                <InfoBox 
                    icon="altura" 
                    label="Altura" 
                    value={`${heightInMeters || '---'} m`} 
                    gradientColors={isDarkMode ? ['#553c9a', '#805ad5'] : ['#f093fb', '#f5576c']} 
                />
                <InfoBox 
                    icon="ideal" 
                    label="Peso ideal" 
                    value={`${idealWeight || '---'} kg`} 
                    gradientColors={isDarkMode ? ['#2c5282', '#3182ce'] : ['#4facfe', '#00f2fe']} 
                />
                <InfoBox 
                    icon="imc" 
                    label="IMC" 
                    value={`${imc || '---'}`} 
                    gradientColors={isDarkMode ? ['#276749', '#38a169'] : ['#43e97b', '#38f9d7']} 
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
        </View>
    );
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
    // Se eliminaron header y title redundantes
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 24, // Usar valor fijo en lugar de theme.spacing.lg
    },
    avatarWrapper: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16, // Usar valor fijo en lugar de theme.spacing.md
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
        fontSize: 20, // Usar valor fijo en lugar de theme.typography.fontSize.large
        fontFamily: 'Roboto-Bold', // Usar valor fijo en lugar de theme.typography.fontFamily.bold
        marginBottom: 4,
    },
    email: {
        fontSize: 14, // Usar valor fijo en lugar de theme.typography.fontSize.medium
        fontFamily: 'Roboto-Regular', // Usar valor fijo en lugar de theme.typography.fontFamily.regular
        marginBottom: 24, // Usar valor fijo en lugar de theme.spacing.lg
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: 280,
        rowGap: 16, // Usar valor fijo en lugar de theme.spacing.md
        columnGap: 16, // Usar valor fijo en lugar de theme.spacing.md
        marginBottom: 24, // Usar valor fijo en lugar de theme.spacing.lg
    },
    box: {
        width: 130,
        height: 120,
        borderRadius: 8, // Usar valor fijo en lugar de theme.borderRadius.md
        marginBottom: 10, // Usar valor fijo en lugar de theme.spacing.md
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
        marginBottom: 4, // Usar valor fijo en lugar de theme.spacing.xs
    },
    iconImage: {
        width: 28,
        height: 28,
        resizeMode: 'contain',
        tintColor: 'white',
    },
    boxValue: {
        fontSize: 20, // Usar valor fijo en lugar de theme.typography.fontSize.large
        fontFamily: 'Roboto-Bold', // Usar valor fijo en lugar de theme.typography.fontFamily.bold
        color: 'white',
        marginTop: 4, // Usar valor fijo en lugar de theme.spacing.xs
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    boxLabel: {
        fontSize: 12, // Usar valor fijo en lugar de theme.typography.fontSize.small
        fontFamily: 'Roboto-Medium', // Usar valor fijo en lugar de theme.typography.fontFamily.medium
        color: 'rgba(255,255,255,0.9)',
        marginTop: 4, // Usar valor fijo en lugar de theme.spacing.xs
    },
    boxGradient: {
        flex: 1,
        borderRadius: 8, // Usar valor fijo en lugar de theme.borderRadius.md
        paddingVertical: 8, // Usar valor fijo en lugar de theme.spacing.sm
        paddingHorizontal: 4, // Usar valor fijo en lugar de theme.spacing.xs
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    chevronIcon: {
        position: 'absolute',
        right: 8,
        top: 8,
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