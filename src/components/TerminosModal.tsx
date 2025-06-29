import React from "react";
import { Modal, View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { createGlobalStyles } from "../styles/global";

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
  const { theme } = useTheme();
  const globalStyles = createGlobalStyles(theme);
  
  // Determinar si mostrar botones de aceptar/rechazar o solo cerrar
  const showActionButtons = onAccept && onDecline;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={globalStyles.modalOverlay} onPress={onClose}>
        <Pressable style={[styles.modal, { backgroundColor: theme.colors.background }]} onPress={(e) => e.stopPropagation()}>
          {/* Botón de cerrar (cruz) */}
          <Pressable style={styles.closeButton} onPress={onClose}>
            <MaterialIcons name="close" size={24} color={theme.colors.textSecondary} />
          </Pressable>

          {/* Icono de términos */}
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.surface }]}>
            <MaterialIcons name="description" size={40} color={theme.colors.primary} />
          </View>

          {/* Título del modal */}
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
            Términos y Condiciones
          </Text>

          {/* Contenedor del scroll para el contenido */}
          <ScrollView 
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Sección de introducción */}
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              {/* TEXTO: Título de la sección de introducción */}
              1. Introducción
            </Text>
            <Text style={[styles.contentText, { color: theme.colors.textSecondary }]}>
              {/* TEXTO: Contenido de la introducción */}
              Bienvenido a MiGymApp. Al utilizar nuestra aplicación, aceptas estos términos y condiciones en su totalidad. Si no estás de acuerdo con estos términos o alguna parte de estos términos, no debes utilizar nuestra aplicación.
            </Text>

            {/* Sección de uso de la aplicación */}
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              {/* TEXTO: Título de la sección de uso */}
              2. Uso de la Aplicación
            </Text>
            <Text style={[styles.contentText, { color: theme.colors.textSecondary }]}>
              {/* TEXTO: Contenido sobre el uso de la aplicación */}
              MiGymApp está diseñada para ayudarte a gestionar tu membresía de gimnasio, marcar asistencia y realizar seguimiento de tu progreso físico. Te comprometes a utilizar la aplicación únicamente para estos fines legítimos.
            </Text>

            {/* Sección de privacidad */}
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              {/* TEXTO: Título de la sección de privacidad */}
              3. Privacidad y Datos Personales
            </Text>
            <Text style={[styles.contentText, { color: theme.colors.textSecondary }]}>
              {/* TEXTO: Contenido sobre privacidad */}
              Tu privacidad es importante para nosotros. Recopilamos y procesamos tus datos personales de acuerdo con nuestra Política de Privacidad. Al usar la aplicación, consientes el procesamiento de tus datos personales.
            </Text>

            {/* Sección de responsabilidades */}
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              {/* TEXTO: Título de la sección de responsabilidades */}
              4. Responsabilidades del Usuario
            </Text>
            <Text style={[styles.contentText, { color: theme.colors.textSecondary }]}>
              {/* TEXTO: Contenido sobre responsabilidades */}
              Eres responsable de mantener la confidencialidad de tu cuenta y contraseña. También eres responsable de todas las actividades que ocurran bajo tu cuenta. Debes notificarnos inmediatamente de cualquier uso no autorizado.
            </Text>

            {/* Sección de limitaciones */}
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              {/* TEXTO: Título de la sección de limitaciones */}
              5. Limitaciones de Responsabilidad
            </Text>
            <Text style={[styles.contentText, { color: theme.colors.textSecondary }]}>
              {/* TEXTO: Contenido sobre limitaciones de responsabilidad */}
              MiGymApp se proporciona "tal como está" sin garantías de ningún tipo. No seremos responsables por daños directos, indirectos, incidentales o consecuentes que puedan resultar del uso de la aplicación.
            </Text>

            {/* Sección de modificaciones */}
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              {/* TEXTO: Título de la sección de modificaciones */}
              6. Modificaciones de los Términos
            </Text>
            <Text style={[styles.contentText, { color: theme.colors.textSecondary }]}>
              {/* TEXTO: Contenido sobre modificaciones */}
              Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en la aplicación. Es tu responsabilidad revisar periódicamente estos términos.
            </Text>

            {/* Sección de contacto */}
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              {/* TEXTO: Título de la sección de contacto */}
              7. Contacto
            </Text>
            <Text style={[styles.contentText, { color: theme.colors.textSecondary }]}>
              {/* TEXTO: Contenido sobre contacto */}
              Si tienes alguna pregunta sobre estos términos y condiciones, puedes contactarnos a través de la aplicación o enviando un correo electrónico a nuestro equipo de soporte.
            </Text>
          </ScrollView>

          {/* Botones de acción */}
          {showActionButtons ? (
            <View style={styles.buttonContainer}>
              <Pressable style={[styles.declineButton, { backgroundColor: theme.colors.surface }]} onPress={onDecline}>
                <Text style={[styles.declineButtonText, { color: theme.colors.textSecondary }]}>
                  Rechazar
                </Text>
              </Pressable>
              
              <Pressable style={[styles.acceptButton, { backgroundColor: theme.colors.primary }]} onPress={onAccept}>
                <Text style={[styles.acceptButtonText, { color: theme.colors.background }]}>
                  Aceptar
                </Text>
              </Pressable>
            </View>
          ) : (
            <Pressable style={[styles.closeModalButton, { backgroundColor: theme.colors.primary }]} onPress={onClose}>
              <Text style={[styles.closeModalButtonText, { color: theme.colors.background }]}>
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
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 24,
    gap: 16,
  },
  declineButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  declineButtonText: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
  },
  acceptButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  acceptButtonText: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
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
