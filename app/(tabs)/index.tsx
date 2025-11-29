import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

export default function DashboardScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  // Mock data - will be replaced with real data from Firebase
  const stats = {
    totalBalance: 45250.50,
    monthlyIncome: 8500.00,
    monthlyExpenses: 3275.25,
    investmentValue: 125000.00,
    investmentGains: 12500.00,
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Fetch latest data
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: theme.textSecondary }]}>Welcome back,</Text>
          <Text style={[styles.userName, { color: theme.text }]}>
            {user?.displayName || 'User'}
          </Text>
        </View>
        <TouchableOpacity style={[styles.notificationButton, { backgroundColor: theme.surface }]}>
          <Ionicons name="notifications-outline" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* Total Balance Card */}
      <View style={[styles.balanceCard, { backgroundColor: theme.primary }]}>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <Text style={styles.balanceAmount}>${stats.totalBalance.toLocaleString()}</Text>
        <View style={styles.balanceRow}>
          <View style={styles.balanceItem}>
            <Ionicons name="arrow-down" size={16} color="#FFFFFF" />
            <Text style={styles.balanceItemText}>Income</Text>
            <Text style={styles.balanceItemAmount}>${stats.monthlyIncome.toLocaleString()}</Text>
          </View>
          <View style={styles.balanceDivider} />
          <View style={styles.balanceItem}>
            <Ionicons name="arrow-up" size={16} color="#FFFFFF" />
            <Text style={styles.balanceItemText}>Expenses</Text>
            <Text style={styles.balanceItemAmount}>${stats.monthlyExpenses.toLocaleString()}</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.card }]}>
            <View style={[styles.actionIcon, { backgroundColor: theme.success + '20' }]}>
              <Ionicons name="add" size={24} color={theme.success} />
            </View>
            <Text style={[styles.actionText, { color: theme.text }]}>Add Income</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.card }]}>
            <View style={[styles.actionIcon, { backgroundColor: theme.error + '20' }]}>
              <Ionicons name="remove" size={24} color={theme.error} />
            </View>
            <Text style={[styles.actionText, { color: theme.text }]}>Add Expense</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.card }]}>
            <View style={[styles.actionIcon, { backgroundColor: theme.info + '20' }]}>
              <Ionicons name="wallet" size={24} color={theme.info} />
            </View>
            <Text style={[styles.actionText, { color: theme.text }]}>Wallets</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.card }]}>
            <View style={[styles.actionIcon, { backgroundColor: theme.warning + '20' }]}>
              <Ionicons name="trending-up" size={24} color={theme.warning} />
            </View>
            <Text style={[styles.actionText, { color: theme.text }]}>Invest</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Investments Overview */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Investments</Text>
          <TouchableOpacity>
            <Text style={[styles.seeAll, { color: theme.primary }]}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.investmentCard, { backgroundColor: theme.card }]}>
          <View style={styles.investmentRow}>
            <View>
              <Text style={[styles.investmentLabel, { color: theme.textSecondary }]}>
                Total Value
              </Text>
              <Text style={[styles.investmentValue, { color: theme.text }]}>
                ${stats.investmentValue.toLocaleString()}
              </Text>
            </View>
            <View style={[styles.gainsBadge, { backgroundColor: theme.success + '20' }]}>
              <Ionicons name="trending-up" size={16} color={theme.success} />
              <Text style={[styles.gainsText, { color: theme.success }]}>
                +${stats.investmentGains.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Recent Transactions */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Transactions</Text>
          <TouchableOpacity>
            <Text style={[styles.seeAll, { color: theme.primary }]}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.transactionCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            No transactions yet
          </Text>
        </View>
      </View>

      {/* Bills & EMI Reminder */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Upcoming Bills</Text>
          <TouchableOpacity>
            <Text style={[styles.seeAll, { color: theme.primary }]}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.transactionCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            No upcoming bills
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 14,
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceCard: {
    marginHorizontal: 20,
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
  },
  balanceLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.9,
    marginBottom: 8,
  },
  balanceAmount: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceItem: {
    flex: 1,
    gap: 4,
  },
  balanceItemText: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.9,
  },
  balanceItemAmount: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  balanceDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#FFFFFF',
    opacity: 0.3,
    marginHorizontal: 20,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  investmentCard: {
    padding: 20,
    borderRadius: 12,
  },
  investmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  investmentLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  investmentValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  gainsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  gainsText: {
    fontSize: 14,
    fontWeight: '600',
  },
  transactionCard: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
});
