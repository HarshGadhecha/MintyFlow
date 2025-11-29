import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function IndexScreen() {
  const { user, loading } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    console.log('[IndexScreen] Auth state:', { loading, user: user?.email, onboardingCompleted: user?.onboardingCompleted });

    if (!loading) {
      if (!user) {
        console.log('[IndexScreen] No user - navigating to /auth');
        router.replace('/auth');
      } else if (!user.onboardingCompleted) {
        console.log('[IndexScreen] User not onboarded - navigating to /onboarding');
        router.replace('/onboarding');
      } else {
        console.log('[IndexScreen] User authenticated and onboarded - navigating to /(tabs)');
        router.replace('/(tabs)');
      }
    }
  }, [user, loading]);

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
