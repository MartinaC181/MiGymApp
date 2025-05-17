import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import theme from "../../constants/theme";

// Función hardcode para verificar estados de vista
function getCuotaInfo() {
    // Cambiá este valor para probar ambos estados
    const pendiente = true;

    if (pendiente) {
        return {
            pendiente: true,
            monto: 10213.89,
            nombre: "Teo Risso",
            dni: "40.000.000"
        };
    } else {
        return {
            pendiente: false,
            monto: 0,
            nombre: "Teo Risso",
            dni: "40.000.000"
        };
    }
}

export default function Cuota() {
    const cuota = getCuotaInfo();
    const router = useRouter();

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Cuota</Text>
            </View>

            <View style={styles.container}>
                {/* Si hay cuota pendiente */}
                {cuota.pendiente ? (
                    <>
                        <View style={styles.card}>
                            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                                <Text style={styles.label}>Pago pendiente </Text>
                                <MaterialIcons name="error-outline" size={18} color={theme.colors.error} />
                            </View>
                            <Text style={styles.amount}>${cuota.monto.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</Text>
                            <TouchableOpacity
                                style={styles.payButton}
                                onPress={() => router.push("/facturacion")}
                            >
                                <Text style={styles.payButtonText}>Pagar</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.card}>
                            <Text style={styles.invoiceTitle}>Factura asociada a</Text>
                            <Text style={styles.invoiceText}><Text style={styles.bold}>Nombre:</Text> {cuota.nombre}</Text>
                            <Text style={styles.invoiceText}><Text style={styles.bold}>DNI:</Text> {cuota.dni}</Text>
                            <TouchableOpacity style={styles.payButton}>
                                <Text style={styles.payButtonText}>Factura</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                ) : 
                // Si no hay cuota pendiente
                (
                    <>
                        <View style={styles.card}>
                            <Text style={styles.label}>Pago pendiente</Text>
                            <Text style={styles.amount}>$0</Text>
                        </View>
                        <View style={styles.statusContainer}>
                            <Text style={styles.statusText}>Estás al día con la cuota</Text>
                            <MaterialIcons name="check-circle" size={24} color={theme.colors.success} />
                        </View>
                    </>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: theme.colors.surface,
    },
    header: {
        width: "100%",
        backgroundColor: theme.colors.primary,
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 20,
        paddingBottom: 16,
    },
    title: {
        fontSize: theme.typography.fontSize.title,
        fontFamily: theme.typography.fontFamily.bold,
        color: theme.colors.background,
    },
    container: {
        flex: 1,
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.lg,
    },
    card: {
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg,
        alignItems: "flex-start",
        marginBottom: theme.spacing.lg,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        width: "100%",
    },
    label: {
        color: theme.colors.textSecondary,
        fontSize: theme.typography.fontSize.small,
        fontFamily: theme.typography.fontFamily.medium,
    },
    amount: {
        color: theme.colors.textPrimary,
        fontSize: 32,
        fontFamily: theme.typography.fontFamily.bold,
        marginBottom: theme.spacing.md,
    },
    payButton: {
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borderRadius.md,
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.xl,
        marginTop: theme.spacing.md,
    },
    payButtonText: {
        color: theme.colors.background,
        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily.bold,
        textAlign: "center",
    },
    invoiceTitle: {
        fontFamily: theme.typography.fontFamily.bold,
        fontSize: theme.typography.fontSize.medium,
        marginBottom: theme.spacing.xs,
        color: theme.colors.textPrimary,
    },
    invoiceText: {
        fontSize: theme.typography.fontSize.medium,
        color: theme.colors.textPrimary,
        marginBottom: 2,
    },
    bold: {
        fontFamily: theme.typography.fontFamily.bold,
    },
    statusContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.success,
    },
    statusText: {
        color: theme.colors.primary,
        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily.bold,
        marginRight: theme.spacing.sm,
    },
});