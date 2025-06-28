import React from "react";
import { Modal, View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import theme from "../constants/theme";
import globalStyles from "../styles/global";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function SobreAppModal({
  visible,
  onClose,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={globalStyles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.modal} onPress={(e) => e.stopPropagation()}>
          {/* Botón de cerrar (cruz) */}
          <Pressable style={styles.closeButton} onPress={onClose}>
            <MaterialIcons name="close" size={24} color={theme.colors.textSecondary} />
          </Pressable>

          {/* Icono de información */}
          <View style={styles.iconContainer}>
            <MaterialIcons name="info" size={40} color={theme.colors.primary} />
          </View>

          {/* Título del modal */}
          <Text style={styles.title}>
            {/* TEXTO: Título principal del modal */}
            Sobre MiGymApp
          </Text>

          {/* Contenedor del scroll para el contenido */}
          <ScrollView 
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Sección de descripción general */}
            <Text style={styles.sectionTitle}>
              {/* TEXTO: Título de la sección de descripción */}
              ¿Qué es MiGymApp?
            </Text>
            <Text style={styles.contentText}>
              {/* TEXTO: Contenido de la descripción */}
              MiGymApp es una aplicación móvil diseñada para ayudarte a gestionar tu membresía de gimnasio de manera eficiente. Nuestro objetivo es simplificar tu experiencia fitness proporcionando herramientas para marcar asistencia, realizar seguimiento de tu progreso y mantenerte motivado en tu camino hacia una vida más saludable.
            </Text>

            {/* Sección de características */}
            <Text style={styles.sectionTitle}>
              {/* TEXTO: Título de la sección de características */}
              Características Principales
            </Text>
            <Text style={styles.contentText}>
              {/* TEXTO: Contenido sobre características */}
              • Marcado de asistencia rápido y sencillo{'\n'}
              • Seguimiento de rachas y metas semanales{'\n'}
              • Gestión de membresía y cuotas{'\n'}
              • Perfil personalizado con métricas físicas{'\n'}
              • Historial de asistencia detallado{'\n'}
              • Interfaz intuitiva y fácil de usar
            </Text>

            {/* Sección de versión */}
            <Text style={styles.sectionTitle}>
              {/* TEXTO: Título de la sección de versión */}
              Información de la Aplicación
            </Text>
            <Text style={styles.contentText}>
              {/* TEXTO: Contenido sobre versión */}
              Versión: 1.0.0{'\n'}
              Desarrollado para: iOS y Android{'\n'}
              Última actualización: Diciembre 2024{'\n'}
              Tamaño de la aplicación: 15 MB
            </Text>

            {/* Sección de desarrolladores */}
            <Text style={styles.sectionTitle}>
              {/* TEXTO: Título de la sección de desarrolladores */}
              Equipo de Desarrollo
            </Text>
            <Text style={styles.contentText}>
              {/* TEXTO: Contenido sobre desarrolladores */}
              MiGymApp fue desarrollado por un equipo apasionado por la tecnología y el fitness. Nuestro objetivo es crear herramientas que ayuden a las personas a alcanzar sus objetivos de salud y bienestar de manera más efectiva y motivadora.
            </Text>

            {/* Sección de agradecimientos */}
            <Text style={styles.sectionTitle}>
              {/* TEXTO: Título de la sección de agradecimientos */}
              Agradecimientos
            </Text>
            <Text style={styles.contentText}>
              {/* TEXTO: Contenido sobre agradecimientos */}
              Agradecemos a todos los usuarios que confían en MiGymApp para gestionar su fitness. Sus comentarios y sugerencias nos ayudan a mejorar constantemente la aplicación. También agradecemos a la comunidad de desarrolladores por las herramientas y librerías que hacen posible esta aplicación.
            </Text>

            {/* Sección de contacto */}
            <Text style={styles.sectionTitle}>
              {/* TEXTO: Título de la sección de contacto */}
              Contacto y Soporte
            </Text>
            <Text style={styles.contentText}>
              {/* TEXTO: Contenido sobre contacto */}
              Si tienes preguntas, sugerencias o necesitas ayuda con la aplicación, no dudes en contactarnos. Estamos aquí para ayudarte a aprovechar al máximo tu experiencia con MiGymApp.
            </Text>

            {/* Sección de derechos */}
            <Text style={styles.sectionTitle}>
              {/* TEXTO: Título de la sección de derechos */}
              Derechos de Autor
            </Text>
            <Text style={styles.contentText}>
              {/* TEXTO: Contenido sobre derechos */}
              © 2024 MiGymApp. Todos los derechos reservados. Esta aplicación y su contenido están protegidos por las leyes de derechos de autor y propiedad intelectual.
            </Text>
          </ScrollView>

          {/* Botón de cerrar */}
          <Pressable style={styles.closeModalButton} onPress={onClose}>
            <Text style={styles.closeModalButtonText}>
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
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.xl,
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
    top: theme.spacing.md,
    right: theme.spacing.md,
    zIndex: 1,
    padding: theme.spacing.sm,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.lg,
    elevation: 4,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.textPrimary,
    textAlign: "center",
    marginBottom: theme.spacing.lg,
  },
  scrollContainer: {
    width: "100%",
    maxHeight: 400,
  },
  scrollContent: {
    paddingBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  contentText: {
    fontSize: 14,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    textAlign: "justify",
  },
  closeModalButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    marginTop: theme.spacing.lg,
    elevation: 4,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  closeModalButtonText: {
    fontSize: 16,
    fontFamily: theme.typography.fontFamily.medium,
    color: "#FFFFFF",
  },
});
