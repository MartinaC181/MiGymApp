import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import theme from "../constants/theme";
type HeaderProps = {
  title: string;
  showBack?: boolean; // opcional: mostrar o no botón atrás
};

const Header = ({ title, showBack = false }: HeaderProps) => {
  return (
    <View style={styles.header}>
      {/* Botón volver */}
      {showBack && (
        <TouchableOpacity style={styles.leftIcon} onPress={() => router.back()}>
          <MaterialIcons
            name="chevron-left"
            size={24}
            color={theme.colors.background}
          />
        </TouchableOpacity>
      )}

      {/* Título */}
      <Text style={styles.title}>{title}</Text>

      {/* Botón configuración */}
      <TouchableOpacity
        style={styles.rightIcon}
        onPress={() => router.push("/configuracion")}
      >
        <MaterialCommunityIcons
          name="cog-outline"
          size={20}
          color={theme.colors.background}
        />
      </TouchableOpacity>
    </View>
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
});
export default Header;
