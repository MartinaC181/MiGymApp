import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import globalStyles from '../../styles/global';
import theme from '../../constants/theme';
import {router} from "expo-router";

const EditProfile = ({navigation}: any) => {

        const [name, setName] = useState('Mirtho Legrand');
        const [email, setEmail] = useState('elMailDeMirtho@UTN.edu.ar');
        const [weight, setWeight] = useState('75');
        const [idealWeight, setIdealWeight] = useState('65');
        const [height, setHeight] = useState('1.72');

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

    const handleSave = () => {
        router.push({
            pathname: '/perfil',
            params: {
                name,
                email,
                weight,
                idealWeight,
                height,
            },
        });

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

                    <TouchableOpacity style={globalStyles.primaryButton} onPress={handleSave}>
                        <Text style={globalStyles.buttonText}>Guardar cambios</Text>
                    </TouchableOpacity>
                </View>
            </View>


        );
    }
;


export default EditProfile;
