import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import paths from "../../paths"

const Register = ({ }) => {

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");


  const navigation = useNavigation();

  const registrarUsuario = async () => {
    if (!usuario || !password) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    try {
      const response = await fetch(paths.URL + paths.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intMode: 1,
          usuario,
          password,
        }),
      });

      console.log("Datos enviados: ", usuario, password)
      const result = await response.json();
      console.log("Resultado del registro:", result);

      if (result.success) {
        alert("Usuario registrado con éxito");
        navigation.replace("Login");
      } else {
        alert("No se pudo registrar el usuario.");
      }
    } catch (error) {
      console.error("Error al registrar:", error);
      alert("Hubo un problema al registrar el usuario.");
    }
  };


  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FBE9E7", // fondo general beige rosado
        justifyContent: "center",
        alignItems: "center",
        padding: 0,
      }}
    >
      <View
        style={{
          backgroundColor: "#A52A2A", // encabezado marrón rojizo
          width: "100%",
          alignItems: "center",
          paddingVertical: 30,
        }}
      >
        <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
          Registro
        </Text>
      </View>

      <View
        style={{
          backgroundColor: "white",
          width: "85%",
          padding: 20,
          borderRadius: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 5,
          elevation: 5,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 20,
            color: "#7B1B1B", // título rojo oscuro
          }}
        >
          Crear Cuenta
        </Text>

        <TextInput
          style={{
            width: "100%",
            height: 40,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 5,
            paddingHorizontal: 10,
            marginBottom: 15,
          }}
          placeholder="Ingrese su nombre"
          value={usuario}
          onChangeText={setUsuario}
          placeholderTextColor="#666"
        />

        <TextInput
          style={{
            width: "100%",
            height: 40,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 5,
            paddingHorizontal: 10,
            marginBottom: 15,
          }}
          placeholder="Ingrese su contraseña"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#666"
        />

        <TouchableOpacity
          style={{
            backgroundColor: "#8B0000", // botón rojo sangre
            paddingVertical: 10,
            borderRadius: 5,
            alignItems: "center",
          }}
           onPress={registrarUsuario}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
            Registrarse
          </Text>
        </TouchableOpacity>
        
        <Text
          style={{
          textAlign: "center",
          marginTop: 10,
          fontSize: 14,
          color: "#333",
          }}
        >
        Regrese al inicio de sesión{" "}
        <Text
          style={{ color: "#A52A2A", fontWeight: "bold" }} // enlace color morena
          onPress={() => navigation.navigate("Login")}
        >
          Inicio de sesión
          </Text>
        </Text>
      </View>
    </View>
  );

};

export default Register;
