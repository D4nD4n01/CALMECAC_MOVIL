import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import paths from "../../paths";

const AsistenciaPasoAPaso = ({ navigation, dataGroup }) => {

  const [indiceActual, setIndiceActual] = useState(0);

  const registrarAsistencia = async (tipo) => {
    const alumno = dataGroup[indiceActual];
    const hoy = new Date().toISOString().split("T")[0];

    try {
      const response = await fetch(paths.URL + paths.ATTENDANCE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          intMode: 1,
          strDate: hoy,
          idCourse: alumno.idCourse,
          idStudent: alumno.idStudent,
          blnAssist: tipo,
          intNumberControl: alumno.intNumberControl,
          intNumberList: alumno.intNumberList,
          strName: alumno.strName,
          strSubject: alumno.strSubject,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        alert("Error", "No se pudo registrar la asistencia.");
        return;
      }
    } catch (error) {
      console.error("Error al registrar asistencia:", error);
      alert("Error", "Hubo un problema con el servidor.");
      return;
    }

    if (indiceActual < dataGroup.length - 1) {
      setIndiceActual(indiceActual + 1);
    } else {
      alert("Finalizado", "Se registró la asistencia de todos los alumnos.");
      navigation.replace("MenuGroup");
    }
  };

  if (dataGroup.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Cargando alumnos...</Text>
      </View>
    );
  }

  const alumno = dataGroup[indiceActual];

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.nombre}>
          {alumno.intNumberList}. {alumno.strName}
        </Text>

        <View style={styles.botonesContainer}>
          <TouchableOpacity
            style={[styles.boton, { backgroundColor: "#B71C1C" }]}
            onPress={() => registrarAsistencia(0)}
          >
            <Text style={styles.botonTexto}>No asistió</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.boton, { backgroundColor: "#4E342E" }]}
            onPress={() => registrarAsistencia(1)}
          >
            <Text style={styles.botonTexto}>Asistió</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F5",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "90%",
    backgroundColor: "#FBE9E7",
    borderRadius: 10,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 5,
  },
  nombre: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6B0000",
    marginBottom: 30,
    textAlign: "center",
  },
  botonesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
  },
  boton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  botonTexto: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  title: {
    fontSize: 25,
    color: "#6B0000",
    textAlign: "center",
  },
});

export default AsistenciaPasoAPaso;
