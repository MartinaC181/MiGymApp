import { Slot } from "expo-router";
import { View } from "react-native";
import Navigation from "../../components/Navigation";

export default function Layout() {
return (
    <View className="flex-1 justify-center items-center bg-white">
        <Slot />
        <Navigation />
    </View>
)
}