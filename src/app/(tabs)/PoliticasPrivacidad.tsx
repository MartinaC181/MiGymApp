import React from "react";
import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { createGlobalStyles } from "../../styles/global";
import { useRouter } from "expo-router";

export default function PoliticasPrivacidad() {
  const { theme } = useTheme();
  const globalStyles = createGlobalStyles(theme);
  const router = useRouter();

  return (
    <View style={[globalStyles.safeArea, { flex: 1, backgroundColor: theme.colors.background }]}> 
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </Pressable>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Políticas de Privacidad</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={true}>
        <View style={[styles.iconContainer, { backgroundColor: theme.colors.surface }]}> 
          <MaterialIcons name="security" size={40} color={theme.colors.primary} />
        </View>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>1. Información General</Text>
        <Text style={[styles.contentText, { color: theme.colors.textSecondary }]}>En MiGymApp, nos comprometemos a proteger tu privacidad y tus datos personales. Esta política de privacidad describe cómo recopilamos, utilizamos y protegemos tu información cuando utilizas nuestra aplicación.</Text>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>2. Información que Recopilamos</Text>
        <Text style={[styles.contentText, { color: theme.colors.textSecondary }]}>Recopilamos información que nos proporcionas directamente, como tu nombre, correo electrónico, información de perfil físico (altura, peso, objetivos) y datos de asistencia al gimnasio. También recopilamos información de uso de la aplicación para mejorar nuestros servicios.</Text>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>3. Cómo Utilizamos tu Información</Text>
        <Text style={[styles.contentText, { color: theme.colors.textSecondary }]}>Utilizamos tu información para proporcionar y mejorar nuestros servicios, personalizar tu experiencia, comunicarnos contigo sobre actualizaciones y mantener la seguridad de tu cuenta. Nunca vendemos tu información personal a terceros.</Text>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>4. Seguridad de Datos</Text>
        <Text style={[styles.contentText, { color: theme.colors.textSecondary }]}>Implementamos medidas de seguridad técnicas y organizativas para proteger tu información personal contra acceso no autorizado, alteración, divulgación o destrucción. Utilizamos encriptación para proteger los datos sensibles.</Text>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>5. Compartir Información</Text>
        <Text style={[styles.contentText, { color: theme.colors.textSecondary }]}>No compartimos tu información personal con terceros, excepto cuando es necesario para proporcionar nuestros servicios, cumplir con obligaciones legales, o cuando tienes consentimiento explícito. Solo compartimos datos agregados y anonimizados para análisis.</Text>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>6. Tus Derechos</Text>
        <Text style={[styles.contentText, { color: theme.colors.textSecondary }]}>Tienes derecho a acceder, corregir, eliminar o portar tus datos personales. También puedes retirar tu consentimiento en cualquier momento. Para ejercer estos derechos, contáctanos a través de la aplicación o por correo electrónico.</Text>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>7. Cookies y Tecnologías Similares</Text>
        <Text style={[styles.contentText, { color: theme.colors.textSecondary }]}>Utilizamos cookies y tecnologías similares para mejorar tu experiencia, analizar el uso de la aplicación y personalizar el contenido. Puedes controlar el uso de cookies a través de la configuración de tu dispositivo.</Text>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>8. Cambios en esta Política</Text>
        <Text style={[styles.contentText, { color: theme.colors.textSecondary }]}>Podemos actualizar esta política de privacidad ocasionalmente. Te notificaremos sobre cambios significativos a través de la aplicación o por correo electrónico. Te recomendamos revisar esta política periódicamente.</Text>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>9. Contacto</Text>
        <Text style={[styles.contentText, { color: theme.colors.textSecondary }]}>Si tienes preguntas sobre esta política de privacidad o sobre cómo manejamos tus datos personales, contáctanos a través de la aplicación o envía un correo electrónico a nuestro equipo de privacidad.</Text>
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