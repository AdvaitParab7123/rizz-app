import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, StyleSheet, ActivityIndicator, Image, Dimensions } from 'react-native';
import { User } from 'firebase/auth';

import LoginScreen from './screens/LoginScreen';
import UploadScreen from './screens/UploadScreen';
import ReplyScreen from './screens/ReplyScreen';
import LoadingScreen from './screens/LoadingScreen';
import { loadAuthState, initializeAuthListener } from './services/authService';
import { COLORS, SPACING } from './constants/theme';

const Stack = createNativeStackNavigator();
const { width } = Dimensions.get('window');

// Auth Loading Screen Component
const AuthLoadingScreen: React.FC = () => (
  <View style={styles.authLoadingContainer}>
    <Image 
      source={require('./assets/logo-glow.png')} 
      style={styles.authLoadingLogo}
      resizeMode="contain"
    />
    <ActivityIndicator size="large" color={COLORS.primary} style={styles.authLoadingSpinner} />
  </View>
);

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initializeAuth = async () => {
      try {
        // Load saved auth state
        const authState = await loadAuthState();
        
        if (authState.isLoggedIn && authState.user) {
          setUser(authState.user);
        }

        // Initialize Firebase auth listener
        unsubscribe = initializeAuthListener((firebaseUser) => {
          setUser(firebaseUser);
          setIsLoading(false);
        });

        // Set loading to false after a short delay to avoid flicker
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error initializing auth:', error);
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Cleanup function
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Show loading screen while checking auth state
  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.background },
        }}
        initialRouteName={user ? 'Upload' : 'Login'}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Upload" component={UploadScreen} />
        <Stack.Screen name="Reply" component={ReplyScreen} />
        <Stack.Screen name="Loading" component={LoadingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  authLoadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authLoadingLogo: {
    width: width * 0.3,
    height: width * 0.3,
    marginBottom: SPACING.xl,
  },
  authLoadingSpinner: {
    marginTop: SPACING.md,
  },
});
