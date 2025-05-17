import { View, Text } from "react-native";
import globalStyles from "../../styles/global";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Rutina() {
  return (
    <SafeAreaView style={globalStyles.safeArea}>
      {/* Header */}
      <View style={globalStyles.header}>
        <Text style={globalStyles.title}>Rutina</Text>
      </View>
      <Text>Aquí puedes ver tu rutina de entrenamiento.</Text>
    </SafeAreaView>
  );
}
