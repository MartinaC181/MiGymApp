
import { StyleSheet } from "react-native";
import theme from "../constants/theme";

const globalStyles = StyleSheet.create({
   logoContainer: {
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginBottom: theme.spacing.xl,
  },
  label: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily.medium,
    marginBottom: 4,
    marginTop: theme.spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    fontSize: theme.typography.fontSize.medium,
    fontFamily: theme.typography.fontFamily.regular,
    backgroundColor: "#FFFFFF",
    marginBottom: theme.spacing.sm,
  },
  loginButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  buttonText: {
    color: theme.colors.background,
    fontSize: theme.typography.fontSize.medium,
    fontFamily: theme.typography.fontFamily.bold,
  },
  forgotPassword: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.small,
    textAlign: "center",
    marginTop: theme.spacing.sm,
    textDecorationLine: "underline",
  },
  registerText: {
    textAlign: "center",
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.lg,
  },
  registerLink: {
    color: theme.colors.primary,
    fontWeight: "bold",
  },
  socialButton: {
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    marginTop: theme.spacing.sm,
  },
  socialText: {
    fontSize: theme.typography.fontSize.medium,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textPrimary,
    marginLeft: theme.spacing.sm,
    flex: 1,
    textAlign: "center",
  },
});

export default globalStyles;
