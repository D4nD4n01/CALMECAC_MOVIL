import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../components/login/Login"; // Asegúrate que Login.jsx exista correctamente

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login"component={Login}options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
}