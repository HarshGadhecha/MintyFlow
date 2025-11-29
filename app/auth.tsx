import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { APP_NAME } from '../constants/AppConstants';

export default function AuthScreen() {
  const { theme } = useTheme();
  const { signInWithGoogle, signInWithApple } = useAuth();
  const [loading, setLoading] = useState(false);

  // Google Sign In configuration
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const result = await promptAsync();

      if (result.type === 'success') {
        const { authentication } = result;
        if (authentication?.idToken) {
          await signInWithGoogle(authentication.idToken);
          router.replace('/onboarding');
        }
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      Alert.alert('Error', 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      setLoading(true);
      const nonce = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        Math.random().toString()
      );

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce,
      });

      if (credential.identityToken) {
        await signInWithApple(credential.identityToken, nonce);
        router.replace('/onboarding');
      }
    } catch (error: any) {
      if (error.code === 'ERR_CANCELED') {
        // User canceled
        return;
      }
      console.error('Apple sign in error:', error);
      Alert.alert('Error', 'Failed to sign in with Apple');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
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
          disabled={loading || !request}
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
