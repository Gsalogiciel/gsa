// SplashScreen.js
import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function SplashScreenComponent() {
  const logoScale = useSharedValue(0.5); // Départ à moitié de la taille normale
  const logoOpacity = useSharedValue(0); // Opacité initiale à 0

  useEffect(() => {
    // Animation du logo
    logoScale.value = withTiming(1, {
      duration: 1000, // Durée de 1 seconde
      easing: Easing.out(Easing.exp),
    });

    logoOpacity.value = withTiming(1, {
      duration: 1000,
      easing: Easing.out(Easing.exp),
    });

    const prepare = async () => {
      // Simule une tâche avant que l'application ne soit prête
      await new Promise(resolve => setTimeout(resolve, 2000));
      await SplashScreen.hideAsync(); // Masque le splash screen après la tâche
    };

    prepare();
  }, []);

  // Styles animés
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/logo2.png')} // Chemin de votre logo
        style={[styles.image, animatedStyle]}
        resizeMode="contain"
      />
      <ActivityIndicator size="large" color="#FFFFFF" style={styles.indicator} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4A90E2', // Couleur de fond
  },
  image: {
    width: 120,
    height: 100,
    marginBottom: 20,
  },
  indicator: {
    marginTop: 20,
  },
});
