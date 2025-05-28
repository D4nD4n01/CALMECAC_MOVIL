import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons"; // 👈 Importa los íconos
import logo from "../../assets/images/logo.jpg";
import Loading from "../../utils/Loading";
import paths from "../../paths";

const Login = () => {
  const navigation = useNavigation();
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const guardarUserID = async (id) => {
    try {
      await AsyncStorage.setItem("userID", id.toString());
    } catch (error) {
      console.error("Error guardando userID:", error);
    }
  };

  const obtenerUserID = async () => {
    try {
      return await AsyncStorage.getItem("userID");
    } catch (error) {
      console.error("Error obteniendo userID:", error);
    }
  };

  useEffect(() => {
    const verificarSesion = async () => {
      setLoading(true);
      const userID = await obtenerUserID();
      if (userID) {
        setLoading(false);
        navigation.replace("MyGroups");
      }
      setLoading(false);
    };
    verificarSesion();
  }, []);

  const ingresar = async () => {
    setLoading(true);
    const body = {
      intMode: 0,
      usuario,
      password,
    };
    console.log(body);

    try {
      const response = await fetch(paths.URL + paths.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!data.success) {
        alert(data.message);
        setLoading(false);
        return;
      }

      await guardarUserID(data.user.id);
      setUsuario("");
      setPassword("");
      setLoading(false);
      navigation.replace("MyGroups");
    } catch (error) {
      setLoading(false);
      console.error("Error al ingresar:", error);
      alert("Error en el servidor. Intenta más tarde.");
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FBE9E7",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          backgroundColor: "#A52A2A",
          width: "100%",
          alignItems: "center",
          paddingVertical: 10,
        }}
      >
        <Image
          source={logo}
          style={{
            width: 100,
            height: 100,
            borderRadius: 20,
            backgroundColor: "gray",
          }}
        />
      </View>

      <View
        style={{
          backgroundColor: "white",
          width: "85%",
          padding: 20,
          margin:50,
          borderRadius: 10,
          elevation: 5,
        }}
      >
        {loading ? <Loading color="#FFF" /> : null}
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 20,
            color: "#7B1B1B",
          }}
        >
          Inicio de Sesión
        </Text>

        <TextInput
          style={{
            height: 40,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 5,
            paddingHorizontal: 10,
            marginBottom: 15,
          }}
          placeholder="Ingrese su nombre de usuario"
          placeholderTextColor="#666"
          value={usuario}
          onChangeText={setUsuario}
        />

        {/* TextInput de contraseña con ícono de ojo */}
        <View style={{ position: "relative", marginBottom: 15 }}>
          <TextInput
            style={{
              height: 40,
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 5,
              paddingHorizontal: 10,
              paddingRight: 40,
            }}
            placeholder="Ingrese su contraseña"
            secureTextEntry={!showPassword}
            placeholderTextColor="#666"
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: 10,
              top: 8,
            }}
          >
            <Ionicons
              name={showPassword ? "eye" : "eye-off"}
              size={22}
              color="#A52A2A"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: "#8B0000",
            paddingVertical: 10,
            borderRadius: 5,
            alignItems: "center",
          }}
          onPress={ingresar}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
            Acceder
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
          ¿No tienes cuenta?{" "}
          <Text
            style={{ color: "#A52A2A", fontWeight: "bold" }}
            onPress={() => navigation.navigate("Register")}
          >
            Regístrate
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default Login;
