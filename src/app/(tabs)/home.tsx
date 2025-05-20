import { View, Text, TextInput, StyleSheet, ScrollView, Image, SafeAreaView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import theme from "../../constants/theme";
import globalStyles from "../../styles/global";

export default function Home() {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={globalStyles.container}>
                <View style={styles.greetingContainer}>
                    <Text style={styles.greeting}>Hola, <Text style={styles.name}>Mirtho!</Text></Text>
                    <Text style={styles.subGreeting}>¿Listo para entrenar?</Text>
                </View>

                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar clase"
                        placeholderTextColor="#999"
                    />
                    <MaterialIcons name="search" size={24} color="#999" style={styles.searchIcon} />
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.carousel}
                    pagingEnabled
                >
                    <View style={[globalStyles.card, styles.card]}>
                        <Image
                            source={{ uri: "https://via.placeholder.com/150" }}
                            style={styles.cardImage}
                        />
                        <Text style={styles.cardTitle}>FUNCIONAL HIT</Text>
                        <Text style={styles.cardLink}>Ver más</Text>
                    </View>
                    <View style={[globalStyles.card, styles.card]}>
                        <Image
                            source={{ uri: "https://via.placeholder.com/150" }}
                            style={styles.cardImage}
                        />
                        <Text style={styles.cardTitle}>PESAS</Text>
                        <Text style={styles.cardLink}>Ver más</Text>
                    </View>
                </ScrollView>
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
    greetingContainer: {
        marginBottom: theme.spacing.lg,
        paddingHorizontal: theme.spacing.lg,
    },
    greeting: {
        fontSize: theme.typography.fontSize.large,
        fontFamily: theme.typography.fontFamily.bold,
        color: theme.colors.primary,
    },
    name: {
        color: theme.colors.primary,
    },
    subGreeting: {
        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily.regular,
        color: theme.colors.textSecondary,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        paddingHorizontal: theme.spacing.md,
        marginBottom: theme.spacing.xl,
        marginHorizontal: theme.spacing.lg,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    searchInput: {
        flex: 1,
        height: 40,
        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily.regular,
        color: theme.colors.textPrimary,
    },
    searchIcon: {
        marginLeft: theme.spacing.sm,
    },
    carousel: {
        flexDirection: "row",
        paddingHorizontal: theme.spacing.lg,
    },
    card: {
        width: 300,
        marginRight: theme.spacing.md,
        alignItems: "center",
        justifyContent: "center",
        padding: theme.spacing.md,
    },
    cardImage: {
        width: "100%",
        height: 120,
        borderRadius: theme.borderRadius.md,
    },
    cardTitle: {
        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily.bold,
        textAlign: "center",
        marginVertical: theme.spacing.sm,
        color: theme.colors.textPrimary,
    },
    cardLink: {
        fontSize: theme.typography.fontSize.small,
        fontFamily: theme.typography.fontFamily.medium,
        textAlign: "center",
        color: theme.colors.primary,
        marginBottom: theme.spacing.sm,
    },
});