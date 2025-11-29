import {
  signInWithCredential,
  GoogleAuthProvider,
  OAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { ref, set, update, get } from 'firebase/database';
import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, database } from '../../config/firebase';
import { User } from '../../types';
import { STORAGE_KEYS } from '../../constants/AppConstants';

class AuthService {
  /**
   * Sign in with Google
   */
  async signInWithGoogle(idToken: string): Promise<User> {
    try {
      const credential = GoogleAuthProvider.credential(idToken);
      const result = await signInWithCredential(auth, credential);
      const user = await this.handleAuthUser(result.user);
      return user;
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  }

  /**
   * Sign in with Apple
   */
  async signInWithApple(identityToken: string, nonce: string): Promise<User> {
    try {
      const provider = new OAuthProvider('apple.com');
      const credential = provider.credential({
        idToken: identityToken,
        rawNonce: nonce,
      });
      const result = await signInWithCredential(auth, credential);
      const user = await this.handleAuthUser(result.user);
      return user;
    } catch (error) {
      console.error('Apple sign in error:', error);
      throw error;
    }
  }

  /**
   * Handle authenticated user
   */
  private async handleAuthUser(firebaseUser: FirebaseUser): Promise<User> {
    const userRef = ref(database, `users/${firebaseUser.uid}`);
    const snapshot = await get(userRef);

    const now = Date.now();

    if (!snapshot.exists()) {
      // New user - create record
      const newUser: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        createdAt: now,
        lastLogin: now,
        onboardingCompleted: false,
      };

      await set(userRef, newUser);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, firebaseUser.uid);
      return newUser;
    } else {
      // Existing user - update last login
      await update(userRef, { lastLogin: now });
      await AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, firebaseUser.uid);
      return snapshot.val() as User;
    }
  }

  /**
   * Sign out
   */
  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  /**
   * Get current user
   */
  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  /**
   * Check if user has completed onboarding
   */
  async hasCompletedOnboarding(): Promise<boolean> {
    const completed = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
    return completed === 'true';
  }

  /**
   * Mark onboarding as completed
   */
  async completeOnboarding(userId: string): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
    const userRef = ref(database, `users/${userId}`);
    await update(userRef, { onboardingCompleted: true });
  }

  /**
   * Delete user account
   */
  async deleteAccount(userId: string): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');

      // Delete user data from Firebase
      const userRef = ref(database, `users/${userId}`);
      await set(userRef, null);

      // Delete Firebase Auth account
      await user.delete();

      // Clear local storage
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Delete account error:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();
export default authService;
