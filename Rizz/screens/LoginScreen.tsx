import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, Dimensions } from 'react-native';
import { signInUser, signUpUser } from '../services/authService';
import { NavigationProps } from '../types';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { validateEmail, validatePassword } from '../utils/validation';
import { handleFirebaseError, logError } from '../utils/errorHandling';

const { width } = Dimensions.get('window');

interface LoginScreenProps extends NavigationProps {}

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      await signInUser(email, password);
      navigation.navigate('Upload');
    } catch (error: any) {
      const appError = handleFirebaseError(error);
      logError(appError, 'LoginScreen.handleSignIn');
      Alert.alert('Sign In Error', appError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      Alert.alert('Error', passwordValidation.errors.join('\n'));
      return;
    }

    setLoading(true);
    try {
      await signUpUser(email, password);
      Alert.alert('Success', 'Account created successfully!');
      navigation.navigate('Upload');
    } catch (error: any) {
      const appError = handleFirebaseError(error);
      logError(appError, 'LoginScreen.handleSignUp');
      Alert.alert('Sign Up Error', appError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image 
          source={require('../assets/logo-glow.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Title and Slogan */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>The Rizzo App</Text>
        <Text style={styles.slogan}>Level up your game</Text>
      </View>

      {/* Input Fields */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={COLORS.textSecondary}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={COLORS.textSecondary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
        />
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, loading && styles.disabledButton]}
          onPress={handleSignIn}
          disabled={loading}
        >
          {loading ? (
            <LoadingSpinner size="small" color={COLORS.background} />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.signUpButton, loading && styles.disabledButton]}
          onPress={handleSignUp}
          disabled={loading}
        >
          {loading ? (
            <LoadingSpinner size="small" color={COLORS.primary} />
          ) : (
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
  },
  logoContainer: {
    marginBottom: SPACING.xl,
    ...SHADOWS.primary,
  },
  logo: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: (width * 0.25) / 2,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: FONT_WEIGHTS.extrabold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    letterSpacing: 1.5,
    fontFamily: 'System',
    textShadowColor: COLORS.primaryLight,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  slogan: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xxl,
    letterSpacing: 0.5,
    fontWeight: FONT_WEIGHTS.normal,
    fontFamily: 'System',
  },
  inputContainer: {
    width: '100%',
    marginBottom: SPACING.xl,
  },
  input: {
    backgroundColor: COLORS.backgroundSecondary,
    color: COLORS.textPrimary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.subtle,
  },
  buttonContainer: {
    width: '100%',
    gap: SPACING.md,
  },
  button: {
    backgroundColor: COLORS.success,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.secondary,
  },
  buttonText: {
    color: COLORS.background,
    textAlign: 'center',
    fontWeight: FONT_WEIGHTS.bold,
    fontSize: FONT_SIZES.lg,
    letterSpacing: 0.5,
  },
  signUpButton: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: 'transparent',
    ...SHADOWS.secondary,
  },
  signUpButtonText: {
    color: COLORS.primary,
    textAlign: 'center',
    fontWeight: FONT_WEIGHTS.bold,
    fontSize: FONT_SIZES.lg,
    letterSpacing: 0.5,
  },
  disabledButton: {
    opacity: 0.6,
  },
});