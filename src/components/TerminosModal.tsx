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

export default function TerminosModal({
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

          {/* Icono de términos */}
          <View style={styles.iconContainer}>
            <MaterialIcons name="description" size={40} color={theme.colors.primary} />
          </View>

          {/* Título del modal */}
          <Text style={styles.title}>
            Términos y Condiciones
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
              1. Introducción
            </Text>
            <Text style={styles.contentText}>
              {/* TEXTO: Contenido de la introducción */}
              Bienvenido a MiGymApp. Al utilizar nuestra aplicación, aceptas estos términos y condiciones en su totalidad. Si no estás de acuerdo con estos términos o alguna parte de estos términos, no debes utilizar nuestra aplicación.
            </Text>

            {/* Sección de uso de la aplicación */}
            <Text style={styles.sectionTitle}>
              {/* TEXTO: Título de la sección de uso */}
              2. Uso de la Aplicación
            </Text>
            <Text style={styles.contentText}>
              {/* TEXTO: Contenido sobre el uso de la aplicación */}
              MiGymApp está diseñada para ayudarte a gestionar tu membresía de gimnasio, marcar asistencia y realizar seguimiento de tu progreso físico. Te comprometes a utilizar la aplicación únicamente para estos fines legítimos.
            </Text>

            {/* Sección de privacidad */}
            <Text style={styles.sectionTitle}>
              {/* TEXTO: Título de la sección de privacidad */}
              3. Privacidad y Datos Personales
            </Text>
            <Text style={styles.contentText}>
              {/* TEXTO: Contenido sobre privacidad */}
              Tu privacidad es importante para nosotros. Recopilamos y procesamos tus datos personales de acuerdo con nuestra Política de Privacidad. Al usar la aplicación, consientes el procesamiento de tus datos personales.
            </Text>

            {/* Sección de responsabilidades */}
            <Text style={styles.sectionTitle}>
              {/* TEXTO: Título de la sección de responsabilidades */}
              4. Responsabilidades del Usuario
            </Text>
            <Text style={styles.contentText}>
              {/* TEXTO: Contenido sobre responsabilidades */}
              Eres responsable de mantener la confidencialidad de tu cuenta y contraseña. También eres responsable de todas las actividades que ocurran bajo tu cuenta. Debes notificarnos inmediatamente de cualquier uso no autorizado.
            </Text>

            {/* Sección de limitaciones */}
            <Text style={styles.sectionTitle}>
              {/* TEXTO: Título de la sección de limitaciones */}
              5. Limitaciones de Responsabilidad
            </Text>
            <Text style={styles.contentText}>
              {/* TEXTO: Contenido sobre limitaciones de responsabilidad */}
              MiGymApp se proporciona "tal como está" sin garantías de ningún tipo. No seremos responsables por daños directos, indirectos, incidentales o consecuentes que puedan resultar del uso de la aplicación.
            </Text>

            {/* Sección de modificaciones */}
            <Text style={styles.sectionTitle}>
              {/* TEXTO: Título de la sección de modificaciones */}
              6. Modificaciones de los Términos
            </Text>
            <Text style={styles.contentText}>
              {/* TEXTO: Contenido sobre modificaciones */}
              Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en la aplicación. Es tu responsabilidad revisar periódicamente estos términos.
            </Text>

            {/* Sección de contacto */}
            <Text style={styles.sectionTitle}>
              {/* TEXTO: Título de la sección de contacto */}
              7. Contacto
            </Text>
            <Text style={styles.contentText}>
              {/* TEXTO: Contenido sobre contacto */}
              Si tienes alguna pregunta sobre estos términos y condiciones, puedes contactarnos a través de la aplicación o enviando un correo electrónico a nuestro equipo de soporte.
            </Text>
          </ScrollView>

          {/* Botones de acción */}
          {showActionButtons ? (
            <View style={styles.buttonContainer}>
              <Pressable style={styles.declineButton} onPress={onDecline}>
                <Text style={styles.declineButtonText}>
                  Rechazar
                </Text>
              </Pressable>
              
              <Pressable style={styles.acceptButton} onPress={onAccept}>
                <Text style={styles.acceptButtonText}>
                  Aceptar
                </Text>
              </Pressable>
            </View>
          ) : (
            <Pressable style={styles.closeModalButton} onPress={onClose}>
              <Text style={styles.closeModalButtonText}>
                Cerrar
              </Text>
            </Pressable>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

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
