import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function IndexScreen() {
  const { user, loading } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not authenticated - show auth screen
        router.replace('/auth');
      } else if (!user.onboardingCompleted) {
        // Authenticated but not onboarded - show onboarding
        router.replace('/onboarding');
      } else {
        // Authenticated and onboarded - show main app
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
