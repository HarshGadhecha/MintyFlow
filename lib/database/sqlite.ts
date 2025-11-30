import * as SQLite from 'expo-sqlite';

const DB_NAME = 'mintyflow.db';

class Database {
  private db: SQLite.SQLiteDatabase | null = null;

  async init() {
    try {
      this.db = await SQLite.openDatabaseAsync(DB_NAME);
      await this.createTables();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    }
  }

  private async createTables() {
    if (!this.db) throw new Error('Database not initialized');

    const tables = [
      // Users table
      `CREATE TABLE IF NOT EXISTS users (
        uid TEXT PRIMARY KEY,
        email TEXT,
        displayName TEXT,
        photoURL TEXT,
        createdAt INTEGER,
        lastLogin INTEGER,
        onboardingCompleted INTEGER DEFAULT 0
      )`,

      // Wallets table
      `CREATE TABLE IF NOT EXISTS wallets (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        balance REAL DEFAULT 0,
        currency TEXT DEFAULT 'USD',
        createdAt INTEGER,
        updatedAt INTEGER,
        isEncrypted INTEGER DEFAULT 0,
        FOREIGN KEY (userId) REFERENCES users(uid)
      )`,

      // Transactions table
      `CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        walletId TEXT NOT NULL,
        type TEXT NOT NULL,
        amount REAL NOT NULL,
        category TEXT,
        categoryId TEXT,
        description TEXT,
        notes TEXT,
        date INTEGER,
        createdAt INTEGER,
        updatedAt INTEGER,
        isRecurring INTEGER DEFAULT 0,
        recurringInterval TEXT,
        toWalletId TEXT,
        FOREIGN KEY (userId) REFERENCES users(uid),
        FOREIGN KEY (walletId) REFERENCES wallets(id)
      )`,

      // Budgets table
      `CREATE TABLE IF NOT EXISTS budgets (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        categoryId TEXT NOT NULL,
        amount REAL NOT NULL,
        spent REAL DEFAULT 0,
        period TEXT NOT NULL,
        startDate INTEGER,
        endDate INTEGER,
        createdAt INTEGER,
        updatedAt INTEGER,
        FOREIGN KEY (userId) REFERENCES users(uid)
      )`,

      // Goals table
      `CREATE TABLE IF NOT EXISTS goals (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        name TEXT NOT NULL,
        targetAmount REAL NOT NULL,
        currentAmount REAL DEFAULT 0,
        deadline INTEGER,
        createdAt INTEGER,
        updatedAt INTEGER,
        isCompleted INTEGER DEFAULT 0,
        icon TEXT,
        color TEXT,
        FOREIGN KEY (userId) REFERENCES users(uid)
      )`,

      // Bills table
      `CREATE TABLE IF NOT EXISTS bills (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        name TEXT NOT NULL,
        amount REAL NOT NULL,
        dueDate INTEGER,
        recurringInterval TEXT,
        categoryId TEXT,
        walletId TEXT,
        isPaid INTEGER DEFAULT 0,
        reminderDays INTEGER DEFAULT 3,
        createdAt INTEGER,
        updatedAt INTEGER,
        lastPaidDate INTEGER,
        notes TEXT,
        FOREIGN KEY (userId) REFERENCES users(uid)
      )`,

      // Investments table
      `CREATE TABLE IF NOT EXISTS investments (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        provider TEXT,
        accountNumber TEXT,
        purchaseValue REAL NOT NULL,
        currentValue REAL NOT NULL,
        startDate INTEGER,
        maturityDate INTEGER,
        createdAt INTEGER,
        updatedAt INTEGER,
        notes TEXT,
        interestRate REAL,
        installmentAmount REAL,
        frequency TEXT,
        FOREIGN KEY (userId) REFERENCES users(uid)
      )`,

      // Life Insurance table
      `CREATE TABLE IF NOT EXISTS life_insurance (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        policyName TEXT NOT NULL,
        provider TEXT NOT NULL,
        policyNumber TEXT NOT NULL,
        premium REAL NOT NULL,
        premiumFrequency TEXT NOT NULL,
        startDate INTEGER,
        endDate INTEGER,
        coverageAmount REAL NOT NULL,
        isActive INTEGER DEFAULT 1,
        nextPremiumDate INTEGER,
        createdAt INTEGER,
        updatedAt INTEGER,
        notes TEXT,
        FOREIGN KEY (userId) REFERENCES users(uid)
      )`,

      // Sync Queue table (for offline changes)
      `CREATE TABLE IF NOT EXISTS sync_queue (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        table_name TEXT NOT NULL,
        record_id TEXT NOT NULL,
        action TEXT NOT NULL,
        data TEXT NOT NULL,
        timestamp INTEGER,
        synced INTEGER DEFAULT 0
      )`,

      // Settings table
      `CREATE TABLE IF NOT EXISTS settings (
        userId TEXT PRIMARY KEY,
        currency TEXT DEFAULT 'USD',
        biometricEnabled INTEGER DEFAULT 0,
        notificationsEnabled INTEGER DEFAULT 1,
        maturityNotifications INTEGER DEFAULT 1,
        alertNotifications INTEGER DEFAULT 1,
        additionalCurrencies TEXT DEFAULT '[]',
        updatedAt INTEGER,
        FOREIGN KEY (userId) REFERENCES users(uid)
      )`,
    ];

    for (const table of tables) {
      await this.db.execAsync(table);
    }

    // Create indexes for better performance
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_transactions_userId ON transactions(userId)',
      'CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date)',
      'CREATE INDEX IF NOT EXISTS idx_wallets_userId ON wallets(userId)',
      'CREATE INDEX IF NOT EXISTS idx_bills_userId ON bills(userId)',
      'CREATE INDEX IF NOT EXISTS idx_investments_userId ON investments(userId)',
      'CREATE INDEX IF NOT EXISTS idx_insurance_userId ON life_insurance(userId)',
    ];

    for (const index of indexes) {
      await this.db.execAsync(index);
    }
  }

  async executeQuery(query: string, params: any[] = []): Promise<any> {
    if (!this.db) throw new Error('Database not initialized');
    return await this.db.runAsync(query, params);
  }

  async getAll(query: string, params: any[] = []): Promise<any[]> {
    if (!this.db) throw new Error('Database not initialized');
    return await this.db.getAllAsync(query, params);
  }

  async getFirst(query: string, params: any[] = []): Promise<any | null> {
    if (!this.db) throw new Error('Database not initialized');
    return await this.db.getFirstAsync(query, params);
  }

  async clearAllData() {
    if (!this.db) throw new Error('Database not initialized');

    const tables = [
      'transactions',
      'wallets',
      'budgets',
      'goals',
      'bills',
      'investments',
      'life_insurance',
      'sync_queue',
      'users',
    ];

    for (const table of tables) {
      await this.db.execAsync(`DELETE FROM ${table}`);
    }
  }

  async close() {
    if (this.db) {
      await this.db.closeAsync();
      this.db = null;
    }
  }
}

export const database = new Database();
export default database;
