// User Types
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: number;
  lastLogin: number;
  onboardingCompleted: boolean;
  currencySetupCompleted?: boolean;
  baseCurrency?: string;
}

// Wallet Types
export enum WalletType {
  PERSONAL = 'personal',
  SHARED = 'shared',
  SECRET = 'secret',
}

export interface Wallet {
  id: string;
  userId: string;
  name: string;
  type: WalletType;
  balance: number;
  currency: string;
  createdAt: number;
  updatedAt: number;
  sharedWith?: string[]; // UIDs of users with access
  isEncrypted?: boolean;
}

// Transaction Types
export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
  TRANSFER = 'transfer',
}

export interface TransactionCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
}

export interface Transaction {
  id: string;
  userId: string;
  walletId: string;
  type: TransactionType;
  amount: number;
  category: string;
  categoryId: string;
  description: string;
  notes?: string;
  date: number;
  createdAt: number;
  updatedAt: number;
  attachments?: string[]; // URLs to Firebase Storage
  isRecurring?: boolean;
  recurringInterval?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  toWalletId?: string; // For transfers
}

// Budget Types
export interface Budget {
  id: string;
  userId: string;
  categoryId: string;
  amount: number;
  spent: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: number;
  endDate: number;
  createdAt: number;
  updatedAt: number;
  alerts: {
    at50Percent: boolean;
    at80Percent: boolean;
    at100Percent: boolean;
  };
}

// Goal Types
export interface Goal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: number;
  createdAt: number;
  updatedAt: number;
  isCompleted: boolean;
  icon?: string;
  color?: string;
}

// Bill & EMI Types
export interface Bill {
  id: string;
  userId: string;
  name: string;
  amount: number;
  dueDate: number;
  recurringInterval: 'monthly' | 'quarterly' | 'yearly';
  categoryId: string;
  walletId: string;
  isPaid: boolean;
  reminderDays: number; // Days before due date to remind
  createdAt: number;
  updatedAt: number;
  lastPaidDate?: number;
  notes?: string;
}

// Investment Types
export enum InvestmentType {
  FD = 'fd',
  RD = 'rd',
  SIP = 'sip',
  MUTUAL_FUND = 'mutual_fund',
  ETF = 'etf',
  COMMODITY = 'commodity',
  OTHER = 'other',
}

export interface Investment {
  id: string;
  userId: string;
  name: string;
  type: InvestmentType;
  provider: string;
  accountNumber?: string;
  purchaseValue: number;
  currentValue: number;
  startDate: number;
  maturityDate?: number;
  createdAt: number;
  updatedAt: number;
  notes?: string;
  documents?: string[]; // URLs to Firebase Storage
  interestRate?: number;
  installmentAmount?: number;
  frequency?: 'monthly' | 'quarterly' | 'yearly';
}

// Life Insurance Types
export interface LifeInsurance {
  id: string;
  userId: string;
  policyName: string;
  provider: string;
  policyNumber: string;
  premium: number;
  premiumFrequency: 'monthly' | 'quarterly' | 'half-yearly' | 'yearly';
  startDate: number;
  endDate: number;
  coverageAmount: number;
  isActive: boolean;
  nextPremiumDate: number;
  createdAt: number;
  updatedAt: number;
  notes?: string;
  documents?: string[]; // URLs to Firebase Storage
  nominees?: {
    name: string;
    relationship: string;
    share: number;
  }[];
}

// Split Bill Types
export interface SplitBill {
  id: string;
  createdBy: string;
  name: string;
  totalAmount: number;
  participants: {
    userId: string;
    name: string;
    share: number;
    hasPaid: boolean;
  }[];
  category: string;
  date: number;
  createdAt: number;
  updatedAt: number;
  notes?: string;
}

// Notification Types
export interface AppNotification {
  id: string;
  userId: string;
  type: 'bill' | 'investment' | 'insurance' | 'goal' | 'budget' | 'expense';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: number;
  data?: Record<string, any>;
}

// Analytics Types
export interface DashboardStats {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  investmentValue: number;
  investmentGains: number;
  activePolicies: number;
  totalCoverage: number;
  upcomingBills: Bill[];
  budgetAlerts: Budget[];
}

// App Settings
export interface AppSettings {
  userId: string;
  theme: 'light' | 'dark' | 'auto';
  currency: string;
  biometricEnabled: boolean;
  notificationsEnabled: boolean;
  language: string;
  secretWalletEnabled: boolean;
}
