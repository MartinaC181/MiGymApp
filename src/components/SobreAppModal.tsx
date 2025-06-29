import React from "react";
import { Modal, View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { createGlobalStyles } from "../styles/global";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function SobreAppModal({
  visible,
  onClose,
}: Props) {
  const { theme } = useTheme();
  const globalStyles = createGlobalStyles(theme);
  
  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={globalStyles.modalOverlay} onPress={onClose}>
        <Pressable style={[styles.modal, { backgroundColor: theme.colors.background }]} onPress={(e) => e.stopPropagation()}>
          {/* Botón de cerrar (cruz) */}
          <Pressable style={styles.closeButton} onPress={onClose}>
            <MaterialIcons name="close" size={24} color={theme.colors.textSecondary} />
          </Pressable>

          {/* Icono de información */}
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.surface }]}>
            <MaterialIcons name="info" size={40} color={theme.colors.primary} />
          </View>

          {/* Título del modal */}
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
            Sobre MiGymApp
          </Text>

          {/* Contenedor del scroll para el contenido */}
          <ScrollView 
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={styles.scrollContent}
            nestedScrollEnabled={true}
          >
            {/* Sección de descripción general */}
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              {/* TEXTO: Título de la sección de descripción */}
              ¿Qué es MiGymApp?
            </Text>
            <Text style={[styles.contentText, { color: theme.colors.textSecondary }]}>
              {/* TEXTO: Contenido de la descripción */}
              MiGymApp es una aplicación móvil diseñada para ayudarte a gestionar tu membresía de gimnasio de manera eficiente. Nuestro objetivo es simplificar tu experiencia fitness proporcionando herramientas para marcar asistencia, realizar seguimiento de tu progreso y mantenerte motivado en tu camino hacia una vida más saludable.
            </Text>

            {/* Sección de características */}
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              {/* TEXTO: Título de la sección de características */}
              Características Principales
            </Text>
            <Text style={[styles.contentText, { color: theme.colors.textSecondary }]}>
              {/* TEXTO: Contenido sobre características */}
              • Marcado de asistencia rápido y sencillo{'\n'}
              • Seguimiento de rachas y metas semanales{'\n'}
              • Gestión de membresía y cuotas{'\n'}
              • Perfil personalizado con métricas físicas{'\n'}
              • Historial de asistencia detallado{'\n'}
              • Interfaz intuitiva y fácil de usar
            </Text>

            {/* Sección de versión */}
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              {/* TEXTO: Título de la sección de versión */}
              Información de la Aplicación
            </Text>
            <Text style={[styles.contentText, { color: theme.colors.textSecondary }]}>
              {/* TEXTO: Contenido sobre versión */}
              Versión: 1.0.0{'\n'}
              Desarrollado para: iOS y Android{'\n'}
              Última actualización: Diciembre 2024{'\n'}
              Tamaño de la aplicación: 15 MB
            </Text>

            {/* Sección de desarrolladores */}
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              {/* TEXTO: Título de la sección de desarrolladores */}
              Equipo de Desarrollo
            </Text>
            <Text style={[styles.contentText, { color: theme.colors.textSecondary }]}>
              {/* TEXTO: Contenido sobre desarrolladores */}
              MiGymApp fue desarrollado por un equipo apasionado por la tecnología y el fitness. Nuestro objetivo es crear herramientas que ayuden a las personas a alcanzar sus objetivos de salud y bienestar de manera más efectiva y motivadora.
            </Text>

            {/* Sección de agradecimientos */}
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              {/* TEXTO: Título de la sección de agradecimientos */}
              Agradecimientos
            </Text>
            <Text style={[styles.contentText, { color: theme.colors.textSecondary }]}>
              {/* TEXTO: Contenido sobre agradecimientos */}
              Agradecemos a todos los usuarios que confían en MiGymApp para gestionar su fitness. Sus comentarios y sugerencias nos ayudan a mejorar constantemente la aplicación. También agradecemos a la comunidad de desarrolladores por las herramientas y librerías que hacen posible esta aplicación.
            </Text>

            {/* Sección de contacto */}
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              {/* TEXTO: Título de la sección de contacto */}
              Contacto y Soporte
            </Text>
            <Text style={[styles.contentText, { color: theme.colors.textSecondary }]}>
              {/* TEXTO: Contenido sobre contacto */}
              Si tienes preguntas, sugerencias o necesitas ayuda con la aplicación, no dudes en contactarnos. Estamos aquí para ayudarte a aprovechar al máximo tu experiencia con MiGymApp.
            </Text>

            {/* Sección de derechos */}
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              {/* TEXTO: Título de la sección de derechos */}
              Derechos de Autor
            </Text>
            <Text style={[styles.contentText, { color: theme.colors.textSecondary }]}>
              {/* TEXTO: Contenido sobre derechos */}
              © 2024 MiGymApp. Todos los derechos reservados. Esta aplicación y su contenido están protegidos por las leyes de derechos de autor y propiedad intelectual.
            </Text>
          </ScrollView>

          {/* Botón de cerrar */}
          <Pressable style={[styles.closeModalButton, { backgroundColor: theme.colors.primary }]} onPress={onClose}>
            <Text style={[styles.closeModalButtonText, { color: theme.colors.background }]}>
              {/* TEXTO: Botón de cerrar */}
              Cerrar
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// Estilos específicos del modal sobre la app
const styles = StyleSheet.create({
  modal: {
    width: "90%",
    maxHeight: "80%",
    borderRadius: 16,
    paddingVertical: 32,
    paddingHorizontal: 32,
    alignItems: "center",
    position: "relative",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 1,
    padding: 8,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    elevation: 4,
    shadowColor: "#00BFFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Roboto-Bold',
    textAlign: "center",
    marginBottom: 24,
  },
  scrollContainer: {
    width: "100%",
    maxHeight: 400,
  },
  scrollContent: {
    paddingBottom: 24,
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
    textAlign: "justify",
    marginBottom: 16,
  },
  closeModalButton: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  closeModalButtonText: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
  },
});
