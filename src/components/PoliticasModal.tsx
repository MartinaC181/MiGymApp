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

export default function PoliticasModal({
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

          {/* Icono de políticas */}
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.surface }]}>
            <MaterialIcons name="security" size={40} color={theme.colors.primary} />
          </View>

          {/* Título del modal */}
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
            Políticas de Privacidad
          </Text>

          {/* Contenedor del scroll para el contenido */}
          <ScrollView 
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={styles.scrollContent}
            nestedScrollEnabled={true}
          >
            {/* Sección de introducción */}
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              {/* TEXTO: Título de la sección de introducción */}
              1. Información General
            </Text>
            <Text style={[styles.contentText, { color: theme.colors.textSecondary }]}>
              {/* TEXTO: Contenido de la introducción */}
              En MiGymApp, nos comprometemos a proteger tu privacidad y tus datos personales. Esta política de privacidad describe cómo recopilamos, utilizamos y protegemos tu información cuando utilizas nuestra aplicación.
            </Text>

            {/* Sección de datos recopilados */}
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              {/* TEXTO: Título de la sección de datos */}
              2. Información que Recopilamos
            </Text>
            <Text style={[styles.contentText, { color: theme.colors.textSecondary }]}>
              {/* TEXTO: Contenido sobre datos recopilados */}
              Recopilamos información que nos proporcionas directamente, como tu nombre, correo electrónico, información de perfil físico (altura, peso, objetivos) y datos de asistencia al gimnasio. También recopilamos información de uso de la aplicación para mejorar nuestros servicios.
            </Text>

            {/* Sección de uso de datos */}
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              {/* TEXTO: Título de la sección de uso */}
              3. Cómo Utilizamos tu Información
            </Text>
            <Text style={[styles.contentText, { color: theme.colors.textSecondary }]}>
              {/* TEXTO: Contenido sobre uso de datos */}
              Utilizamos tu información para proporcionar y mejorar nuestros servicios, personalizar tu experiencia, comunicarnos contigo sobre actualizaciones y mantener la seguridad de tu cuenta. Nunca vendemos tu información personal a terceros.
            </Text>

            {/* Sección de seguridad */}
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              {/* TEXTO: Título de la sección de seguridad */}
              4. Seguridad de Datos
            </Text>
            <Text style={[styles.contentText, { color: theme.colors.textSecondary }]}>
              {/* TEXTO: Contenido sobre seguridad */}
              Implementamos medidas de seguridad técnicas y organizativas para proteger tu información personal contra acceso no autorizado, alteración, divulgación o destrucción. Utilizamos encriptación para proteger los datos sensibles.
            </Text>

            {/* Sección de compartir datos */}
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              {/* TEXTO: Título de la sección de compartir */}
              5. Compartir Información
            </Text>
            <Text style={[styles.contentText, { color: theme.colors.textSecondary }]}>
              {/* TEXTO: Contenido sobre compartir datos */}
              No compartimos tu información personal con terceros, excepto cuando es necesario para proporcionar nuestros servicios, cumplir con obligaciones legales, o cuando tienes consentimiento explícito. Solo compartimos datos agregados y anonimizados para análisis.
            </Text>

            {/* Sección de tus derechos */}
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              {/* TEXTO: Título de la sección de derechos */}
              6. Tus Derechos
            </Text>
            <Text style={[styles.contentText, { color: theme.colors.textSecondary }]}>
              {/* TEXTO: Contenido sobre derechos del usuario */}
              Tienes derecho a acceder, corregir, eliminar o portar tus datos personales. También puedes retirar tu consentimiento en cualquier momento. Para ejercer estos derechos, contáctanos a través de la aplicación o por correo electrónico.
            </Text>

            {/* Sección de cookies */}
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              {/* TEXTO: Título de la sección de cookies */}
              7. Cookies y Tecnologías Similares
            </Text>
            <Text style={[styles.contentText, { color: theme.colors.textSecondary }]}>
              {/* TEXTO: Contenido sobre cookies */}
              Utilizamos cookies y tecnologías similares para mejorar tu experiencia, analizar el uso de la aplicación y personalizar el contenido. Puedes controlar el uso de cookies a través de la configuración de tu dispositivo.
            </Text>

            {/* Sección de cambios */}
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              {/* TEXTO: Título de la sección de cambios */}
              8. Cambios en esta Política
            </Text>
            <Text style={[styles.contentText, { color: theme.colors.textSecondary }]}>
              {/* TEXTO: Contenido sobre cambios */}
              Podemos actualizar esta política de privacidad ocasionalmente. Te notificaremos sobre cambios significativos a través de la aplicación o por correo electrónico. Te recomendamos revisar esta política periódicamente.
            </Text>

            {/* Sección de contacto */}
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              {/* TEXTO: Título de la sección de contacto */}
              9. Contacto
            </Text>
            <Text style={[styles.contentText, { color: theme.colors.textSecondary }]}>
              {/* TEXTO: Contenido sobre contacto */}
              Si tienes preguntas sobre esta política de privacidad o sobre cómo manejamos tus datos personales, contáctanos a través de la aplicación o envía un correo electrónico a nuestro equipo de privacidad.
            </Text>
          </ScrollView>

          {/* Botones de acción */}
          {showActionButtons ? (
            <View style={styles.buttonContainer}>
              <Pressable style={[styles.declineButton, { backgroundColor: theme.colors.surface }]} onPress={onDecline}>
                <Text style={[styles.declineButtonText, { color: theme.colors.textSecondary }]}>
                  {/* TEXTO: Botón de rechazar */}
                  Rechazar
                </Text>
              </Pressable>
              
              <Pressable style={[styles.acceptButton, { backgroundColor: theme.colors.primary }]} onPress={onAccept}>
                <Text style={[styles.acceptButtonText, { color: theme.colors.background }]}>
                  {/* TEXTO: Botón de aceptar */}
                  Aceptar
                </Text>
              </Pressable>
            </View>
          ) : (
            <Pressable style={[styles.closeModalButton, { backgroundColor: theme.colors.primary }]} onPress={onClose}>
              <Text style={[styles.closeModalButtonText, { color: theme.colors.background }]}>
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
