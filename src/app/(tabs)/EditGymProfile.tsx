import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { createGlobalStyles } from "../../styles/global";
import { useTheme } from '../../context/ThemeContext';
import { getCurrentUser, updateUserProfile } from '../../utils/storage';
import { GymUser } from '../../data/Usuario';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';

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
        errorTitle: {
            fontSize: theme.typography.fontSize.large,
            fontFamily: theme.typography.fontFamily.bold,
            color: theme.colors.error,
            marginTop: theme.spacing.md,
            textAlign: 'center',
        },
        errorText: {
            fontSize: theme.typography.fontSize.medium,
            fontFamily: theme.typography.fontFamily.regular,
            color: theme.colors.textSecondary,
            marginTop: theme.spacing.sm,
            textAlign: 'center',
            paddingHorizontal: theme.spacing.lg,
        },
        header: {
            height: 120,
            marginBottom: theme.spacing.lg,
        },
        headerGradient: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: theme.spacing.xl,
        },
        headerTitle: {
            fontSize: theme.typography.fontSize.title,
            fontFamily: theme.typography.fontFamily.bold,
            color: 'white',
            textAlign: 'center',
        },
        headerSubtitle: {
            fontSize: theme.typography.fontSize.medium,
            fontFamily: theme.typography.fontFamily.regular,
            color: 'rgba(255,255,255,0.8)',
            textAlign: 'center',
            marginTop: theme.spacing.xs,
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
        inputContainer: {
            marginBottom: theme.spacing.md,
        },
        inputLabel: {
            fontSize: theme.typography.fontSize.small,
            fontFamily: theme.typography.fontFamily.medium,
            color: theme.colors.textPrimary,
            marginBottom: theme.spacing.xs,
        },
        input: {
            backgroundColor: theme.colors.surface,
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: theme.borderRadius.md,
            padding: theme.spacing.md,
            fontSize: theme.typography.fontSize.medium,
            fontFamily: theme.typography.fontFamily.regular,
            color: theme.colors.textPrimary,
        },
        textArea: {
            backgroundColor: theme.colors.surface,
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: theme.borderRadius.md,
            padding: theme.spacing.md,
            fontSize: theme.typography.fontSize.medium,
            fontFamily: theme.typography.fontFamily.regular,
            color: theme.colors.textPrimary,
            height: 100,
            textAlignVertical: 'top',
        },
        requiredLabel: {
            color: theme.colors.error,
        },
        buttonsContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: theme.spacing.xl,
        },
        cancelButton: {
            flex: 1,
            marginRight: theme.spacing.sm,
            backgroundColor: theme.colors.surface,
            borderWidth: 2,
            borderColor: theme.colors.error,
        },
        saveButton: {
            flex: 1,
            marginLeft: theme.spacing.sm,
        },
        buttonText: {
            fontSize: theme.typography.fontSize.medium,
            fontFamily: theme.typography.fontFamily.bold,
            textAlign: 'center',
        },
        cancelButtonText: {
            color: theme.colors.error,
        },
        saveButtonText: {
            color: 'white',
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
                <Text style={styles.errorText}>No se pudo cargar el perfil del gimnasio</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <LinearGradient
                    colors={theme.colors.gradient1}
                    style={styles.headerGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <Text style={styles.headerTitle}>Editar Perfil</Text>
                    <Text style={styles.headerSubtitle}>Configuración del Gimnasio</Text>
                </LinearGradient>
            </View>

            {/* Contenido */}
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Información básica */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Información Básica</Text>
                    
                    <View style={styles.inputContainer}>
                        <Text style={[styles.inputLabel, styles.requiredLabel]}>
                            Nombre del Negocio *
                        </Text>
                        <TextInput
                            style={styles.input}
                            value={businessName}
                            onChangeText={setBusinessName}
                            placeholder="Nombre del gimnasio"
                            placeholderTextColor={theme.colors.textSecondary}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Dirección</Text>
                        <TextInput
                            style={styles.input}
                            value={address}
                            onChangeText={setAddress}
                            placeholder="Dirección del gimnasio"
                            placeholderTextColor={theme.colors.textSecondary}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Teléfono</Text>
                        <TextInput
                            style={styles.input}
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="+54 11 1234-5678"
                            placeholderTextColor={theme.colors.textSecondary}
                            keyboardType="phone-pad"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={[styles.inputLabel, styles.requiredLabel]}>
                            Email *
                        </Text>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="email@gimnasio.com"
                            placeholderTextColor={theme.colors.textSecondary}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>
                </View>

                {/* Descripción */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Descripción</Text>
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Descripción del Gimnasio</Text>
                        <TextInput
                            style={styles.textArea}
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
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity 
                        style={[globalStyles.LoginButton, styles.cancelButton]}
                        onPress={handleCancel}
                        disabled={saving}
                    >
                        <Text style={[styles.buttonText, styles.cancelButtonText]}>
                            Cancelar
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[globalStyles.LoginButton, styles.saveButton]}
                        onPress={handleSave}
                        disabled={saving}
                    >
                        {saving ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                            <Text style={[styles.buttonText, styles.saveButtonText]}>
                                Guardar
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

export default EditGymProfile; 