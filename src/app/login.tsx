import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function Login() {
    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/logo.png')} 
                style={styles.logo}
            />
            <Text style={styles.appName}>MiGym</Text>

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

            <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/home')}>
                <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
            </TouchableOpacity>

            <TouchableOpacity>
                <Text style={styles.forgotPassword}>¿Olvidaste la contraseña?</Text>
            </TouchableOpacity>

            <Text style={styles.registerText}>
                ¿No estás registrado todavía?{' '}
                <TouchableOpacity onPress={() => router.push('/register')}>
                    <Text style={styles.registerLink}>Regístrate</Text>
                </TouchableOpacity>
            </Text>

            <TouchableOpacity style={styles.socialButton}>
                <MaterialCommunityIcons name="google" size={24} color="#DB4437" />
                <Text style={styles.socialButtonText}>Iniciar sesión con Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton}>
                <MaterialCommunityIcons name="facebook" size={24} color="#4267B2" />
                <Text style={styles.socialButtonText}>Iniciar sesión con Facebook</Text>
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
        paddingTop: 5,
        paddingBottom: 100,
    },
    logo: {
        width: 200,
        height: 200,
        marginBottom: 5,
        borderRadius: 20,
    },
    appName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    label: {
        alignSelf: 'flex-start',
        fontSize: 14,
        color: '#333',
        marginBottom: 5,
        marginTop: 10,
    },
    input: {
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 5,
        paddingHorizontal: 10,
        backgroundColor: '#FFF',
        marginBottom: 10,
    },
    loginButton: {
        width: '100%',
        height: 40,
        backgroundColor: '#00AEEF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 5,
    },
    loginButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    forgotPassword: {
        color: '#1E90FF',
        fontSize: 14,
        marginTop: 5,
    },
    registerText: {
        fontSize: 14,
        color: '#333',
        marginTop: 10,
    },
    registerLink: {
        color: '#1E90FF',
        fontWeight: 'bold',
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginTop: 10,
        backgroundColor: '#FFF',
        marginBottom: 5,
    },
    socialButtonText: {
        marginLeft: 10,
        fontSize: 14,
        color: '#333',
    },
});