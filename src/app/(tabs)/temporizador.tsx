import React from "react";
import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import globalStyles from "../../styles/global";
import { useTheme } from "../../context/ThemeContext";
import Timer from "../../components/Timer";

export default function TemporizadorScreen() {
  const { theme } = useTheme();
  
  return (
    <SafeAreaView style={[globalStyles.safeArea, { backgroundColor: theme.colors.background }]}>
      <ScrollView 
        contentContainerStyle={{ 
          flexGrow: 1, 
          justifyContent: 'center', 
          alignItems: 'center', 
          padding: theme.spacing.lg,
          backgroundColor: theme.colors.background
        }}
      >
        <View style={{ width: '100%', alignItems: 'center' }}>
          <Timer initialHours={0} initialMinutes={1} initialSeconds={0} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
