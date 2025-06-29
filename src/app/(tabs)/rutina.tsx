import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import globalStyles from '../../styles/global';
import theme from '../../constants/theme';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';

const grupos = [
  {
    nombre: 'Piernas',
    icon: 'directions-run',
    gradient: ['#667eea', '#764ba2'],
    ejercicios: 12,
    descripcion: 'Cuádriceps, glúteos y pantorrillas'
  },
  {
    nombre: 'Brazos',
    icon: 'fitness-center',
    gradient: ['#f093fb', '#f5576c'],
    ejercicios: 8,
    descripcion: 'Bíceps, tríceps y antebrazos'
  },
  {
    nombre: 'Pecho',
    icon: 'sports-gymnastics',
    gradient: ['#4facfe', '#00f2fe'],
    ejercicios: 6,
    descripcion: 'Pectorales mayor y menor'
  },
  {
    nombre: 'Espalda',
    icon: 'accessibility',
    gradient: ['#43e97b', '#38f9d7'],
    ejercicios: 10,
    descripcion: 'Dorsales, romboides y trapecio'
  },
];

export default function Rutina() {
  const renderGrupoCard = (grupo: any, index: number) => (
    <TouchableOpacity
      key={grupo.nombre}
      style={styles.grupoCard}
      onPress={() => {
        router.push({
          pathname: '/GrupoDetalle',  
          params: { grupo: grupo.nombre }
        });
      }}
      activeOpacity={0.85}
    >
      <LinearGradient
        colors={grupo.gradient}
        style={styles.cardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons 
              name={grupo.icon} 
              size={28} 
              color="white" 
            />
          </View>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => {
              router.push({
                pathname: '/GrupoDetalle',  
                params: { grupo: grupo.nombre }
              });
            }}
          >
            <MaterialIcons name="edit" size={18} color="white" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.cardContent}>
          <Text style={styles.grupoNombre}>{grupo.nombre}</Text>
          <Text style={styles.grupoDescripcion}>{grupo.descripcion}</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="dumbbell" size={16} color="rgba(255,255,255,0.8)" />
              <Text style={styles.statText}>{grupo.ejercicios} ejercicios</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.cardFooter}>
          <Text style={styles.verMasText}>Ver rutina</Text>
          <MaterialIcons name="keyboard-arrow-right" size={20} color="white" />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Mis Rutinas</Text>
        <Text style={styles.subtitle}>Selecciona el grupo muscular a entrenar</Text>
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gruposContainer}>
          {grupos.map((grupo, index) => renderGrupoCard(grupo, index))}
        </View>
        
        <TouchableOpacity style={styles.addRoutineButton}>
          <LinearGradient
            colors={['rgba(0, 191, 255, 0.1)', 'rgba(0, 191, 255, 0.05)']}
            style={styles.addButtonGradient}
          >
            <MaterialIcons name="add" size={24} color={theme.colors.primary} />
            <Text style={styles.addButtonText}>Crear rutina personalizada</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerContainer: {
    padding: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSize.large,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.textPrimary,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.medium,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.textSecondary,
  },
  scrollContent: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: theme.spacing.xl,
  },
  gruposContainer: {
    width: '100%',
    padding: theme.spacing.md,
  },
  grupoCard: {
    width: '100%',
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
  },
  cardGradient: {
    flex: 1,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    padding: theme.spacing.sm,
  },
  cardContent: {
    marginTop: theme.spacing.md,
  },
  grupoNombre: {
    fontSize: theme.typography.fontSize.medium,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.textPrimary,
  },
  grupoDescripcion: {
    fontSize: theme.typography.fontSize.small,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  statText: {
    fontSize: theme.typography.fontSize.small,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.textSecondary,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
  },
  verMasText: {
    fontSize: theme.typography.fontSize.small,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.textSecondary,
  },
  addRoutineButton: {
    width: '100%',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.background,
    marginTop: theme.spacing.md,
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  addButtonText: {
    fontSize: theme.typography.fontSize.medium,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.primary,
    marginLeft: theme.spacing.sm,
  },
});