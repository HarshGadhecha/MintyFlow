import { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/contexts/ThemeContext';
import { useSettings } from '@/contexts/SettingsContext';
import notificationService from '@/services/notificationService';

export default function NotificationModal() {
  const { theme } = useTheme();
  const {
    notificationsEnabled,
    maturityNotifications,
    alertNotifications,
    toggleNotifications,
    toggleMaturityNotifications,
    toggleAlertNotifications,
  } = useSettings();

  const [dailyNotificationTime, setDailyNotificationTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    checkNotificationPermission();
    // Set default time to 9:00 AM
    const defaultTime = new Date();
    defaultTime.setHours(9, 0, 0, 0);
    setDailyNotificationTime(defaultTime);
  }, []);

  const checkNotificationPermission = async () => {
    const isEnabled = await notificationService.areNotificationsEnabled();
    setPermissionGranted(isEnabled);
  };

  const handleMasterToggle = async (value: boolean) => {
    if (value) {
      // Request permission and enable
      const hasPermission = await notificationService.requestPermissions();

      if (hasPermission) {
        await toggleNotifications();
        setPermissionGranted(true);

        // Schedule daily notification
        await notificationService.scheduleDailyNotification(
          dailyNotificationTime.getHours(),
          dailyNotificationTime.getMinutes()
        );

        Alert.alert(
          'Notifications Enabled',
          'You will receive daily reminders to track your expenses.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Permission Required',
          'Please enable notifications in your device settings to use this feature.',
          [{ text: 'OK' }]
        );
      }
    } else {
      // Disable all notifications
      Alert.alert(
        'Disable All Notifications?',
        'This will turn off all notification types including investment maturity alerts and budget warnings.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Disable',
            style: 'destructive',
            onPress: async () => {
              await toggleNotifications();
              await notificationService.cancelAllNotifications();
            },
          },
        ]
      );
    }
  };

  const handleMaturityToggle = async (value: boolean) => {
    await toggleMaturityNotifications();
  };

  const handleAlertToggle = async (value: boolean) => {
    await toggleAlertNotifications();
  };

  const handleTimeChange = async (event: any, selectedDate?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');

    if (selectedDate && notificationsEnabled) {
      setDailyNotificationTime(selectedDate);

      // Reschedule daily notification with new time
      await notificationService.scheduleDailyNotification(
        selectedDate.getHours(),
        selectedDate.getMinutes()
      );

      if (Platform.OS === 'android') {
        Alert.alert(
          'Time Updated',
          `Daily reminder set for ${selectedDate.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          })}`,
          [{ text: 'OK' }]
        );
      }
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <ThemedView style={styles.header}>
          <Ionicons name="notifications" size={48} color={theme.primary} />
          <ThemedText type="title" style={styles.title}>
            Notifications
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
            Stay on top of your finances with timely alerts
          </ThemedText>
        </ThemedView>

        {/* Master Toggle */}
        <ThemedView style={[styles.section, { backgroundColor: theme.card }]}>
          <ThemedView style={styles.settingRow}>
            <ThemedView style={styles.settingLeft}>
              <Ionicons
                name="notifications-outline"
                size={24}
                color={notificationsEnabled ? theme.primary : theme.textSecondary}
              />
              <ThemedView style={styles.settingText}>
                <ThemedText type="defaultSemiBold">All Notifications</ThemedText>
                <ThemedText style={[styles.description, { color: theme.textSecondary }]}>
                  Master switch for all notification types
                </ThemedText>
              </ThemedView>
            </ThemedView>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleMasterToggle}
              trackColor={{ false: theme.border, true: theme.primary + '40' }}
              thumbColor={notificationsEnabled ? theme.primary : theme.textSecondary}
            />
          </ThemedView>
        </ThemedView>

        {/* Daily Reminder */}
        {notificationsEnabled && (
          <ThemedView style={[styles.section, { backgroundColor: theme.card }]}>
            <ThemedText
              type="defaultSemiBold"
              style={[styles.sectionTitle, { color: theme.textSecondary }]}
            >
              DAILY REMINDER
            </ThemedText>

            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => setShowTimePicker(true)}
              activeOpacity={0.7}
            >
              <ThemedView style={styles.settingLeft}>
                <Ionicons name="time-outline" size={24} color={theme.primary} />
                <ThemedView style={styles.settingText}>
                  <ThemedText type="defaultSemiBold">Reminder Time</ThemedText>
                  <ThemedText style={[styles.description, { color: theme.textSecondary }]}>
                    Daily notification to track expenses
                  </ThemedText>
                </ThemedView>
              </ThemedView>
              <ThemedView style={styles.timeContainer}>
                <ThemedText style={{ color: theme.primary, fontWeight: '600' }}>
                  {formatTime(dailyNotificationTime)}
                </ThemedText>
                <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
              </ThemedView>
            </TouchableOpacity>

            {showTimePicker && (
              <DateTimePicker
                value={dailyNotificationTime}
                mode="time"
                is24Hour={false}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleTimeChange}
              />
            )}
          </ThemedView>
        )}

        {/* Investment Maturity Alerts */}
        {notificationsEnabled && (
          <ThemedView style={[styles.section, { backgroundColor: theme.card }]}>
            <ThemedText
              type="defaultSemiBold"
              style={[styles.sectionTitle, { color: theme.textSecondary }]}
            >
              INVESTMENT ALERTS
            </ThemedText>

            <ThemedView style={styles.settingRow}>
              <ThemedView style={styles.settingLeft}>
                <Ionicons name="trending-up-outline" size={24} color={theme.success} />
                <ThemedView style={styles.settingText}>
                  <ThemedText type="defaultSemiBold">Maturity Notifications</ThemedText>
                  <ThemedText style={[styles.description, { color: theme.textSecondary }]}>
                    Alert 7 days before investment matures
                  </ThemedText>
                </ThemedView>
              </ThemedView>
              <Switch
                value={maturityNotifications}
                onValueChange={handleMaturityToggle}
                trackColor={{ false: theme.border, true: theme.success + '40' }}
                thumbColor={maturityNotifications ? theme.success : theme.textSecondary}
              />
            </ThemedView>
          </ThemedView>
        )}

        {/* Budget & Bill Alerts */}
        {notificationsEnabled && (
          <ThemedView style={[styles.section, { backgroundColor: theme.card }]}>
            <ThemedText
              type="defaultSemiBold"
              style={[styles.sectionTitle, { color: theme.textSecondary }]}
            >
              BUDGET & BILL ALERTS
            </ThemedText>

            <ThemedView style={styles.settingRow}>
              <ThemedView style={styles.settingLeft}>
                <Ionicons name="alert-circle-outline" size={24} color={theme.warning} />
                <ThemedView style={styles.settingText}>
                  <ThemedText type="defaultSemiBold">Alert Notifications</ThemedText>
                  <ThemedText style={[styles.description, { color: theme.textSecondary }]}>
                    Budget warnings and bill reminders
                  </ThemedText>
                </ThemedView>
              </ThemedView>
              <Switch
                value={alertNotifications}
                onValueChange={handleAlertToggle}
                trackColor={{ false: theme.border, true: theme.warning + '40' }}
                thumbColor={alertNotifications ? theme.warning : theme.textSecondary}
              />
            </ThemedView>

            {alertNotifications && (
              <ThemedView style={styles.alertTypes}>
                <ThemedView style={styles.alertItem}>
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color={theme.success}
                    style={styles.alertIcon}
                  />
                  <ThemedText style={[styles.alertText, { color: theme.textSecondary }]}>
                    Budget warnings at 50%, 80%, and 100%
                  </ThemedText>
                </ThemedView>
                <ThemedView style={styles.alertItem}>
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color={theme.success}
                    style={styles.alertIcon}
                  />
                  <ThemedText style={[styles.alertText, { color: theme.textSecondary }]}>
                    Bill reminders 3 days before due
                  </ThemedText>
                </ThemedView>
              </ThemedView>
            )}
          </ThemedView>
        )}

        {/* Info */}
        {!permissionGranted && (
          <ThemedView style={[styles.warningSection, { backgroundColor: theme.warning + '20' }]}>
            <Ionicons name="warning-outline" size={20} color={theme.warning} />
            <ThemedText style={[styles.warningText, { color: theme.warning }]}>
              Notifications are disabled in your device settings. Please enable them to receive
              alerts.
            </ThemedText>
          </ThemedView>
        )}
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
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  description: {
    fontSize: 12,
    marginTop: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  alertTypes: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  alertIcon: {
    marginTop: 2,
  },
  alertText: {
    fontSize: 13,
    marginLeft: 8,
    flex: 1,
  },
  warningSection: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    marginBottom: 20,
  },
  warningText: {
    fontSize: 13,
    lineHeight: 20,
    marginLeft: 12,
    flex: 1,
    fontWeight: '600',
  },
});
