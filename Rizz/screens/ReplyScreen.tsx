import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Dimensions, Animated, ActivityIndicator } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { generateReplies } from '../services/generateReplies';
import { signOutUser } from '../services/authService';

const { width, height } = Dimensions.get('window');

// Subtle Background Animation Component
const BackgroundGradient = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    const fadeAnimation = () => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 3000,
          useNativeDriver: true,
        }),
      ]).start(() => fadeAnimation());
    };
    
    fadeAnimation();
  }, [fadeAnim]);

  return (
    <Animated.View style={[styles.backgroundGradient, { opacity: fadeAnim }]} />
  );
};

export default function ReplyScreen({ route, navigation }: any) {
  const { text } = route.params;
  const [replies, setReplies] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const buttonAnimations = useRef(Array.from({ length: 3 }, () => new Animated.Value(1))).current;

  useEffect(() => {
    const fetchReplies = async () => {
      const generatedReplies = await generateReplies(text);
      setReplies(generatedReplies);
      setLoading(false);
    };
    fetchReplies();
  }, [text]);

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

  const copyToClipboard = async (reply: string, index: number) => {
    // Button press animation
    Animated.sequence([
      Animated.timing(buttonAnimations[index], {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonAnimations[index], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    await Clipboard.setStringAsync(reply);
    Alert.alert('Copied!', 'Reply copied to clipboard');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <BackgroundGradient />
        <Text style={styles.loadingText}>Generating your rizz replies...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BackgroundGradient />
      
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
      
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Bar */}
        <View style={styles.titleContainer}>
          <Text style={styles.mainTitle}>Your Rizz Replies</Text>
          <Text style={styles.subtitle}>AI-powered conversation starters</Text>
        </View>

        {/* Extracted Text Section */}
        <View style={styles.extractedSection}>
          <Text style={styles.extractedLabel}>Extracted Text:</Text>
          <View style={styles.extractedTextContainer}>
            <Text style={styles.extractedText}>{text}</Text>
          </View>
        </View>

        {/* Replies Section */}
        <View style={styles.repliesSection}>
          <Text style={styles.repliesLabel}>Generated Replies:</Text>
          
          {replies.map((reply, index) => (
            <View key={index} style={styles.replyContainer}>
              <View style={styles.replyBlock}>
                <Text style={styles.replyNumber}>Reply {index + 1}</Text>
                <Text style={styles.replyText}>{reply}</Text>
              </View>
              
              <Animated.View style={{ transform: [{ scale: buttonAnimations[index] }] }}>
                <TouchableOpacity
                  style={styles.copyButton}
                  onPress={() => copyToClipboard(reply, index)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.copyButtonText}>Copy</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0a0a0a',
    opacity: 0.5,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  loadingText: {
    color: '#00FF99',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 1,
    textShadowColor: '#00FF99',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    letterSpacing: 0.5,
    fontWeight: '400',
  },
  extractedSection: {
    marginBottom: 32,
  },
  extractedLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  extractedTextContainer: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#374151',
    shadowColor: '#00FF99',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  extractedText: {
    color: '#E5E7EB',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    letterSpacing: 0.3,
  },
  repliesSection: {
    marginBottom: 20,
  },
  repliesLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  replyContainer: {
    marginBottom: 24,
  },
  replyBlock: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#374151',
    shadowColor: '#00FF99',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  replyNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00FF99',
    marginBottom: 8,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  replyText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    letterSpacing: 0.3,
  },
  copyButton: {
    backgroundColor: '#00CC66',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignSelf: 'flex-start',
    shadowColor: '#00FF99',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#00FF99',
  },
  copyButtonText: {
    color: '#000000',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
}); 