import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles/gestion-gimnasio';
import theme from '../constants/theme';
import { ClientUser } from '../data/Usuario';

interface ClientFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (client: ClientUser) => void;
  editingClient?: ClientUser | null;
}

const ClientFormModal: React.FC<ClientFormModalProps> = ({
  visible,
  onClose,
  onSave,
  editingClient = null,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [membershipType, setMembershipType] = useState('');

  useEffect(() => {
    if (visible) {
      if (editingClient) {
        setName(editingClient.name);
        setEmail(editingClient.email);
        setMembershipType(editingClient.membershipType || '');
      } else {
        setName('');
        setEmail('');
        setMembershipType('');
      }
    }
  }, [visible, editingClient]);

  const handleSave = () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Error', 'Nombre y email son obligatorios');
      return;
    }

    const client: ClientUser = editingClient
      ? { ...editingClient, name, email, membershipType }
      : {
          id: Date.now().toString(),
          role: 'client',
          weeklyGoal: 0,
          attendance: [],
          weeklyStreak: 0,
          name,
          email,
          password: '',
          membershipType,
          gymId: undefined,
        };

    onSave(client);
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.modalContainer}>
        {/* Header */}
        <View style={styles.modalHeader}>
          <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
            <MaterialIcons name="close" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.modalTitleContainer}>
            <Text style={styles.modalTitle}>{editingClient ? 'Editar Socio' : 'Nuevo Socio'}</Text>
          </View>
          <TouchableOpacity style={styles.modalSaveButton} onPress={handleSave}>
            <Text style={styles.modalSaveText}>Guardar</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView contentContainerStyle={styles.modalContent}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nombre</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Nombre completo"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.textInput}
              placeholder="correo@ejemplo.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Tipo de Membresía</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Ej: premium, básica"
              value={membershipType}
              onChangeText={setMembershipType}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

export default ClientFormModal; 