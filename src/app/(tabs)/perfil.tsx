import React, { useState, useEffect } from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {useLocalSearchParams, useRouter} from 'expo-router';
import globalStyles from "../../styles/global";
import theme from "../../constants/theme";
import { getCurrentUser } from '../../utils/storage';
import { ClientUser } from '../../data/Usuario';
import pesoImg from '../../../assets/profile/bascula.png';
import alturaImg from '../../../assets/profile/altura.png';
import idealImg from '../../../assets/profile/pesoIdeal.png';
import imcImg from '../../../assets/profile/imc.png';
import perfilMirtho from '../../../assets/profile/perfilMirtho.png';

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";


const iconMap: Record<string, any> = {
    peso: pesoImg,
    altura: alturaImg,
    ideal: idealImg,
    imc: imcImg,
};

const Profile = () => {
    const router = useRouter();
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

    const imc = (parseFloat(weight) / Math.pow(parseFloat(height), 2)).toFixed(2);
    
    if (loading) {
        return (
            <View style={[globalStyles.container, { justifyContent: 'center' }]}>
                <Text>Cargando...</Text>
            </View>
        );
    }

    return (
        <View style={globalStyles.container}>
            {/* Avatar con fondo y botón de edición*/}
            <View style={styles.avatarWrapper}>
                <Image source={perfilMirtho} style={styles.avatar}/>
                <TouchableOpacity style={styles.editIcon}
                                  onPress={() => router.push('EditProfile')}>
                    <MaterialCommunityIcons name="pencil" size={16} color="white"/>
                </TouchableOpacity>
            </View>

            {/* Nombre y correo */}
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.email}>{email}</Text>

            {/* Cuadricula */}
            <View style={styles.grid}>
                <InfoBox icon="peso" label="Peso" value={`${weight || '---'} kg`}/>
                <InfoBox icon="altura" label="Altura" value={`${height || '---'} m`}/>
                <InfoBox icon="ideal" label="Peso ideal" value={`${idealWeight || '---'} kg`}/>
                <InfoBox icon="imc" label="IMC" value={`${imc || '---'}`}/>
            </View>

            {/* Botón de editar */}
            <TouchableOpacity style={globalStyles.LoginButton}
                              onPress={() => router.push('EditProfile')}>
                <Text style={globalStyles.buttonText}>Editar</Text>
            </TouchableOpacity>
        </View>
    );
};

const InfoBox = ({icon, value, label}: {
    icon: 'peso' | 'altura' | 'ideal' | 'imc';
    value: string;
    label: string;
}) => (
    <View style={styles.box}>
        <View style={styles.iconCircle}>
            <Image source={iconMap[icon]} style={styles.iconImage}/>
        </View>
        <Text style={styles.boxValue}>{value}</Text>
        <Text style={styles.boxLabel}>{label}</Text>
    </View>
);

const styles = StyleSheet.create({
    // Se eliminaron header y title redundantes
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: theme.spacing.lg,
    },
    avatarWrapper: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing.md,
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: theme.colors.surface,
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
        backgroundColor: theme.colors.primary,
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: theme.colors.surface,
    },
    name: {
        fontSize: theme.typography.fontSize.large,
        fontFamily: theme.typography.fontFamily.bold,
        color: theme.colors.textPrimary,
        marginBottom: 4,
    },
    email: {
        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily.regular,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.lg,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: 280,
        rowGap: theme.spacing.md,
        columnGap: theme.spacing.md,
        marginBottom: theme.spacing.lg,
    },
    box: {
        width: 130,
        height: 120,
        backgroundColor: '#b3dcec',
        borderRadius: theme.borderRadius.md,
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.xs,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing.md,
        elevation: 8,

    },
    iconCircle: {
        width: 50,
        height: 50,
        borderRadius: 20,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing.xs,
    },
    iconImage: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
    boxValue: {
        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily.bold,
        color: theme.colors.textPrimary,
        marginTop: theme.spacing.xs,
    },
    boxLabel: {
        fontSize: theme.typography.fontSize.small,
        fontFamily: theme.typography.fontFamily.regular,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.xs,
    },
});

export default Profile;