import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useSettings } from '../../contexts/SettingsContext';

export default function SettingsScreen() {
  const { theme, themeMode, setThemeMode } = useTheme();
  const { user, signOut } = useAuth();
  const { currency } = useSettings();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/auth');
          },
        },
      ]
    );
  };

  const handleThemeChange = () => {
    Alert.alert(
      'Choose Theme',
      'Select your preferred theme',
      [
        { text: 'Light', onPress: () => setThemeMode('light') },
        { text: 'Dark', onPress: () => setThemeMode('dark') },
        { text: 'Auto', onPress: () => setThemeMode('auto') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
      </View>

      {/* User Info */}
      <View style={[styles.userCard, { backgroundColor: theme.card }]}>
        {user?.photoURL ? (
          <Image source={{ uri: user.photoURL }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatarPlaceholder, { backgroundColor: theme.primary }]}>
            <Text style={styles.avatarText}>
              {user?.displayName?.charAt(0) || 'U'}
            </Text>
          </View>
        )}
        <Text style={[styles.userName, { color: theme.text }]}>
          {user?.displayName || 'User'}
        </Text>
        <Text style={[styles.userEmail, { color: theme.textSecondary }]}>
          {user?.email || ''}
        </Text>
      </View>

      {/* Settings Options */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          PREFERENCES
        </Text>

        {/* Security */}
        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: theme.card }]}
          onPress={() => router.push('/security-modal')}
          activeOpacity={0.7}
        >
          <View style={styles.menuItemLeft}>
            <View style={[styles.iconContainer, { backgroundColor: theme.primary + '20' }]}>
              <Ionicons name="shield-checkmark-outline" size={22} color={theme.primary} />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={[styles.menuItemText, { color: theme.text }]}>Security</Text>
              <Text style={[styles.menuItemSubtext, { color: theme.textSecondary }]}>
                Biometric lock & authentication
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
        </TouchableOpacity>

        {/* Currency */}
        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: theme.card }]}
          onPress={() => router.push('/currency-modal')}
          activeOpacity={0.7}
        >
          <View style={styles.menuItemLeft}>
            <View style={[styles.iconContainer, { backgroundColor: theme.success + '20' }]}>
              <Ionicons name="cash-outline" size={22} color={theme.success} />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={[styles.menuItemText, { color: theme.text }]}>Currency</Text>
              <Text style={[styles.menuItemSubtext, { color: theme.textSecondary }]}>
                Base: {currency}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
        </TouchableOpacity>

        {/* Notifications */}
        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: theme.card }]}
          onPress={() => router.push('/notification-modal')}
          activeOpacity={0.7}
        >
          <View style={styles.menuItemLeft}>
            <View style={[styles.iconContainer, { backgroundColor: theme.warning + '20' }]}>
              <Ionicons name="notifications-outline" size={22} color={theme.warning} />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={[styles.menuItemText, { color: theme.text }]}>Notifications</Text>
              <Text style={[styles.menuItemSubtext, { color: theme.textSecondary }]}>
                Alerts, reminders & updates
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
        </TouchableOpacity>

        {/* Theme */}
        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: theme.card }]}
          onPress={handleThemeChange}
          activeOpacity={0.7}
        >
          <View style={styles.menuItemLeft}>
            <View style={[styles.iconContainer, { backgroundColor: theme.primary + '20' }]}>
              <Ionicons name="color-palette-outline" size={22} color={theme.primary} />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={[styles.menuItemText, { color: theme.text }]}>Theme</Text>
              <Text style={[styles.menuItemSubtext, { color: theme.textSecondary }]}>
                {themeMode === 'auto' ? 'Auto' : themeMode === 'dark' ? 'Dark' : 'Light'}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Privacy & Legal */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          PRIVACY & DATA
        </Text>

        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: theme.card }]}
          onPress={() => router.push('/personal-privacy-modal')}
          activeOpacity={0.7}
        >
          <View style={styles.menuItemLeft}>
            <View style={[styles.iconContainer, { backgroundColor: theme.error + '20' }]}>
              <Ionicons name="lock-closed-outline" size={22} color={theme.error} />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={[styles.menuItemText, { color: theme.text }]}>
                Personal Data & Privacy
              </Text>
              <Text style={[styles.menuItemSubtext, { color: theme.textSecondary }]}>
                Privacy policy, data management
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>ABOUT</Text>

        <View style={[styles.aboutCard, { backgroundColor: theme.card }]}>
          <View style={styles.aboutHeader}>
            <Ionicons name="information-circle" size={32} color={theme.primary} />
            <Text style={[styles.aboutTitle, { color: theme.text }]}>MintyFlow</Text>
          </View>
          <Text style={[styles.aboutText, { color: theme.textSecondary }]}>
            Your personal finance companion for tracking expenses, investments, and achieving
            financial goals.
          </Text>
          <View style={styles.aboutFooter}>
            <Text style={[styles.versionText, { color: theme.textSecondary }]}>
              Version 1.0.0
            </Text>
          </View>
        </View>
      </View>

      {/* Sign Out */}
      <TouchableOpacity
        style={[styles.signOutButton, { backgroundColor: theme.error }]}
        onPress={handleSignOut}
        activeOpacity={0.8}
      >
        <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
  },
  userCard: {
    marginHorizontal: 20,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  menuItemSubtext: {
    fontSize: 12,
  },
  aboutCard: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  aboutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  aboutTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 12,
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  aboutFooter: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  versionText: {
    fontSize: 12,
  },
  signOutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    marginTop: 8,
  },
  signOutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
