import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../components/login/Login";
import Register from "../components/login/Register";
import MyGroups from "../components/groups/MyGroups.jsx"
import MenuGroup from "../components/groups/MenuGroup.jsx"
import ListaAsistencia from "../components/groups/ListaAsistencia.jsx"
import BuscarAlumno from "../components/groups/BuscarAlumno.jsx"

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
      <Stack.Screen name="MyGroups" component={MyGroups} options={{ headerShown: false }} />
      <Stack.Screen name="MenuGroup" component={MenuGroup} options={{ headerShown: false }} />
      <Stack.Screen name="ListaAsistencia" component={ListaAsistencia} options={{ headerShown: false }} />
      <Stack.Screen name="BuscarAlumno" component={BuscarAlumno} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}