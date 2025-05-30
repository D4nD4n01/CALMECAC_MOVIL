import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ConfirmDelete = ({ visible, onClose, onConfirm, message = "¿Estás seguro que deseas eliminar este elemento?" }) => {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={[styles.button, styles.confirm]} onPress={() => { onConfirm(); onClose(); }}>
              <Text style={styles.buttonText}>Eliminar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.cancel]} onPress={onClose}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '75%',
    backgroundColor: '#FFF5F5',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  message: {
    fontSize: 18,
    color: '#6B0000',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  cancel: {
    backgroundColor: '#ccc',
  },
  confirm: {
    backgroundColor: '#B22222',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ConfirmDelete;
