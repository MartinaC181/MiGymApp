import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Picker } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function Register() {
    return (
        <View style={styles.container}>
            {/* Logo */}
            <Image
                source={require ('../assets/logo.png')}
                style={styles.logo}
            />
            <Text style={styles.title}>Crea una nueva cuenta</Text>

            {/* Enlace para iniciar sesión */}
            <Text style={styles.loginText}>
                ¿Ya estás registrado?{' '}
                <Text style={styles.loginLink}>Iniciar Sesión</Text>
            </Text>

            {/* Campos de entrada */}
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
            <Picker style={styles.picker}>
                <Picker.Item label="Seleccionar" value="" />
                <Picker.Item label="Gimnasio A" value="gimnasio_a" />
                <Picker.Item label="Gimnasio B" value="gimnasio_b" />
            </Picker>

            {/* Botón de registro */}
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
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 20, // 
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 20,
        borderRadius: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 30,
    },
    loginText: {
        fontSize: 14,
        color: '#333',
        marginBottom: 30,
        textAlign: 'center',
    },
    loginLink: {
        color: '#1E90FF',
        fontWeight: 'bold',
    },
    label: {
        alignSelf: 'flex-start',
        fontSize: 14,
        color: '#333',
        marginBottom: 5,
        marginTop: 15,
    },
    input: {
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 5,
        paddingHorizontal: 10,
        backgroundColor: '#FFF',
        marginBottom: 15,
    },
    datePicker: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 5,
        paddingHorizontal: 10,
        backgroundColor: '#FFF',
        marginBottom: 15,
        width: '100%',
    },
    picker: {
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 5,
        backgroundColor: '#FFF',
        marginBottom: 15,
    },
    registerButton: {
        width: '100%',
        height: 45,
        backgroundColor: '#00AEEF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 30,
        marginBottom: 50,
    },
    registerButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});