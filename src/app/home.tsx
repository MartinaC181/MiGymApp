import { View, Text, TextInput, StyleSheet, ScrollView, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Navigation from "../components/Navigation";

export default function Home() {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
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
                <View style={styles.card}>
                    <Image
                        source={{ uri: "https://via.placeholder.com/150" }}
                        style={styles.cardImage}
                    />
                    <Text style={styles.cardTitle}>FUNCIONAL HIT</Text>
                    <Text style={styles.cardLink}>Ver más</Text>
                </View>
                <View style={styles.card}>
                    <Image
                        source={{ uri: "https://via.placeholder.com/150" }}
                        style={styles.cardImage}
                    />
                    <Text style={styles.cardTitle}>PESAS</Text>
                    <Text style={styles.cardLink}>Ver más</Text>
                </View>
            </ScrollView>
        </View> 
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    header: {
        marginBottom: 20,
    },
    greeting: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#00AEEF",
    },
    name: {
        color: "#00AEEF",
    },
    subGreeting: {
        fontSize: 16,
        color: "#333",
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF",
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 40,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    searchInput: {
        flex: 1,
        height: 40,
        fontSize: 16,
        color: "#333",
    },
    searchIcon: {
        marginLeft: 10,
    },
    carousel: {
        flexDirection: "row",
        marginBottom: 100,
        marginTop: 100,
    },
    card: {
        width: 300,
        marginRight: 10,
        backgroundColor: "#FFF",
        borderRadius: 10,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        marginBottom: 100,   
    },
    cardImage: {
        width: "100%",
        height: 120,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
        marginVertical: 10,
        color: "#333",
    },
    cardLink: {
        fontSize: 14,
        textAlign: "center",
        color: "#00AEEF",
        marginBottom: 10,
    },
});