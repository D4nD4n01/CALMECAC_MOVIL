import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AsistenciaPasoAPaso from "./AsistenciaPasoAPaso";
import Loading from "../../utils/Loading";
import paths from "../../paths";
import Ionicons from 'react-native-vector-icons/Ionicons';

const ListaAsistencia = ({ navigation, route }) => {
  const [groupId, setGroupId] = useState(0);
  const [dataGroup, setDataGroup] = useState(false);
  const [groups, setGroups] = useState([]);
  const [finalGroupData, setFinalGroupData] = useState([]);
  const [mostrarAsistencia, setMostrarAsistencia] = useState(false);
  const [isNew, setIsNew] = useState(true)

  const abrirLectorQR = () => {
    navigation.replace("QRScanner");
  };

  useEffect(() => {
    if (route.params?.qrData) {
      console.log("QR Escaneado:", route.params.qrData);
    }
  }, [route.params?.qrData]);

  const obtenerGrupoID = async () => {
    try {
      const id = await AsyncStorage.getItem("groupID");
      setGroupId(parseInt(id));
    } catch (e) {
      console.error("Error obteniendo el ID del grupo:", e);
    }
  };

  const obtenerDataGroup = async () => {
    try {
      const response = await fetch(paths.URL + paths.STUDENTS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intMode: 0, idCourse: groupId }),
      });

      const result = await response.json();

      if (result.success) {
        setGroups(result.data);
        verificarAsistencia(result.data); // pasa los estudiantes al siguiente paso
      } else {
        console.error("Error al obtener alumnos:", result.message);
      }
    } catch (error) {
      console.error("Error en la petición:", error);
    }
  };

  const verificarAsistencia = async (grupo) => {
    try {
      const hoy = new Date().toISOString().split("T")[0];

      const response = await fetch(paths.URL + paths.ATTENDANCE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intMode: 0,
          strDate: hoy,
          idCourse: groupId,
        }),
      });

      const result = await response.json();

      if (result.success) {
        if (result.new) {
          setFinalGroupData(grupo);
          setMostrarAsistencia(true);
          setIsNew(true)
        } else if (result.allAttended) {
          alert("Todos los alumnos han asistido hoy.");
          console.log("Ya asistieron todos")
          setMostrarAsistencia(false);
          navigation.replace("MenuGroup")
        } else {
          setIsNew(false)
          setFinalGroupData(result.data); // solo los que no han asistido
          setMostrarAsistencia(true);
        }
      } else {
        alert("Error No se pudo consultar la asistencia.");
      }
    } catch (error) {
      console.error("Error al consultar asistencia:", error);
      alert("Error Error al consultar la asistencia.");
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
          paddingHorizontal: 10,
          margin: 30,
          borderRadius: 10,
          marginBottom: 10,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 24, fontWeight: "bold" }}>
          Asistencia
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

      {/* Componente paso a paso */}
      {mostrarAsistencia ? (
        <AsistenciaPasoAPaso navigation={navigation} dataGroup={finalGroupData} isNew={isNew}/>
      ) : (
        <Loading />
      )}

      {/* Botón lector QR */}
      <View style={{ flex: 1, backgroundColor: "#FFF5F5", alignItems: "center", padding: 20 }}>
        <TouchableOpacity
          onPress={abrirLectorQR}
          style={{
            backgroundColor: "#6B0000",
            paddingVertical: 10,
            paddingHorizontal: 10,
            margin: 10,
            borderRadius: 10,
            marginBottom: 10,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
            Con QR
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ListaAsistencia;
