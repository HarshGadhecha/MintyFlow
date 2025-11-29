import {
  signInWithCredential,
  GoogleAuthProvider,
  OAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  deleteUser,
} from 'firebase/auth';
import { ref, set, update, get, remove } from 'firebase/database';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, database } from '../../config/firebase';
import { User } from '../../types';
import { STORAGE_KEYS } from '../../constants/AppConstants';

class AuthService {
  constructor() {
    // Configure Google Sign-In
    // Note: webClientId should be set in your .env file
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      offlineAccess: true,
    });
  }

  /**
   * Sign in with Google using @react-native-google-signin/google-signin
   */
  async signInWithGoogle(): Promise<User> {
    try {
      console.log('[AuthService] Starting Google Sign-In');

      // Check if Google Play services are available
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      // Sign in with Google
      console.log('[AuthService] Prompting Google Sign-In');
      const userInfo = await GoogleSignin.signIn();

      console.log('[AuthService] Google Sign-In successful:', {
        user: userInfo.data?.user?.email,
        hasIdToken: !!userInfo.data?.idToken,
      });

      if (!userInfo.data?.idToken) {
        throw new Error('No ID token received from Google');
      }

      // Sign in to Firebase with the Google credential
      console.log('[AuthService] Signing in with Firebase credential');
      const credential = GoogleAuthProvider.credential(userInfo.data.idToken);
      const userCredential = await signInWithCredential(auth, credential);

      return await this.createOrUpdateUser(userCredential.user, 'google');
    } catch (error: any) {
      console.error('[AuthService] Google Sign-In Error:', error);

      // Handle user cancellation gracefully
      if (error.code === '12501' || error.code === 'ERR_CANCELED') {
        console.log('[AuthService] User cancelled Google Sign-In');
        throw { code: 'ERR_CANCELED', message: 'User cancelled' };
      }

      throw error;
    }
  }

  /**
   * Sign in with Apple
   */
  async signInWithApple(): Promise<User> {
    try {
      // Generate nonce for security
      const rawNonce = Math.random().toString(36).substring(2, 15) +
                       Math.random().toString(36).substring(2, 15);

      const hashedNonce = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        rawNonce
      );

      console.log('[AuthService] Starting Apple Sign-In with nonce');

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce: hashedNonce,
      });

      console.log('[AuthService] Apple credential received:', {
        user: credential.user,
        email: credential.email,
        hasIdentityToken: !!credential.identityToken,
      });

      const { identityToken } = credential;
      if (!identityToken) {
        throw new Error('No identity token returned from Apple');
      }

      // Create Firebase credential with the identity token and raw nonce
      const provider = new OAuthProvider('apple.com');
      const authCredential = provider.credential({
        idToken: identityToken,
        rawNonce: rawNonce,
      });

      console.log('[AuthService] Signing in with Firebase credential');
      const userCredential = await signInWithCredential(auth, authCredential);
      console.log('[AuthService] Firebase sign-in successful, user:', userCredential.user.uid);

      return await this.createOrUpdateUser(userCredential.user, 'apple');
    } catch (error: any) {
      console.error('[AuthService] Apple Sign-In Error:', error);

      // Handle user cancellation gracefully
      if (error.code === 'ERR_CANCELED') {
        console.log('[AuthService] User cancelled Apple Sign-In');
        throw { code: 'ERR_CANCELED', message: 'User cancelled' };
      }

      throw error;
    }
  }

  /**
   * Create or update user in database
   */
  private async createOrUpdateUser(
    firebaseUser: FirebaseUser,
    provider: 'google' | 'apple'
  ): Promise<User> {
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
      const updates = {
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        lastLogin: now,
      };

      await update(userRef, updates);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, firebaseUser.uid);
      return { ...snapshot.val(), ...updates };
    }
  }

  /**
   * Sign out
   */
  async signOut(): Promise<void> {
    try {
      // Sign out from Google if signed in
      const isGoogleSignedIn = await GoogleSignin.isSignedIn();
      if (isGoogleSignedIn) {
        await GoogleSignin.signOut();
      }

      await firebaseSignOut(auth);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  /**
   * Get current user from database
   */
  async getCurrentUser(): Promise<User | null> {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return null;

    const userRef = ref(database, `users/${firebaseUser.uid}`);
    const snapshot = await get(userRef);

    return snapshot.exists() ? snapshot.val() : null;
  }

  /**
   * Listen to auth state changes with retry logic for new users
   */
  onAuthStateChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Retry logic to handle race condition for new users
        let user = await this.getCurrentUser();
        let retries = 0;
        const maxRetries = 5;

        // If user doesn't exist yet (new user being created), wait and retry
        while (!user && retries < maxRetries) {
          console.log(`[AuthService] User not found in database, retrying... (${retries + 1}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, 300)); // Wait 300ms
          user = await this.getCurrentUser();
          retries++;
        }

        callback(user);
      } else {
        callback(null);
      }
    });
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
   * Delete user account and all associated data
   */
  async deleteAccount(userId: string): Promise<void> {
    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) {
        throw new Error('No user is currently signed in');
      }

      console.log(`[AuthService] Starting account deletion for user: ${userId}`);

      // Step 1: Delete user profile from database
      console.log('[AuthService] Deleting user profile from database...');
      const userRef = ref(database, `users/${userId}`);
      await remove(userRef);

      // Step 2: Delete user from Firebase Auth
      console.log('[AuthService] Deleting user from Firebase Auth...');
      await deleteUser(firebaseUser);

      // Step 3: Clear local storage
      await AsyncStorage.clear();

      // Step 4: Sign out from Google if needed
      const isGoogleSignedIn = await GoogleSignin.isSignedIn();
      if (isGoogleSignedIn) {
        await GoogleSignin.signOut();
      }

      console.log(`[AuthService] Successfully deleted account for user: ${userId}`);
    } catch (error: any) {
      console.error('[AuthService] Delete Account Error:', error);

      // Provide helpful error messages
      if (error.code === 'auth/requires-recent-login') {
        throw new Error(
          'For security reasons, please sign out and sign in again before deleting your account.'
        );
      }

      throw error;
    }
  }
}

export const authService = new AuthService();
export default authService;
