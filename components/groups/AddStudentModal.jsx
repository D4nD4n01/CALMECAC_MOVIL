import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import paths from '../../paths';
import Loading from '../../utils/Loading';

const AddStudentModal = ({ visible, onClose, update, studentData = {} }) => {
  const [strName, setStrName] = useState(studentData.strName || '');
  const [intNumberList, setIntNumberList] = useState(studentData.intNumberList?.toString() || "");
  const [intNumberControl, setIntNumberControl] = useState(studentData.intNumberControl?.toString() || "")
  const isEditMode = studentData?.idCourse > 0;
  const [loading, setLoading] = useState(false)

  const insertarAlumno = async () => {
    try {
      const numList = parseInt(intNumberList, 10);
      if (isNaN(numList) || numList < 1) {
        alert("Por favor, ingresa un número de lista válido.");
        return;
      }

      const numControl = parseInt(intNumberControl, 10);
      if (isNaN(numList) || numList < 1) {
        alert("Por favor, ingresa un número de control válido.");
        return;
      }

      const groupID = await AsyncStorage.getItem('groupID');
      if (!groupID) {
        alert('Error', 'No se encontró el ID del curso.');
        return;
      }


      const bodyData = isEditMode ? {
        intMode: 2,
        strName,
        intNumberList: numList,
        idStudent: studentData.idStudent,
        intNumberControl: numControl
      }
        :
        {
          intMode: 1,
          strName,
          intNumberList: numList,
          idCourse: groupID,
          intNumberControl: numControl
        };
      console.log(bodyData)
      const response = await fetch(paths.URL + paths.STUDENTS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        throw new Error(`Error al agregar alumno: ${response.status}`);
      }

      const result = await response.json();
      console.log("respuesta; ", result)
      if (result.success == false) {
        let msg = isEditMode ? "editar" : "añadir"
        alert("No se a podido ", msg, " el alumno")
      }
      setStrName('');
      setIntNumberList('');
      update();
      onClose();

    } catch (error) {
      console.error('Error:', error);
      alert('Error', 'No se pudo agregar el alumno');
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await fetch(paths.URL + paths.STUDENTS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          intMode: 3,
          idStudent: studentData.idStudent,
        }),
      });

      const result = await response.json();

      if (result.success) {
        update();
        onClose();
      } else {
        alert("Error al eliminar el grupo: " + (result.message || "Intenta de nuevo."));
      }
    } catch (error) {
      console.error("Error en la eliminación:", error);
      alert("Error de red al intentar eliminar el grupo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalBackground}>
        {loading ? <Loading /> : null}
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
            placeholder="Número de lista (Ej. 1)"
            value={intNumberList}
            onChangeText={setIntNumberList}
            keyboardType="numeric"
          />

          <TextInput
            style={styles.input}
            placeholder="Número de control (Ej. 2025001)"
            value={intNumberControl}
            onChangeText={setIntNumberControl}
            keyboardType="numeric"
          />

          <View
            style={{
              flexDirection: isEditMode ? "row" : "column",
              justifyContent: "space-between",
            }}
          >
            {isEditMode && (
              <TouchableOpacity
                style={{
                  backgroundColor: "#B22222",
                  padding: 12,
                  borderRadius: 8,
                  flex: 1,
                  marginRight: 8,
                  alignItems: "center",
                }}
                onPress={handleDelete}
              >
                <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 14 }}>
                  Eliminar alumno
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={insertarAlumno}
              style={{
                backgroundColor: "#8B0000",
                padding: 12,
                borderRadius: 8,
                flex: isEditMode ? 1 : undefined,
                marginTop: isEditMode ? 0 : 10,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 14 }}>
                {isEditMode ? "Editar" : "Agregar Alumno"}
              </Text>
            </TouchableOpacity>
          </View>

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
