// SplashScreen.js
import React, { useEffect } from 'react';
import { View, Image, StyleSheet, ActivityIndicator } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync(); // Prevent the splash screen from auto-hiding

export default function SplashScreenComponent() {
  useEffect(() => {
    const prepare = async () => {
      // Simulate some work before the app fully loads (e.g., fetching data)
      await new Promise(resolve => setTimeout(resolve, 2000));
      await SplashScreen.hideAsync(); // Hide the splash screen after the work is done
    };

    prepare();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo2.png')} // Your splash screen image
        style={styles.image}
        resizeMode="contain"
      />
      <ActivityIndicator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
  },
  image: {
    width: 90,
    height: 70,
    objectFit:"contain"
  },
});
