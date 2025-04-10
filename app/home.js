import { Link } from "expo-router";

export default function Home() {
    return (
        <View className="flex-1 justify-center items-center bg-black">

            <Text className="text-black">Home</Text>
            
            <Link href="/" className="text-blue-500">Atras</Link>
        </View>
    )
}