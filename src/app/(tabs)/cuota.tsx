import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Modal, StatusBar, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import theme from "../../constants/theme";
import globalStyles from "../../styles/global";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

// Función hardcode para verificar estados de vista
function getCuotaInfo(pendiente: boolean) {
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

// Objeto con los datos de factura
const getFacturaData = (cuotaInfo: any) => {
    return {
        numeroFactura: "#2024-001",
        fechaEmision: "15/01/2024",
        fechaVencimiento: "15/02/2024",
        cliente: cuotaInfo.nombre,
        dni: cuotaInfo.dni,
        servicio: "Membresía Gimnasio",
        periodo: "Enero 2024",
        monto: cuotaInfo.monto,
        items: [
            {
                descripcion: "Membresía Mensual",
                cantidad: 1,
                precioUnitario: 10213.89,
                subtotal: 10213.89
            }
        ],
        total: cuotaInfo.monto
    };
};

export default function Cuota() {
    const [pendiente, setPendiente] = useState(true);
    const cuota = getCuotaInfo(pendiente);
    const factura = getFacturaData(cuota);
    const router = useRouter();
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);

    // Efecto para cambiar el StatusBar cuando el modal esté abierto
    useEffect(() => {
        if (showInvoiceModal) {
            // Hacer la barra de estado transparente cuando el modal esté abierto
            StatusBar.setBarStyle('light-content');
            StatusBar.setBackgroundColor('rgba(0, 0, 0, 0.5)');
            StatusBar.setTranslucent(true);
        } else {
            // Restaurar la barra de estado original
            StatusBar.setBarStyle('light-content');
            StatusBar.setBackgroundColor(theme.colors.primary);
            StatusBar.setTranslucent(true);
        }
    }, [showInvoiceModal]);


    // Función para generar y descargar la factura
    const handleDownloadInvoice = async () => {
        try {
            // Generar contenido de la factura en formato texto
            const invoiceContent = `
FACTURA
${factura.numeroFactura}

Fecha de Emisión: ${factura.fechaEmision}
Fecha de Vencimiento: ${factura.fechaVencimiento}

CLIENTE:
Nombre: ${factura.cliente}
DNI: ${factura.dni}

SERVICIO:
${factura.servicio}
Período: ${factura.periodo}

DETALLE:
${factura.items.map(item => 
    `${item.descripcion} - Cantidad: ${item.cantidad} - Precio: $${item.precioUnitario.toLocaleString("es-AR", { minimumFractionDigits: 2 })} - Subtotal: $${item.subtotal.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`
).join('\n')}

TOTAL A PAGAR: $${factura.total.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
            `.trim();

            // Crear archivo temporal
            const fileName = `factura_${factura.numeroFactura.replace('#', '').replace('-', '_')}.txt`;
            const fileUri = `${FileSystem.documentDirectory}${fileName}`;
            
            await FileSystem.writeAsStringAsync(fileUri, invoiceContent, {
                encoding: FileSystem.EncodingType.UTF8,
            });

            // Verificar si se puede compartir
            const isAvailable = await Sharing.isAvailableAsync();
            if (isAvailable) {
                await Sharing.shareAsync(fileUri, {
                    mimeType: 'text/plain',
                    dialogTitle: 'Descargar Factura',
                });
            } else {
                Alert.alert(
                    'Descarga completada',
                    `La factura se ha guardado como: ${fileName}`,
                    [{ text: 'OK' }]
                );
            }
        } catch (error) {
            console.error('Error al descargar la factura:', error);
            Alert.alert(
                'Error',
                'No se pudo descargar la factura. Inténtalo de nuevo.',
                [{ text: 'OK' }]
            );
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Botón provisorio para cambiar estado */}
                <View style={styles.devContainer}>
                    <Text style={styles.devLabel}>🔧 DESARROLLO</Text>
                    <TouchableOpacity 
                        style={styles.toggleButton}
                        onPress={() => setPendiente(!pendiente)}
                    >
                        <Text style={styles.toggleButtonText}>
                            {pendiente ? "Cambiar a PAGADO" : "Cambiar a PENDIENTE"}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Si hay cuota pendiente */}
                {cuota.pendiente ? (
                    <>
                        <View style={globalStyles.card}>
                            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                                <Text style={styles.label}>Pago pendiente </Text>
                                <MaterialIcons name="error-outline" size={18} color={theme.colors.error} />
                            </View>
                            <Text style={styles.amount}>${cuota.monto.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</Text>
                            
                            {/* Botones de pago */}
                            <View style={styles.paymentButtonsContainer}>
                            <TouchableOpacity
                                style={styles.payButton}
                                onPress={() => router.push("/facturacion")}
                            >
                                <Text style={globalStyles.buttonText}>Pagar</Text>
                            </TouchableOpacity>
                            </View>
                        </View>
                        <View style={globalStyles.card}>
                            <Text style={styles.invoiceTitle}>Factura asociada</Text>
                            
                            {/* Información de la factura */}
                            <View style={styles.invoiceInfoContainer}>
                                <View style={styles.invoiceRow}>
                                    <Text style={styles.invoiceLabel}>Número:</Text>
                                    <Text style={styles.invoiceValue}>{factura.numeroFactura}</Text>
                                </View>
                                
                                <View style={styles.invoiceRow}>
                                    <Text style={styles.invoiceLabel}>Emisión:</Text>
                                    <Text style={styles.invoiceValue}>{factura.fechaEmision}</Text>
                                </View>
                                
                                <View style={styles.invoiceRow}>
                                    <Text style={styles.invoiceLabel}>Vencimiento:</Text>
                                    <Text style={styles.invoiceValue}>{factura.fechaVencimiento}</Text>
                                </View>
                                
                                <View style={styles.invoiceRow}>
                                    <Text style={styles.invoiceLabel}>Cliente:</Text>
                                    <Text style={styles.invoiceValue}>{factura.cliente}</Text>
                                </View>
                                
                                <View style={styles.invoiceRow}>
                                    <Text style={styles.invoiceLabel}>DNI:</Text>
                                    <Text style={styles.invoiceValue}>{factura.dni}</Text>
                                </View>
                                
                                <View style={styles.invoiceRow}>
                                    <Text style={styles.invoiceLabel}>Servicio:</Text>
                                    <Text style={styles.invoiceValue}>{factura.servicio}</Text>
                                </View>
                                
                                <View style={styles.invoiceRow}>
                                    <Text style={styles.invoiceLabel}>Período:</Text>
                                    <Text style={styles.invoiceValue}>{factura.periodo}</Text>
                                </View>
                                
                                <View style={styles.totalRow}>
                                    <Text style={styles.totalLabel}>TOTAL:</Text>
                                    <Text style={styles.totalAmount}>${factura.total.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</Text>
                                </View>
                            </View>
                            
                            <TouchableOpacity 
                                style={styles.downloadButton}
                                onPress={handleDownloadInvoice}
                            >
                                <MaterialIcons name="download" size={20} color={theme.colors.background} />
                                <Text style={styles.downloadButtonText}>DESCARGAR FACTURA</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                ) : 
                // Si no hay cuota pendiente
                (
                    <>
                        <View style={globalStyles.card}>
                            <View style={styles.paidStatusContainer}>
                                <View style={styles.paidTextContainer}>
                                    <View style={styles.paidTitleContainer}>
                                        <Text style={styles.paidTitle}>Cuota al día</Text>
                                        <MaterialIcons name="check-circle" size={18} color={theme.colors.success} />
                                    </View>
                                    <Text style={styles.paidAmount}>$0</Text>
                                    <Text style={styles.paidSubtitle}>No tienes pagos pendientes</Text>
                                </View>
                            </View>
                        </View>
                        
                        <View style={globalStyles.card}>
                            <Text style={styles.infoTitle}>Información de membresía</Text>
                            <View style={styles.infoRow}>
                                <MaterialIcons name="calendar-today" size={18} color={theme.colors.textSecondary} />
                                <Text style={styles.infoLabel}>Último pago:</Text>
                                <Text style={styles.infoValue}>15/01/2024</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <MaterialIcons name="schedule" size={18} color={theme.colors.textSecondary} />
                                <Text style={styles.infoLabel}>Próximo vencimiento:</Text>
                                <Text style={styles.infoValue}>15/02/2024</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <MaterialIcons name="account-circle" size={18} color={theme.colors.textSecondary} />
                                <Text style={styles.infoLabel}>Estado:</Text>
                                <Text style={[styles.infoValue, { color: theme.colors.success }]}>Activo</Text>
                            </View>
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
    container: {
        flex: 1,
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.lg,
    },
    label: {
        color: theme.colors.textSecondary,
        fontSize: theme.typography.fontSize.medium,
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
        paddingVertical: theme.spacing.xs,
        paddingHorizontal: theme.spacing.sm,
        marginTop: theme.spacing.md,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        minHeight: 36,
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
    paymentButtonsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: theme.spacing.sm,
    },
    mercadopagoButton: {
        backgroundColor: "#009EE3", // Color oficial de Mercado Pago
        borderRadius: theme.borderRadius.md,
        paddingVertical: theme.spacing.xs,
        paddingHorizontal: theme.spacing.sm,
        marginTop: theme.spacing.md,
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 36,
        shadowColor: "#009EE3",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    mpLogoContainer: {
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.sm,
        paddingVertical: 4,
        paddingHorizontal: 6,
        marginRight: theme.spacing.sm,
        alignItems: "center",
        justifyContent: "center",
    },
    mercadopagoText: {
        color: theme.colors.background,
        fontSize: theme.typography.fontSize.small,
        fontFamily: theme.typography.fontFamily.bold,
    },
    invoiceButton: {
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borderRadius.md,
        paddingVertical: theme.spacing.xs,
        paddingHorizontal: theme.spacing.sm,
        marginTop: theme.spacing.md,
        alignItems: "center",
        justifyContent: "center",
        minHeight: 36,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        paddingTop: StatusBar.currentHeight || 0,
    },
    modalContent: {
        backgroundColor: theme.colors.background,
        padding: theme.spacing.lg,
        borderRadius: theme.borderRadius.lg,
        width: "80%",
        maxHeight: "80%",
        alignItems: "center",
    },
    modalHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: theme.spacing.md,
    },
    modalTitle: {
        fontFamily: theme.typography.fontFamily.bold,
        fontSize: theme.typography.fontSize.medium,
        color: theme.colors.textPrimary,
    },
    closeIcon: {
        padding: theme.spacing.sm,
    },
    invoiceInfo: {
        width: "100%",
        marginBottom: theme.spacing.md,
    },
    invoiceRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: theme.spacing.xs,
    },
    invoiceLabel: {
        fontFamily: theme.typography.fontFamily.medium,
        fontSize: theme.typography.fontSize.small,
        color: theme.colors.textSecondary,
    },
    invoiceValue: {
        fontFamily: theme.typography.fontFamily.bold,
        fontSize: theme.typography.fontSize.medium,
        color: theme.colors.textPrimary,
    },
    totalRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: theme.spacing.md,
    },
    totalLabel: {
        fontFamily: theme.typography.fontFamily.medium,
        fontSize: theme.typography.fontSize.small,
        color: theme.colors.textSecondary,
    },
    totalAmount: {
        fontFamily: theme.typography.fontFamily.bold,
        fontSize: theme.typography.fontSize.medium,
        color: theme.colors.textPrimary,
    },
    closeButton: {
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borderRadius.md,
        paddingVertical: theme.spacing.xs,
        paddingHorizontal: theme.spacing.sm,
        marginTop: theme.spacing.md,
        alignItems: "center",
        justifyContent: "center",
        minHeight: 36,
    },
    closeButtonText: {
        color: theme.colors.background,
        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily.bold,
    },
    invoiceInfoContainer: {
        marginBottom: theme.spacing.md,
    },
    downloadButton: {
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borderRadius.md,
        paddingVertical: theme.spacing.xs,
        paddingHorizontal: theme.spacing.sm,
        marginTop: theme.spacing.md,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 36,
    },
    downloadButtonText: {
        color: theme.colors.background,
        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily.bold,
        marginLeft: theme.spacing.sm,
    },
    toggleButton: {
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.sm,
        paddingVertical: theme.spacing.xs,
        paddingHorizontal: theme.spacing.sm,
        alignItems: "center",
        justifyContent: "center",
        minHeight: 28,
        borderWidth: 1,
        borderColor: theme.colors.textSecondary,
    },
    toggleButtonText: {
        color: theme.colors.textSecondary,
        fontSize: theme.typography.fontSize.small,
        fontFamily: theme.typography.fontFamily.medium,
    },
    devContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.sm,
        marginBottom: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.textSecondary,
        opacity: 0.8,
    },
    devLabel: {
        color: theme.colors.textSecondary,
        fontSize: theme.typography.fontSize.small,
        fontFamily: theme.typography.fontFamily.medium,
    },
    paidStatusContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingVertical: theme.spacing.xs,
    },
    paidTextContainer: {
        flex: 1,
    },
    paidTitleContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: theme.spacing.xs,
    },
    paidTitle: {
        fontFamily: theme.typography.fontFamily.medium,
        fontSize: theme.typography.fontSize.medium,
        color: theme.colors.success,
        marginRight: theme.spacing.sm,
    },
    paidAmount: {
        fontFamily: theme.typography.fontFamily.bold,
        fontSize: 28,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.xs,
    },
    paidSubtitle: {
        fontFamily: theme.typography.fontFamily.medium,
        fontSize: theme.typography.fontSize.medium,
        color: theme.colors.textSecondary,
    },
    infoTitle: {
        fontFamily: theme.typography.fontFamily.bold,
        fontSize: theme.typography.fontSize.medium,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.md,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
    },
    infoLabel: {
        fontFamily: theme.typography.fontFamily.medium,
        fontSize: theme.typography.fontSize.small,
        color: theme.colors.textSecondary,
        flex: 1,
        marginLeft: theme.spacing.sm,
    },
    infoValue: {
        fontFamily: theme.typography.fontFamily.bold,
        fontSize: theme.typography.fontSize.small,
        color: theme.colors.textPrimary,
    },
});