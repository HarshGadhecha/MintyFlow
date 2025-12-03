import { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Switch, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as LocalAuthentication from 'expo-local-authentication';
import { Ionicons } from '@expo/vector-icons';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/contexts/ThemeContext';
import { useSettings } from '@/contexts/SettingsContext';

export default function SecurityModal() {
  const router = useRouter();
  const { theme } = useTheme();
  const { biometricEnabled, toggleBiometric } = useSettings();

  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState<string>('');

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();

      setIsBiometricAvailable(compatible && enrolled);

      if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        setBiometricType('Face ID');
      } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        setBiometricType('Fingerprint');
      } else if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
        setBiometricType('Iris');
      } else {
        setBiometricType('Biometric');
      }
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      setIsBiometricAvailable(false);
    }
  };

  const handleBiometricToggle = async (value: boolean) => {
    if (!isBiometricAvailable) {
      Alert.alert(
        'Biometric Not Available',
        'Please enable biometric authentication in your device settings first.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (value) {
      // Authenticate before enabling
      try {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: `Enable ${biometricType} Lock`,
          fallbackLabel: 'Use Passcode',
          cancelLabel: 'Cancel',
        });

        if (result.success) {
          await toggleBiometric();
          Alert.alert(
            'Security Enhanced',
            `${biometricType} lock has been enabled. You'll need to authenticate when opening the app.`,
            [{ text: 'OK' }]
          );
        }
      } catch (error) {
        console.error('Biometric authentication error:', error);
      }
    } else {
      // Confirm before disabling
      Alert.alert(
        'Disable Biometric Lock?',
        'Your app will no longer require biometric authentication to open.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Disable',
            style: 'destructive',
            onPress: async () => {
              await toggleBiometric();
            },
          },
        ]
      );
    }
  };

  const getBiometricIcon = () => {
    if (biometricType === 'Face ID') {
      return 'scan-outline';
    } else if (biometricType === 'Fingerprint') {
      return 'finger-print-outline';
    }
    return 'shield-checkmark-outline';
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <ThemedView style={styles.header}>
          <Ionicons name="shield-checkmark" size={48} color={theme.primary} />
          <ThemedText type="title" style={styles.title}>
            Security
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
            Protect your financial data with biometric authentication
          </ThemedText>
        </ThemedView>

        {/* Biometric Lock Section */}
        <ThemedView style={[styles.section, { backgroundColor: theme.card }]}>
          <ThemedView style={styles.settingRow}>
            <ThemedView style={styles.settingLeft}>
              <Ionicons
                name={getBiometricIcon()}
                size={24}
                color={isBiometricAvailable ? theme.primary : theme.textSecondary}
              />
              <ThemedView style={styles.settingText}>
                <ThemedText type="defaultSemiBold">
                  {biometricType} Lock
                </ThemedText>
                <ThemedText style={[styles.description, { color: theme.textSecondary }]}>
                  {isBiometricAvailable
                    ? 'Require authentication to open app'
                    : 'Not available on this device'}
                </ThemedText>
              </ThemedView>
            </ThemedView>
            <Switch
              value={biometricEnabled}
              onValueChange={handleBiometricToggle}
              trackColor={{ false: theme.border, true: theme.primary + '40' }}
              thumbColor={biometricEnabled ? theme.primary : theme.textSecondary}
              disabled={!isBiometricAvailable}
            />
          </ThemedView>
        </ThemedView>

        {/* Info Section */}
        <ThemedView style={[styles.infoSection, { backgroundColor: theme.card }]}>
          <Ionicons name="information-circle-outline" size={20} color={theme.primary} />
          <ThemedText style={[styles.infoText, { color: theme.textSecondary }]}>
            When enabled, you'll need to authenticate with {biometricType.toLowerCase()} every time you
            open the app. This helps protect your financial data from unauthorized access.
          </ThemedText>
        </ThemedView>

        {/* Additional Security Tips */}
        <ThemedView style={styles.tipsSection}>
          <ThemedText type="defaultSemiBold" style={styles.tipsTitle}>
            Security Tips
          </ThemedText>

          <ThemedView style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={20} color={theme.success} />
            <ThemedText style={[styles.tipText, { color: theme.textSecondary }]}>
              Use a strong device passcode as backup
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={20} color={theme.success} />
            <ThemedText style={[styles.tipText, { color: theme.textSecondary }]}>
              Keep your device OS up to date
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={20} color={theme.success} />
            <ThemedText style={[styles.tipText, { color: theme.textSecondary }]}>
              Don't share your device with others
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 14,
    paddingHorizontal: 20,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  description: {
    fontSize: 12,
    marginTop: 2,
  },
  infoSection: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    marginBottom: 24,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 20,
    marginLeft: 12,
    flex: 1,
  },
  tipsSection: {
    marginBottom: 20,
  },
  tipsTitle: {
    marginBottom: 16,
    fontSize: 16,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
});
