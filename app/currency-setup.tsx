import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';
import { Currencies, APP_NAME } from '../constants/AppConstants';

export default function CurrencySetupScreen() {
  const { theme } = useTheme();
  const { updateCurrency } = useSettings();
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [saving, setSaving] = useState(false);

  const handleContinue = async () => {
    try {
      setSaving(true);
      await updateCurrency(selectedCurrency);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error setting currency:', error);
      setSaving(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.appName, { color: theme.primary }]}>{APP_NAME}</Text>
        <Text style={[styles.title, { color: theme.text }]}>Choose Your Currency</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Select the currency you'll use for tracking your finances
        </Text>
      </View>

      {/* Currency List */}
      <ScrollView
        style={styles.currencyList}
        contentContainerStyle={styles.currencyListContent}
        showsVerticalScrollIndicator={false}
      >
        {Currencies.map((currency) => (
          <TouchableOpacity
            key={currency.code}
            style={[
              styles.currencyItem,
              {
                backgroundColor: theme.card,
                borderColor: selectedCurrency === currency.code ? theme.primary : theme.border,
                borderWidth: selectedCurrency === currency.code ? 2 : 1,
              },
            ]}
            onPress={() => setSelectedCurrency(currency.code)}
          >
            <View style={styles.currencyInfo}>
              <Text style={[styles.currencySymbol, { color: theme.text }]}>
                {currency.symbol}
              </Text>
              <View style={styles.currencyDetails}>
                <Text style={[styles.currencyName, { color: theme.text }]}>
                  {currency.name}
                </Text>
                <Text style={[styles.currencyCode, { color: theme.textSecondary }]}>
                  {currency.code}
                </Text>
              </View>
            </View>
            {selectedCurrency === currency.code && (
              <Ionicons name="checkmark-circle" size={24} color={theme.primary} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            { backgroundColor: theme.primary },
            saving && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.continueButtonText}>Continue</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  currencyList: {
    flex: 1,
  },
  currencyListContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  currencyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: 'bold',
    width: 50,
    textAlign: 'center',
  },
  currencyDetails: {
    gap: 4,
  },
  currencyName: {
    fontSize: 16,
    fontWeight: '600',
  },
  currencyCode: {
    fontSize: 14,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  continueButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
  },
  continueButtonDisabled: {
    opacity: 0.6,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
