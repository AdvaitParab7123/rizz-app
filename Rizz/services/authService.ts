import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from './firebase';
import { User, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { AuthState } from '../types';

const AUTH_KEY = 'user_auth_state';

// Save auth state to AsyncStorage
export const saveAuthState = async (user: User | null): Promise<void> => {
  try {
    const authState: AuthState = {
      isLoggedIn: !!user,
      user: user ? {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
      } as User : null,
    };
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(authState));
  } catch (error) {
    console.error('Error saving auth state:', error);
    throw new Error('Failed to save authentication state');
  }
};

// Load auth state from AsyncStorage
export const loadAuthState = async (): Promise<AuthState> => {
  try {
    const authStateString = await AsyncStorage.getItem(AUTH_KEY);
    if (authStateString) {
      const authState: AuthState = JSON.parse(authStateString);
      return authState;
    }
  } catch (error) {
    console.error('Error loading auth state:', error);
  }
  
  return {
    isLoggedIn: false,
    user: null,
  };
};

// Clear auth state from AsyncStorage
export const clearAuthState = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(AUTH_KEY);
  } catch (error) {
    console.error('Error clearing auth state:', error);
    throw new Error('Failed to clear authentication state');
  }
};

// Sign in with email and password
export const signInUser = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    await saveAuthState(userCredential.user);
    return userCredential.user;
  } catch (error: any) {
    console.error('Sign in error:', error);
    throw new Error(error.message || 'Failed to sign in');
  }
};

// Sign up with email and password
export const signUpUser = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await saveAuthState(userCredential.user);
    return userCredential.user;
  } catch (error: any) {
    console.error('Sign up error:', error);
    throw new Error(error.message || 'Failed to sign up');
  }
};

// Sign out user
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
    await clearAuthState();
  } catch (error) {
    console.error('Error signing out:', error);
    throw new Error('Failed to sign out');
  }
};

// Check if user is currently authenticated
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// Initialize auth state listener
export const initializeAuthListener = (callback: (user: User | null) => void): () => void => {
  const unsubscribe = auth.onAuthStateChanged(async (user) => {
    try {
      await saveAuthState(user);
      callback(user);
    } catch (error) {
      console.error('Error in auth state listener:', error);
      callback(user); // Still call callback even if save fails
    }
  });
  
  return unsubscribe;
}; 