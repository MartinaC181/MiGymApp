import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "../../context/ThemeContext";
import { createGlobalStyles } from "../../styles/global";
import { getCurrentUser, getUserPaymentInfo, getGymQuotaSettings } from "../../utils/storage";
import { ClientUser } from "../../data/Usuario";

// Función para obtener información de cuota (ahora obsoleta, se usa cuotaData)
function getCuotaInfo(pendiente: boolean) {
    if (pendiente) {
        return {
            pendiente: true,
            nombre: "Teo Risso",
            dni: "40.000.000",
            numeroFactura: "0001-00000001",
            fechaEmision: "2024-01-01",
            fechaVencimiento: "2024-01-15",
            periodo: "Enero 2024"
        };
    } else {
        return {
            pendiente: false,
            monto: 0,
            nombre: "Teo Risso",
            dni: "40.000.000",
            numeroFactura: "0001-00000001",
            fechaEmision: "2024-01-01",
            fechaVencimiento: "2024-01-15",
            periodo: "Enero 2024",
            ultimoPago: {
                monto: 10213.89,
                fecha: "2024-01-15",
                numeroFactura: "0001-00000001",
                proximoVencimiento: "2024-02-15"
            }
        };
    }
}

export default function Cuota() {
    // Hook para el tema dinámico
    const { theme } = useTheme();
    
    // Generar estilos dinámicamente basados en el tema actual
    const styles = createStyles(theme);
    const globalStyles = createGlobalStyles(theme);
    
    // Estado para indicar si la cuota está pendiente o no
    const [pendiente, setPendiente] = useState<boolean>(true);
    // Estado para controlar si estamos en modo desarrollo
    const [isDevMode, setIsDevMode] = useState<boolean>(false);

    const router = useRouter();
    const [cuotaData, setCuotaData] = useState(null);
    const [currentUser, setCurrentUser] = useState<ClientUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [quotaDescription, setQuotaDescription] = useState<string>("");

    // Información de cuota basada en los datos reales o el estado `pendiente` como fallback
    // En modo desarrollo, usar datos reales pero con estado pendiente controlado por el botón
    const cuota = isDevMode ? {
        ...cuotaData,
        pendiente: pendiente,
        // Si está pagado, agregar información del último pago
        ...(pendiente ? {} : {
            ultimoPago: {
                monto: cuotaData?.monto || 10213.89,
                fecha: cuotaData?.fechaEmision || "2024-01-15",
                numeroFactura: cuotaData?.numeroFactura || "0001-00000001",
                proximoVencimiento: cuotaData?.fechaVencimiento || "2024-02-15"
            }
        })
    } : (cuotaData ? {
        ...cuotaData,
        // Si no estamos en modo desarrollo, usar el estado pendiente real de los datos
        pendiente: cuotaData.pendiente
    } : getCuotaInfo(pendiente));

    // Cargar datos del usuario y su información de pago
    useEffect(() => {
        loadPaymentData();
    }, []);

    const loadPaymentData = async () => {
        try {
            // Obtener usuario actual
            const user = await getCurrentUser() as ClientUser;
            if (!user) {
                setCuotaData({
                    pendiente: false,
                    monto: 0,
                    nombre: "Usuario no encontrado",
                    dni: "N/A"
                });
                setPendiente(false);
                setIsLoading(false);
                return;
            }

            setCurrentUser(user);

            // Obtener información de pago del usuario
            const paymentInfo = await getUserPaymentInfo(user.id);
            
            // Si el usuario es cliente y tiene gymId, obtener la configuración de cuota del gimnasio
            let gymQuotaSettings = null;
            if (user.role === 'client' && user.gymId) {
                try {
                    gymQuotaSettings = await getGymQuotaSettings(user.gymId);
                    setQuotaDescription(gymQuotaSettings.descripcion);
                } catch (error) {
                    console.log("No se pudo obtener configuración del gimnasio");
                    setQuotaDescription("Membresía mensual del gimnasio");
                }
            } else {
                setQuotaDescription("Membresía mensual del gimnasio");
            }
            
            // Formatear la información para el componente
            const cuotaInfo = {
                pendiente: paymentInfo.pendiente,
                monto: paymentInfo.monto,
                nombre: user.name,
                dni: user.dni || "No especificado",
                numeroFactura: paymentInfo.numeroFactura,
                fechaEmision: paymentInfo.fechaEmision,
                fechaVencimiento: paymentInfo.fechaVencimiento,
                periodo: paymentInfo.periodo
            };

            setCuotaData(cuotaInfo);
            // Actualizar el estado pendiente con los datos reales
            setPendiente(paymentInfo.pendiente);
        } catch (error) {
            console.error("Error cargando datos de pago:", error);
            setCuotaData({
                pendiente: false,
                monto: 0,
                nombre: "Error cargando datos",
                dni: "N/A"
            });
            setPendiente(false);
            setQuotaDescription("Membresía mensual del gimnasio");
        } finally {
            setIsLoading(false);
        }
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

    // Datos para la factura usando datos reales del localStorage
    const factura = {
        numeroFactura: cuota?.numeroFactura || cuotaData?.numeroFactura || "N/A",
        fechaEmision: formatDate(cuota?.fechaEmision || cuotaData?.fechaEmision || ""),
        fechaVencimiento: formatDate(cuota?.fechaVencimiento || cuotaData?.fechaVencimiento || ""),
        cliente: cuota?.nombre || cuotaData?.nombre || "Usuario no especificado",
        dni: cuota?.dni || cuotaData?.dni || "N/A",
        servicio: quotaDescription || cuota?.servicio || "Membresía Gimnasio",
        total: cuota?.monto || cuotaData?.monto || 0,
        periodo: cuota?.periodo || cuotaData?.periodo || "N/A"
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
            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.container}>
                    {/* Botón provisorio para cambiar estado */}
                    <View style={styles.devContainer}>
                        <Text style={styles.devLabel}>🔧 DESARROLLO</Text>
                        <TouchableOpacity 
                            style={styles.toggleButton}
                            onPress={() => {
                                setIsDevMode(true);
                                setPendiente(!pendiente);
                            }}
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
                                
                                {/* Descripción de la cuota */}
                                {(quotaDescription || cuota.servicio) && (
                                    <View style={styles.quotaDescriptionContainer}>
                                        <MaterialIcons name="info-outline" size={16} color={theme.colors.textSecondary} />
                                        <Text style={styles.quotaDescriptionText}>
                                            {quotaDescription || cuota.servicio || "Membresía mensual del gimnasio"}
                                        </Text>
                                    </View>
                                )}
                                
                                {/* Botones de pago */}
                                <View style={styles.paymentButtonsContainer}>
                                <TouchableOpacity
                                    style={styles.payButton}
                                    onPress={() => router.push("/MetodoDePago")}
                                >
                                    <Text style={globalStyles.buttonText}>Pagar</Text>
                                </TouchableOpacity>
                                </View>
                            </View>

                            {/* Sección de factura */}
                            <View style={globalStyles.card}>
                                <View style={styles.invoiceHeader}>
                                    <MaterialIcons name="receipt" size={24} color={theme.colors.primary} />
                                    <Text style={styles.invoiceTitle}>FACTURA</Text>
                                </View>
                                
                                <View style={styles.invoiceInfo}>
                                    <View style={styles.invoiceRow}>
                                        <Text style={styles.invoiceLabel}>Número de Factura:</Text>
                                        <Text style={styles.invoiceValue}>{factura.numeroFactura}</Text>
                                    </View>
                                    
                                    <View style={styles.invoiceRow}>
                                        <Text style={styles.invoiceLabel}>Fecha de Emisión:</Text>
                                        <Text style={styles.invoiceValue}>{factura.fechaEmision}</Text>
                                    </View>
                                    
                                    <View style={styles.invoiceRow}>
                                        <Text style={styles.invoiceLabel}>Fecha de Vencimiento:</Text>
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
                                            <Text style={styles.paidTitle}>Al día con la cuota</Text>
                                            <MaterialIcons name="check-circle" size={20} color={theme.colors.success} />
                                        </View>
                                        <Text style={styles.paidAmount}>$0</Text>
                                        <Text style={styles.paidSubtitle}>No tienes pagos pendientes</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Información del último pago */}
                            <View style={globalStyles.card}>
                                <Text style={styles.infoTitle}>Último Pago Realizado</Text>
                                
                                <View style={styles.infoRow}>
                                    <MaterialIcons name="payment" size={20} color={theme.colors.primary} />
                                    <Text style={styles.infoLabel}>Monto pagado:</Text>
                                    <Text style={styles.infoValue}>
                                        ${cuota.ultimoPago?.monto?.toLocaleString("es-AR", { minimumFractionDigits: 2 }) || "10.213,89"}
                                    </Text>
                                </View>
                                
                                <View style={styles.infoRow}>
                                    <MaterialIcons name="calendar-today" size={20} color={theme.colors.primary} />
                                    <Text style={styles.infoLabel}>Fecha de pago:</Text>
                                    <Text style={styles.infoValue}>
                                        {cuota.ultimoPago?.fecha ? formatDate(cuota.ultimoPago.fecha) : "15/01/2024"}
                                    </Text>
                                </View>
                                
                                <View style={styles.infoRow}>
                                    <MaterialIcons name="receipt" size={20} color={theme.colors.primary} />
                                    <Text style={styles.infoLabel}>N° Factura:</Text>
                                    <Text style={styles.infoValue}>
                                        {cuota.ultimoPago?.numeroFactura || "0001-00000001"}
                                    </Text>
                                </View>
                                
                                <View style={styles.infoRow}>
                                    <MaterialIcons name="schedule" size={20} color={theme.colors.primary} />
                                    <Text style={styles.infoLabel}>Próximo vencimiento:</Text>
                                    <Text style={styles.infoValue}>
                                        {cuota.ultimoPago?.proximoVencimiento ? formatDate(cuota.ultimoPago.proximoVencimiento) : "15/02/2024"}
                                    </Text>
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
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

// Función para generar estilos dinámicos basados en el tema
const createStyles = (theme: any) => StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: theme.spacing.xl,
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
        // Sombras para destacar del fondo
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    payButtonText: {
        color: theme.colors.background,
        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily.bold,
        textAlign: "center",
    },
    invoiceHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: theme.spacing.md,
    },
    invoiceTitle: {
        fontFamily: theme.typography.fontFamily.bold,
        fontSize: theme.typography.fontSize.large,
        marginLeft: theme.spacing.sm,
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
        backgroundColor: theme.colors.card,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        borderWidth: 2,
        borderColor: theme.colors.success,
        // Sombras para destacar
        shadowColor: theme.colors.success,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    statusText: {
        color: theme.colors.textPrimary,
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
    invoiceInfo: {
        width: "100%",
        marginBottom: theme.spacing.md,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    invoiceRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: theme.spacing.xs,
        paddingVertical: theme.spacing.xs,
        borderBottomWidth: 0.5,
        borderBottomColor: theme.colors.border,
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
        paddingTop: theme.spacing.sm,
        borderTopWidth: 2,
        borderTopColor: theme.colors.primary,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.sm,
        padding: theme.spacing.sm,
    },
    totalLabel: {
        fontFamily: theme.typography.fontFamily.medium,
        fontSize: theme.typography.fontSize.small,
        color: theme.colors.textSecondary,
    },
    totalAmount: {
        fontFamily: theme.typography.fontFamily.bold,
        fontSize: theme.typography.fontSize.medium,
        color: theme.colors.primary,
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
        // Sombras para destacar
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    downloadButtonText: {
        color: theme.colors.background,
        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily.bold,
        marginLeft: theme.spacing.sm,
    },
    toggleButton: {
        backgroundColor: theme.colors.card,
        borderRadius: theme.borderRadius.sm,
        paddingVertical: theme.spacing.xs,
        paddingHorizontal: theme.spacing.sm,
        alignItems: "center",
        justifyContent: "center",
        minHeight: 28,
        borderWidth: 2,
        borderColor: theme.colors.border,
        // Sombras sutiles
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
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
        backgroundColor: theme.colors.card,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.sm,
        marginBottom: theme.spacing.md,
        borderWidth: 2,
        borderColor: theme.colors.border,
        opacity: 0.9,
        // Sombras para destacar
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
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
        marginTop: 0,
    },
    paidTitle: {
        fontFamily: theme.typography.fontFamily.medium,
        fontSize: theme.typography.fontSize.medium,
        color: theme.colors.success,
        marginRight: 4,
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
    actionButton: {
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borderRadius.md,
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        marginTop: theme.spacing.sm,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 44,
        // Sombras para destacar
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    actionButtonText: {
        color: theme.colors.background,
        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily.bold,
        marginLeft: theme.spacing.sm,
    },
    secondaryActionButton: {
        backgroundColor: theme.colors.surface,
        borderWidth: 2,
        borderColor: theme.colors.primary,
        marginTop: theme.spacing.sm,
    },
    secondaryActionButtonText: {
        color: theme.colors.primary,
        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily.bold,
        marginLeft: theme.spacing.sm,
    },
    quotaDescriptionContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.sm,
        padding: theme.spacing.sm,
        marginBottom: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    quotaDescriptionText: {
        color: theme.colors.textSecondary,
        fontSize: theme.typography.fontSize.small,
        fontFamily: theme.typography.fontFamily.regular,
        marginLeft: theme.spacing.xs,
        flex: 1,
    },
});

// Función placeholder para descarga de factura
const handleDownloadInvoice = () => {
    Alert.alert('Descarga', 'La descarga de factura estará disponible próximamente.');
};