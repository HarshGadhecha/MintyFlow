import { User } from '@/types';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import {
  User as FirebaseUser,
  GoogleAuthProvider,
  OAuthProvider,
  deleteUser,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithCredential
} from 'firebase/auth';
import { get, ref, remove, set, update } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, database } from './firebase';
import { GOOGLE_WEB_CLIENT } from './firebase.config';
import { database as sqliteDB } from '@/lib/database/sqlite';

class AuthService {
  constructor() {
    // Configure Google Sign-In
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT,
      offlineAccess: true,
    });
  }

  // Google Sign-In using @react-native-google-signin/google-signin
  async signInWithGoogle(): Promise<User | null> {
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

  // Google Sign-In with credential (called from AuthContext after OAuth flow)
  async signInWithGoogleCredential(idToken: string): Promise<User | null> {
    try {
      console.log('[AuthService] Signing in with Google credential');
      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, credential);

      return await this.createOrUpdateUser(userCredential.user, 'google');
    } catch (error) {
      console.error('[AuthService] Google Sign-In Error:', error);
      throw error;
    }
  }

  // Apple Sign-In
  async signInWithApple(): Promise<User | null> {
    try {
      // Generate nonce for security
      const nonce = Math.random().toString(36).substring(2, 10);
      const hashedNonce = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        nonce
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

      // Create Firebase credential with the identity token and nonce
      const provider = new OAuthProvider('apple.com');
      const authCredential = provider.credential({
        idToken: identityToken,
        rawNonce: nonce,
      });

      console.log('[AuthService] Signing in with Firebase credential');
      const userCredential = await signInWithCredential(auth, authCredential);
      console.log('[AuthService] Firebase sign-in successful, user:', userCredential.user.uid);

      return await this.createOrUpdateUser(userCredential.user, 'apple');
    } catch (error) {
      console.error('[AuthService] Apple Sign-In Error:', error);
      throw error;
    }
  }

  // Create or update user in database
  private async createOrUpdateUser(
    firebaseUser: FirebaseUser,
    _provider: 'google' | 'apple'
  ): Promise<User> {
    const userRef = ref(database, `users/${firebaseUser.uid}`);
    const snapshot = await get(userRef);

    const now = Date.now();

    if (!snapshot.exists()) {
      // Create new user
      const newUser: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        createdAt: now,
        lastLogin: now,
        onboardingCompleted: false,
        currencySetupCompleted: false,
        baseCurrency: undefined,
      };

      await set(userRef, newUser);
      return newUser;
    } else {
      // Update existing user
      const updates = {
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        lastLogin: now,
      };

      await update(userRef, updates);
      return { ...snapshot.val(), ...updates };
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Sign Out Error:', error);
      throw error;
    }
  }

  // Delete account and all associated data
  async deleteAccount(): Promise<void> {
    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) {
        throw new Error('No user is currently signed in');
      }

      const userId = firebaseUser.uid;
      console.log(`[AuthService] Starting account deletion for user: ${userId}`);

      // Step 1: Delete all local SQLite data
      console.log('[AuthService] Deleting all local SQLite data...');
      await sqliteDB.clearAllData();

      // Step 2: Clear AsyncStorage
      console.log('[AuthService] Clearing AsyncStorage...');
      await AsyncStorage.clear();

      // Step 3: Delete user profile from Firebase Realtime Database
      console.log('[AuthService] Deleting user profile from Firebase database...');
      const userRef = ref(database, `users/${userId}`);
      await remove(userRef);

      // Step 4: Delete user from Firebase Auth
      console.log('[AuthService] Deleting user from Firebase Auth...');
      await deleteUser(firebaseUser);

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

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return null;

    const userRef = ref(database, `users/${firebaseUser.uid}`);
    const snapshot = await get(userRef);

    return snapshot.exists() ? snapshot.val() : null;
  }

  // Mark onboarding as complete
  async completeOnboarding(): Promise<void> {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) {
      throw new Error('No user is currently signed in');
    }

    const userRef = ref(database, `users/${firebaseUser.uid}`);
    await update(userRef, { onboardingCompleted: true });
    console.log('[AuthService] Onboarding marked as complete for user:', firebaseUser.uid);
  }

  // Mark currency setup as complete and save base currency
  async completeCurrencySetup(currency: string): Promise<void> {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) {
      throw new Error('No user is currently signed in');
    }

    const userRef = ref(database, `users/${firebaseUser.uid}`);
    await update(userRef, {
      currencySetupCompleted: true,
      baseCurrency: currency
    });
    console.log('[AuthService] Currency setup marked as complete for user:', firebaseUser.uid, 'Currency:', currency);
  }

  // Listen to auth state changes
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
}

export default new AuthService();

