// components/common/Loading.js (opcional, puedes incluirlo dentro del Login si prefieres)

import React from "react";
import { View, StyleSheet } from "react-native";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Loading = ({ }) => {
   return (
      <View style={styles.container}>
        <DotLottieReact
          src="https://lottie.host/ac94fb6d-4104-433b-a70a-1623b7d7119b/Srre1XsNIB.lottie"
          loop
          autoplay
          speed={4}
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
    width: 80, // Ajusta el ancho según lo que necesites
    height: 80, // Ajusta la altura según lo que necesites
  },
});

export default Loading;
