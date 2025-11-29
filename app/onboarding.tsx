import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const { width } = Dimensions.get('window');

const ONBOARDING_DATA = [
  {
    id: '1',
    title: 'Track Your Finances',
    description: 'Manage income, expenses, and budgets all in one place',
    emoji: '📊',
  },
  {
    id: '2',
    title: 'Smart Investments',
    description: 'Monitor your investments and insurance policies effortlessly',
    emoji: '📈',
  },
  {
    id: '3',
    title: 'Shared Wallets',
    description: 'Collaborate with family and friends on shared expenses',
    emoji: '👨‍👩‍👧‍👦',
  },
  {
    id: '4',
    title: "Let's Get Started",
    description: 'Set up your first wallet and start tracking your finances',
    emoji: '🚀',
  },
];

export default function OnboardingScreen() {
  const { theme } = useTheme();
  const { completeOnboarding } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < ONBOARDING_DATA.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex });
      setCurrentIndex(nextIndex);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = async () => {
    try {
      await completeOnboarding();
      // User will be redirected to currency-setup by the index.tsx logic
      router.replace('/');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  const renderItem = ({ item }: { item: typeof ONBOARDING_DATA[0] }) => (
    <View style={[styles.slide, { width }]}>
      <View style={styles.emojiContainer}>
        <Text style={styles.emoji}>{item.emoji}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
        <Text style={[styles.description, { color: theme.textSecondary }]}>
          {item.description}
        </Text>
      </View>
    </View>
  );

  const renderDot = (index: number) => (
    <View
      key={index}
      style={[
        styles.dot,
        {
          backgroundColor: index === currentIndex ? theme.primary : theme.disabled,
          width: index === currentIndex ? 24 : 8,
        },
      ]}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Skip Button */}
      {currentIndex < ONBOARDING_DATA.length - 1 && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={[styles.skipText, { color: theme.textSecondary }]}>Skip</Text>
        </TouchableOpacity>
      )}

      {/* Carousel */}
      <FlatList
        ref={flatListRef}
        data={ONBOARDING_DATA}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        keyExtractor={(item) => item.id}
      />

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {ONBOARDING_DATA.map((_, index) => renderDot(index))}
      </View>

      {/* Next/Get Started Button */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={handleNext}
      >
        <Text style={styles.buttonText}>
          {currentIndex === ONBOARDING_DATA.length - 1 ? 'Get Started' : 'Next'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 12,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emojiContainer: {
    marginBottom: 40,
  },
  emoji: {
    fontSize: 120,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 40,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  button: {
    marginHorizontal: 24,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
