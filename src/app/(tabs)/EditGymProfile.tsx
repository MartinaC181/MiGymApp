import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { createGlobalStyles } from "../../styles/global";
import { useTheme } from '../../context/ThemeContext';
import { getCurrentUser, updateUserProfile } from '../../utils/storage';
import { GymUser } from '../../data/Usuario';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import styles from '../../styles/gestion-gimnasio';
import globalStyles from '../../styles/global';

const EditGymProfile = () => {
    const router = useRouter();
    const { theme, isDarkMode } = useTheme();
    const globalStyles = createGlobalStyles(theme);
    const [gymData, setGymData] = useState<GymUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    // Estados para los campos editables
    const [businessName, setBusinessName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        loadGymData();
    }, []);

    const loadGymData = async () => {
        try {
            const user = await getCurrentUser() as GymUser;
            if (user && user.role === 'gym') {
                setGymData(user);
                setBusinessName(user.businessName || '');
                setAddress(user.address || '');
                setPhone(user.phone || '');
                setEmail(user.email || '');
                setDescription(user.description || '');
            } else {
                Alert.alert('Error', 'No tienes permisos para editar este perfil');
                router.back();
            }
        } catch (error) {
            console.error('Error cargando datos del gimnasio:', error);
            Alert.alert('Error', 'No se pudieron cargar los datos del gimnasio');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!gymData) return;

        // Validaciones básicas
        if (!businessName.trim()) {
            Alert.alert('Error', 'El nombre del negocio es obligatorio');
            return;
        }

        if (!email.trim()) {
            Alert.alert('Error', 'El email es obligatorio');
            return;
        }

        setSaving(true);
        try {
            const updatedGym: Partial<GymUser> = {
                businessName: businessName.trim(),
                address: address.trim(),
                phone: phone.trim(),
                email: email.trim(),
                description: description.trim(),
            };

            const result = await updateUserProfile(gymData.id, updatedGym);
            
            if (result) {
                Alert.alert(
                    'Éxito', 
                    'Perfil del gimnasio actualizado correctamente',
                    [{ text: 'OK', onPress: () => router.back() }]
                );
            } else {
                Alert.alert('Error', 'No se pudo actualizar el perfil');
            }
        } catch (error) {
            console.error('Error guardando perfil:', error);
            Alert.alert('Error', 'No se pudo guardar el perfil');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        Alert.alert(
            'Cancelar',
            '¿Estás seguro de que quieres cancelar? Los cambios no guardados se perderán.',
            [
                { text: 'No', style: 'cancel' },
                { text: 'Sí', onPress: () => router.back() }
            ]
        );
    };

    const localStyles = StyleSheet.create({
        section: {
            marginBottom: theme.spacing.xl,
        },
        loadingText: {
            fontSize: theme.typography.fontSize.medium,
            fontFamily: theme.typography.fontFamily.regular,
            color: theme.colors.textSecondary,
            textAlign: 'center',
            marginTop: theme.spacing.md,
        },
        buttonText: {
            fontSize: theme.typography.fontSize.medium,
            fontFamily: theme.typography.fontFamily.bold,
            textAlign: 'center',
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

    if (!gymData) {
        return (
            <View style={[globalStyles.container, { justifyContent: 'center' }]}>
                <MaterialCommunityIcons 
                    name="alert-circle-outline" 
                    size={64} 
                    color={theme.colors.error} 
                />
                <Text style={styles.errorTitle}>Error</Text>
                <Text style={styles.centralErrorText}>No se pudo cargar el perfil del gimnasio</Text>
            </View>
        );
    }

    return (
        <View style={globalStyles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.headerSection}>
                    <Text style={styles.sectionTitle}>Editar Perfil del Gimnasio</Text>
                    <Text style={styles.sectionSubtitle}>
                        Actualiza la información de tu gimnasio para que tus socios puedan conocerte mejor
                    </Text>
                </View>

                <View style={styles.clasesContainer}>
                    {/* Información básica */}
                    <View style={localStyles.section}>
                        <Text style={styles.centralFormSectionTitle}>Información Básica</Text>
                        
                        <View style={styles.inputContainer}>
                            <Text style={[styles.smallInputLabel, styles.requiredLabelHighlight]}>
                                Nombre del Negocio *
                            </Text>
                            <TextInput
                                style={styles.baseInput}
                                value={businessName}
                                onChangeText={setBusinessName}
                                placeholder="Ej: Gimnasio FitLife"
                                placeholderTextColor={theme.colors.textSecondary}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={[styles.smallInputLabel, styles.requiredLabelHighlight]}>
                                Email *
                            </Text>
                            <TextInput
                                style={styles.baseInput}
                                value={email}
                                onChangeText={setEmail}
                                placeholder="contacto@gimnasio.com"
                                placeholderTextColor={theme.colors.textSecondary}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.smallInputLabel}>Dirección</Text>
                            <TextInput
                                style={styles.baseInput}
                                value={address}
                                onChangeText={setAddress}
                                placeholder="Ej: Av. Principal 1234, Ciudad"
                                placeholderTextColor={theme.colors.textSecondary}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.smallInputLabel}>Teléfono</Text>
                            <TextInput
                                style={styles.baseInput}
                                value={phone}
                                onChangeText={setPhone}
                                placeholder="Ej: +54 11 1234-5678"
                                placeholderTextColor={theme.colors.textSecondary}
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>

                    {/* Descripción */}
                    <View style={localStyles.section}>
                        <Text style={styles.centralFormSectionTitle}>Descripción</Text>
                        <View style={styles.inputContainer}>
                            <Text style={styles.smallInputLabel}>Descripción del Gimnasio</Text>
                            <TextInput
                                style={styles.centralTextAreaInput}
                                value={description}
                                onChangeText={setDescription}
                                placeholder="Describe tu gimnasio, servicios, equipamiento, etc."
                                placeholderTextColor={theme.colors.textSecondary}
                                multiline
                                numberOfLines={4}
                            />
                        </View>
                    </View>

                    {/* Botones */}
                    <View style={styles.buttonsContainerXL}>
                        <TouchableOpacity 
                            style={[globalStyles.LoginButton, styles.cancelButtonDanger]}
                            onPress={handleCancel}
                            disabled={saving}
                        >
                            <Text style={[localStyles.buttonText, styles.cancelButtonDangerText]}>
                                Cancelar
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={[globalStyles.LoginButton, { flex: 1, marginLeft: theme.spacing.sm }]}
                            onPress={handleSave}
                            disabled={saving}
                        >
                            {saving ? (
                                <ActivityIndicator size="small" color="white" />
                            ) : (
                                <Text style={[localStyles.buttonText, { color: 'white' }]}>
                                    Guardar
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default EditGymProfile; 