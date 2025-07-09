import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { BackgroundGradientProps } from '../types';
import { COLORS } from '../constants/theme';

export const BackgroundGradient: React.FC<BackgroundGradientProps> = ({ 
  duration = 3000 
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    const fadeAnimation = () => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration,
          useNativeDriver: true,
        }),
      ]).start(() => fadeAnimation());
    };
    
    fadeAnimation();
  }, [fadeAnim, duration]);

  return (
    <Animated.View style={[styles.backgroundGradient, { opacity: fadeAnim }]} />
  );
};

const styles = StyleSheet.create({
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0a0a0a',
    opacity: 0.5,
  },
}); 