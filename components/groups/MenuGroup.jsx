import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from 'react-native-vector-icons/Ionicons';
import paths from "../../paths";

const MenuGroup = ({ navigation }) => {
  const [groupId, setGroupId] = useState(0);
  const [curso, setCurso] = useState(null);

  if (Platform.OS === "web") {
    return null;
  }

  const obtenerUserID = async () => {
    try {
      return await AsyncStorage.getItem("userID");
    } catch (error) {
      console.error("Error obteniendo userID:", error);
    }
  };

  const obtenerGrupoID = async () => {
    try {
      const id = await AsyncStorage.getItem("groupID");
      if (id) setGroupId(parseInt(id));
    } catch (e) {
      console.error("Error obteniendo el ID del grupo:", e);
    }
  };

  const salirDelGrupo = async () => {
    try {
      await AsyncStorage.removeItem("groupID");
      navigation.replace("MyGroups");
    } catch (error) {
      console.error("Error al salir del grupo:", error);
    }
  };

  useEffect(() => {
    obtenerUserID();
    obtenerGrupoID();
  }, []);

  useEffect(() => {
    if (groupId !== 0) obtenerCurso();
  }, [groupId]);

  const obtenerCurso = async () => {
    try {
      const response = await fetch(paths.URL + paths.getCOURSE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idCourse: groupId }),
      });

      const data = await response.json();
      if (data.success) {
        setCurso(data.data);
      } else {
        console.error("Curso no encontrado");
      }
    } catch (error) {
      console.error("Error al obtener el curso:", error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF5F5" }}>
      <View
        style={{
          backgroundColor: "#6B0000",
          paddingVertical: 20,
          paddingHorizontal: 10,
          margin: 30,
          borderRadius: 10,
          marginBottom: 10,
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "white" }}>
          { curso? curso.strSubject: "grupo"} {curso?curso.strClassroom:"salon"}
        </Text>

        <TouchableOpacity
          onPress={salirDelGrupo}
          style={{
            position: "absolute",
            top: 18,
            right: 20,
            backgroundColor: "#6B0000",
            borderRadius: 10,
            padding: 5,
            zIndex: 10,
          }}
        >
          <Ionicons name="exit-outline" size={20} color="#FBE9E7" />
        </TouchableOpacity>
      </View>

      <View
        style={{
          backgroundColor: "white",
          padding: 20,
          borderRadius: 12,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.replace("ListaAsistencia")}
          style={{
            backgroundColor: "#8B0000",
            paddingVertical: 12,
            borderRadius: 8,
            marginBottom: 15,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
            Ver Asistencia
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.replace("BuscarAlumno")}
          style={{
            backgroundColor: "#8B0000",
            paddingVertical: 12,
            borderRadius: 8,
            marginBottom: 15,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
            Buscar Alumno
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => navigation.replace("ListaAlumnos")}
          style={{
            backgroundColor: "#8B0000",
            paddingVertical: 12,
            borderRadius: 8,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
            Lista de Alumnos
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MenuGroup;
