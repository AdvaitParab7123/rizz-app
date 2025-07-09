import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, Animated, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { extractTextFromImage } from '../services/extractTextFromImage';
import { NavigationProps } from '../types';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { MatrixRain } from '../components/MatrixRain';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { validateImageFile } from '../utils/validation';
import { logError } from '../utils/errorHandling';

const { width } = Dimensions.get('window');

interface UploadScreenProps extends NavigationProps {}

export default function UploadScreen({ navigation }: UploadScreenProps) {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const catWiggleAnim = useRef(new Animated.Value(0)).current;

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

    // Cat wiggle animation
    const catWiggle = () => {
      Animated.sequence([
        Animated.timing(catWiggleAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(catWiggleAnim, {
          toValue: -1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(catWiggleAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.delay(3000),
      ]).start(() => catWiggle());
    };

    pulse();
    catWiggle();
  }, [pulseAnim, catWiggleAnim]);

  const pickImage = async () => {
    try {
      // Request permissions first
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please grant permission to access your photo library');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        base64: true,
        quality: 0.8, // Reduced quality for better performance
        allowsEditing: true,
        aspect: [4, 3],
      });
      
      if (!result.canceled && result.assets && result.assets[0] && result.assets[0].base64) {
        const base64Data = result.assets[0].base64;
        const imageUri = result.assets[0].uri;
        
        if (!validateImageFile(base64Data)) {
          Alert.alert('Error', 'Please select a valid image file');
          return;
        }

        setLoading(true);
        setImage(imageUri);
        
        try {
          const text = await extractTextFromImage(base64Data);
          setLoading(false);
          navigation.navigate('Reply', { text });
        } catch (error) {
          setLoading(false);
          logError(error as Error, 'UploadScreen.extractTextFromImage');
          Alert.alert('Error', 'Failed to extract text from image. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      logError(error as Error, 'UploadScreen.pickImage');
      Alert.alert('Error', 'Failed to pick image. Please try again.');
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Matrix Background */}
      <MatrixRain />
      
      {/* Dark Overlay - Reduced opacity to show Matrix effect */}
      <View style={styles.overlay} />
      
      {/* Cat Image - Positioned in top-right corner */}
      <Animated.View 
        style={[
          styles.catContainer,
          {
            transform: [
              {
                rotate: catWiggleAnim.interpolate({
                  inputRange: [-1, 0, 1],
                  outputRange: ['-3deg', '0deg', '3deg'],
                }),
              },
            ],
          },
        ]}
      >
        <Image 
          source={require('../assets/cat-leaning.png')} 
          style={styles.catImage}
          resizeMode="contain"
        />
      </Animated.View>
      
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
            <LoadingSpinner 
              size="large" 
              color={COLORS.primary}
              text="Analyzing your screenshot..."
              textColor={COLORS.primary}
            />
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
    backgroundColor: COLORS.background,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.overlay,
    zIndex: 2,
  },
  catContainer: {
    position: 'absolute',
    top: 80,
    right: 4,
    zIndex: 3,
  },
  catImage: {
    width: 90,
    height: 120,
    opacity: 0.9,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    zIndex: 3,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.extrabold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
    letterSpacing: 1,
    textShadowColor: COLORS.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xxl,
    letterSpacing: 0.5,
    fontWeight: FONT_WEIGHTS.normal,
  },
  pickButton: {
    backgroundColor: COLORS.primaryDark,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.xl,
    ...SHADOWS.primary,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  pickButtonText: {
    color: COLORS.background,
    fontWeight: FONT_WEIGHTS.bold,
    fontSize: FONT_SIZES.lg,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  disabledButton: {
    opacity: 0.6,
  },
  loadingContainer: {
    marginTop: SPACING.xl,
    alignItems: 'center',
  },
  imageContainer: {
    marginTop: SPACING.xl,
    alignItems: 'center',
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.primary,
    ...SHADOWS.primary,
  },
  imageText: {
    color: COLORS.primary,
    marginTop: SPACING.md,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
    letterSpacing: 0.5,
  },
}); 