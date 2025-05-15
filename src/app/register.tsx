import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Register() {
    const router = useRouter();
    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/icon.png')}
                style={styles.logo}
            />
            <Text style={styles.title}>Crea una nueva cuenta</Text>

            <Text style={styles.loginText}>
                ¿Ya estás registrado?{' '}
                <Text
                    style={styles.loginLink}
                    onPress={() => router.push('/login')}
                >
                    Iniciar Sesión
                </Text>
            </Text>

            <Text style={styles.label}>NOMBRE Y APELLIDO</Text>
            <TextInput
                style={styles.input}
                placeholder="Mirtho Legrand"
                placeholderTextColor="#999"
            />

            <Text style={styles.label}>CORREO ELECTRÓNICO</Text>
            <TextInput
                style={styles.input}
                placeholder="correo@ejemplo.com"
                placeholderTextColor="#999"
                keyboardType="email-address"
            />

            <Text style={styles.label}>CONTRASEÑA</Text>
            <TextInput
                style={styles.input}
                placeholder="********"
                placeholderTextColor="#999"
                secureTextEntry
            />

            <Text style={styles.label}>FECHA DE NACIMIENTO</Text>
            <View style={styles.datePicker}>
                <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Seleccionar"
                    placeholderTextColor="#999"
                />
                <MaterialIcons name="calendar-today" size={24} color="#999" />
            </View>

            <Text style={styles.label}>GIMNASIO</Text>
            <View style={styles.pickerContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Seleccionar gimnasio"
                    placeholderTextColor="#999"
                />
            </View>

            <TouchableOpacity style={styles.registerButton}>
                <Text style={styles.registerButtonText}>Registrarse</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingTop: 15,
        paddingBottom: 5,
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 15,
        borderRadius: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    loginText: {
        fontSize: 12,
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    loginLink: {
        color: '#1E90FF',
        fontWeight: 'bold',
    },
    label: {
        alignSelf: 'flex-start',
        fontSize: 12,
        color: '#333',
        marginBottom: 5,
        marginTop: 10,
    },
    input: {
        width: '100%',
        height: 35,
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 5,
        paddingHorizontal: 8,
        backgroundColor: '#FFF',
        marginBottom: 10,
    },
    datePicker: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 5,
        paddingHorizontal: 8,
        backgroundColor: '#FFF',
        marginBottom: 10,
        width: '100%',
    },
    pickerContainer: {
        width: '100%',
        marginBottom: 10,
    },
    registerButton: {
        width: '100%',
        height: 40,
        backgroundColor: '#00AEEF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 20,
        marginBottom: 5,
    },
    registerButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
});