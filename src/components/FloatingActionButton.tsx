import React from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import theme from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

interface FloatingActionButtonProps {
    onPress: () => void;
    icon?: keyof typeof MaterialIcons.glyphMap;
    size?: number;
    backgroundColor?: string;
    iconColor?: string;
    bottom?: number;
    right?: number;
    showLabel?: boolean;
    label?: string;
}

export default function FloatingActionButton({
    onPress,
    icon = 'library-add',
    size = 28,
    backgroundColor,
    iconColor,
    bottom = 50,
    right = 24,
    showLabel = true,
    label = 'Nueva Clase'
}: FloatingActionButtonProps) {
    const { theme, isDarkMode } = useTheme();
    // Color de fondo por defecto
    const fabBackgroundColor = backgroundColor || theme.colors.primary;
    // Color de ícono: negro en darkmode, blanco en lightmode
    const fabIconColor = iconColor || (isDarkMode ? '#111111' : '#FFFFFF');
    return (
        <View style={[styles.fabContainer, { bottom, right }]}>
            {showLabel && (
                <View style={styles.labelContainer}>
                    <Text style={styles.labelText}>{label}</Text>
                </View>
            )}
            <TouchableOpacity 
                style={[
                    styles.fabButton,
                    {
                        backgroundColor: fabBackgroundColor,
                    }
                ]}
                onPress={onPress}
            >
                <MaterialIcons name={icon} size={size} color={fabIconColor} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    fabContainer: {
        position: 'absolute',
        alignItems: 'center',
    },
    fabButton: {
        width: 65,
        height: 65,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    labelContainer: {
        backgroundColor: '#b3dcec',
        borderRadius: theme.borderRadius.sm,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        marginBottom: theme.spacing.xs,
    },
    labelText: {
        color: theme.colors.textPrimary,
        fontSize: theme.typography.fontSize.small,
        fontFamily: theme.typography.fontFamily.regular,
        textAlign: 'center',
    },
}); 