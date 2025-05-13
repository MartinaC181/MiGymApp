import { Slot } from "expo-router";
import { View, StyleSheet } from "react-native";
import Navigation from "../components/Navigation";

export default function Layout() {
    return (
        <View style={styles.container}>
            <Slot />
            <Navigation />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    }
});