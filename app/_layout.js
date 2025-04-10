import { Slot } from "expo-router";
import { View } from "react-native";

export default function Layout() {
return (
    <View className="flex-1 justify-center items-center bg-white">
        <Slot />
    </View>
)
}