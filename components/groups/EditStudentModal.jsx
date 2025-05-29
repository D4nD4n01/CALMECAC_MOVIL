import React, { useState, useEffect } from 'react';
import { Modal, View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import paths from '../../paths';

const EditStudentModal = ({ visible, onClose, student, update }) => {
  // Estados para los campos editables, inicializados con los datos del alumno
  const [strName, setStrName] = useState('');
  const [numeroListaTexto, setNumeroListaTexto] = useState('');

  useEffect(() => {
   if (student) {
    setStrName(student.strName || '');
    if (Array.isArray(student.intNumberList)) {
      setNumeroListaTexto(student.intNumberList.join(', '));
    } else if (student.intNumberList != null) {
      // si es número o string, convertir a string
      setNumeroListaTexto(String(student.intNumberList));
    } else {
      setNumeroListaTexto('');
    }
  }
  }, [student]);

  const actualizarAlumno = async () => {
    try {
      if (!student || !student.id) {
        Alert.alert('Error', 'No se encontró el alumno a editar.');
        return;
      }

      // Convertir texto a array de números
      const intNumberList = numeroListaTexto
        .split(',')
        .map(num => parseInt(num.trim()))
        .filter(num => !isNaN(num));

      const bodyData = {
        strName,
        intNumberList,
      };

      const response = await fetch(`${paths.URL}${paths.STUDENTS}/${student.id}`, {
        method: 'PUT', // método para actualizar recurso
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        throw new Error(`Error al actualizar alumno: ${response.status}`);
      }

      const result = await response.json();
      console.log('Alumno actualizado:', result);
      Alert.alert('Éxito', 'Alumno actualizado correctamente');
      update();
      onClose();

    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'No se pudo actualizar el alumno');
    }

  };
  const eliminarAlumno = async () => {
    try {
      if (!student || !student.id) {
        Alert.alert('Error', 'No se encontró el alumno a eliminar.');
        return;
      }
      

      Alert.alert(
        'Confirmar eliminación',
        '¿Estás seguro de que deseas eliminar este alumno?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Eliminar',
            style: 'destructive',
            onPress: async () => {
              const response = await fetch(`${paths.URL}${paths.STUDENTS}/${student.id}`, {
                method: 'DELETE',
              });

              if (!response.ok) {
                throw new Error(`Error al eliminar alumno: ${response.status}`);
              }

              const result = await response.json();
              console.log('Alumno eliminado:', result);
              Alert.alert('Éxito', 'Alumno eliminado correctamente');
              update();
              onClose();
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'No se pudo eliminar el alumno');
    }
  };

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Editar Alumno</Text>

          <TextInput
            style={styles.input}
            placeholder="Nombre del alumno"
            value={strName}
            onChangeText={setStrName}
          />

          <TextInput
            style={styles.input}
            placeholder="Números de lista (ej. 101, 202)"
            value={numeroListaTexto}
            onChangeText={setNumeroListaTexto}
            keyboardType="numeric"
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.updateButton]} onPress={actualizarAlumno}>
              <Text style={styles.buttonText}>Actualizar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={eliminarAlumno}>
              <Text style={styles.buttonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
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
    backgroundColor: '#8B0000',
    borderRadius: 20,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
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
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  updateButton: {
    backgroundColor: '#8B0000',
  },
  deleteButton: {
    backgroundColor: '#B22222',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default EditStudentModal;
