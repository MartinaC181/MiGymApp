import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import globalStyles from '../../styles/global';
import { useTheme } from '../../context/ThemeContext';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';

export default function Rutina() {
  const { theme, isDarkMode } = useTheme();

  const grupos = [
    {
      nombre: 'Piernas',
      icon: 'run',
      gradient: theme.colors.gradient1,
      ejercicios: 12,
      descripcion: 'Cuádriceps, glúteos y pantorrillas'
    },
    {
      nombre: 'Brazos',
      icon: 'arm-flex',
      gradient: theme.colors.gradient2,
      ejercicios: 8,
      descripcion: 'Bíceps, tríceps y antebrazos'
    },
    {
      nombre: 'Pecho',
      icon: 'weight-lifter',
      gradient: theme.colors.gradient3,
      ejercicios: 6,
      descripcion: 'Pectorales mayor y menor'
    },
    {
      nombre: 'Espalda',
      icon: 'human-handsup',
      gradient: theme.colors.gradient4,
      ejercicios: 10,
      descripcion: 'Dorsales, romboides y trapecio'
    },
  ];

  const renderGrupoCard = (grupo: any, index: number) => (
    <TouchableOpacity
      key={grupo.nombre}
      style={[styles.grupoCard, { backgroundColor: theme.colors.card }]}
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
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.headerContainer}>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Mis Rutinas</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Selecciona el grupo muscular a entrenar</Text>
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gruposContainer}>
          {grupos.map((grupo, index) => renderGrupoCard(grupo, index))}
        </View>
        
        <TouchableOpacity style={[styles.addRoutineButton, { backgroundColor: theme.colors.surface }]}>
          <LinearGradient
            colors={isDarkMode 
              ? ['rgba(0, 191, 255, 0.2)', 'rgba(0, 191, 255, 0.1)'] 
              : ['rgba(0, 191, 255, 0.1)', 'rgba(0, 191, 255, 0.05)']
            }
            style={styles.addButtonGradient}
          >
            <MaterialIcons name="add" size={24} color={theme.colors.primary} />
            <Text style={[styles.addButtonText, { color: theme.colors.primary }]}>Crear rutina personalizada</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
  },
  scrollContent: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 32,
  },
  gruposContainer: {
    width: '100%',
    padding: 16,
  },
  grupoCard: {
    width: '100%',
    borderRadius: 16,
    marginBottom: 16,
  },
  cardGradient: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
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
    padding: 8,
  },
  cardContent: {
    marginTop: 16,
  },
  grupoNombre: {
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
    color: 'white',
  },
  grupoDescripcion: {
    fontSize: 12,
    fontFamily: 'Roboto-Medium',
    color: 'rgba(255,255,255,0.8)',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 12,
    fontFamily: 'Roboto-Medium',
    color: 'rgba(255,255,255,0.8)',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  verMasText: {
    fontSize: 12,
    fontFamily: 'Roboto-Medium',
    color: 'rgba(255,255,255,0.8)',
  },
  addRoutineButton: {
    width: '100%',
    padding: 16,
    borderRadius: 16,
    marginTop: 16,
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
  },
  addButtonText: {
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
    marginLeft: 8,
  },
});