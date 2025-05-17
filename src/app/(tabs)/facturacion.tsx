import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import theme from "../../constants/theme";
import globalStyles from "../../styles/global";
import pagoCorrecto from '../../assets/pagocorrecto.png';
import pagoError from '../../assets/pagoerror.png';
import { router } from "expo-router";

// Hardcodea el resultado del pago aquí
const pagoExitoso = true; // Cambia a false para probar el error

export default function Facturacion() {
    const [procesando, setProcesando] = useState(false);
    const [resultado, setResultado] = useState<null | "exito" | "error">(null);

    const handlePagar = () => {
        setProcesando(true);
        setTimeout(() => {
            setProcesando(false);
            setResultado(pagoExitoso ? "exito" : "error");
        }, 3000);
    };

    // Pantalla de procesando
    if (procesando) {
        return (
            <SafeAreaView style={[globalStyles.safeArea, styles.center]}>
                <Text style={styles.procesandoText}>Procesando pago</Text>
                <ActivityIndicator size={60} color="#888" style={{ marginTop: 32 }} />
            </SafeAreaView>
        );
    }

    // Pantalla de resultado
    if (resultado) {
        return (
            <SafeAreaView style={[globalStyles.safeArea, styles.center]}>
                <Text
                    style={[
                        styles.resultadoText,
                        { color: resultado === "exito" ? theme.colors.primary : theme.colors.error }
                    ]}
                >
                    {resultado === "exito" ? "¡Todo listo!" : "Algo salió mal"}
                </Text>
                <Image
                    source={resultado === "exito" ? pagoCorrecto : pagoError}
                    style={styles.resultadoImg}
                    resizeMode="contain"
                />
                <TouchableOpacity onPress={() => { router.push("/home") }} style={{ marginTop: 32 }}>
                    <Text style={styles.volverText}>Volver al inicio</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    // Pantalla de formulario
    return (
        <SafeAreaView style={globalStyles.safeArea}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Facturación</Text>
            </View>

            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <MaterialIcons name="credit-card" size={28} color={theme.colors.primary} />
                    <Text style={styles.title}>Información de la tarjeta</Text>
                </View>

                <Text style={globalStyles.label}>Nombre en la tarjeta</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nombre/Apellido"
                    placeholderTextColor={theme.colors.textSecondary}
                />

                <Text style={globalStyles.label}>Número de tarjeta</Text>
                <TextInput
                    style={styles.input}
                    placeholder="0000 0000 0000 0000"
                    placeholderTextColor={theme.colors.textSecondary}
                    keyboardType="numeric"
                    maxLength={19}
                />

                <View style={styles.row}>
                    <View style={{ flex: 1, marginRight: theme.spacing.sm }}>
                        <Text style={globalStyles.label}>Vencimiento</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="00/00"
                            placeholderTextColor={theme.colors.textSecondary}
                            keyboardType="numeric"
                            maxLength={5}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={globalStyles.label}>CVV</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="000"
                            placeholderTextColor={theme.colors.textSecondary}
                            keyboardType="numeric"
                            maxLength={4}
                            secureTextEntry
                        />
                    </View>
                </View>

                <TouchableOpacity style={styles.payButton} onPress={handlePagar}>
                    <Text style={styles.payButtonText}>Pagar</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        width: "100%",
        backgroundColor: theme.colors.primary,
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 20,
        paddingBottom: 16,
    },
    headerTitle: {
        fontSize: theme.typography.fontSize.title,
        fontFamily: theme.typography.fontFamily.bold,
        color: theme.colors.background,
    },
    container: {
        flex: 1,
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.lg,
    },
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: theme.spacing.lg,
        marginTop: theme.spacing.md,
    },
    title: {
        fontSize: theme.typography.fontSize.large,
        fontFamily: theme.typography.fontFamily.bold,
        color: theme.colors.textPrimary,
        marginLeft: theme.spacing.sm,
    },
    input: {
        ...globalStyles.input,
        marginBottom: theme.spacing.md,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: theme.spacing.md,
    },
    payButton: {
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borderRadius.md,
        paddingVertical: theme.spacing.md,
        alignItems: "center",
        marginTop: theme.spacing.lg,
    },
    payButtonText: {
        color: theme.colors.background,
        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily.bold,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.surface,
    },
    procesandoText: {
        fontSize: theme.typography.fontSize.large,
        fontFamily: theme.typography.fontFamily.bold,
        color: theme.colors.textPrimary,
        marginBottom: 24,
        textAlign: "center",
    },
    resultadoText: {
        fontSize: theme.typography.fontSize.title,
        fontFamily: theme.typography.fontFamily.bold,
        marginBottom: 16,
        textAlign: "center",
    },
    resultadoImg: {
        width: 220,
        height: 260,
        marginBottom: 24,
    },
    volverText: {
        color: theme.colors.primary,
        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily.regular,
        textAlign: "center",
        textDecorationLine: "underline",
    },
});