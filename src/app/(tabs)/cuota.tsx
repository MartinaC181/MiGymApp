import { View, Text } from 'react-native';
import globalStyles from '../../styles/global';

export default function Cuota() {
    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>Cuota</Text>
            <Text style={globalStyles.description}>Aquí puedes ver y gestionar tu cuota.</Text>
        </View>
    );
}
