import React, { createContext, useContext, useEffect, useState } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { database } from '../lib/database/sqlite';
import { useAuth } from './AuthContext';
import { DEFAULT_CURRENCY, STORAGE_KEYS } from '../constants/AppConstants';

export interface UserSettings {
  currency: string;
  biometricEnabled: boolean;
  notificationsEnabled: boolean;
  maturityNotifications: boolean;
  alertNotifications: boolean;
}

interface SettingsContextType {
  settings: UserSettings;
  loading: boolean;
  updateCurrency: (currency: string) => Promise<void>;
  toggleBiometric: () => Promise<void>;
  toggleNotifications: () => Promise<void>;
  toggleMaturityNotifications: () => Promise<void>;
  toggleAlertNotifications: () => Promise<void>;
  isBiometricAvailable: boolean;
  hasCurrencySet: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings>({
    currency: DEFAULT_CURRENCY,
    biometricEnabled: false,
    notificationsEnabled: true,
    maturityNotifications: true,
    alertNotifications: true,
  });
  const [loading, setLoading] = useState(true);
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [hasCurrencySet, setHasCurrencySet] = useState(false);

  // Check biometric availability
  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  // Load settings when user changes
  useEffect(() => {
    if (user) {
      loadSettings();
    } else {
      // Reset to defaults when no user
      setSettings({
        currency: DEFAULT_CURRENCY,
        biometricEnabled: false,
        notificationsEnabled: true,
        maturityNotifications: true,
        alertNotifications: true,
      });
      setHasCurrencySet(false);
      setLoading(false);
    }
  }, [user]);

  const checkBiometricAvailability = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setIsBiometricAvailable(compatible && enrolled);
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      setIsBiometricAvailable(false);
    }
  };

  const loadSettings = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Load from database
      const result = await database.getFirst(
        'SELECT * FROM settings WHERE userId = ?',
        [user.uid]
      );

      if (result) {
        setSettings({
          currency: result.currency || DEFAULT_CURRENCY,
          biometricEnabled: result.biometricEnabled === 1,
          notificationsEnabled: result.notificationsEnabled === 1,
          maturityNotifications: result.maturityNotifications === 1,
          alertNotifications: result.alertNotifications === 1,
        });
        setHasCurrencySet(true);
      } else {
        // Create default settings for new user
        await createDefaultSettings();
        setHasCurrencySet(false);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const createDefaultSettings = async () => {
    if (!user) return;

    try {
      await database.executeQuery(
        `INSERT INTO settings (userId, currency, biometricEnabled, notificationsEnabled, maturityNotifications, alertNotifications, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          user.uid,
          DEFAULT_CURRENCY,
          0,
          1,
          1,
          1,
          Date.now(),
        ]
      );

      setSettings({
        currency: DEFAULT_CURRENCY,
        biometricEnabled: false,
        notificationsEnabled: true,
        maturityNotifications: true,
        alertNotifications: true,
      });
    } catch (error) {
      console.error('Error creating default settings:', error);
    }
  };

  const updateSetting = async (key: string, value: any) => {
    if (!user) return;

    try {
      // Update in database
      await database.executeQuery(
        `UPDATE settings SET ${key} = ?, updatedAt = ? WHERE userId = ?`,
        [value, Date.now(), user.uid]
      );

      // Update local state
      setSettings(prev => ({ ...prev, [key]: value }));

      // If setting currency for the first time, mark it as set
      if (key === 'currency') {
        setHasCurrencySet(true);
      }
    } catch (error) {
      console.error(`Error updating ${key}:`, error);
      throw error;
    }
  };

  const updateCurrency = async (currency: string) => {
    await updateSetting('currency', currency);
  };

  const toggleBiometric = async () => {
    if (!isBiometricAvailable) {
      throw new Error('Biometric authentication is not available on this device');
    }

    const newValue = !settings.biometricEnabled;

    // If enabling, authenticate first
    if (newValue) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to enable biometric lock',
        fallbackLabel: 'Use passcode',
      });

      if (!result.success) {
        throw new Error('Authentication failed');
      }
    }

    await updateSetting('biometricEnabled', newValue ? 1 : 0);
    await AsyncStorage.setItem(STORAGE_KEYS.BIOMETRIC_ENABLED, newValue ? '1' : '0');
  };

  const toggleNotifications = async () => {
    const newValue = !settings.notificationsEnabled;
    await updateSetting('notificationsEnabled', newValue ? 1 : 0);
  };

  const toggleMaturityNotifications = async () => {
    const newValue = !settings.maturityNotifications;
    await updateSetting('maturityNotifications', newValue ? 1 : 0);
  };

  const toggleAlertNotifications = async () => {
    const newValue = !settings.alertNotifications;
    await updateSetting('alertNotifications', newValue ? 1 : 0);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        updateCurrency,
        toggleBiometric,
        toggleNotifications,
        toggleMaturityNotifications,
        toggleAlertNotifications,
        isBiometricAvailable,
        hasCurrencySet,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
