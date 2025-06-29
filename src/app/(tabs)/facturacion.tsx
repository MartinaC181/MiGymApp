import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Image, Alert, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import theme from "../../constants/theme";
import globalStyles from "../../styles/global";
import pagoCorrecto from '../../../assets/pagocorrecto.png';
import pagoError from '../../../assets/pagoerror.png';
import { router } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import { handleIntegrationMercadoPago } from "../../utils/MPIntegration";
import { getCurrentUser, getUserPaymentInfo, processPayment } from "../../utils/storage";
import { ClientUser } from "../../data/Usuario";

// Hardcodea el resultado del pago aquí
const pagoExitoso = true; // Cambia a false para probar el error

export default function Facturacion() {
    const [procesando, setProcesando] = useState(false);
    const [resultado, setResultado] = useState<null | "exito" | "error">(null);
    
    // Estados para los campos del formulario
    const [cardName, setCardName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");

    // Estados para validación visual
    const [errors, setErrors] = useState({
        cardName: false,
        cardNumber: false,
        expiry: false,
        cvv: false
    });

    // Estados adicionales
    const [metodoPago, setMetodoPago] = useState<"mercadopago" | "tarjeta">("mercadopago");
    const [currentUser, setCurrentUser] = useState<ClientUser | null>(null);
    const [paymentInfo, setPaymentInfo] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Cargar datos del usuario y pago al montar
    useEffect(() => {
        loadPaymentData();
    }, []);

    const loadPaymentData = async () => {
        try {
            const user = await getCurrentUser() as ClientUser;
            if (!user) {
                Alert.alert("Error", "Debes estar logueado para acceder a la facturación");
                router.back();
                return;
            }

            setCurrentUser(user);
            const payment = await getUserPaymentInfo(user.id);
            setPaymentInfo(payment);
        } catch (error) {
            console.error("Error cargando datos de pago:", error);
            Alert.alert("Error", "No se pudieron cargar los datos de pago");
        } finally {
            setIsLoading(false);
        }
    };

    // Función para formatear el número de tarjeta
    const formatCardNumber = (text: string) => {
        const cleaned = text.replace(/\s/g, '');
        const groups = cleaned.match(/.{1,4}/g);
        return groups ? groups.join(' ') : cleaned;
    };

    // Función para formatear la fecha de vencimiento
    const formatExpiry = (text: string) => {
        const cleaned = text.replace(/\D/g, '');
        if (cleaned.length >= 2) {
            return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
        }
        return cleaned;
    };

    // Función para validar un campo específico
    const validateField = (field: string, value: string) => {
        let isValid = true;
        
        switch (field) {
            case 'cardName':
                isValid = value.trim().length > 0;
                break;
            case 'cardNumber':
                isValid = value.replace(/\s/g, '').length >= 16;
                break;
            case 'expiry':
                isValid = value.length >= 5;
                break;
            case 'cvv':
                isValid = value.length >= 3;
                break;
        }

        setErrors(prev => ({
            ...prev,
            [field]: !isValid
        }));

        return isValid;
    };

    // Función para validar el formulario completo
    const validateForm = () => {
        const cardNameValid = validateField('cardName', cardName);
        const cardNumberValid = validateField('cardNumber', cardNumber);
        const expiryValid = validateField('expiry', expiry);
        const cvvValid = validateField('cvv', cvv);

        if (!cardNameValid) {
            Alert.alert("Error", "Por favor ingresa el nombre en la tarjeta");
            return false;
        }
        if (!cardNumberValid) {
            Alert.alert("Error", "Por favor ingresa un número de tarjeta válido");
            return false;
        }
        if (!expiryValid) {
            Alert.alert("Error", "Por favor ingresa la fecha de vencimiento");
            return false;
        }
        if (!cvvValid) {
            Alert.alert("Error", "Por favor ingresa el CVV");
            return false;
        }
        return true;
    };

    // Función para verificar si todos los campos están completos
    const isFormComplete = () => {
        if (metodoPago === "mercadopago") {
            return true; // Mercado Pago no requiere campos adicionales
        }
        if (metodoPago === "tarjeta") {
            return cardName.trim() && 
                   cardNumber.replace(/\s/g, '').length >= 16 && 
                   expiry.length >= 5 && 
                   cvv.length >= 3;
        }
        return false;
    };
     // Función para manejar el pago con Mercado Pago
     const handleMercadoPagoPayment = async () => {
        // Aquí iría la lógica de integración con Mercado Pago
        console.log("Procesando pago con Mercado Pago...");
        const data = await handleIntegrationMercadoPago();

        if (!data) {
           return console.error("Error al procesar el pago con Mercado Pago");
        }

        openBrowserAsync(data);
    };

    const handlePagar = async () => {
        if (!validateForm()) return;
        
        setProcesando(true);

        try {
            // Simular procesamiento con AsyncStorage
            const paymentData = {
                metodo: 'Tarjeta de crédito',
                tarjeta: `****${cardNumber.slice(-4)}`,
                nombre: cardName,
                monto: paymentInfo.monto
            };

            // Procesar pago usando la función de storage
            if (!currentUser || !paymentInfo) return;
            const result = await processPayment(currentUser.id, paymentData);
            
            // Simular delay de procesamiento
            setTimeout(() => {
                setProcesando(false);
                setResultado(result.success ? "exito" : "error");
            }, 3000);
            
        } catch (error) {
            console.error("Error procesando pago:", error);
            setProcesando(false);
            setResultado("error");
        }
    };

    // Mostrar loading mientras se cargan los datos
    if (isLoading) {
        return (
            <View style={[globalStyles.container, styles.center]}>
                <ActivityIndicator size={60} color={theme.colors.primary} />
                <Text style={styles.procesandoText}>Cargando información de pago...</Text>
            </View>
        );
    }

    // Verificar que tengamos los datos necesarios
    if (!currentUser || !paymentInfo) {
        return (
            <View style={[globalStyles.container, styles.center]}>
                <Text style={styles.procesandoText}>Error: No se pudieron cargar los datos de pago</Text>
                <TouchableOpacity 
                    style={styles.volverButton} 
                    onPress={() => router.back()}
                >
                    <Text style={styles.volverButtonText}>Volver</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Pantalla de procesando
    if (procesando) {
        return (
            <View style={[globalStyles.container, styles.center]}>
                <View style={styles.processingContainer}>
                    <ActivityIndicator size={60} color={theme.colors.primary} />
                <Text style={styles.procesandoText}>Procesando pago</Text>
                    <Text style={styles.procesandoSubtext}>Por favor espera...</Text>
                </View>
            </View>
        );
    }

    // Pantalla de resultado
    if (resultado) {
        return (
            <View style={[globalStyles.container, styles.center]}>
                <View style={styles.resultContainer}>
                    <Image
                        source={resultado === "exito" ? pagoCorrecto : pagoError}
                        style={styles.resultadoImg}
                        resizeMode="contain"
                    />
                <Text
                    style={[
                        styles.resultadoText,
                        { color: resultado === "exito" ? theme.colors.primary : theme.colors.error }
                    ]}
                >
                        {resultado === "exito" ? "¡Pago exitoso!" : "Pago rechazado"}
                    </Text>
                    <Text style={styles.resultadoSubtext}>
                        {resultado === "exito" 
                            ? "Tu pago ha sido procesado correctamente" 
                            : "Hubo un problema con tu pago. Intenta nuevamente"
                        }
                </Text>
                    <TouchableOpacity 
                        style={styles.volverButton} 
                        onPress={() => { router.push("/home") }}
                    >
                        <Text style={styles.volverButtonText}>Volver al inicio</Text>
                </TouchableOpacity>
                </View>
            </View>
        );
    }

    // Pantalla de formulario
    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <View style={styles.titleContainer}>
                <MaterialIcons name="credit-card" size={32} color={theme.colors.primary} />
                <Text style={styles.title}>Método de pago</Text>
            </View>

            <View style={styles.formContainer}>
                {/* Opciones de método de pago */}
                <Text style={styles.sectionTitle}>SELECCIONA TU MÉTODO DE PAGO</Text>
                
                <TouchableOpacity 
                    style={[
                        styles.paymentOption,
                        metodoPago === "mercadopago" && styles.paymentOptionSelected
                    ]}
                    onPress={() => setMetodoPago("mercadopago")}
                >
                    <View style={styles.paymentOptionContent}>
                        <MaterialIcons 
                            name="account-balance-wallet" 
                            size={24} 
                            color={metodoPago === "mercadopago" ? theme.colors.surface : theme.colors.primary} 
                        />
                        <Text style={[
                            styles.paymentOptionText,
                            metodoPago === "mercadopago" && styles.paymentOptionTextSelected
                        ]}>
                            Pagar con Mercado Pago
                        </Text>
                    </View>
                    {metodoPago === "mercadopago" && (
                        <MaterialIcons name="check-circle" size={24} color={theme.colors.surface} />
                    )}
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[
                        styles.paymentOption,
                        metodoPago === "tarjeta" && styles.paymentOptionSelected
                    ]}
                    onPress={() => setMetodoPago("tarjeta")}
                >
                    <View style={styles.paymentOptionContent}>
                        <MaterialIcons 
                            name="credit-card" 
                            size={24} 
                            color={metodoPago === "tarjeta" ? theme.colors.surface : theme.colors.primary} 
                        />
                        <Text style={[
                            styles.paymentOptionText,
                            metodoPago === "tarjeta" && styles.paymentOptionTextSelected
                        ]}>
                            Pagar con tarjeta
                        </Text>
                    </View>
                    {metodoPago === "tarjeta" && (
                        <MaterialIcons name="check-circle" size={24} color={theme.colors.surface} />
                    )}
                </TouchableOpacity>

                {/* Campos de tarjeta (solo se muestran si se selecciona tarjeta) */}
                {metodoPago === "tarjeta" && (
                    <View style={styles.cardFieldsContainer}>
                        <View style={styles.cardFieldsHeader}>
                            <MaterialIcons name="credit-card" size={20} color={theme.colors.primary} />
                            <Text style={styles.cardFieldsTitle}>Información de la tarjeta</Text>
                        </View>
                        
                        <Text style={styles.fieldLabel}>NOMBRE EN LA TARJETA</Text>
                        <TextInput
                            style={[
                                styles.cardInput,
                                errors.cardName && styles.inputError
                            ]}
                            placeholder="Nombre y Apellido"
                            placeholderTextColor={theme.colors.textSecondary}
                            value={cardName}
                            onChangeText={(text) => {
                                setCardName(text);
                                if (errors.cardName) validateField('cardName', text);
                            }}
                            onBlur={() => validateField('cardName', cardName)}
                            autoCapitalize="words"
                        />
                        {errors.cardName && (
                            <Text style={styles.errorText}>El nombre es requerido</Text>
                        )}

                        <Text style={styles.fieldLabel}>NÚMERO DE TARJETA</Text>
                        <TextInput
                            style={[
                                styles.cardInput,
                                errors.cardNumber && styles.inputError
                            ]}
                            placeholder="0000 0000 0000 0000"
                            placeholderTextColor={theme.colors.textSecondary}
                            keyboardType="numeric"
                            maxLength={19}
                            value={cardNumber}
                            onChangeText={(text) => {
                                const formatted = formatCardNumber(text);
                                setCardNumber(formatted);
                                if (errors.cardNumber) validateField('cardNumber', formatted);
                            }}
                            onBlur={() => validateField('cardNumber', cardNumber)}
                        />
                        {errors.cardNumber && (
                            <Text style={styles.errorText}>Ingresa un número de tarjeta válido</Text>
                        )}

                        <View style={styles.cardRow}>
                            <View style={styles.halfInput}>
                                <Text style={styles.fieldLabel}>VENCIMIENTO</Text>
                                <TextInput
                                    style={[
                                        styles.cardInput,
                                        errors.expiry && styles.inputError
                                    ]}
                                    placeholder="MM/AA"
                                    placeholderTextColor={theme.colors.textSecondary}
                                    keyboardType="numeric"
                                    maxLength={5}
                                    value={expiry}
                                    onChangeText={(text) => {
                                        const formatted = formatExpiry(text);
                                        setExpiry(formatted);
                                        if (errors.expiry) validateField('expiry', formatted);
                                    }}
                                    onBlur={() => validateField('expiry', expiry)}
                                />
                                {errors.expiry && (
                                    <Text style={styles.errorText}>Fecha requerida</Text>
                                )}
                            </View>
                            <View style={styles.halfInput}>
                                <Text style={styles.fieldLabel}>CVV</Text>
                                <TextInput
                                    style={[
                                        styles.cardInput,
                                        errors.cvv && styles.inputError
                                    ]}
                                    placeholder="123"
                                    placeholderTextColor={theme.colors.textSecondary}
                                    keyboardType="numeric"
                                    maxLength={4}
                                    secureTextEntry
                                    value={cvv}
                                    onChangeText={(text) => {
                                        setCvv(text);
                                        if (errors.cvv) validateField('cvv', text);
                                    }}
                                    onBlur={() => validateField('cvv', cvv)}
                                />
                                {errors.cvv && (
                                    <Text style={styles.errorText}>CVV requerido</Text>
                                )}
                            </View>
                        </View>
                    </View>
                )}

                <View style={styles.amountContainer}>
                    <Text style={styles.amountLabel}>MONTO A PAGAR</Text>
                    <Text style={styles.amount}>$10,213.89</Text>
            </View>

                <TouchableOpacity 
                    style={[
                        !isFormComplete() ? globalStyles.LoginButtonDisabled : styles.payButton
                    ]} 
                    onPress={handlePagar}
                    disabled={!isFormComplete()}
                >
                    <Text style={globalStyles.buttonText}>
                        PAGAR $10,213.89
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    // Se eliminaron safeArea, header y title redundantes
    container: {
        flex: 1,
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.lg,
    },
    scrollContent: {
        paddingBottom: 100, // Espacio extra para evitar que choque con el navbar
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
    sectionTitle: {
        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily.bold,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.md,
        textAlign: "center",
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
        marginBottom: theme.spacing.xl,
    },
    center: {
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
    processingContainer: {
        justifyContent: "center",
        alignItems: "center",
        padding: theme.spacing.lg,
    },
    procesandoSubtext: {
        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily.regular,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.sm,
        textAlign: "center",
    },
    resultContainer: {
        justifyContent: "center",
        alignItems: "center",
        padding: theme.spacing.lg,
    },
    resultadoSubtext: {
        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily.regular,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.sm,
        textAlign: "center",
    },
    volverButton: {
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borderRadius.md,
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        alignItems: "center",
        marginTop: theme.spacing.lg,
    },
    volverButtonText: {
        color: theme.colors.surface,
        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily.bold,
    },
    formContainer: {
        padding: theme.spacing.lg,
    },
    halfInput: {
        flex: 1,
        marginRight: theme.spacing.sm,
    },
    amountContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        marginBottom: theme.spacing.xs,
        marginTop: theme.spacing.md,
    },
    amountLabel: {
        fontSize: 17,
        fontFamily: theme.typography.fontFamily.bold,
        color: theme.colors.textPrimary,
    },
    amount: {
        fontSize: theme.typography.fontSize.large,
        fontFamily: theme.typography.fontFamily.bold,
        color: theme.colors.primary,
    },
    inputError: {
        borderColor: theme.colors.error,
        borderWidth: 1,
    },
    errorText: {
        color: theme.colors.error,
        fontSize: theme.typography.fontSize.small,
        marginTop: theme.spacing.sm,
        marginBottom: theme.spacing.sm,
    },
    paymentOption: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.sm,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        borderColor: theme.colors.textSecondary,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    paymentOptionSelected: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
        elevation: 4,
        shadowOpacity: 0.2,
    },
    paymentOptionContent: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    paymentOptionText: {
        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily.regular,
        color: theme.colors.textPrimary,
        marginLeft: theme.spacing.sm,
    },
    paymentOptionTextSelected: {
        fontFamily: theme.typography.fontFamily.bold,
        color: theme.colors.surface,
    },
    cardFieldsContainer: {
        marginTop: theme.spacing.lg,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 1,
    },
    cardFieldsHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: theme.spacing.md,
    },
    cardFieldsTitle: {
        fontSize: theme.typography.fontSize.large,
        fontFamily: theme.typography.fontFamily.bold,
        color: theme.colors.textPrimary,
        marginLeft: theme.spacing.sm,
    },
    fieldLabel: {
        fontSize: theme.typography.fontSize.small,
        fontFamily: theme.typography.fontFamily.bold,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.sm,
        marginTop: theme.spacing.md,
    },
    cardInput: {
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.md,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily.regular,
        color: theme.colors.textPrimary,
        borderWidth: 1,
        borderColor: theme.colors.textSecondary,
        marginBottom: theme.spacing.sm,
    },
    cardRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: theme.spacing.md,
    },
});