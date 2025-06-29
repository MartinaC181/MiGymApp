import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { useTheme } from "../context/ThemeContext";

type HeaderProps = {
  title: string;
  showBack?: boolean;
};

const Header = ({ title, showBack = false }: HeaderProps) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const pathname = usePathname();
  const isHome = pathname.includes('/home');
  const { theme, isDarkMode } = useTheme();

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
      <View style={[
        styles.header, 
        { 
          backgroundColor: isDarkMode ? '#0066CC' : theme.colors.primary 
        }
      ]}>
        {showBack && (
          <TouchableOpacity style={styles.leftIcon} onPress={handleBackPress}>
            <MaterialIcons
              name="chevron-left"
              size={28}
              color={isDarkMode ? '#ffffff' : theme.colors.background}
            />
          </TouchableOpacity>
        )}

        <Text style={[
          styles.title, 
          { color: isDarkMode ? '#ffffff' : theme.colors.background }
        ]}>
          {title}
        </Text>

        <TouchableOpacity
          style={styles.rightIcon}
          onPress={() => router.push("/Settings")}
        >
          <MaterialCommunityIcons
            name="cog-outline"
            size={24}
            color={isDarkMode ? '#ffffff' : theme.colors.background}
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
          <View style={[
            styles.modalContainer, 
            { backgroundColor: theme.colors.background }
          ]}>
            <Text style={[
              styles.modalTitle, 
              { color: theme.colors.textPrimary }
            ]}>
              Cerrar sesión
            </Text>
            <Text style={[
              styles.modalMessage, 
              { color: theme.colors.textSecondary }
            ]}>
              ¿Estás seguro que querés cerrar tu sesión?
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[
                  styles.cancelButton, 
                  { backgroundColor: theme.colors.surface }
                ]} 
                onPress={handleCancelLogout}
              >
                <Text style={[
                  styles.cancelButtonText, 
                  { color: theme.colors.textSecondary }
                ]}>
                  Cancelar
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.confirmButton, 
                  { backgroundColor: theme.colors.primary }
                ]} 
                onPress={handleLogout}
              >
                <Text style={[
                  styles.confirmButtonText, 
                  { color: theme.colors.background }
                ]}>
                  Cerrar sesión
                </Text>
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
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
  },
  leftIcon: {
    position: "absolute",
    left: 16,
    top: 64,
  },
  rightIcon: {
    position: "absolute",
    right: 16,
    top: 64,
  },
  // Estilos del modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    borderRadius: 12,
    padding: 24,
    margin: 16,
    minWidth: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
  },
  confirmButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
  },
});

export default Header;
