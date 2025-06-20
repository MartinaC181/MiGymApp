import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import theme from "../constants/theme";
type HeaderProps = {
  title: string;
  showBack?: boolean;
};

const Header = ({ title, showBack = false }: HeaderProps) => {
  return (
    <View style={styles.header}>
      {showBack && (
        <TouchableOpacity style={styles.leftIcon} onPress={() => router.back()}>
          <MaterialIcons
            name="chevron-left"
            size={28}
            color={theme.colors.background}
          />
        </TouchableOpacity>
      )}


      <Text style={styles.title}>{title}</Text>

  
      <TouchableOpacity
        style={styles.rightIcon}
        onPress={() => router.push("/configuracion")}
      >
        <MaterialCommunityIcons
          name="cog-outline"
          size={24}
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
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: theme.typography.fontSize.title,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.background,
  },
  leftIcon: {
    position: "absolute",
    left: 16,
    top: 20,
  },
  rightIcon: {
    position: "absolute",
    right: 16,
    top: 20,
  },
});
export default Header;
