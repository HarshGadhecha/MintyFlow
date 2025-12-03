import { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

export default function PersonalPrivacyModal() {
  const router = useRouter();
  const { theme } = useTheme();
  const { deleteAccount } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const handlePrivacyPolicy = () => {
    Alert.alert(
      'Privacy Policy',
      'MintyFlow Privacy Policy\n\n' +
        '1. Data Collection\n' +
        'We collect only the data necessary to provide our services. This includes your email, financial transactions, and preferences.\n\n' +
        '2. Data Storage\n' +
        'All your financial data is stored locally on your device using encrypted SQLite database. We do not store your financial data on our servers.\n\n' +
        '3. Third-Party Services\n' +
        'We use Firebase for authentication only. No financial data is shared with third parties.\n\n' +
        '4. Data Security\n' +
        'We employ industry-standard security measures including biometric authentication and encryption.\n\n' +
        '5. Your Rights\n' +
        'You have the right to access, modify, or delete your data at any time.',
      [{ text: 'Close' }],
      { cancelable: true }
    );
  };

  const handleTermsOfService = () => {
    Alert.alert(
      'Terms of Service',
      'MintyFlow Terms of Service\n\n' +
        '1. Acceptance of Terms\n' +
        'By using MintyFlow, you agree to these terms and conditions.\n\n' +
        '2. Use of Service\n' +
        'MintyFlow is a personal finance management tool. You are responsible for the accuracy of data you enter.\n\n' +
        '3. User Responsibilities\n' +
        '• Keep your device secure\n' +
        '• Do not share your account\n' +
        '• Maintain backup of important data\n\n' +
        '4. Disclaimer\n' +
        'MintyFlow is provided "as is" without warranties. We are not responsible for financial decisions made based on app data.\n\n' +
        '5. Changes to Terms\n' +
        'We may update these terms. Continued use constitutes acceptance of changes.',
      [{ text: 'Close' }],
      { cancelable: true }
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      '⚠️ Delete Account',
      'This action cannot be undone!\n\n' +
        'Deleting your account will permanently remove:\n\n' +
        '• All transactions and wallets\n' +
        '• All investments and goals\n' +
        '• All budgets and bills\n' +
        '• All personal settings\n' +
        '• Your account from our system\n\n' +
        'Are you absolutely sure you want to continue?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete Everything',
          style: 'destructive',
          onPress: () => confirmDeleteAccount(),
        },
      ]
    );
  };

  const confirmDeleteAccount = () => {
    Alert.alert(
      'Final Confirmation',
      'Type "DELETE" below to confirm account deletion.\n\nThis is your last chance to cancel.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm Delete',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            try {
              await deleteAccount();
              Alert.alert(
                'Account Deleted',
                'Your account and all data have been permanently deleted.',
                [{ text: 'OK', onPress: () => router.replace('/auth') }]
              );
            } catch (error) {
              Alert.alert(
                'Error',
                'Failed to delete account. Please try again or contact support.',
                [{ text: 'OK' }]
              );
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Data export feature is coming soon!\n\nYou will be able to export all your financial data in JSON or CSV format.',
      [{ text: 'OK' }]
    );
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
            Personal Data & Privacy
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
            Manage your data and privacy settings
          </ThemedText>
        </ThemedView>

        {/* Privacy Information */}
        <ThemedView style={[styles.infoCard, { backgroundColor: theme.primary + '15' }]}>
          <Ionicons name="lock-closed" size={24} color={theme.primary} />
          <ThemedView style={styles.infoTextContainer}>
            <ThemedText type="defaultSemiBold" style={{ color: theme.primary }}>
              Your Data is Secure
            </ThemedText>
            <ThemedText style={[styles.infoText, { color: theme.primary }]}>
              All financial data is stored locally on your device with encryption. We do not
              upload your transactions to any server.
            </ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Privacy & Terms Section */}
        <ThemedView style={[styles.section, { backgroundColor: theme.card }]}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handlePrivacyPolicy}
            activeOpacity={0.7}
          >
            <ThemedView style={styles.menuLeft}>
              <Ionicons name="document-text-outline" size={24} color={theme.primary} />
              <ThemedText type="defaultSemiBold" style={styles.menuText}>
                Privacy Policy
              </ThemedText>
            </ThemedView>
            <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
          </TouchableOpacity>

          <ThemedView style={[styles.divider, { backgroundColor: theme.border }]} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleTermsOfService}
            activeOpacity={0.7}
          >
            <ThemedView style={styles.menuLeft}>
              <Ionicons name="document-outline" size={24} color={theme.primary} />
              <ThemedText type="defaultSemiBold" style={styles.menuText}>
                Terms of Service
              </ThemedText>
            </ThemedView>
            <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        </ThemedView>

        {/* Data Management Section */}
        <ThemedView style={[styles.section, { backgroundColor: theme.card }]}>
          <ThemedText
            type="defaultSemiBold"
            style={[styles.sectionTitle, { color: theme.textSecondary }]}
          >
            DATA MANAGEMENT
          </ThemedText>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleExportData}
            activeOpacity={0.7}
          >
            <ThemedView style={styles.menuLeft}>
              <Ionicons name="download-outline" size={24} color={theme.success} />
              <ThemedView style={styles.menuTextContainer}>
                <ThemedText type="defaultSemiBold">Export My Data</ThemedText>
                <ThemedText style={[styles.description, { color: theme.textSecondary }]}>
                  Download all your data in JSON/CSV format
                </ThemedText>
              </ThemedView>
            </ThemedView>
            <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        </ThemedView>

        {/* Data Rights */}
        <ThemedView style={styles.rightsSection}>
          <ThemedText type="defaultSemiBold" style={styles.rightsTitle}>
            Your Data Rights
          </ThemedText>

          <ThemedView style={styles.rightItem}>
            <Ionicons name="checkmark-circle" size={20} color={theme.success} />
            <ThemedText style={[styles.rightText, { color: theme.textSecondary }]}>
              Right to access your personal data
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.rightItem}>
            <Ionicons name="checkmark-circle" size={20} color={theme.success} />
            <ThemedText style={[styles.rightText, { color: theme.textSecondary }]}>
              Right to correct inaccurate data
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.rightItem}>
            <Ionicons name="checkmark-circle" size={20} color={theme.success} />
            <ThemedText style={[styles.rightText, { color: theme.textSecondary }]}>
              Right to delete your data
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.rightItem}>
            <Ionicons name="checkmark-circle" size={20} color={theme.success} />
            <ThemedText style={[styles.rightText, { color: theme.textSecondary }]}>
              Right to data portability
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ScrollView>

      {/* Delete Account Button (Floating) */}
      <ThemedView style={[styles.deleteContainer, { backgroundColor: theme.background }]}>
        <TouchableOpacity
          style={[styles.deleteButton, { backgroundColor: theme.error }]}
          onPress={handleDeleteAccount}
          disabled={isDeleting}
          activeOpacity={0.8}
        >
          {isDeleting ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Ionicons name="trash-outline" size={20} color="white" />
              <ThemedText style={styles.deleteButtonText}>
                Delete Profile & All Data
              </ThemedText>
            </>
          )}
        </TouchableOpacity>

        <ThemedText style={[styles.deleteWarning, { color: theme.textSecondary }]}>
          This action cannot be undone
        </ThemedText>
      </ThemedView>
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
    paddingBottom: 180, // Space for floating button
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
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
  infoCard: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    marginBottom: 24,
  },
  infoTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 20,
    marginTop: 4,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuText: {
    marginLeft: 12,
  },
  menuTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  description: {
    fontSize: 12,
    marginTop: 2,
  },
  divider: {
    height: 0.5,
    marginVertical: 16,
    opacity: 0.3,
  },
  rightsSection: {
    marginBottom: 20,
  },
  rightsTitle: {
    marginBottom: 16,
    fontSize: 16,
  },
  rightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  rightText: {
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  deleteContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingTop: 16,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  deleteWarning: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 8,
  },
});
