import { View, Text } from 'react-native';
import { StyleSheet } from 'react-native';

export default function Rutina() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Rutina</Text>
            <Text style={styles.description}>Aquí puedes ver tu rutina de entrenamiento.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 16,
        color: '#666',
    },
});