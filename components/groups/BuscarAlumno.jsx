import React, { useState, useEffect } from "react";
import { View, TextInput, Text, FlatList, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // ✅ Asegúrate de tenerlo instalado
import Loading from "../../utils/Loading";
import paths from "../../paths";

const BuscarAlumno = ({ navigation }) => {
  const [busqueda, setBusqueda] = useState("");
  const [groups, setGroups] = useState([]);
  const [groupId, setGroupId] = useState(0);
  const [loading, setLoading] = useState(false);

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
          alignItems: "center",
          justifyContent: "center",
          elevation: 4,
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
          onPress={() => navigation.navigate("MenuGroup")}
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            backgroundColor: "#6B0000",
            padding: 5,
            borderRadius: 10,
            zIndex: 10,
          }}
        >
          <Text
            style={{
              color: "#FBE9E7",
              fontWeight: "bold",
              fontSize: 18,
            }}
          >
            X
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ padding: 20, flex: 1 }}>
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

        {groupId > 0 && (
          <FlatList
            data={filtrados}
            keyExtractor={(item) => item.idStudent.toString()}
            renderItem={({ item }) => (
              <View
                style={{
                  backgroundColor: "#FBE9E7",
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  marginBottom: 10,
                  elevation: 2,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    color: "#6B0000",
                    fontWeight: "500",
                  }}
                >
                  {item.intNumberList}. {item.strName}
                </Text>
              </View>
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
        )}
      </View>
    </View>
  );
};

export default BuscarAlumno;
