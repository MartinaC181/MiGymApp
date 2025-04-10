import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';

export function Main() {

  return (
    <View style={styles.container}>
      <Text>¡Bienvenido a MiGymApp!</Text>

      <Link href="/home" style={{ marginTop: 16, color: '#1e90ff', fontWeight: 'bold', fontSize: 18 }}>
        Ir al home
      </Link>
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6fc',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 450,
    paddingBottom: 450,
  },
});
