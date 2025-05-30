import React, { useState, useEffect } from "react";
import { View, TextInput, Text, FlatList, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loading from "../../utils/Loading";
import paths from "../../paths";
import Ionicons from 'react-native-vector-icons/Ionicons';
import AddStudentModal from "./AddStudentModal";
import Student from "./Student";


const BuscarAlumno = ({ navigation }) => {
  const [busqueda, setBusqueda] = useState("");
  const [groups, setGroups] = useState([]);
  const [groupId, setGroupId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);


  const filtrados = groups.filter((item) =>
    item.strName.toLowerCase().includes(busqueda.toLowerCase())
  );


  const obtenerGrupoID = async () => {
    try {
      setLoading(true);
      const id = await AsyncStorage.getItem("groupID");
      setGroupId(parseInt(id));
    } catch (e) {
      console.error("Error obteniendo el ID del grupo:", e);
    } finally {
      setLoading(false);
    }
  };

  const obtenerDataGroup = async () => {
    try {
      setLoading(true);
      const response = await fetch(paths.URL + paths.STUDENTS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          intMode: 0,
          idCourse: groupId,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setGroups(result.data);
      } else {
        console.error("Error al obtener alumnos:", result.message);
      }
    } catch (error) {
      console.error("Error en la petición:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerGrupoID();
  }, []);

  useEffect(() => {
    if (groupId > 0) {
      obtenerDataGroup();
    }
  }, [groupId]);

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF5F5" }}>
      <View
        style={{
          backgroundColor: "#6B0000",
          paddingVertical: 20,
          paddingHorizontal: 10,
          margin: 35,
          borderRadius: 10,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 24,
            fontWeight: "bold",
          }}
        >
          Buscar Alumno
        </Text>
        <TouchableOpacity
          onPress={() => navigation.replace("MenuGroup")}
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
          <Ionicons name="exit-outline" size={24} color="#FBE9E7" />
        </TouchableOpacity>
      </View>

      <View style={{ padding: 20, flex: 1 }}>
        <TouchableOpacity
          style={{
            backgroundColor: "#6B0000",
            padding: 12,
            borderRadius: 8,
            alignItems: "center",
            marginBottom: 20,
          }}
          onPress={() => setShowAddStudent(true)}
        >
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
            Agregar Alumno
          </Text>
        </TouchableOpacity>

        {loading && <Loading />}

        <TextInput
          style={{
            borderWidth: 1,
            borderColor: "#6B0000",
            paddingVertical: 10,
            paddingHorizontal: 15,
            borderRadius: 8,
            marginBottom: 20,
            backgroundColor: "#fff",
            fontSize: 16,
          }}
          placeholder="Escribe el nombre del alumno"
          value={busqueda}
          onChangeText={setBusqueda}
          placeholderTextColor="#aaa"
        />

        <FlatList
          data={filtrados}
          keyExtractor={(item) => item.idStudent.toString()}
          renderItem={({ item }) => (
            <Student student={item} update={obtenerDataGroup}/>
          )}
          ListEmptyComponent={
            <Text
              style={{
                textAlign: "center",
                marginTop: 20,
                color: "#6B0000",
                fontSize: 16,
              }}
            >
              No se encontraron alumnos.
            </Text>
          }
        />

      </View>

      {showAddStudent && (
        <AddStudentModal
          visible={showAddStudent}
          onClose={() => setShowAddStudent(false)}
          update={obtenerDataGroup}
        />
      )}
    </View>
  );
};

export default BuscarAlumno;
