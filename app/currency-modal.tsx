import { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/contexts/ThemeContext';
import { useSettings } from '@/contexts/SettingsContext';
import { Currencies } from '@/constants/AppConstants';

interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export default function CurrencyModal() {
  const { theme } = useTheme();
  const { currency, updateCurrency, additionalCurrencies, addAdditionalCurrency, removeAdditionalCurrency } = useSettings();

  const [searchQuery, setSearchQuery] = useState('');
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
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

  const handleBaseCurrencyPress = () => {
    Alert.alert(
      'Base Currency',
      'Base currency is set during initial setup and cannot be changed. This helps maintain consistency in your financial records.',
      [{ text: 'OK' }]
    );
  };

  const handleAddCurrency = () => {
    setSearchQuery('');
    setShowCurrencyPicker(true);
  };

  const handleSelectCurrency = (curr: Currency) => {
    // Check if already added
    if (curr.code === currency) {
      Alert.alert('Already Set', 'This is your base currency.', [{ text: 'OK' }]);
      return;
    }

    if (additionalCurrencies?.includes(curr.code)) {
      Alert.alert('Already Added', 'This currency is already in your list.', [{ text: 'OK' }]);
      return;
    }

    addAdditionalCurrency(curr.code);
    setShowCurrencyPicker(false);
    setSearchQuery('');
  };

  const handleRemoveCurrency = (currencyCode: string) => {
    Alert.alert(
      'Remove Currency',
      `Remove ${currencyCode} from your list?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeAdditionalCurrency(currencyCode),
        },
      ]
    );
  };

  const getCurrencyInfo = (code: string) => {
    return Currencies.find((c) => c.code === code);
  };

  const renderCurrencyItem = ({ item }: { item: Currency }) => (
    <TouchableOpacity
      style={[styles.currencyItem, { backgroundColor: theme.card }]}
      onPress={() => handleSelectCurrency(item)}
      activeOpacity={0.7}
    >
      <ThemedView style={styles.currencyLeft}>
        <ThemedView
          style={[styles.currencyIcon, { backgroundColor: theme.primary + '20' }]}
        >
          <ThemedText style={{ color: theme.primary, fontSize: 20, fontWeight: '700' }}>
            {item.symbol}
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.currencyInfo}>
          <ThemedText type="defaultSemiBold">{item.code}</ThemedText>
          <ThemedText style={[styles.currencyName, { color: theme.textSecondary }]}>
            {item.name}
          </ThemedText>
        </ThemedView>
      </ThemedView>
      <Ionicons name="add-circle-outline" size={24} color={theme.primary} />
    </TouchableOpacity>
  );

  if (showCurrencyPicker) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.pickerHeader}>
          <TouchableOpacity
            onPress={() => setShowCurrencyPicker(false)}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <ThemedText type="title" style={styles.pickerTitle}>
            Add Currency
          </ThemedText>
          <ThemedView style={{ width: 24 }} />
        </ThemedView>

        <ThemedView style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={theme.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search currencies..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          )}
        </ThemedView>

        <FlatList
          data={filteredCurrencies}
          renderItem={renderCurrencyItem}
          keyExtractor={(item) => item.code}
          contentContainerStyle={styles.currencyList}
          showsVerticalScrollIndicator={false}
        />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <ThemedView style={styles.header}>
          <Ionicons name="cash" size={48} color={theme.primary} />
          <ThemedText type="title" style={styles.title}>
            Currency Settings
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
            Manage your base and additional currencies
          </ThemedText>
        </ThemedView>

        {/* Base Currency Section */}
        <ThemedView style={[styles.section, { backgroundColor: theme.card }]}>
          <ThemedText
            type="defaultSemiBold"
            style={[styles.sectionTitle, { color: theme.textSecondary }]}
          >
            BASE CURRENCY
          </ThemedText>

          <TouchableOpacity
            style={styles.baseCurrencyCard}
            onPress={handleBaseCurrencyPress}
            activeOpacity={0.7}
          >
            <ThemedView style={styles.currencyLeft}>
              <ThemedView
                style={[
                  styles.baseCurrencyIcon,
                  { backgroundColor: theme.primary + '20' },
                ]}
              >
                <ThemedText style={{ color: theme.primary, fontSize: 28, fontWeight: '700' }}>
                  {getCurrencyInfo(currency)?.symbol}
                </ThemedText>
              </ThemedView>
              <ThemedView style={styles.currencyInfo}>
                <ThemedText type="title" style={{ fontSize: 20 }}>
                  {currency}
                </ThemedText>
                <ThemedText style={[styles.currencyName, { color: theme.textSecondary }]}>
                  {getCurrencyInfo(currency)?.name}
                </ThemedText>
              </ThemedView>
            </ThemedView>
            <ThemedView style={[styles.lockBadge, { backgroundColor: theme.warning + '20' }]}>
              <Ionicons name="lock-closed" size={16} color={theme.warning} />
              <ThemedText style={[styles.lockText, { color: theme.warning }]}>
                Locked
              </ThemedText>
            </ThemedView>
          </TouchableOpacity>

          <ThemedView style={[styles.infoBox, { backgroundColor: theme.primary + '10' }]}>
            <Ionicons name="information-circle" size={16} color={theme.primary} />
            <ThemedText style={[styles.infoText, { color: theme.primary }]}>
              Base currency is set once and cannot be changed to ensure data consistency
            </ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Additional Currencies Section */}
        <ThemedView style={[styles.section, { backgroundColor: theme.card }]}>
          <ThemedView style={styles.sectionHeader}>
            <ThemedText
              type="defaultSemiBold"
              style={[styles.sectionTitle, { color: theme.textSecondary, marginBottom: 0 }]}
            >
              ADDITIONAL CURRENCIES
            </ThemedText>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: theme.primary }]}
              onPress={handleAddCurrency}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={20} color="white" />
              <ThemedText style={styles.addButtonText}>Add</ThemedText>
            </TouchableOpacity>
          </ThemedView>

          {(!additionalCurrencies || additionalCurrencies.length === 0) ? (
            <ThemedView style={styles.emptyState}>
              <Ionicons name="wallet-outline" size={48} color={theme.textSecondary} />
              <ThemedText style={[styles.emptyText, { color: theme.textSecondary }]}>
                No additional currencies added
              </ThemedText>
              <ThemedText style={[styles.emptySubtext, { color: theme.textSecondary }]}>
                Add currencies for multi-currency tracking
              </ThemedText>
            </ThemedView>
          ) : (
            <ThemedView style={styles.additionalList}>
              {additionalCurrencies.map((code, index) => {
                const currInfo = getCurrencyInfo(code);
                return (
                  <ThemedView
                    key={code}
                    style={[
                      styles.additionalItem,
                      index !== 0 && { borderTopWidth: 0.5, borderTopColor: theme.border, opacity: 0.3 },
                    ]}
                  >
                    <ThemedView style={styles.currencyLeft}>
                      <ThemedView
                        style={[
                          styles.additionalIcon,
                          { backgroundColor: theme.success + '20' },
                        ]}
                      >
                        <ThemedText
                          style={{ color: theme.success, fontSize: 20, fontWeight: '600' }}
                        >
                          {currInfo?.symbol}
                        </ThemedText>
                      </ThemedView>
                      <ThemedView style={styles.currencyInfo}>
                        <ThemedText type="defaultSemiBold">{code}</ThemedText>
                        <ThemedText
                          style={[styles.currencyName, { color: theme.textSecondary }]}
                        >
                          {currInfo?.name}
                        </ThemedText>
                      </ThemedView>
                    </ThemedView>
                    <TouchableOpacity
                      onPress={() => handleRemoveCurrency(code)}
                      style={styles.removeButton}
                    >
                      <Ionicons name="trash-outline" size={20} color={theme.error} />
                    </TouchableOpacity>
                  </ThemedView>
                );
              })}
            </ThemedView>
          )}
        </ThemedView>

        {/* Usage Info */}
        <ThemedView style={styles.usageSection}>
          <ThemedText type="defaultSemiBold" style={styles.usageTitle}>
            How it works
          </ThemedText>

          <ThemedView style={styles.usageItem}>
            <Ionicons name="checkmark-circle" size={20} color={theme.success} />
            <ThemedText style={[styles.usageText, { color: theme.textSecondary }]}>
              All transactions are stored in your base currency
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.usageItem}>
            <Ionicons name="checkmark-circle" size={20} color={theme.success} />
            <ThemedText style={[styles.usageText, { color: theme.textSecondary }]}>
              Additional currencies can be used for multi-currency wallets
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.usageItem}>
            <Ionicons name="checkmark-circle" size={20} color={theme.success} />
            <ThemedText style={[styles.usageText, { color: theme.textSecondary }]}>
              Exchange rates are applied automatically for reporting
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
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  baseCurrencyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  currencyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  baseCurrencyIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currencyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  additionalIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currencyInfo: {
    marginLeft: 12,
    flex: 1,
  },
  currencyName: {
    fontSize: 13,
    marginTop: 2,
  },
  lockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  lockText: {
    fontSize: 12,
    fontWeight: '600',
  },
  infoBox: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 10,
    gap: 8,
  },
  infoText: {
    fontSize: 12,
    flex: 1,
    lineHeight: 18,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 13,
    marginTop: 4,
  },
  additionalList: {
    gap: 0,
  },
  additionalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  removeButton: {
    padding: 8,
  },
  usageSection: {
    marginBottom: 20,
  },
  usageTitle: {
    marginBottom: 16,
    fontSize: 16,
  },
  usageItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  usageText: {
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  // Currency Picker Styles
  pickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 10,
  },
  backButton: {
    padding: 4,
  },
  pickerTitle: {
    fontSize: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  currencyList: {
    padding: 20,
    paddingTop: 0,
  },
  currencyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
});
