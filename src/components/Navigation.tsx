import { Link } from 'expo-router';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function Navigation() {
    return (            
        <View style={styles.container}> 
            <Link asChild href="/">
                <Pressable style={styles.iconContainer}>
                    <MaterialCommunityIcons name="home" size={32} color="white" />
                    <Text style={styles.iconText}>Inicio</Text>
                </Pressable>
            </Link>

            <Link asChild href="/rutina">
                <Pressable style={styles.iconContainer}>
                    <MaterialCommunityIcons name="weight-lifter" size={32} color="white" />
                    <Text style={styles.iconText}>Rutina</Text>
                </Pressable>
            </Link>

            <Link asChild href="/cuota">
                <Pressable style={styles.iconContainer}>
                    <MaterialCommunityIcons name="wallet" size={32} color="white" />
                    <Text style={styles.iconText}>Cuota</Text>
                </Pressable>
            </Link>

            <Link asChild href="/perfil">
                <Pressable style={styles.iconContainer}>
                    <MaterialCommunityIcons name="account" size={32} color="white" />
                    <Text style={styles.iconText}>Perfil</Text>
                </Pressable>
            </Link>
        </View>
    );  
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#00AEEF',
        paddingVertical: 10,
        
    },
    iconContainer: {
        alignItems: 'center',
    },
    iconText: {
        color: 'white',
        fontSize: 12,
        marginTop: 5,
    },
});