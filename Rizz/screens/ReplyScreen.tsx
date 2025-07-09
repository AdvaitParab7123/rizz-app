import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Dimensions, Animated } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { generateReplies } from '../services/generateReplies';
import { ReplyScreenProps } from '../types';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { BackgroundGradient } from '../components/BackgroundGradient';

const { width } = Dimensions.get('window');

export default function ReplyScreen({ route, navigation }: ReplyScreenProps) {
  const { text } = route.params;
  const [replies, setReplies] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const buttonAnimations = useRef(Array.from({ length: 3 }, () => new Animated.Value(1))).current;

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const generatedReplies = await generateReplies(text);
        setReplies(generatedReplies);
      } catch (error) {
        console.error('Error generating replies:', error);
        Alert.alert('Error', 'Failed to generate replies. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchReplies();
  }, [text]);

  const copyToClipboard = async (reply: string, index: number) => {
    // Button press animation
    const animValue = buttonAnimations[index];
    if (animValue) {
      Animated.sequence([
        Animated.timing(animValue, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(animValue, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }

    try {
      await Clipboard.setStringAsync(reply);
      Alert.alert('Copied!', 'Reply copied to clipboard');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      Alert.alert('Error', 'Failed to copy to clipboard');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <BackgroundGradient />
        <Text style={styles.loadingText}>Generating your Rizzo replies...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BackgroundGradient />
      
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Bar */}
        <View style={styles.titleContainer}>
          <Text style={styles.mainTitle}>Your Rizzo Replies</Text>
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
              
              <Animated.View style={{ transform: [{ scale: buttonAnimations[index] || 1 }] }}>
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
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    letterSpacing: 0.5,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: 60,
    paddingBottom: SPACING.xl,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  mainTitle: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: FONT_WEIGHTS.extrabold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    letterSpacing: 1,
    textShadowColor: COLORS.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    letterSpacing: 0.5,
    fontWeight: FONT_WEIGHTS.normal,
  },
  extractedSection: {
    marginBottom: SPACING.xl,
  },
  extractedLabel: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    letterSpacing: 0.5,
  },
  extractedTextContainer: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.subtle,
  },
  extractedText: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZES.md,
    lineHeight: 24,
    fontWeight: FONT_WEIGHTS.normal,
    letterSpacing: 0.3,
  },
  repliesSection: {
    marginBottom: SPACING.lg,
  },
  repliesLabel: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
    letterSpacing: 0.5,
  },
  replyContainer: {
    marginBottom: SPACING.lg,
  },
  replyBlock: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.subtle,
  },
  replyNumber: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.primary,
    marginBottom: SPACING.sm,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  replyText: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES.md,
    lineHeight: 24,
    fontWeight: FONT_WEIGHTS.normal,
    letterSpacing: 0.3,
  },
  copyButton: {
    backgroundColor: COLORS.primaryDark,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.xxl,
    alignSelf: 'flex-start',
    ...SHADOWS.secondary,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  copyButtonText: {
    color: COLORS.background,
    fontWeight: FONT_WEIGHTS.bold,
    fontSize: FONT_SIZES.sm,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
}); 