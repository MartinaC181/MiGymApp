import React from "react";
import { Modal, View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import theme from "../constants/theme";
import globalStyles from "../styles/global";

interface Props {
  visible: boolean;
  onClose: () => void;
  onAccept?: () => void;
  onDecline?: () => void;
}

export default function PoliticasModal({
  visible,
  onClose,
  onAccept,
  onDecline,
}: Props) {
  // Determinar si mostrar botones de aceptar/rechazar o solo cerrar
  const showActionButtons = onAccept && onDecline;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={globalStyles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.modal} onPress={(e) => e.stopPropagation()}>
          {/* Botón de cerrar (cruz) */}
          <Pressable style={styles.closeButton} onPress={onClose}>
            <MaterialIcons name="close" size={24} color={theme.colors.textSecondary} />
          </Pressable>

          {/* Icono de políticas */}
          <View style={styles.iconContainer}>
            <MaterialIcons name="security" size={40} color={theme.colors.primary} />
          </View>

          {/* Título del modal */}
          <Text style={styles.title}>
            {/* TEXTO: Título principal del modal */}
            Políticas de Privacidad
          </Text>

          {/* Contenedor del scroll para el contenido */}
          <ScrollView 
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Sección de introducción */}
            <Text style={styles.sectionTitle}>
              {/* TEXTO: Título de la sección de introducción */}
              1. Información General
            </Text>
            <Text style={styles.contentText}>
              {/* TEXTO: Contenido de la introducción */}
              En MiGymApp, nos comprometemos a proteger tu privacidad y tus datos personales. Esta política de privacidad describe cómo recopilamos, utilizamos y protegemos tu información cuando utilizas nuestra aplicación.
            </Text>

            {/* Sección de datos recopilados */}
            <Text style={styles.sectionTitle}>
              {/* TEXTO: Título de la sección de datos */}
              2. Información que Recopilamos
            </Text>
            <Text style={styles.contentText}>
              {/* TEXTO: Contenido sobre datos recopilados */}
              Recopilamos información que nos proporcionas directamente, como tu nombre, correo electrónico, información de perfil físico (altura, peso, objetivos) y datos de asistencia al gimnasio. También recopilamos información de uso de la aplicación para mejorar nuestros servicios.
            </Text>

            {/* Sección de uso de datos */}
            <Text style={styles.sectionTitle}>
              {/* TEXTO: Título de la sección de uso */}
              3. Cómo Utilizamos tu Información
            </Text>
            <Text style={styles.contentText}>
              {/* TEXTO: Contenido sobre uso de datos */}
              Utilizamos tu información para proporcionar y mejorar nuestros servicios, personalizar tu experiencia, comunicarnos contigo sobre actualizaciones y mantener la seguridad de tu cuenta. Nunca vendemos tu información personal a terceros.
            </Text>

            {/* Sección de seguridad */}
            <Text style={styles.sectionTitle}>
              {/* TEXTO: Título de la sección de seguridad */}
              4. Seguridad de Datos
            </Text>
            <Text style={styles.contentText}>
              {/* TEXTO: Contenido sobre seguridad */}
              Implementamos medidas de seguridad técnicas y organizativas para proteger tu información personal contra acceso no autorizado, alteración, divulgación o destrucción. Utilizamos encriptación para proteger los datos sensibles.
            </Text>

            {/* Sección de compartir datos */}
            <Text style={styles.sectionTitle}>
              {/* TEXTO: Título de la sección de compartir */}
              5. Compartir Información
            </Text>
            <Text style={styles.contentText}>
              {/* TEXTO: Contenido sobre compartir datos */}
              No compartimos tu información personal con terceros, excepto cuando es necesario para proporcionar nuestros servicios, cumplir con obligaciones legales, o cuando tienes consentimiento explícito. Solo compartimos datos agregados y anonimizados para análisis.
            </Text>

            {/* Sección de tus derechos */}
            <Text style={styles.sectionTitle}>
              {/* TEXTO: Título de la sección de derechos */}
              6. Tus Derechos
            </Text>
            <Text style={styles.contentText}>
              {/* TEXTO: Contenido sobre derechos del usuario */}
              Tienes derecho a acceder, corregir, eliminar o portar tus datos personales. También puedes retirar tu consentimiento en cualquier momento. Para ejercer estos derechos, contáctanos a través de la aplicación o por correo electrónico.
            </Text>

            {/* Sección de cookies */}
            <Text style={styles.sectionTitle}>
              {/* TEXTO: Título de la sección de cookies */}
              7. Cookies y Tecnologías Similares
            </Text>
            <Text style={styles.contentText}>
              {/* TEXTO: Contenido sobre cookies */}
              Utilizamos cookies y tecnologías similares para mejorar tu experiencia, analizar el uso de la aplicación y personalizar el contenido. Puedes controlar el uso de cookies a través de la configuración de tu dispositivo.
            </Text>

            {/* Sección de cambios */}
            <Text style={styles.sectionTitle}>
              {/* TEXTO: Título de la sección de cambios */}
              8. Cambios en esta Política
            </Text>
            <Text style={styles.contentText}>
              {/* TEXTO: Contenido sobre cambios */}
              Podemos actualizar esta política de privacidad ocasionalmente. Te notificaremos sobre cambios significativos a través de la aplicación o por correo electrónico. Te recomendamos revisar esta política periódicamente.
            </Text>

            {/* Sección de contacto */}
            <Text style={styles.sectionTitle}>
              {/* TEXTO: Título de la sección de contacto */}
              9. Contacto
            </Text>
            <Text style={styles.contentText}>
              {/* TEXTO: Contenido sobre contacto */}
              Si tienes preguntas sobre esta política de privacidad o sobre cómo manejamos tus datos personales, contáctanos a través de la aplicación o envía un correo electrónico a nuestro equipo de privacidad.
            </Text>
          </ScrollView>

          {/* Botones de acción */}
          {showActionButtons ? (
            <View style={styles.buttonContainer}>
              <Pressable style={styles.declineButton} onPress={onDecline}>
                <Text style={styles.declineButtonText}>
                  {/* TEXTO: Botón de rechazar */}
                  Rechazar
                </Text>
              </Pressable>
              
              <Pressable style={styles.acceptButton} onPress={onAccept}>
                <Text style={styles.acceptButtonText}>
                  {/* TEXTO: Botón de aceptar */}
                  Aceptar
                </Text>
              </Pressable>
            </View>
          ) : (
            <Pressable style={styles.closeModalButton} onPress={onClose}>
              <Text style={styles.closeModalButtonText}>
                {/* TEXTO: Botón de cerrar */}
                Cerrar
              </Text>
            </Pressable>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// Estilos específicos del modal de políticas
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  declineButton: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.textSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  declineButtonText: {
    fontSize: 16,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.textSecondary,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  acceptButtonText: {
    fontSize: 16,
    fontFamily: theme.typography.fontFamily.medium,
    color: "#FFFFFF",
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
