import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, Switch, TouchableOpacity, Share, Alert, Modal, ScrollView} from 'react-native';

import modeIcon from '../../../assets/settings/modoscuro.png';
import changeIcon from '../../../assets/settings/llave.png';
import aboutIcon from '../../../assets/settings/sobreapp.png';
import termsIcon from '../../../assets/settings/terminos.png';
import privacyIcon from '../../../assets/settings/seguridad.png';
import shareIcon from '../../../assets/settings/compartir.png';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {useRouter} from "expo-router";
import { createGlobalStyles } from "../../styles/global";
import { useTheme } from "../../context/ThemeContext";
import { clearSession } from "../../utils/storage";

const Settings = () => {

    const router = useRouter();
    const { theme, isDarkMode, toggleTheme } = useTheme();
    const globalStyles = createGlobalStyles(theme);
    const [showTerminos, setShowTerminos] = useState(false);
    const [showPoliticas, setShowPoliticas] = useState(false);
    const [showSobreApp, setShowSobreApp] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleShareApp = async () => {
        try {
            const result = await Share.share({
                title: 'MiGymApp - Gestiona tu Fitness',
                message: '¡Descubre MiGymApp! La aplicación perfecta para gestionar tu membresía de gimnasio, marcar asistencia y realizar seguimiento de tu progreso fitness. ¡Descárgala ahora y comienza tu camino hacia una vida más saludable!',
                url: 'https://migymapp.com', // Reemplaza con la URL real de tu app
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // Compartido con una actividad específica
                } else {
                    // Compartido
                }
            } else if (result.action === Share.dismissedAction) {
                // Cancelado
            }
        } catch (error) {
            Alert.alert(
                'Error',
                'No se pudo compartir la aplicación. Inténtalo de nuevo.',
                [{ text: 'OK' }]
            );
        }
    };

    const handleLogout = async () => {
        setShowLogoutModal(false);
        await clearSession(); // Limpiar la sesión de AsyncStorage
        router.replace("/login"); // replace para limpiar el stack
    };

    const handleCancelLogout = () => {
        setShowLogoutModal(false);
    };

    const items = [
        {
            icon: aboutIcon, label: 'Sobre la app', onPress: () => {
                router.push('/(tabs)/SobreApp');
            }
        },
        {
            icon: termsIcon, label: 'Términos y condiciones', onPress: () => {
                router.push('/(tabs)/TerminosCondiciones');
            }
        },
        {
            icon: privacyIcon, label: 'Políticas de privacidad', onPress: () => {
                router.push('/(tabs)/PoliticasPrivacidad');
            }
        },
        {
            icon: shareIcon, label: 'Compartir esta aplicación', onPress: handleShareApp
        },


    ];

    // Agregar acceso al debug sólo en modo desarrollo
    if (__DEV__) {
        items.push({
            icon: aboutIcon,
            label: 'Debug Storage',
            onPress: () => router.push('/debug-storage'),
        });
    }

    return (
        <View style={globalStyles.safeArea}>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
                <View style={[styles.container, { backgroundColor: theme.colors.background }]}>

                    <Text style={[styles.groupTitle, { color: theme.colors.textSecondary }]}> Configuración general</Text>

                    <View style={styles.row}>
                        <View style={styles.rowLeft}>
                            <Image 
                                source={modeIcon} 
                                style={[
                                    styles.icon, 
                                    { tintColor: isDarkMode ? '#ffffff' : undefined }
                            ]}
                            />
                            <Text style={[styles.label, { color: theme.colors.textPrimary }]}> Modo</Text>
                        </View>

                        <Switch
                            value={isDarkMode} 
                            onValueChange={toggleTheme}
                            trackColor={{false: '#767577', true: '#81b0ff'}}
                            thumbColor={isDarkMode ? '#f5dd4b' : '#f4f3f4'}
                            ios_backgroundColor="#3e3e3e"
                        />
                    </View>

                    <Text style={[styles.rowDescription, { color: theme.colors.textSecondary }]}>Claro u oscuro</Text>

                    <TouchableOpacity style={styles.row} onPress={() => router.push('/reset-password')}>
                        <View style={styles.rowLeft}>
                            <Image 
                                source={changeIcon} 
                                style={[
                                    styles.icon, 
                                    { tintColor: isDarkMode ? '#ffffff' : undefined }
                            ]}
                            />
                            <Text style={[styles.label, { color: theme.colors.textPrimary }]}>Cambiar contraseña</Text>

                        </View>
                        <MaterialCommunityIcons name="chevron-right" size={24} color={theme.colors.textSecondary}/>

                    </TouchableOpacity>

                    <Text style={[styles.groupTitle, {marginTop: theme.spacing.lg, color: theme.colors.textSecondary}]}>Información</Text>
                    {items.map((item) => (
                        <TouchableOpacity key={item.label} style={styles.row} onPress={item.onPress}>
                            <View style={styles.rowLeft}>
                                <Image 
                                    source={item.icon} 
                                    style={[
                                        styles.icon, 
                                        { tintColor: isDarkMode ? '#ffffff' : undefined }
                                    ]}
                                />
                                <Text style={[styles.label, { color: theme.colors.textPrimary }]}>{item.label}</Text>
                            </View>
                            <MaterialCommunityIcons name="chevron-right" size={24} color={theme.colors.textSecondary}/>
                        </TouchableOpacity>))
                    }

                    {/* Botón Cerrar sesión */}
                    <View style={[styles.logoutContainer, {marginTop: theme.spacing.xl}]}>
                        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: theme.colors.primary }]} onPress={() => setShowLogoutModal(true)}>
                            <Text style={[styles.logoutButtonText, { color: '#FFFFFF' }]}>Cerrar sesión</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </ScrollView>

            {/* Modal de confirmación de logout */}
            <Modal
                visible={showLogoutModal}
                transparent={true}
                animationType="fade"
                onRequestClose={handleCancelLogout}
            >
                <View style={styles.modalOverlay}>
                    <View style={[
                        styles.modalContainer, 
                        { 
                            backgroundColor: isDarkMode ? '#2a2a2a' : theme.colors.background,
                            borderWidth: isDarkMode ? 1 : 0,
                            borderColor: isDarkMode ? '#404040' : 'transparent'
                        }
                    ]}>
                        <Text style={[
                            styles.modalTitle, 
                            { color: theme.colors.textPrimary }
                        ]}>
                            Cerrar sesión
                        </Text>
                        <Text style={[
                            styles.modalMessage, 
                            { color: theme.colors.textSecondary }
                        ]}>
                            ¿Estás seguro que querés cerrar tu sesión?
                        </Text>
                        
                        <View style={styles.modalButtons}>
                            <TouchableOpacity 
                                style={[
                                    styles.cancelButton, 
                                    { 
                                        backgroundColor: isDarkMode ? '#404040' : theme.colors.surface,
                                        borderWidth: isDarkMode ? 1 : 0,
                                        borderColor: isDarkMode ? '#606060' : 'transparent'
                                    }
                                ]} 
                                onPress={handleCancelLogout}
                            >
                                <Text style={[
                                    styles.cancelButtonText, 
                                    { color: isDarkMode ? '#ffffff' : theme.colors.textSecondary }
                                ]}>
                                    Cancelar
                                </Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={[
                                    styles.confirmButton, 
                                    { backgroundColor: theme.colors.primary }
                                ]} 
                                onPress={handleLogout}
                            >
                                <Text style={[
                                    styles.confirmButtonText, 
                                    { color: isDarkMode ? '#000000' : '#ffffff' }
                                ]}>
                                    Cerrar sesión
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
        ;
};

export default Settings;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24, // Usando el valor directo ya que theme se aplica dinámicamente
    },

    groupTitle: {
        fontSize: 12, // Usando el valor directo ya que theme se aplica dinámicamente
        fontFamily: 'Roboto-Medium',
        marginBottom: 16, // Usando el valor directo ya que theme se aplica dinámicamente
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8, // Usando el valor directo ya que theme se aplica dinámicamente
    },
    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    icon: {
        width: 24,
        height: 24,
        marginRight: 16, // Usando el valor directo ya que theme se aplica dinámicamente
        resizeMode: "contain",
    },
    label: {
        fontSize: 14, // Usando el valor directo ya que theme se aplica dinámicamente
        fontFamily: 'Roboto-Regular',
    },
    rowDescription: {
        fontSize: 12, // Usando el valor directo ya que theme se aplica dinámicamente
        fontFamily: 'Roboto-Regular',
        marginLeft: 40, // 24 + 16
        marginBottom: 16, // Usando el valor directo ya que theme se aplica dinámicamente
    },

    // Estilos para el botón de cerrar sesión
    logoutContainer: {
        alignItems: 'center',
        paddingVertical: 16,
    },
    logoutButton: {
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 8,
        minWidth: 200,
        alignItems: 'center',
    },
    logoutButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontFamily: 'Roboto-Medium',
    },

    // Estilos del modal (reutilizados de Header.tsx)
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        borderRadius: 12,
        padding: 24,
        margin: 16,
        minWidth: 300,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontFamily: 'Roboto-Bold',
        textAlign: 'center',
        marginBottom: 12,
    },
    modalMessage: {
        fontSize: 16,
        fontFamily: 'Roboto-Regular',
        textAlign: 'center',
        marginBottom: 24,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        fontFamily: 'Roboto-Medium',
    },
    confirmButton: {
        flex: 1,
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
    },
    confirmButtonText: {
        fontSize: 16,
        fontFamily: 'Roboto-Medium',
    },
});
