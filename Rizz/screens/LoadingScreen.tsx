import React, { useEffect, useRef } from 'react';
import { View, Image, ActivityIndicator, Animated, StyleSheet } from 'react-native';

export default function LoadingScreen() {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };

    pulse();
  }, [pulseAnim]);

  return (
    <View className="flex-1 bg-black justify-center items-center">
      <Animated.View
        style={[
          styles.logoContainer,
          {
            transform: [{ scale: pulseAnim }],
          },
        ]}
      >
        <Image 
          source={require('../assets/logo-glow.png')} 
          style={styles.logo}
        />
      </Animated.View>
      <ActivityIndicator size="large" color="#39FF14" style={styles.spinner} />
    </View>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    shadowColor: '#39FF14',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20,
  },
  logo: {
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  spinner: {
    marginTop: 40,
  },
}); 