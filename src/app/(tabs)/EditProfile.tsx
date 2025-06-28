import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import globalStyles from '../../styles/global';
import theme from '../../constants/theme';
import {router} from "expo-router";
import styles from '@/src/styles/home';
import { getCurrentUser, updateUserProfile } from '../../utils/storage';
import { ClientUser } from '../../data/Usuario';

const EditProfile = ({navigation}: any) => {

        const [name, setName] = useState('');
        const [email, setEmail] = useState('');
        const [weight, setWeight] = useState('');
        const [idealWeight, setIdealWeight] = useState('');
        const [height, setHeight] = useState('');
        const [currentUser, setCurrentUser] = useState<ClientUser | null>(null);
        const [isLoading, setIsLoading] = useState(false);

        // Cargar datos del usuario actual
        useEffect(() => {
            loadUserData();
        }, []);

        const loadUserData = async () => {
            const user = await getCurrentUser() as ClientUser;
            if (user && user.role === 'client') {
                setCurrentUser(user);
                setName(user.name || '');
                setEmail(user.email || '');
                // Estos campos pueden no existir aún, los agregamos como extensiones
                setWeight((user as any).weight || '');
                setIdealWeight((user as any).idealWeight || '');
                setHeight((user as any).height || '');
            }
        };

        // const handleSave = () => {
    //     const updateData = {
    //         name,
    //         email,
    //         weight,
    //         idealWeight,
    //         height
    //     };
    //     console.log("Datos guardados:", updateData);
    // };

    const handleSave = async () => {
        if (!currentUser) return;
        
        setIsLoading(true);
        
        try {
            // Actualizar usuario con los nuevos datos
            const updates = {
                name,
                email,
                weight,
                idealWeight,
                height
            };
            
            await updateUserProfile(currentUser.id, updates);
            
            // Navegar de vuelta al perfil
            router.push('/perfil');
        } catch (error) {
            console.error('Error guardando perfil:', error);
        } finally {
            setIsLoading(false);
        }
    };



    return (
            <View style={globalStyles.safeArea}>
                <View style={{padding: theme.spacing.lg}}>
                    <Text style={globalStyles.label}>Nombre</Text>
                    <TextInput
                        style={globalStyles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Nombre"/>

                    <Text style={globalStyles.label}>Email</Text>
                    <TextInput
                        style={globalStyles.input}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Email"
                        keyboardType="email-address"/>
                    <Text style={globalStyles.label}>Peso actual</Text>
                    <TextInput
                        style={globalStyles.input}
                        value={weight}
                        onChangeText={setWeight}
                        placeholder="Kg"
                        keyboardType="decimal-pad"/>
                    <Text style={globalStyles.label}>Peso ideal</Text>
                    <TextInput
                        style={globalStyles.input}
                        value={idealWeight}
                        onChangeText={setIdealWeight}
                        placeholder="Kg"
                        keyboardType="decimal-pad"/>
                    <Text style={globalStyles.label}>Altura</Text>
                    <TextInput
                        style={globalStyles.input}
                        value={height}
                        onChangeText={setHeight}
                        placeholder="cm"
                        keyboardType="decimal-pad"/>

                    <TouchableOpacity style={globalStyles.LoginButton} onPress={handleSave}>
                        <Text style={globalStyles.buttonText}>Guardar cambios</Text>
                    </TouchableOpacity>
                </View>
            </View>


        );
    }
;


export default EditProfile;
