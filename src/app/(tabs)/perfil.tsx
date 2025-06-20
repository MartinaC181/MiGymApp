import React, { useState } from 'react';
import {View, Text, TouchableOpacity, Image, ScrollView, Alert, Share, Dimensions, SafeAreaView} from 'react-native';
import {useLocalSearchParams, useRouter} from 'expo-router';
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";

import globalStyles from "../../styles/global";
import theme from "../../constants/theme";

import perfilMirtho from '../../../assets/profile/perfilMirtho.png';

const { width } = Dimensions.get('window');

type InfoBoxIcon = 'peso' | 'altura' | 'edad';

interface InfoBoxProps {
    icon: InfoBoxIcon;
    value: string;
    label: string;
    trend?: string;
}

const InfoBox = ({icon, value, label, trend}: InfoBoxProps) => {
    const getIcon = () => {
        switch (icon) {
            case 'peso':
                return <Ionicons name="fitness" size={20} color={theme.colors.primary}/>;
            case 'altura':
                return <Ionicons name="body" size={20} color={theme.colors.primary}/>;
            case 'edad':
                return <Ionicons name="time" size={20} color={theme.colors.primary}/>;
            default:
                return null;
        }
    };

    return (
        <View style={globalStyles.infoBox}>
            <View style={globalStyles.iconContainer}>
                {getIcon()}
            </View>
            <View style={globalStyles.infoContent}>
                <Text style={globalStyles.boxValue}>{value}</Text>
                <Text style={globalStyles.boxLabel}>{label}</Text>
            </View>
        </View>
    );
};

const Profile = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [isDarkMode, setIsDarkMode] = useState(false);

    // ===== DATOS DEL USUARIO =====
    const name = params.name as string || 'Mirtho García';
    const email = params.email as string || 'mirtho.garcia@email.com';
    const weight = params.weight as string || '75';
    const height = params.height as string || '1.75';
    const age = params.age as string || '28';

    // ===== FUNCIONES =====
    const handleShare = async () => {
        try {
            await Share.share({
                message: `¡Mira mi progreso en MiGymApp! Peso: ${weight}kg, Altura: ${height}m`,
                title: 'Mi Perfil de Fitness'
            });
        } catch (error) {
            Alert.alert('Error', 'No se pudo compartir el perfil');
        }
    };

    const handleEditProfile = () => {
        router.push('EditProfile');
    };

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <SafeAreaView style={globalStyles.safeArea}>
            <ScrollView style={globalStyles.profileContainer} showsVerticalScrollIndicator={false}>
                {/* ===== FOTO DE PERFIL Y INFORMACIÓN ===== */}
                <View style={globalStyles.profileHeader}>
                    <View style={globalStyles.avatarWrapper}>
                        <Image source={perfilMirtho} style={globalStyles.avatar}/>
                        <TouchableOpacity style={globalStyles.editIcon} onPress={handleEditProfile}>
                            <MaterialCommunityIcons name="pencil" size={14} color="white"/>
                </TouchableOpacity>
            </View>

                    <Text style={globalStyles.profileName}>{name}</Text>
                    <Text style={globalStyles.profileEmail}>{email}</Text>
                    
                    <View style={globalStyles.actionButtons}>
                        <TouchableOpacity style={globalStyles.actionButton} onPress={handleShare}>
                            <Ionicons name="share-outline" size={18} color={theme.colors.primary}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={globalStyles.actionButton} onPress={toggleDarkMode}>
                            <Ionicons name={isDarkMode ? "sunny" : "moon"} size={18} color={theme.colors.primary}/>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ===== INFORMACIÓN PERSONAL ===== */}
                <View style={globalStyles.infoSection}>
                    <Text style={globalStyles.sectionTitle}>Información Personal</Text>
                    <View style={globalStyles.infoList}>
                        <InfoBox icon="peso" label="Peso Actual" value={`${weight} kg`}/>
                        <InfoBox icon="altura" label="Altura" value={`${height} m`} />
                        <InfoBox icon="edad" label="Edad" value={`${age} años`} />
                    </View>
                </View>

                {/* ===== LOGROS ===== */}
                <View style={globalStyles.achievementsSection}>
                    <Text style={globalStyles.sectionTitle}>Logros Recientes</Text>
                    <View style={globalStyles.achievementsList}>
                        <View style={globalStyles.achievementItem}>
                            <View style={globalStyles.achievementIcon}>
                                <Ionicons name="trophy" size={20} color="#FFD700"/>
                            </View>
                            <View style={globalStyles.achievementContent}>
                                <Text style={globalStyles.achievementTitle}>Primera semana completa</Text>
                                <Text style={globalStyles.achievementDesc}>Completaste 7 días de entrenamiento</Text>
                            </View>
            </View>

                        <View style={globalStyles.achievementItem}>
                            <View style={globalStyles.achievementIcon}>
                                <Ionicons name="fitness" size={20} color="#4ECDC4"/>
                            </View>
                            <View style={globalStyles.achievementContent}>
                                <Text style={globalStyles.achievementTitle}>Consistencia</Text>
                                <Text style={globalStyles.achievementDesc}>6 semanas consecutivas de entrenamiento</Text>
                            </View>
                        </View>

                        <View style={globalStyles.achievementItem}>
                            <View style={globalStyles.achievementIcon}>
                                <Ionicons name="star" size={20} color="#FF6B6B"/>
                            </View>
                            <View style={globalStyles.achievementContent}>
                                <Text style={globalStyles.achievementTitle}>Cliente VIP</Text>
                                <Text style={globalStyles.achievementDesc}>Más de 30 días de membresía activa</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* ===== BOTÓN DE EDICIÓN ===== */}
                <TouchableOpacity style={globalStyles.editProfileButton} onPress={handleEditProfile}>
                    <MaterialCommunityIcons name="account-edit" size={18} color="white"/>
                    <Text style={globalStyles.buttonText}>Editar Perfil</Text>
            </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Profile;