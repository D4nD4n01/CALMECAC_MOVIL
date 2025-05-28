import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AddGroupModal from "./AddGroupModal"; // Asegúrate de tener el path correcto

const Group = ({ data, update }) => {
  const navigation = useNavigation();
  const [showAddGroup, setShowAddGroup] = useState(false);

  const handlePress = async () => {
    try {
      await AsyncStorage.setItem("groupID", data.idCourse.toString());
      navigation.replace("MenuGroup", { data });
    } catch (error) {
      console.error("Error guardando groupID:", error);
    }
  };

  const handleEdit = () => {
    setShowAddGroup(true);
  };

  return (
    <>
      <TouchableOpacity onPress={handlePress}>
        <View
          style={{
            backgroundColor: "#FFF5F5",
            padding: 16,
            marginBottom: 12,
            borderRadius: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
            borderLeftWidth: 5,
            borderLeftColor: "#8B0000",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Información del grupo */}
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: "#8B0000" }}>
              {data.strSubject}
            </Text>
            <Text style={{ color: "#5C5C5C" }}>Grado: {data.intGrade}</Text>
            <Text style={{ color: "#5C5C5C" }}>Salón: {data.strClassroom}</Text>
            <Text style={{ color: "#5C5C5C" }}>Hora: {data.strHour}</Text>
          </View>

          {/* Botón de edición */}
          <TouchableOpacity
            onPress={handleEdit}
            style={{
              backgroundColor: "#8B0000",
              padding: 8,
              borderRadius: 8,
            }}
          >
            <Ionicons name="create-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* Modal de edición */}
      {showAddGroup && (
        <AddGroupModal
          visible={showAddGroup}
          onClose={() => setShowAddGroup(false)}
          update={update}
          groupData={data}
        />
      )}
    </>
  );
};

export default Group;
