import React from "react";
import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { createGlobalStyles } from "../../styles/global";
import { useRouter } from "expo-router";

export default function SobreApp() {
  const { theme } = useTheme();
  const globalStyles = createGlobalStyles(theme);
  const router = useRouter();

  return (
    <View style={[globalStyles.safeArea, { flex: 1, backgroundColor: theme.colors.background }]}> 
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </Pressable>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Sobre MiGymApp</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={true}>
        <View style={[styles.iconContainer, { backgroundColor: theme.colors.surface }]}> 
          <MaterialIcons name="info" size={40} color={theme.colors.primary} />
        </View>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>¿Qué es MiGymApp?</Text>
        <Text style={[styles.contentText, { color: theme.colors.textSecondary }]}>MiGymApp es una aplicación móvil diseñada para ayudarte a gestionar tu membresía de gimnasio de manera eficiente. Nuestro objetivo es simplificar tu experiencia fitness proporcionando herramientas para marcar asistencia, realizar seguimiento de tu progreso y mantenerte motivado en tu camino hacia una vida más saludable.</Text>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Características Principales</Text>
        <Text style={[styles.contentText, { color: theme.colors.textSecondary }]}>• Marcado de asistencia rápido y sencillo{`\n`}• Seguimiento de rachas y metas semanales{`\n`}• Gestión de membresía y cuotas{`\n`}• Perfil personalizado con métricas físicas{`\n`}• Historial de asistencia detallado{`\n`}• Interfaz intuitiva y fácil de usar</Text>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Información de la Aplicación</Text>
        <Text style={[styles.contentText, { color: theme.colors.textSecondary }]}>Versión: 1.0.0{`\n`}Desarrollado para: iOS y Android{`\n`}Última actualización: Diciembre 2024{`\n`}Tamaño de la aplicación: 15 MB</Text>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Equipo de Desarrollo</Text>
        <Text style={[styles.contentText, { color: theme.colors.textSecondary }]}>MiGymApp fue desarrollado por un equipo apasionado por la tecnología y el fitness. Nuestro objetivo es crear herramientas que ayuden a las personas a alcanzar sus objetivos de salud y bienestar de manera más efectiva y motivadora.</Text>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Agradecimientos</Text>
        <Text style={[styles.contentText, { color: theme.colors.textSecondary }]}>Agradecemos a todos los usuarios que confían en MiGymApp para gestionar su fitness. Sus comentarios y sugerencias nos ayudan a mejorar constantemente la aplicación. También agradecemos a la comunidad de desarrolladores por las herramientas y librerías que hacen posible esta aplicación.</Text>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Contacto y Soporte</Text>
        <Text style={[styles.contentText, { color: theme.colors.textSecondary }]}>Si tienes preguntas, sugerencias o necesitas ayuda con la aplicación, no dudes en contactarnos. Estamos aquí para ayudarte a aprovechar al máximo tu experiencia con MiGymApp.</Text>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Derechos de Autor</Text>
        <Text style={[styles.contentText, { color: theme.colors.textSecondary }]}>© 2024 MiGymApp. Todos los derechos reservados. Esta aplicación y su contenido están protegidos por las leyes de derechos de autor y propiedad intelectual.</Text>
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