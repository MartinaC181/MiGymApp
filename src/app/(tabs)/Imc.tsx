import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useLocalSearchParams} from "expo-router";
import globalStyles from "../../styles/global";
import theme from "../../constants/theme";

const Imc = () => {

    const {weight, height} = useLocalSearchParams();

    const numericWeight = parseFloat(weight as string);
    const numericHeight = parseFloat(height as string);
    const heightInMeters = numericHeight / 100;

    const imc =
        numericWeight > 0 && heightInMeters > 0 ? numericWeight / Math.pow(heightInMeters, 2) : NaN;

    const imcValue = isNaN(imc) ? '---' : imc.toFixed(2);

    // const getCategoria = (imc: number) => {
    //     // if (imc< 18.5) return 'bajo';
    //     // if (imc >= 18.5 && imc < 25) return 'normal';
    //     // if (imc >= 25 && imc < 30) return 'sobrepeso';
    //     // if (imc >= 30) return 'obesidad';
    //
    //     if (imc < 18.5) return 'bajo';
    //     if (imc < 25) return 'normal';
    //     if (imc < 30) return 'sobrepeso';
    //     return 'obesidad';
    // };
    //
    // const categoria = isNaN(imc) ? '' : getCategoria(imc);
    //
    // const categoriaTexto: Record<string, string> = {
    //     bajo: 'Bajo peso',
    //     normal: 'Normal',
    //     sobrepeso: 'Sobrepeso',
    //     obesidad: 'Obesidad',
    // };

    const rows = [
        {range: '< 18,5', label: 'Bajo peso'},
        {range: '18,5–24,9', label: 'Normal'},
        {range: '25,0–29,9', label: 'Sobrepeso'},
        {range: '≥ 30,0', label: 'Obesidad'},
    ];

    return (
        <View style={globalStyles.safeArea}>

            <View style={styles.container}>

                <Text style={styles.title}>¿Qué es el IMC?</Text>
                <Text style={styles.description}> El IMC (Índice de Masa Corporal) es una medida que relaciona el peso y
                    la altura para estimar si una persona tiene un peso saludable.
                </Text>

                <View style={styles.tableContainer}>
                    <Text style={styles.tableTitle}>Tabla de IMC</Text>

                    {rows.map((row) => (
                        <View style={styles.row} key={row.label}>
                            <View style={styles.leftCell}>
                                <Text style={styles.rangeText}>{row.range}</Text>
                            </View>
                            <Text style={styles.categoryText}>{row.label}</Text>
                        </View>
                    ))}
                </View>

                {/*<View style={[styles.row, categoria === 'bajo' && styles.highlight]}>*/}
                {/*    <View style={styles.cell}>*/}
                {/*        <Text style={styles.rangeText}>{'18,5'}</Text>*/}
                {/*    </View>*/}
                {/*    <Text style={styles.category}>Bajo peso</Text>*/}
                {/*</View>*/}

                {/*<View style={[styles.row, categoria === 'normal' && styles.highlight]}>*/}
                {/*    <View style={styles.cell}>*/}
                {/*        <Text style={styles.rangeText}>18,5–24,9</Text>*/}
                {/*    </View>*/}
                {/*    <Text style={styles.category}>Normal</Text>*/}
                {/*</View>*/}

                {/*<View style={[styles.row, categoria === 'sobrepeso' && styles.highlight]}>*/}
                {/*    <View style={styles.cell}>*/}
                {/*        <Text style={styles.rangeText}>25,0–29,9</Text>*/}
                {/*    </View>*/}
                {/*    <Text style={styles.category}>Sobrepeso</Text>*/}
                {/*</View>*/}

                {/*<View style={[styles.row, categoria === 'obesidad' && styles.highlight]}>*/}
                {/*    <View style={styles.cell}>*/}
                {/*        <Text style={styles.rangeText}>≥ 30,0</Text>*/}
                {/*    </View>*/}
                {/*    <Text style={styles.category}>Obesidad</Text>*/}
                {/*</View>*/}

                <Text style={styles.resultText}>
                    Tu IMC es:{' '}
                    <Text style={styles.imcValue}>{imcValue}</Text>
                </Text>
                {/*<Text style={styles.result}>*/}
                {/*    Tu IMC es: <Text style={styles.imcValue}>{imcValue}</Text>*/}
                {/*    {categoria && (*/}
                {/*        <Text style={styles.categoriaTexto}>*/}
                {/*            ({categoriaTexto[categoria]})</Text>)}*/}
                {/*</Text>*/}
            </View>
        </View>
    )
        ;
};

const styles = StyleSheet.create({
    // container: {
    //     flex: 1,
    //     padding: theme.spacing.lg,
    //     alignItems: 'center',
    //     justifyContent: 'flex-start'
    // },
    container: {
        flex: 1,
        padding: theme.spacing.lg,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    title: {
        fontSize: theme.typography.fontSize.title,
        marginBottom: theme.spacing.sm,
        fontFamily: theme.typography.fontFamily.bold,
        color: theme.colors.textPrimary,
        textAlign: 'center',
    },
    description: {
        fontSize: theme.typography.fontSize.small,
        marginBottom: theme.spacing.lg,
        fontFamily: theme.typography.fontFamily.regular,
        color: theme.colors.textSecondary,
        textAlign: 'center',
    },

    tableContainer: {
        width: '100%',
        maxWidth: 320,
        backgroundColor: theme.colors.background,   // Blanco
        borderRadius: theme.borderRadius.lg,        // Bordes redondeados
        borderWidth: 1,
        borderColor: theme.colors.surface,          // Gris claro para el borde
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        marginBottom: theme.spacing.lg,
    },
    // table: {
    //     width: '100%',
    //     maxWidth: 300,
    //     marginBottom: theme.spacing.lg,
    //     backgroundColor: theme.colors.background,
    //     borderRadius: theme.borderRadius.lg,
    //     padding: theme.spacing.md,
    //     shadowColor: '#000',
    //     shadowOpacity: 0.1,
    //     shadowRadius: 5,
    //     elevation: 3,
    //
    // },
    table: {
        width: '100%',
        maxWidth: 320,
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: theme.colors.surface,
        paddingVertical: theme.spacing.lg,
        paddingHorizontal: theme.spacing.lg,
        marginBottom: theme.spacing.lg,
    },
    tableTitle: {
        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily.bold,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.md,
        textAlign: 'center',
    },
    // row: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     marginBottom: theme.spacing.sm,
    //     padding: theme.spacing.xs,
    //     borderRadius: theme.borderRadius.sm,
    // },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    highlight: {
        backgroundColor: '#D9F2FF',

    },
    // leftCell: {
    //     backgroundColor: theme.colors.primary,      // Azul fuerte
    //     borderRadius: theme.borderRadius.md,
    //     paddingVertical: theme.spacing.xs,
    //     paddingHorizontal: theme.spacing.sm,
    //     minWidth: 70,
    //     alignItems: 'center',
    //     marginRight: theme.spacing.md,
    // },
    leftCell: {
        width: 80,
        height: 32,
        backgroundColor: theme.colors.primary,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: theme.spacing.lg,
    },
    cell: {
        backgroundColor: theme.colors.primary,
        paddingVertical: theme.spacing.xs,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        marginRight: theme.spacing.md,
        minWidth: 70,
        alignItems: 'center',
    },
    rangeText: {
        color: theme.colors.background,
        fontSize: theme.typography.fontSize.small,
        fontFamily: theme.typography.fontFamily.bold,
    },
    category: {
        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily.regular,
        color: theme.colors.textPrimary,
    },
    result: {
        fontSize: theme.typography.fontSize.large,
        fontFamily: theme.typography.fontFamily.regular,
        color: theme.colors.textPrimary,
        textAlign: 'center',
        marginTop: theme.spacing.md,
    },
    imcValue: {
        // fontFamily: theme.typography.fontFamily.bold,
        color: theme.colors.primary,
    },
    categoriaTexto: {
        fontFamily: theme.typography.fontFamily.medium,
        color: theme.colors.textSecondary,
    },
    categoryText: {
        fontSize: theme.typography.fontSize.small,
        fontFamily: theme.typography.fontFamily.regular,
        color: theme.colors.textPrimary,
    },
    // resultText: {
    //     fontSize: theme.typography.fontSize.title,  // Muy grande
    //     fontFamily: theme.typography.fontFamily.bold,
    //     color: theme.colors.textPrimary,
    //     textAlign: 'center',
    // },
    resultText: {
        fontSize: theme.typography.fontSize.display,
        fontFamily: theme.typography.fontFamily.bold,
        color: theme.colors.textPrimary,
        textAlign: 'center',
    },

});

export default Imc;
