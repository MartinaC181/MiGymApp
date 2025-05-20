import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, Switch, TouchableOpacity} from 'react-native';

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

const Settings = () => {

    const router = useRouter();
    const [darkMode, setDarkMode] = useState(false);

    const items = [
        {
            icon: aboutIcon, label: 'Sobre la app', onPress: () => {
            }
        },
        {
            icon: termsIcon, label: 'Términos y condiciones', onPress: () => {
            }
        },
        {
            icon: privacyIcon, label: 'Políticas de privacidad', onPress: () => {
            }
        },
        {
            icon: shareIcon, label: 'Compartir esta aplicación', onPress: () => {
            }
        },


    ];

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

                <TouchableOpacity style={styles.row} onPress={() => router.push('/changePassword')}>
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
