import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';

export default function IndexScreen() {
  const { user, loading: authLoading } = useAuth();
  const { theme } = useTheme();
  const { hasCurrencySet, loading: settingsLoading } = useSettings();

  useEffect(() => {
    console.log('[IndexScreen] Auth state:', {
      authLoading,
      settingsLoading,
      user: user?.email,
      onboardingCompleted: user?.onboardingCompleted,
      hasCurrencySet
    });

    if (!authLoading && !settingsLoading) {
      if (!user) {
        console.log('[IndexScreen] No user - navigating to /auth');
        router.replace('/auth');
      } else if (!user.onboardingCompleted) {
        console.log('[IndexScreen] User not onboarded - navigating to /onboarding');
        router.replace('/onboarding');
      } else if (!hasCurrencySet) {
        console.log('[IndexScreen] User needs to set currency - navigating to /currency-setup');
        router.replace('/currency-setup');
      } else {
        console.log('[IndexScreen] User authenticated and setup complete - navigating to /(tabs)');
        router.replace('/(tabs)');
      }
    }
  }, [user, authLoading, settingsLoading, hasCurrencySet]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ActivityIndicator size="large" color={theme.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
