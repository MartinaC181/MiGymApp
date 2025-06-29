import React from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import theme from '../constants/theme';

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
    backgroundColor = theme.colors.primary,
    iconColor = '#FFFFFF',
    bottom = 50,
    right = 24,
    showLabel = true,
    label = 'Nueva Clase'
}: FloatingActionButtonProps) {
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
                        backgroundColor,
                    }
                ]}
                onPress={onPress}
            >
                <MaterialIcons name={icon} size={size} color={iconColor} />
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
        width: 56,
        height: 56,
        borderRadius: 28,
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