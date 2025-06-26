import { StyleSheet } from "react-native";
import theme from "../constants/theme";

export default StyleSheet.create({
  card: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: "center",
  },
  cardPressed: {
    backgroundColor: theme.colors.surface,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  streakText: {
    fontSize: theme.typography.fontSize.title,
    fontFamily: theme.typography.fontFamily.bold,
    marginHorizontal: 4,
    color: theme.colors.textPrimary,
  },
  label: {
    fontSize: theme.typography.fontSize.medium,
    color: theme.colors.textSecondary,
  },
  progressWrapper: {
    flexDirection: "row",
    marginTop: theme.spacing.xs,
  },
  progressDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: theme.colors.surface,
    marginHorizontal: 3,
  },
  progressDotActive: {
    backgroundColor: theme.colors.primary,
  },
  progressDotWrapper: {
    marginHorizontal: 3,
  },
  desc: {
    marginTop: theme.spacing.sm,
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.textSecondary,
  },
});