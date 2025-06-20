// src/styles/tabsLayoutStyles.ts
import { StyleSheet } from 'react-native';
import theme from '../constants/theme';

export default StyleSheet.create({
  container: {
    flex: 1,                        
    backgroundColor: theme.colors.surface,
    zIndex: 0,
  },
  content: {
    flex: 1,  
    paddingBottom: 56 + theme.spacing.sm,
  },
});
