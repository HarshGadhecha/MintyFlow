import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';
import { useAuth } from '../contexts/AuthContext';
import { Currencies, APP_NAME } from '../constants/AppConstants';

interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export default function CurrencySetupScreen() {
  const { theme } = useTheme();
  const { updateCurrency } = useSettings();
  const { completeCurrencySetup } = useAuth();
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCurrencies, setFilteredCurrencies] = useState<Currency[]>(Currencies);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCurrencies(Currencies);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = Currencies.filter(
        (curr) =>
          curr.code.toLowerCase().includes(query) ||
          curr.name.toLowerCase().includes(query)
      );
      setFilteredCurrencies(filtered);
    }
  }, [searchQuery]);

  const handleContinue = async () => {
    try {
      setSaving(true);

      // Save to Firebase (this marks currency setup as completed)
      await completeCurrencySetup(selectedCurrency);

      // Also save to local SQLite for offline access
      await updateCurrency(selectedCurrency);

      // Navigate to home
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
        <View style={[styles.iconContainer, { backgroundColor: theme.primary + '20' }]}>
          <Ionicons name="cash" size={40} color={theme.primary} />
        </View>
        <Text style={[styles.appName, { color: theme.primary }]}>{APP_NAME}</Text>
        <Text style={[styles.title, { color: theme.text }]}>Choose Your Base Currency</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          This will be your primary currency for all transactions
        </Text>
      </View>

      {/* Important Notice */}
      <View style={[styles.warningBox, { backgroundColor: theme.warning + '15' }]}>
        <Ionicons name="lock-closed" size={20} color={theme.warning} />
        <Text style={[styles.warningText, { color: theme.warning }]}>
          Base currency cannot be changed later. Choose carefully!
        </Text>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: theme.card }]}>
        <Ionicons name="search" size={20} color={theme.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Search currencies..."
          placeholderTextColor={theme.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Currency List */}
      <ScrollView
        style={styles.currencyList}
        contentContainerStyle={styles.currencyListContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredCurrencies.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color={theme.textSecondary} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No currencies found
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
              Try a different search term
            </Text>
          </View>
        ) : (
          filteredCurrencies.map((currency) => {
            const isSelected = selectedCurrency === currency.code;
            return (
              <TouchableOpacity
                key={currency.code}
                style={[
                  styles.currencyItem,
                  {
                    backgroundColor: isSelected ? theme.primary + '10' : theme.card,
                    borderColor: isSelected ? theme.primary : theme.border,
                    borderWidth: isSelected ? 2 : 1,
                  },
                ]}
                onPress={() => setSelectedCurrency(currency.code)}
                activeOpacity={0.7}
              >
                <View style={styles.currencyInfo}>
                  <View
                    style={[
                      styles.symbolContainer,
                      {
                        backgroundColor: isSelected
                          ? theme.primary + '20'
                          : theme.background,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.currencySymbol,
                        { color: isSelected ? theme.primary : theme.text },
                      ]}
                    >
                      {currency.symbol}
                    </Text>
                  </View>
                  <View style={styles.currencyDetails}>
                    <Text
                      style={[
                        styles.currencyName,
                        { color: theme.text },
                        isSelected && { fontWeight: '700' },
                      ]}
                    >
                      {currency.name}
                    </Text>
                    <Text
                      style={[
                        styles.currencyCode,
                        { color: isSelected ? theme.primary : theme.textSecondary },
                      ]}
                    >
                      {currency.code}
                    </Text>
                  </View>
                </View>
                {isSelected && (
                  <View style={[styles.checkmark, { backgroundColor: theme.primary }]}>
                    <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* Continue Button */}
      <View style={[styles.footer, { backgroundColor: theme.background }]}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            { backgroundColor: theme.primary },
            saving && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={saving}
          activeOpacity={0.8}
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
        <Text style={[styles.footerHint, { color: theme.textSecondary }]}>
          You can add additional currencies later in settings
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 20,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    gap: 12,
  },
  warningText: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
    lineHeight: 18,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  currencyList: {
    flex: 1,
  },
  currencyListContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
  },
  currencyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  symbolContainer: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '700',
  },
  currencyDetails: {
    gap: 3,
    flex: 1,
  },
  currencyName: {
    fontSize: 16,
    fontWeight: '600',
  },
  currencyCode: {
    fontSize: 13,
    fontWeight: '500',
  },
  checkmark: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 14,
    marginBottom: 12,
  },
  continueButtonDisabled: {
    opacity: 0.6,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  footerHint: {
    fontSize: 13,
    textAlign: 'center',
  },
});
