import { View, Text } from 'react-native';
import globalStyles from '../../styles/global';

export default function Perfil() {
    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>Perfil</Text>
            <Text style={globalStyles.description}>Aquí puedes ver y editar tu perfil.</Text>
        </View>
    );
}