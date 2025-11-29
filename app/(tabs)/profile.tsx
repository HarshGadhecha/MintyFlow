import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

export default function ProfileScreen() {
  const { theme, themeMode, setThemeMode } = useTheme();
  const { user, signOut } = useAuth();

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
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Profile</Text>
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

      {/* Settings */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Settings</Text>

        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: theme.card }]}
          onPress={handleThemeChange}
        >
          <View style={styles.menuItemLeft}>
            <Ionicons name="color-palette-outline" size={24} color={theme.text} />
            <Text style={[styles.menuItemText, { color: theme.text }]}>Theme</Text>
          </View>
          <View style={styles.menuItemRight}>
            <Text style={[styles.menuItemValue, { color: theme.textSecondary }]}>
              {themeMode === 'auto' ? 'Auto' : themeMode === 'dark' ? 'Dark' : 'Light'}
            </Text>
            <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, { backgroundColor: theme.card }]}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="lock-closed-outline" size={24} color={theme.text} />
            <Text style={[styles.menuItemText, { color: theme.text }]}>Biometric Lock</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, { backgroundColor: theme.card }]}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="notifications-outline" size={24} color={theme.text} />
            <Text style={[styles.menuItemText, { color: theme.text }]}>Notifications</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, { backgroundColor: theme.card }]}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="cash-outline" size={24} color={theme.text} />
            <Text style={[styles.menuItemText, { color: theme.text }]}>Currency</Text>
          </View>
          <View style={styles.menuItemRight}>
            <Text style={[styles.menuItemValue, { color: theme.textSecondary }]}>USD</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
          </View>
        </TouchableOpacity>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>About</Text>

        <TouchableOpacity style={[styles.menuItem, { backgroundColor: theme.card }]}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="information-circle-outline" size={24} color={theme.text} />
            <Text style={[styles.menuItemText, { color: theme.text }]}>About MintyFlow</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, { backgroundColor: theme.card }]}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="document-text-outline" size={24} color={theme.text} />
            <Text style={[styles.menuItemText, { color: theme.text }]}>Privacy Policy</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Sign Out */}
      <TouchableOpacity
        style={[styles.signOutButton, { backgroundColor: theme.error }]}
        onPress={handleSignOut}
      >
        <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={[styles.versionText, { color: theme.textSecondary }]}>
          Version 1.0.0
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  userCard: {
    marginHorizontal: 20,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 12,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuItemValue: {
    fontSize: 14,
  },
  signOutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  signOutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  versionText: {
    fontSize: 12,
  },
});
