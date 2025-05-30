import React,{ useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AddStudentModal from "./AddStudentModal";

const Student = ({ student, update }) => {
    const [showAddStudent,setShowAddStudent] = useState(false)
    const openEditModal = () => {
        setShowAddStudent(true)
    }
    return (
        <View
            style={{
                backgroundColor: "#FBE9E7",
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 8,
                marginBottom: 10,
                elevation: 2,
                position: "relative",
            }}
        >
            <Text
                style={{
                    fontSize: 18,
                    color: "#6B0000",
                    fontWeight: "500",
                }}
            >
                {student.intNumberList}. {student.strName}
            </Text>

            <TouchableOpacity
                onPress={() => openEditModal()}
                style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    backgroundColor: "#8B0000",
                    padding: 8,
                    borderRadius: 8,
                }}
            >
                <Ionicons name="create-outline" size={20} color="white" />
            </TouchableOpacity>
            {showAddStudent && (
                <AddStudentModal
                    visible={showAddStudent}
                    onClose={() => setShowAddStudent(false)}
                    update={update}
                    studentData={student}
                />
            )}
        </View>
    );
};

export default Student;
