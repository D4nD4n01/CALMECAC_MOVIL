import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../components/login/Login"; 
import Register from "../components/login/Register"; 


const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login"component={Login}options={{ headerShown: false }}/>
      <Stack.Screen name="Register"component={Register}options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
}