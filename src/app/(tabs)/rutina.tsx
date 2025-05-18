import { View, Text } from 'react-native';
import globalStyles from '../../styles/global';

export default function Rutina() {
    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>Rutina</Text>
            <Text style={globalStyles.description}>Aquí puedes ver tu rutina de entrenamiento.</Text>
        </View>
    );
}
