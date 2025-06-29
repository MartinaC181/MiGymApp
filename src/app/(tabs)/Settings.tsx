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
import globalStyles from "../../styles/global";
import theme from "../../constants/theme";
import TerminosModal from "../../components/TerminosModal";
import PoliticasModal from "../../components/PoliticasModal";
import SobreAppModal from "../../components/SobreAppModal";

const Settings = () => {

    const router = useRouter();
    const [darkMode, setDarkMode] = useState(false);
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
                    console.log('Compartido con:', result.activityType);
                } else {
                    // Compartido
                    console.log('Compartido exitosamente');
                }
            } else if (result.action === Share.dismissedAction) {
                // Cancelado
                console.log('Compartir cancelado');
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
            <View style={styles.container}>

                <Text style={styles.groupTitle}> Configuración general</Text>

                <View style={styles.row}>
                    <View style={styles.rowLeft}>
                        <Image source={modeIcon} style={styles.icon}/>
                        <Text style={styles.label}> Modo</Text>
                    </View>

                    <Switch
                        value={darkMode} onValueChange={setDarkMode}
                        trackColor={{false: theme.colors.surface, true: theme.colors.primary}}
                        thumbColor={theme.colors.background}
                    />
                </View>

                <Text style={styles.rowDescription}>Claro u oscuro</Text>

                <TouchableOpacity style={styles.row} onPress={() => router.push('/reset-password')}>
                    <View style={styles.rowLeft}>
                        <Image source={changeIcon} style={styles.icon}/>
                        <Text style={styles.label}>Cambiar contraseña</Text>

                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={24} color={theme.colors.textSecondary}/>

                </TouchableOpacity>

                <Text style={[styles.groupTitle, {marginTop: theme.spacing.lg}]}>Información</Text>
                {items.map((item) => (
                    <TouchableOpacity key={item.label} style={styles.row} onPress={item.onPress}>
                        <View style={styles.rowLeft}>
                            <Image source={item.icon} style={styles.icon}/>
                            <Text style={styles.label}>{item.label}</Text>
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
        padding: theme.spacing.lg,
    },

    groupTitle: {
        fontSize: theme.typography.fontSize.small,
        fontFamily: theme.typography.fontFamily.medium,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.md,
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: theme.spacing.sm,
    },
    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    icon: {
        width: 24,
        height: 24,
        marginRight: theme.spacing.md,
        resizeMode: "contain",
    },
    label: {
        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily.regular,
        color: theme.colors.textPrimary,
    },
    rowDescription: {
        fontSize: theme.typography.fontSize.small,
        fontFamily: theme.typography.fontFamily.regular,
        color: theme.colors.textSecondary,
        marginLeft: 24 + theme.spacing.md,
        marginBottom: theme.spacing.md,
    }


});
