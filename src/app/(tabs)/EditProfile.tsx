import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import globalStyles from '../../styles/global';
import theme from '../../constants/theme';

const EditProfile = ({navigation}: any) => {

        const [name, setName] = useState('');
        const [email, setEmail] = useState('');
        const [weight, setWeight] = useState('');
        const [idealWeight, setIdealWeight] = useState('');
        const [height, setHeight] = useState('');

        const handleSave = () => {
            const updateData = {
                name,
                email,
                weight,
                idealWeight,
                height
            };
            console.log("Datos guardados:", updateData);
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
