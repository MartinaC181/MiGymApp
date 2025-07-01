import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';

import homeStyles from '../../styles/home';
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
      ejercicios: 12,
      descripcion: 'Cuádriceps, glúteos y pantorrillas'
    },
    {
      nombre: 'Brazos',
      icon: 'arm-flex',
      ejercicios: 8,
      descripcion: 'Bíceps, tríceps y antebrazos'
    },
    {
      nombre: 'Pecho',
      icon: 'weight-lifter',
      ejercicios: 6,
      descripcion: 'Pectorales mayor y menor'
    },
    {
      nombre: 'Espalda',
      icon: 'human-handsup',
      ejercicios: 10,
      descripcion: 'Dorsales, romboides y trapecio'
    },
  ];

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
      activeOpacity={0.9}
    >
      <LinearGradient
        colors={isDarkMode ? ['#10344A', '#0C2434'] : ['#b3dcec', '#EAF7FF']}
        style={styles.cardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary }]}>
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
            <MaterialIcons name="edit" size={18} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.cardContent}>
          <Text style={[styles.grupoNombre, { color: theme.colors.textPrimary }]}>{grupo.nombre}</Text>
          <Text style={[styles.grupoDescripcion, { color: theme.colors.textSecondary }]}>{grupo.descripcion}</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons 
                name="dumbbell" 
                size={16} 
                color={theme.colors.textSecondary} 
              />
              <Text style={[styles.statText, { color: theme.colors.textSecondary }]}>{grupo.ejercicios} ejercicios</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.cardFooter}>
          <Text style={[styles.verMasText, { color: theme.colors.textSecondary }]}>Ver rutina</Text>
          <MaterialIcons 
            name="keyboard-arrow-right" 
            size={20} 
            color={theme.colors.textSecondary} 
          />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        <View style={homeStyles.greetingContainer}>
          <Text style={[homeStyles.greeting, { color: theme.colors.primary }]}>
            Mis Rutinas
          </Text>
          <Text style={[homeStyles.subGreeting, { color: theme.colors.textSecondary }]}>
            Selecciona el grupo muscular a entrenar
          </Text>
        </View>
        
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
  scrollContent: {
    paddingBottom: 32,
  },
  gruposContainer: {
    paddingHorizontal: 24,
    gap: 12,
  },
  grupoCard: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 8,
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
    borderRadius: 20,
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
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
  },
  grupoDescripcion: {
    fontSize: 13,
    fontFamily: 'Roboto-Regular',
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
    fontFamily: 'Roboto-Regular',
    marginLeft: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  verMasText: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
  },
  addRoutineButton: {
    marginHorizontal: 24,
    marginTop: 16,
    borderRadius: 16,
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