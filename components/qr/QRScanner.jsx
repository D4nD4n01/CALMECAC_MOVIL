import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { RNCamera } from 'react-native-camera';

const QRScanner = () => {
  const [scanned, setScanned] = useState(false);

  const onBarCodeRead = ({ data }) => {
    if (!scanned) {
      setScanned(true);
      Alert.alert("Código escaneado", data, [
        { text: "Escanear otro", onPress: () => setScanned(false) }
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <RNCamera
        style={styles.camera}
        onBarCodeRead={onBarCodeRead}
        captureAudio={false}
      >
        <Text style={styles.text}>Escanea un código QR</Text>
      </RNCamera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1, justifyContent: 'flex-end', alignItems: 'center' },
  text: { position: 'absolute', top: 40, color: 'white', fontSize: 20 }
});

export default QRScanner;
