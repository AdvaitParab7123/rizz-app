import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, StyleSheet, Dimensions, Animated, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { extractTextFromImage } from '../services/extractTextFromImage';
import { signOutUser } from '../services/authService';

const { width, height } = Dimensions.get('window');

// Matrix Rain Component - Enhanced Version
const MatrixRain = () => {
  const animatedValues = useRef(Array.from({ length: 12 }, () => new Animated.Value(0))).current;
  const [matrixChars, setMatrixChars] = useState<string[]>([]);
  
  useEffect(() => {
    // Generate random matrix characters
    const generateMatrixChars = () => {
      const chars = [];
      for (let i = 0; i < 12; i++) {
        const columnChars = Array.from({ length: 30 }, () => {
          // Mix of Japanese katakana, numbers, and symbols
          const charSets = [
            () => String.fromCharCode(0x30A0 + Math.random() * 96), // Katakana
            () => String.fromCharCode(0x0030 + Math.random() * 10), // Numbers
            () => String.fromCharCode(0x0041 + Math.random() * 26), // Letters
            () => ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'][Math.floor(Math.random() * 10)],
          ];
          return charSets[Math.floor(Math.random() * charSets.length)]();
        }).join('\n');
        chars.push(columnChars);
      }
      setMatrixChars(chars);
    };

    generateMatrixChars();
    
    const animations = animatedValues.map((animValue, index) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(index * 500),
          Animated.timing(animValue, {
            toValue: 1,
            duration: 5000 + Math.random() * 3000,
            useNativeDriver: true,
          }),
          Animated.delay(Math.random() * 1500),
        ])
      );
    });
    
    animations.forEach(animation => animation.start());
    
    // Regenerate characters periodically
    const interval = setInterval(generateMatrixChars, 1500);
    
    return () => {
      animations.forEach(animation => animation.stop());
      clearInterval(interval);
    };
  }, []);

  return (
    <View style={styles.matrixContainer}>
      {animatedValues.map((animValue, index) => (
        <Animated.View
          key={index}
          style={[
            styles.matrixColumn,
            {
              left: (index * width) / 12,
              transform: [
                {
                  translateY: animValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-height * 2, height * 2],
                  }),
                },
              ],
              opacity: animValue.interpolate({
                inputRange: [0, 0.3, 0.7, 1],
                outputRange: [0, 0.8, 0.6, 0.2],
              }),
            },
          ]}
        >
          <Text style={styles.matrixText}>
            {matrixChars[index] || ''}
          </Text>
        </Animated.View>
      ))}
    </View>
  );
};

export default function UploadScreen({ navigation }: any) {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };

    pulse();
  }, [pulseAnim]);

  const handleLogout = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            setLoggingOut(true);
            try {
              await signOutUser();
              navigation.navigate('Login');
            } catch (error: any) {
              Alert.alert('Error', 'Failed to sign out');
            } finally {
              setLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets[0].base64) {
      setLoading(true);
      setImage(result.assets[0].uri);
      const text = await extractTextFromImage(result.assets[0].base64);
      setLoading(false);
      navigation.navigate('Reply', { text });
    }
  };

  return (
    <View style={styles.container}>
      {/* Matrix Background */}
      <MatrixRain />
      
      {/* Dark Overlay - Reduced opacity to show Matrix effect */}
      <View style={styles.overlay} />
      
      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        disabled={loggingOut}
      >
        {loggingOut ? (
          <ActivityIndicator size="small" color="#FF4444" />
        ) : (
          <Text style={styles.logoutButtonText}>Sign Out</Text>
        )}
      </TouchableOpacity>
      
      {/* Content */}
      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title}>Upload Your Screenshot</Text>
        <Text style={styles.subtitle}>Let the AI analyze your conversation</Text>
        
        {/* Main Button */}
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity
            style={[styles.pickButton, loading && styles.disabledButton]}
            onPress={pickImage}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.pickButtonText}>
              {loading ? 'Processing...' : 'Pick an Image'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
        
        {/* Loading Indicator */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#00FF99" />
            <Text style={styles.loadingText}>Analyzing your screenshot...</Text>
          </View>
        )}
        
        {/* Preview Image */}
        {image && !loading && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.previewImage} />
            <Text style={styles.imageText}>Screenshot captured!</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  matrixContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  matrixColumn: {
    position: 'absolute',
    width: width / 12,
    height: height * 4,
  },
  matrixText: {
    color: '#00FF99',
    fontSize: 16,
    fontFamily: 'monospace',
    lineHeight: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    textShadowColor: '#00FF99',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 2,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.50)', // Further reduced opacity to show Matrix effect
    zIndex: 2,
  },
  logoutButton: {
    position: 'absolute',
    top: 60,
    right: 24,
    zIndex: 4,
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FF4444',
  },
  logoutButtonText: {
    color: '#FF4444',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    zIndex: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 1,
    textShadowColor: '#00FF99',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 48,
    letterSpacing: 0.5,
    fontWeight: '400',
  },
  pickButton: {
    backgroundColor: '#00CC66',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 20,
    shadowColor: '#00FF99',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 15,
    borderWidth: 1,
    borderColor: '#00FF99',
  },
  pickButtonText: {
    color: '#000000',
    fontWeight: '700',
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  disabledButton: {
    opacity: 0.6,
  },
  loadingContainer: {
    marginTop: 32,
    alignItems: 'center',
  },
  loadingText: {
    color: '#00FF99',
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  imageContainer: {
    marginTop: 32,
    alignItems: 'center',
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#00FF99',
    shadowColor: '#00FF99',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  imageText: {
    color: '#00FF99',
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
}); 