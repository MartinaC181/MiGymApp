import { View, Text } from "react-native";
import globalStyles from "../../styles/global";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Perfil() {
  return (
    <SafeAreaView style={globalStyles.safeArea}>
      {/* Header */}
      <View style={globalStyles.header}>
        <Text style={globalStyles.title}>Perfil</Text>
      </View>
      <Text style={globalStyles.description}>
        Aquí puedes ver y editar tu perfil.
      </Text>
    </SafeAreaView>
  );
}
