import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import theme from "../constants/theme";

type HeaderProps = {
  title: string;
  showBack?: boolean;
};

const Header = ({ title, showBack = false }: HeaderProps) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const pathname = usePathname();
  const isHome = pathname.includes('/home');

  const handleBackPress = () => {
    if (isHome) {
      // Si estamos en home, mostrar modal de confirmación
      setShowLogoutModal(true);
    } else {
      // En otras pantallas, comportamiento normal
      router.back();
    }
  };

  const handleLogout = () => {
    setShowLogoutModal(false);
    router.replace("/login"); // replace para limpiar el stack
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <View style={styles.header}>
        {showBack && (
          <TouchableOpacity style={styles.leftIcon} onPress={handleBackPress}>
            <MaterialIcons
              name="chevron-left"
              size={24}
              color={theme.colors.background}
            />
          </TouchableOpacity>
        )}

        <Text style={styles.title}>{title}</Text>

        <TouchableOpacity
          style={styles.rightIcon}
          onPress={() => router.push("/Settings")}
        >
          <MaterialCommunityIcons
            name="cog-outline"
            size={20}
            color={theme.colors.background}
          />
        </TouchableOpacity>
      </View>

      {/* Modal de confirmación de logout */}
      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelLogout}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Cerrar sesión</Text>
            <Text style={styles.modalMessage}>
              ¿Estás seguro que querés cerrar tu sesión?
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={handleCancelLogout}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.confirmButton} 
                onPress={handleLogout}
              >
                <Text style={styles.confirmButtonText}>Cerrar sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    width: "100%",
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomLeftRadius: theme.borderRadius.lg,
    borderBottomRightRadius: theme.borderRadius.lg,
  },
  title: {
    fontSize: theme.typography.fontSize.title,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.background,
  },
  leftIcon: {
    position: "absolute",
    left: 16,
    top: 50,
  },
  rightIcon: {
    position: "absolute",
    right: 16,
    top: 50,
  },
  // Estilos del modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    margin: theme.spacing.lg,
    minWidth: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: theme.typography.fontSize.large,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  modalMessage: {
    fontSize: theme.typography.fontSize.medium,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: theme.typography.fontSize.medium,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.textSecondary,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: theme.typography.fontSize.medium,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.background,
  },
});

export default Header;
