import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AsistenciaPasoAPaso from "./AsistenciaPasoAPaso";
import Loading from "@/utils/Loading";
import paths from "../../paths";

const ListaAsistencia = ({ route, navigation }) => {
  const [groupId, setGroupId] = useState(0);
  const [dataIdGroup, setDataIdGroup] = useState(false);
  const [dataGroup, setDataGroup] = useState(false);
  const [groups, setGroups] = useState([]);

  const abrirLectorQR = () => {
    console.log("Abrir lector QR próximamente...");
    alert("Abrir lector QR próximamente...");
  };

  const obtenerGrupoID = async () => {
    try {
      const id = await AsyncStorage.getItem("groupID");
      setGroupId(parseInt(id));
      setDataIdGroup(true);
    } catch (e) {
      console.error("Error obteniendo el ID del grupo:", e);
    }
  };

  const obtenerDataGroup = async () => {
    try {
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
        setDataGroup(true);
      } else {
        console.error("Error al obtener alumnos:", result.message);
      }
    } catch (error) {
      console.error("Error en la petición:", error);
    }
  };

  useEffect(() => {
    obtenerGrupoID();
  }, []);

  useEffect(() => {
    if (groupId > 0) obtenerDataGroup();
  }, [groupId]);

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF5F5" }}>
      {/* Cabecera */}
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
          Asistencia
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

      {/* Componente paso a paso */}
      {dataIdGroup && dataGroup ? (
        <AsistenciaPasoAPaso
          navigation={navigation}
          groupId={groupId}
          dataGroup={groups}
        />
      ) : (
        <Loading />
      )}

      {/* Botón lector QR */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 30,
          paddingHorizontal: 20,
        }}
      >
        <TouchableOpacity
          onPress={abrirLectorQR}
          style={{
            backgroundColor: "#8B0000",
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 8,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            Con QR
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ListaAsistencia;
