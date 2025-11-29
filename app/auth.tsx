import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { APP_NAME } from '../constants/AppConstants';

export default function AuthScreen() {
  const { theme } = useTheme();
  const { signInWithGoogle, signInWithApple } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setLoadingMessage('Signing in with Google...');
      console.log('[AuthScreen] Starting Google Sign-In...');

      const user = await signInWithGoogle();
      console.log('[AuthScreen] Google Sign-In successful:', user.email);

      setLoadingMessage('Login successful!');
      // Don't navigate manually - let the auth state change trigger navigation
      // The index.tsx will handle routing based on onboardingCompleted status
    } catch (error: any) {
      setLoading(false);
      setLoadingMessage('');

      if (error.code === 'ERR_CANCELED') {
        console.log('[AuthScreen] User cancelled Google Sign-In');
        return;
      }

      console.error('[AuthScreen] Google sign in error:', error);
      Alert.alert(
        'Sign In Failed',
        error.message || 'Failed to sign in with Google. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleAppleSignIn = async () => {
    try {
      setLoading(true);
      setLoadingMessage('Signing in with Apple...');
      console.log('[AuthScreen] Starting Apple Sign-In...');

      const user = await signInWithApple();
      console.log('[AuthScreen] Apple Sign-In successful:', user.email);

      setLoadingMessage('Login successful!');
      // Don't navigate manually - let the auth state change trigger navigation
    } catch (error: any) {
      setLoading(false);
      setLoadingMessage('');

      if (error.code === 'ERR_CANCELED') {
        console.log('[AuthScreen] User cancelled Apple Sign-In');
        return;
      }

      console.error('[AuthScreen] Apple sign in error:', error);
      Alert.alert(
        'Sign In Failed',
        error.message || 'Failed to sign in with Apple. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Loading Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={[styles.loadingCard, { backgroundColor: theme.card }]}>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={[styles.loadingText, { color: theme.text }]}>
              {loadingMessage}
            </Text>
          </View>
        </View>
      )}

      {/* Logo/Branding */}
      <View style={styles.header}>
        <Text style={[styles.appName, { color: theme.primary }]}>{APP_NAME}</Text>
        <Text style={[styles.tagline, { color: theme.textSecondary }]}>
          Track your finances effortlessly
        </Text>
      </View>

      {/* Illustration */}
      <View style={styles.illustrationContainer}>
        <Text style={{ fontSize: 120 }}>💰</Text>
      </View>

      {/* Sign In Buttons */}
      <View style={styles.buttonsContainer}>
        {/* Google Sign In */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={handleGoogleSignIn}
          disabled={loading}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.googleIcon}>G</Text>
            <Text style={[styles.buttonText, { color: theme.text }]}>
              Continue with Google
            </Text>
          </View>
        </TouchableOpacity>

        {/* Apple Sign In - iOS only */}
        {Platform.OS === 'ios' && (
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={12}
            style={styles.appleButton}
            onPress={handleAppleSignIn}
          />
        )}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme.textSecondary }]}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingCard: {
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 200,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    textAlign: 'center',
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  button: {
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  googleIcon: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  appleButton: {
    height: 56,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});
