import { TransactionType, TransactionCategory } from '../types';

// Color Palette - No gradients as per requirements
export const Colors = {
  light: {
    primary: '#2563EB',
    secondary: '#7C3AED',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    background: '#FFFFFF',
    surface: '#F9FAFB',
    text: '#111827',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    disabled: '#9CA3AF',
    income: '#10B981',
    expense: '#EF4444',
    card: '#FFFFFF',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
  dark: {
    primary: '#3B82F6',
    secondary: '#8B5CF6',
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
    info: '#60A5FA',
    background: '#111827',
    surface: '#1F2937',
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
    border: '#374151',
    disabled: '#6B7280',
    income: '#34D399',
    expense: '#F87171',
    card: '#1F2937',
    shadow: 'rgba(0, 0, 0, 0.3)',
  },
};

// Default Transaction Categories
export const DefaultCategories: TransactionCategory[] = [
  // Income Categories
  { id: 'salary', name: 'Salary', icon: '💰', color: '#10B981', type: TransactionType.INCOME },
  { id: 'freelance', name: 'Freelance', icon: '💻', color: '#3B82F6', type: TransactionType.INCOME },
  { id: 'investment', name: 'Investment', icon: '📈', color: '#8B5CF6', type: TransactionType.INCOME },
  { id: 'gift', name: 'Gift', icon: '🎁', color: '#EC4899', type: TransactionType.INCOME },
  { id: 'bonus', name: 'Bonus', icon: '🎉', color: '#F59E0B', type: TransactionType.INCOME },
  { id: 'other-income', name: 'Other', icon: '💵', color: '#6B7280', type: TransactionType.INCOME },

  // Expense Categories
  { id: 'food', name: 'Food & Dining', icon: '🍔', color: '#EF4444', type: TransactionType.EXPENSE },
  { id: 'transport', name: 'Transportation', icon: '🚗', color: '#F59E0B', type: TransactionType.EXPENSE },
  { id: 'shopping', name: 'Shopping', icon: '🛍️', color: '#EC4899', type: TransactionType.EXPENSE },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#8B5CF6', type: TransactionType.EXPENSE },
  { id: 'healthcare', name: 'Healthcare', icon: '🏥', color: '#EF4444', type: TransactionType.EXPENSE },
  { id: 'education', name: 'Education', icon: '📚', color: '#3B82F6', type: TransactionType.EXPENSE },
  { id: 'utilities', name: 'Utilities', icon: '💡', color: '#10B981', type: TransactionType.EXPENSE },
  { id: 'rent', name: 'Rent', icon: '🏠', color: '#6366F1', type: TransactionType.EXPENSE },
  { id: 'insurance', name: 'Insurance', icon: '🛡️', color: '#14B8A6', type: TransactionType.EXPENSE },
  { id: 'investment-expense', name: 'Investment', icon: '💹', color: '#8B5CF6', type: TransactionType.EXPENSE },
  { id: 'savings', name: 'Savings', icon: '🏦', color: '#10B981', type: TransactionType.EXPENSE },
  { id: 'other-expense', name: 'Other', icon: '📝', color: '#6B7280', type: TransactionType.EXPENSE },
];

// Currencies
export const Currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
];

// Onboarding Slides
export const OnboardingSlides = [
  {
    id: 1,
    title: 'Track Your Finances',
    description: 'Manage income, expenses, and budgets all in one place',
    image: require('../assets/images/onboarding-1.png'),
  },
  {
    id: 2,
    title: 'Smart Investments',
    description: 'Monitor your investments and insurance policies effortlessly',
    image: require('../assets/images/onboarding-2.png'),
  },
  {
    id: 3,
    title: 'Shared Wallets',
    description: 'Collaborate with family and friends on shared expenses',
    image: require('../assets/images/onboarding-3.png'),
  },
];

// App Settings
export const APP_NAME = 'MintyFlow';
export const DEFAULT_CURRENCY = 'USD';
export const TRANSACTION_LIMIT = 50; // Number of transactions to fetch at once
export const REMINDER_DAYS_BEFORE_BILL = 3;
export const REMINDER_DAYS_BEFORE_PREMIUM = 7;

// Storage Keys
export const STORAGE_KEYS = {
  USER_TOKEN: '@mintyflow_user_token',
  ONBOARDING_COMPLETED: '@mintyflow_onboarding_completed',
  THEME: '@mintyflow_theme',
  BIOMETRIC_ENABLED: '@mintyflow_biometric',
  LAST_SYNC: '@mintyflow_last_sync',
};

// Animation Durations (ms)
export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
};

// Investment Types
export const INVESTMENT_TYPES = [
  { id: 'fd', label: 'Fixed Deposit', icon: '🏦' },
  { id: 'rd', label: 'Recurring Deposit', icon: '💰' },
  { id: 'sip', label: 'SIP', icon: '📊' },
  { id: 'mutual_fund', label: 'Mutual Fund', icon: '📈' },
  { id: 'etf', label: 'ETF', icon: '💹' },
  { id: 'commodity', label: 'Commodity', icon: '🥇' },
  { id: 'other', label: 'Other', icon: '📝' },
];

// Premium Frequencies
export const PREMIUM_FREQUENCIES = [
  { id: 'monthly', label: 'Monthly' },
  { id: 'quarterly', label: 'Quarterly' },
  { id: 'half-yearly', label: 'Half-Yearly' },
  { id: 'yearly', label: 'Yearly' },
];

// Recurring Intervals
export const RECURRING_INTERVALS = [
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
  { id: 'yearly', label: 'Yearly' },
];
