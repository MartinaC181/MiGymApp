import React from "react";
import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { createGlobalStyles } from "../../styles/global";
import { useRouter } from "expo-router";

export default function TerminosCondiciones() {
  const { theme } = useTheme();
  const globalStyles = createGlobalStyles(theme);
  const router = useRouter();

  return (
    <View style={[globalStyles.safeArea, { flex: 1, backgroundColor: theme.colors.background }]}> 
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </Pressable>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Términos y Condiciones</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={true}>
        <View style={[styles.iconContainer, { backgroundColor: theme.colors.surface }]}> 
          <MaterialIcons name="description" size={40} color={theme.colors.primary} />
        </View>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>1. Introducción</Text>
        <Text style={[styles.contentText, { color: theme.colors.textSecondary }]}>Bienvenido a MiGymApp. Al utilizar nuestra aplicación, aceptas estos términos y condiciones en su totalidad. Si no estás de acuerdo con estos términos o alguna parte de estos términos, no debes utilizar nuestra aplicación.</Text>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>2. Uso de la Aplicación</Text>
        <Text style={[styles.contentText, { color: theme.colors.textSecondary }]}>MiGymApp está diseñada para ayudarte a gestionar tu membresía de gimnasio, marcar asistencia y realizar seguimiento de tu progreso físico. Te comprometes a utilizar la aplicación únicamente para estos fines legítimos.</Text>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>3. Privacidad y Datos Personales</Text>
        <Text style={[styles.contentText, { color: theme.colors.textSecondary }]}>Tu privacidad es importante para nosotros. Recopilamos y procesamos tus datos personales de acuerdo con nuestra Política de Privacidad. Al usar la aplicación, consientes el procesamiento de tus datos personales.</Text>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>4. Responsabilidades del Usuario</Text>
        <Text style={[styles.contentText, { color: theme.colors.textSecondary }]}>Eres responsable de mantener la confidencialidad de tu cuenta y contraseña. También eres responsable de todas las actividades que ocurran bajo tu cuenta. Debes notificarnos inmediatamente de cualquier uso no autorizado.</Text>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>5. Limitaciones de Responsabilidad</Text>
        <Text style={[styles.contentText, { color: theme.colors.textSecondary }]}>MiGymApp se proporciona "tal como está" sin garantías de ningún tipo. No seremos responsables por daños directos, indirectos, incidentales o consecuentes que puedan resultar del uso de la aplicación.</Text>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>6. Modificaciones de los Términos</Text>
        <Text style={[styles.contentText, { color: theme.colors.textSecondary }]}>Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en la aplicación. Es tu responsabilidad revisar periódicamente estos términos.</Text>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>7. Contacto</Text>
        <Text style={[styles.contentText, { color: theme.colors.textSecondary }]}>Si tienes alguna pregunta sobre estos términos y condiciones, puedes contactarnos a través de la aplicación o enviando un correo electrónico a nuestro equipo de soporte.</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
    marginBottom: 8,
  },
  backButton: {
    marginRight: 8,
    padding: 4,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Roboto-Bold',
    flex: 1,
    textAlign: 'left',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    alignSelf: 'center',
    elevation: 4,
    shadowColor: "#00BFFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 48,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    marginTop: 16,
    marginBottom: 8,
  },
  contentText: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    lineHeight: 20,
    marginBottom: 16,
    textAlign: 'justify',
  },
}); 