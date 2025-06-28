import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Modal, StatusBar } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import theme from "../../constants/theme";
import globalStyles from "../../styles/global";

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
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [cuota, setCuota] = useState(null);
    const [currentUser, setCurrentUser] = useState<ClientUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Cargar datos del usuario y su información de pago
    useEffect(() => {
        loadPaymentData();
    }, []);

    const loadPaymentData = async () => {
        try {
            // Obtener usuario actual
            const user = await getCurrentUser() as ClientUser;
            if (!user) {
                setCuota({
                    pendiente: false,
                    monto: 0,
                    nombre: "Usuario no encontrado",
                    dni: "N/A"
                });
                setIsLoading(false);
                return;
            }

            setCurrentUser(user);

            // Obtener información de pago del usuario
            const paymentInfo = await getUserPaymentInfo(user.id);
            
            // Formatear la información para el componente
            const cuotaInfo = {
                pendiente: paymentInfo.pendiente,
                monto: paymentInfo.monto,
                nombre: user.name,
                dni: (user as any).dni || "No especificado",
                numeroFactura: paymentInfo.numeroFactura,
                fechaEmision: paymentInfo.fechaEmision,
                fechaVencimiento: paymentInfo.fechaVencimiento,
                periodo: paymentInfo.periodo
            };

            setCuota(cuotaInfo);
        } catch (error) {
            console.error("Error cargando datos de pago:", error);
            setCuota({
                pendiente: false,
                monto: 0,
                nombre: "Error cargando datos",
                dni: "N/A"
            });
        } finally {
            setIsLoading(false);
        }
    };

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

    // Función para manejar el pago con Mercado Pago
    const handleMercadoPagoPayment = async () => {
        // Aquí iría la lógica de integración con Mercado Pago
        console.log("Procesando pago con Mercado Pago...");
        const data = await handleIntegrationMercadoPago(factura.items[0]);

        if (!data) {
           return console.error("Error al procesar el pago con Mercado Pago");
        }

        openBrowserAsync(data);
    };

    // Función para manejar la vista de la factura
    const handleViewInvoice = () => {
        setShowInvoiceModal(true);
    };

    // Función para cerrar el modal
    const closeInvoiceModal = () => {
        setShowInvoiceModal(false);
    };

    // Función para formatear fechas
    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-ES');
        } catch (error) {
            return "Fecha inválida";
        }
    };

    if (isLoading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                    <Text>Cargando información de cuota...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!cuota) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                    <Text>Error cargando información de cuota</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
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
                                
                                <TouchableOpacity
                                    style={styles.mercadopagoButton}
                                    onPress={() => handleMercadoPagoPayment()}
                                >
                                    <View style={styles.mpLogoContainer}>
                                        <MaterialIcons name="account-balance-wallet" size={16} color="#009EE3" />
                                    </View>
                                    <Text style={styles.mercadopagoText}>MERCADO PAGO</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={globalStyles.card}>
                            <Text style={styles.invoiceTitle}>Factura asociada a</Text>
                            <Text style={styles.invoiceText}><Text style={styles.bold}>Nombre:</Text> {cuota.nombre}</Text>
                            <Text style={styles.invoiceText}><Text style={styles.bold}>DNI:</Text> {cuota.dni}</Text>
                            <TouchableOpacity 
                                style={styles.invoiceButton}
                                onPress={() => handleViewInvoice()}
                            >
                                <Text style={globalStyles.buttonText}>FACTURA</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                ) : 
                // Si no hay cuota pendiente
                (
                    <>
                        <View style={globalStyles.card}>
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
            {showInvoiceModal && cuota && (
                <Modal
                    visible={showInvoiceModal}
                    animationType="fade"
                    transparent={true}
                    onRequestClose={closeInvoiceModal}
                    statusBarTranslucent={true}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>FACTURA</Text>
                                <TouchableOpacity
                                    style={styles.closeIcon}
                                    onPress={closeInvoiceModal}
                                >
                                    <MaterialIcons name="close" size={24} color={theme.colors.textSecondary} />
                                </TouchableOpacity>
                            </View>
                            
                            <View style={styles.invoiceInfo}>
                                <View style={styles.invoiceRow}>
                                    <Text style={styles.invoiceLabel}>Número de Factura:</Text>
                                    <Text style={styles.invoiceValue}>#2024-001</Text>
                                </View>
                                
                                <View style={styles.invoiceRow}>
                                    <Text style={styles.invoiceLabel}>Fecha de Emisión:</Text>
                                    <Text style={styles.invoiceValue}>15/01/2024</Text>
                                </View>
                                
                                <View style={styles.invoiceRow}>
                                    <Text style={styles.invoiceLabel}>Fecha de Vencimiento:</Text>
                                    <Text style={styles.invoiceValue}>15/02/2024</Text>
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
                                    <Text style={styles.invoiceValue}>Enero 2024</Text>
                                </View>
                                
                                <View style={styles.totalRow}>
                                    <Text style={styles.totalLabel}>TOTAL A PAGAR:</Text>
                                    <Text style={styles.totalAmount}>${factura.total.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</Text>
                                </View>
                            </View>
                            
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={closeInvoiceModal}
                            >
                                <Text style={styles.closeButtonText}>CERRAR</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
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
});