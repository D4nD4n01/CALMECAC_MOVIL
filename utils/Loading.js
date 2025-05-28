import React from "react";
import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

const Loading = () => {
  return (
    <View style={styles.container}>
      <LottieView
        source={{ uri: 'https://lottie.host/ac94fb6d-4104-433b-a70a-1623b7d7119b/Srre1XsNIB.lottie' }}
        autoPlay
        loop
        speed={5}
        style={styles.animation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: 80,
    height: 80,
  },
});

export default Loading;
