import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, Switch, TouchableOpacity, Share, Alert} from 'react-native';

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
import TerminosModal from "../../components/TerminosModal";
import PoliticasModal from "../../components/PoliticasModal";
import SobreAppModal from "../../components/SobreAppModal";

const Settings = () => {

    const router = useRouter();
    const { theme, isDarkMode, toggleTheme } = useTheme();
    const globalStyles = createGlobalStyles(theme);
    const [showTerminos, setShowTerminos] = useState(false);
    const [showPoliticas, setShowPoliticas] = useState(false);
    const [showSobreApp, setShowSobreApp] = useState(false);

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

    const items = [
        {
            icon: aboutIcon, label: 'Sobre la app', onPress: () => {
                setShowSobreApp(true);
            }
        },
        {
            icon: termsIcon, label: 'Términos y condiciones', onPress: () => {
                setShowTerminos(true);
            }
        },
        {
            icon: privacyIcon, label: 'Políticas de privacidad', onPress: () => {
                setShowPoliticas(true);
            }
        },
        {
            icon: shareIcon, label: 'Compartir esta aplicación', onPress: handleShareApp
        },


    ];

    return (
        <View style={globalStyles.safeArea}>
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

            </View>

            {/* Modal de Términos y Condiciones */}
            <TerminosModal
                visible={showTerminos}
                onClose={() => setShowTerminos(false)}
            />

            {/* Modal de Políticas de Privacidad */}
            <PoliticasModal
                visible={showPoliticas}
                onClose={() => setShowPoliticas(false)}
            />

            {/* Modal de Sobre la App */}
            <SobreAppModal
                visible={showSobreApp}
                onClose={() => setShowSobreApp(false)}
            />

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
    }


});
