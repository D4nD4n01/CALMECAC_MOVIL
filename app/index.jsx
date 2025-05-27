import { useEffect } from "react";
import { Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Login from "@/components/login/Login";

export default function Index() {
  const navigation = useNavigation();
  const isWeb = Platform.OS === "web";
  
  

  useEffect(() => {
    if (isWeb) {
      navigation.replace("Consult"); // redirige a la pantalla web
    } else {
      navigation.replace("Login");
    }
  }, []);

  return null; // No muestra nada porque redirige
}