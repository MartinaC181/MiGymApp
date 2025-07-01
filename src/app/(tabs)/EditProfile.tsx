import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert} from 'react-native';
import globalStyles from '../../styles/global';
import { useTheme } from '../../context/ThemeContext';
import {router} from "expo-router";
import styles from '@/src/styles/home';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateUserProfile } from '../../utils/storage';
// eslint-disable-next-line import/no-unresolved
import * as ImagePicker from 'expo-image-picker';
import { useUser } from '../../context/UserContext';

const EditProfile = ({navigation}: any) => {
    const { theme, isDarkMode } = useTheme();
    const { user, setUser, refreshUser } = useUser();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [weight, setWeight] = useState('');
    const [idealWeight, setIdealWeight] = useState('');
    const [height, setHeight] = useState('');
    const [dni, setDni] = useState('');
    const [avatarUri, setAvatarUri] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Cargar datos del usuario actual desde el contexto
    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
            setWeight((user as any).weight?.toString() || '');
            setIdealWeight((user as any).idealWeight?.toString() || '');
            setHeight((user as any).height?.toString() || '');
            setDni((user as any).dni?.toString() || '');
            setAvatarUri((user as any).avatarUri || null);
        }
    }, [user]);

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };
    const validateNumber = (value: string) => {
        return /^\d+(\.\d+)?$/.test(value) && parseFloat(value) > 0;
    };

    // Estados de error individuales
    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [weightError, setWeightError] = useState("");
    const [idealWeightError, setIdealWeightError] = useState("");
    const [heightError, setHeightError] = useState("");
    const [dniError, setDniError] = useState("");

    // Validaciones en tiempo real por campo
    useEffect(() => {
        setNameError(!name.trim() ? "El nombre es obligatorio." : "");
    }, [name]);
    useEffect(() => {
        setEmailError(!validateEmail(email) ? "El email no es válido." : "");
    }, [email]);
    useEffect(() => {
        setWeightError(!validateNumber(weight) ? "El peso actual debe ser un número mayor a 0." : "");
    }, [weight]);
    useEffect(() => {
        setIdealWeightError(!validateNumber(idealWeight) ? "El peso ideal debe ser un número mayor a 0." : "");
    }, [idealWeight]);
    useEffect(() => {
        setHeightError(!validateNumber(height) ? "La altura debe ser un número mayor a 0." : "");
    }, [height]);
    useEffect(() => {
            setDniError(
                !validateNumber(dni) || dni.length < 7 || dni.length > 8
                    ? "El DNI debe tener entre 7 y 8 dígitos."
                    : ""
            );
        }, [dni]);

    const hasError = nameError || emailError || weightError || idealWeightError || heightError || dniError;

    const handleSave = async () => {
        if (hasError) return;
        setIsLoading(true);
        try {
            if (!user) {
                throw new Error('No se pudo obtener el usuario actual');
            }
            const updates = {
                name,
                email,
                weight,
                idealWeight,
                height,
                dni,
                avatarUri,
            };
            // Usar updateUserProfile para guardar en la base de datos y actualizar la sesión
            const updatedUser = await updateUserProfile(user.id, updates);
            if (updatedUser) {
                setUser(updatedUser); // Actualizar el contexto global
                router.push('/perfil');
            } else {
                throw new Error('No se pudo actualizar el perfil');
            }
        } catch (error) {
            console.error('Error guardando perfil:', error);
            Alert.alert('Error', 'No se pudieron guardar los cambios. Inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    // ------------------  Imagen de perfil ------------------ //
    const requestPermissions = async () => {
        await ImagePicker.requestCameraPermissionsAsync();
        await ImagePicker.requestMediaLibraryPermissionsAsync();
    };

    useEffect(() => {
        requestPermissions();
    }, []);

    const handlePickImage = async (fromCamera: boolean) => {
        try {
            const result = fromCamera
                ? await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.6 })
                : await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 0.6 });

            if (!result.canceled) {
                setAvatarUri(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error al seleccionar imagen:', error);
        }
    };

    const openPickerMenu = () => {
        Alert.alert(
            'Foto de perfil',
            'Selecciona una opción',
            [
                { text: 'Cámara', onPress: () => handlePickImage(true) },
                { text: 'Galería', onPress: () => handlePickImage(false) },
                { text: 'Cancelar', style: 'cancel' },
            ],
        );
    };

    return (
        <View style={[globalStyles.safeArea, { backgroundColor: theme.colors.background }]}> 
            <ScrollView contentContainerStyle={{padding: 24}} keyboardShouldPersistTaps="handled">
                <Text style={[globalStyles.label, { color: theme.colors.textPrimary }]}>Nombre y Apellido</Text>
                <TextInput
                    style={[globalStyles.input, { 
                        backgroundColor: theme.colors.surface,
                        color: theme.colors.textPrimary,
                        borderColor: theme.colors.border
                    }]}
                    value={name}
                    onChangeText={setName}
                    placeholder="Nombre y Apellido"
                    placeholderTextColor={theme.colors.textSecondary}/>
                {nameError ? <Text style={globalStyles.errorText}>{nameError}</Text> : null}

                <Text style={[globalStyles.label, { color: theme.colors.textPrimary }]}>DNI <Text style={{ color: '#999' }}>(sin puntos)</Text></Text>
                <TextInput
                    style={[globalStyles.input, { 
                        backgroundColor: theme.colors.surface,
                        color: theme.colors.textPrimary,
                        borderColor: theme.colors.border
                    }]}
                    value={dni}
                    onChangeText={setDni}
                    placeholder="12345678"
                    placeholderTextColor={theme.colors.textSecondary}
                    keyboardType="number-pad"
                />
                {dniError ? <Text style={globalStyles.errorText}>{dniError}</Text> : null}

                <Text style={[globalStyles.label, { color: theme.colors.textPrimary }]}>Email</Text>
                <TextInput
                    style={[globalStyles.input, { 
                        backgroundColor: theme.colors.surface,
                        color: theme.colors.textPrimary,
                        borderColor: theme.colors.border
                    }]}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Email"
                    placeholderTextColor={theme.colors.textSecondary}
                    keyboardType="email-address"/>
                {emailError ? <Text style={globalStyles.errorText}>{emailError}</Text> : null}

                <Text style={[globalStyles.label, { color: theme.colors.textPrimary }]}>Peso actual (Kg)</Text>
                <TextInput
                    style={[globalStyles.input, { 
                        backgroundColor: theme.colors.surface,
                        color: theme.colors.textPrimary,
                        borderColor: theme.colors.border
                    }]}
                    value={weight}
                    onChangeText={setWeight}
                    placeholder="Kg"
                    placeholderTextColor={theme.colors.textSecondary}
                    keyboardType="decimal-pad"/>
                {weightError ? <Text style={globalStyles.errorText}>{weightError}</Text> : null}

                <Text style={[globalStyles.label, { color: theme.colors.textPrimary }]}>Peso ideal</Text>
                <TextInput
                    style={[globalStyles.input, { 
                        backgroundColor: theme.colors.surface,
                        color: theme.colors.textPrimary,
                        borderColor: theme.colors.border
                    }]}
                    value={idealWeight}
                    onChangeText={setIdealWeight}
                    placeholder="Kg"
                    placeholderTextColor={theme.colors.textSecondary}
                    keyboardType="decimal-pad"/>
                {idealWeightError ? <Text style={globalStyles.errorText}>{idealWeightError}</Text> : null}

                <Text style={[globalStyles.label, { color: theme.colors.textPrimary }]}>Altura (Cm)</Text>
                <TextInput
                    style={[globalStyles.input, { 
                        backgroundColor: theme.colors.surface,
                        color: theme.colors.textPrimary,
                        borderColor: theme.colors.border
                    }]}
                    value={height}
                    onChangeText={setHeight}
                    placeholder="cm"
                    placeholderTextColor={theme.colors.textSecondary}
                    keyboardType="decimal-pad"/>
                {heightError ? <Text style={globalStyles.errorText}>{heightError}</Text> : null}

                <TouchableOpacity 
                    style={[globalStyles.LoginButton, { backgroundColor: theme.colors.primary }]} 
                    onPress={handleSave} 
                    disabled={isLoading}>
                    <Text style={[globalStyles.buttonText, { color: '#FFFFFF' }]}>
                        Guardar cambios
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default EditProfile;
