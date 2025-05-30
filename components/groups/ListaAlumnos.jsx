import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ListaAlumnos = ({navigation}) => {
    const [table, setTable] = useState([[{ value: '' }]]);

    useEffect(() => {
        const loadTable = async () => {
            try {
                const savedTable = await AsyncStorage.getItem('student_table');
                if (savedTable !== null) {
                    setTable(JSON.parse(savedTable));
                }
            } catch (error) {
                console.error('Error al cargar la tabla:', error);
            }
        };
        loadTable();
    }, []);

    const saveTable = async (newTable) => {
        try {
            await AsyncStorage.setItem('student_table', JSON.stringify(newTable));
        } catch (error) {
            console.error('Error al guardar la tabla:', error);
        }
    };

    const addRow = () => {
        const newRow = table[0].map(() => ({ value: '' }));
        const newTable = [...table, newRow];
        setTable(newTable);
        saveTable(newTable);
    };

    const addColumn = () => {
        const newTable = table.map((row) => [...row, { value: '' }]);
        setTable(newTable);
        saveTable(newTable);
    };

    const updateCell = (rowIndex, colIndex, value) => {
        const updatedTable = [...table];
        updatedTable[rowIndex][colIndex].value = value;
        setTable(updatedTable);
        saveTable(updatedTable);
    };

    const exportToExcel = async () => {
        try {
            const plainData = table.map((row) => row.map((cell) => cell.value));
            const ws = XLSX.utils.aoa_to_sheet(plainData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Calificaciones');

            const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
            const uri = FileSystem.documentDirectory + 'tabla_alumnos.xlsx';

            await FileSystem.writeAsStringAsync(uri, wbout, {
                encoding: FileSystem.EncodingType.Base64,
            });

            await Sharing.shareAsync(uri);
        } catch (error) {
            console.error('Error al exportar Excel:', error);
            Alert.alert('Error', 'No se pudo exportar la tabla.');
        }
    };

    return (
        <View style={styles.container}>
            <View
                style={{
                    backgroundColor: "#6B0000",
                    paddingVertical: 20,
                    paddingHorizontal: 10,
                    margin: 10,
                    borderRadius: 10,
                    marginBottom: 10,
                    alignItems: "center",
                }}
            >
                <Text
                    style={{
                        color: "#fff",
                        fontSize: 24,
                        fontWeight: "bold",
                    }}
                >
                    Lista de Alumnos
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

            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={addRow} style={styles.button}>
                    <Text style={styles.buttonText}>Agregar Fila</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={addColumn} style={styles.button}>
                    <Text style={styles.buttonText}>Agregar Columna</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={exportToExcel} style={[styles.button, { backgroundColor: '#008080' }]}>
                    <Text style={styles.buttonText}>Exportar Excel</Text>
                </TouchableOpacity>
            </View>

            <ScrollView horizontal>
                <ScrollView style={styles.tableContainer}>
                    {table.map((row, rowIndex) => (
                        <View key={rowIndex} style={styles.row}>
                            {row.map((cell, colIndex) => (
                                <TextInput
                                    key={colIndex}
                                    value={cell.value}
                                    onChangeText={(text) => updateCell(rowIndex, colIndex, text)}
                                    style={styles.cell}
                                    placeholder={`F${rowIndex + 1}C${colIndex + 1}`}
                                />
                            ))}
                        </View>
                    ))}
                </ScrollView>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 50,
        paddingHorizontal: 16,
        flex: 1,
        backgroundColor: '#f4f6f8',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4B0082',
        textAlign: 'center',
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#6B0000',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginHorizontal: 5,
        marginVertical: 5,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    tableContainer: {
        maxHeight: 500,
    },
    row: {
        flexDirection: 'row',
    },
    cell: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        width: 100,
        height: 50,
        textAlign: 'center',
        backgroundColor: '#fff',
    },
});

export default ListaAlumnos;
