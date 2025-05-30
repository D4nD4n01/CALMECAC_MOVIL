// src/groups/AddGroupModal.jsx
import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import paths from "../../paths";
import Loading from "../../utils/Loading";
import ConfirmDelete from "./ConfirmDelete";


const AddGroupModal = ({ visible, onClose, update = () => { }, groupData = {} }) => {
  const [subject, setSubject] = useState(groupData.strSubject || "");
  const [grade, setGrade] = useState(groupData.intGrade?.toString() || "");
  const [hour, setHour] = useState(groupData.strHour || "");
  const [classroom, setClassroom] = useState(groupData.strClassroom || "");
  const [loading, setLoading] = useState(false);
  const isEditMode = groupData?.idCourse > 0;
  const [confirmVisible, setConfirmVisible] = useState(false);

  const handleDeleteConfirmed  = () => {
  setConfirmVisible(false);
  };


  const getUserID = async () => {
    try {
      return await AsyncStorage.getItem("userID");
    } catch (error) {
      console.error("Error obteniendo userID:", error);
    }
  };

  const handleSave = async () => {
    setLoading(true);

    // Validar que los campos no estén vacíos o con solo espacios
    if (
      !subject.trim() ||
      !hour.trim() ||
      !classroom.trim() ||
      !grade.trim() ||
      parseInt(grade) < 1
    ) {
      alert("Todos los campos son obligatorios y no deben contener solo espacios.");
      setLoading(false);
      return;
    }

    const userID = await getUserID();

    const obj = {
      intMode: isEditMode ? 2 : 1,
      strSubject: subject.trim(),
      strClassroom: classroom.trim(),
      strHour: hour.trim(),
      intGrade: parseInt(grade),
      idTeacher: userID,
    };

    if (isEditMode) obj.idCourse = groupData.idCourse;

    try {
      const response = await fetch(paths.URL + paths.COURSE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
      });
      const result = await response.json();

      if (result.success) {
        update();
        alert("Grupo guardado correctamente.");
        onClose();
      } else {
        alert("Error al guardar", result.message || "Inténtalo de nuevo");
      }
    } catch (error) {
      alert("Error de red", error.message);
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await fetch(paths.URL + paths.COURSE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          intMode: 3,
          idCourse: groupData.idCourse,
        }),
      });

      const result = await response.json();

      if (result.success) {
        update();
        onClose();
        alert("Grupo eliminado correctamente.");
      } else {
        alert("Error al eliminar el grupo: " + (result.message || "Intenta de nuevo."));
      }
    } catch (error) {
      console.error("Error en la eliminación:", error);
      alert("Error de red al intentar eliminar el grupo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,.9)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "80%",
            backgroundColor: "#FFF5F5",
            borderRadius: 10,
            padding: 20,
            elevation: 5,
            position: "relative",
          }}
        >
          {/* Botón cerrar */}
          <TouchableOpacity
            onPress={onClose}
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              zIndex: 10,
              backgroundColor: "#8B0000",
              borderRadius: 20,
              width: 30,
              height: 30,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 16, color: "#fff", fontWeight: "bold" }}>X</Text>
          </TouchableOpacity>

          {loading && <Loading />}

          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#6B0000",
              marginBottom: 20,
              textAlign: "center",
            }}
          >
            {isEditMode ? "Editar grupo" : "Añadir nuevo grupo"}
          </Text>

          <TextInput
            style={inputStyle}
            placeholder="Materia (ej. Física)"
            value={subject}
            onChangeText={setSubject}
          />

          <TextInput
            style={inputStyle}
            placeholder="Grado (ej. 1, 2, 3)"
            keyboardType="numeric"
            value={grade}
            onChangeText={setGrade}
          />

          <TextInput
            style={inputStyle}
            placeholder="Horario (ej. 9:00-10:00)"
            value={hour}
            onChangeText={setHour}
          />

          <TextInput
            style={inputStyle}
            placeholder="Salón (ej. FF1)"
            value={classroom}
            onChangeText={setClassroom}
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
                onPress={() => setConfirmVisible(true)}
              >
                <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 14 }}>
                  Eliminar grupo
                </Text>
              </TouchableOpacity>
            )}

            <ConfirmDelete
              visible={confirmVisible}
              onClose={() => setConfirmVisible(false)}
              onConfirm={handleDeleteConfirmed}
              message="¿Seguro que quieres eliminar este grupo?"
              confirmText="Sí, eliminar"
              cancelText="Cancelar"
            />

            <TouchableOpacity
              onPress={handleSave}
              style={{
                backgroundColor: "#8B0000",
                padding: 12,
                borderRadius: 8,
                flex: isEditMode ? 1 : undefined, // solo aplica flex en modo edición
                marginTop: isEditMode ? 0 : 10,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 14 }}>
                {isEditMode ? "Actualizar" : "Guardar"}
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </View>
    </Modal>
  );
};

const inputStyle = {
  backgroundColor: "#fff",
  borderRadius: 8,
  paddingHorizontal: 10,
  paddingVertical: 8,
  borderWidth: 1,
  borderColor: "#A52A2A",
  marginBottom: 15,
};

export default AddGroupModal;
