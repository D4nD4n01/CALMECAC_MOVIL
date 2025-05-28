import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import paths from '../../paths';

const AddStudentModal = ({ visible, onClose, update }) => {
  const [strName, setStrName] = useState('');
  const [numeroListaTexto, setNumeroListaTexto] = useState('');

  const insertarAlumno = async () => {
    try {
      const groupID = await AsyncStorage.getItem('groupID');
      if (!groupID) {
        Alert.alert('Error', 'No se encontró el ID del curso.');
        return;
      }

      const intNumberList = numeroListaTexto
        .split(',')
        .map(num => parseInt(num.trim()))
        .filter(num => !isNaN(num));

      const bodyData = {
        intMode: 1,
        strName,
        intNumberList,
        idCourse: groupID,
      };

      const response = await fetch(paths.URL + paths.STUDENTS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        throw new Error(`Error al agregar alumno: ${response.status}`);
      }

      const result = await response.json();
      console.log('Alumno agregado:', result);
      Alert.alert('Éxito', 'Alumno agregado correctamente');
      setStrName('');
      setNumeroListaTexto('');
      update();
      onClose();

    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'No se pudo agregar el alumno');
    }
  };

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>

          {/* Botón cerrar */}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Añadir nuevo alumno</Text>

          <TextInput
            style={styles.input}
            placeholder="Nombre del alumno (Ej. Juan Pérez)"
            value={strName}
            onChangeText={setStrName}
          />

          <TextInput
            style={styles.input}
            placeholder="Números de lista (Ej. 101, 202, 303)"
            value={numeroListaTexto}
            onChangeText={setNumeroListaTexto}
            keyboardType="numeric"
          />

          <TouchableOpacity onPress={insertarAlumno} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Agregar Alumno</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#FFF5F5',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: '#8B0000',
    borderRadius: 20,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6B0000',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#A52A2A',
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: '#8B0000',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default AddStudentModal;
