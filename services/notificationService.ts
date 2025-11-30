import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class NotificationService {
  /**
   * Request notification permissions from the user
   */
  async requestPermissions(): Promise<boolean> {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return false;
    }

    // Configure notification channel for Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#2563EB',
      });
    }

    return true;
  }

  /**
   * Schedule a daily notification at a specific time
   * @param hour - Hour (0-23)
   * @param minute - Minute (0-59)
   * @param title - Notification title
   * @param body - Notification body
   */
  async scheduleDailyNotification(
    hour: number = 9,
    minute: number = 0,
    title: string = '📊 MintyFlow Reminder',
    body: string = 'Track your expenses and stay on budget!'
  ): Promise<string | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return null;
      }

      // Cancel existing daily notifications first
      await this.cancelDailyNotification();

      // Calculate trigger time
      const trigger = new Date();
      trigger.setHours(hour);
      trigger.setMinutes(minute);
      trigger.setSeconds(0);

      // If the time has passed today, schedule for tomorrow
      if (trigger.getTime() <= Date.now()) {
        trigger.setDate(trigger.getDate() + 1);
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          hour,
          minute,
          repeats: true,
        },
      });

      return notificationId;
    } catch (error) {
      console.error('Error scheduling daily notification:', error);
      return null;
    }
  }

  /**
   * Cancel daily notification
   */
  async cancelDailyNotification(): Promise<void> {
    try {
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();

      // Cancel all repeating notifications (daily notifications)
      for (const notification of scheduledNotifications) {
        if (notification.trigger && 'repeats' in notification.trigger && notification.trigger.repeats) {
          await Notifications.cancelScheduledNotificationAsync(notification.identifier);
        }
      }
    } catch (error) {
      console.error('Error canceling daily notification:', error);
    }
  }

  /**
   * Schedule a bill/EMI reminder
   * @param billName - Name of the bill
   * @param dueDate - Due date of the bill
   * @param amount - Bill amount
   */
  async scheduleBillReminder(
    billName: string,
    dueDate: Date,
    amount: number,
    currency: string
  ): Promise<string | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return null;
      }

      // Schedule 3 days before due date
      const reminderDate = new Date(dueDate);
      reminderDate.setDate(reminderDate.getDate() - 3);
      reminderDate.setHours(9, 0, 0, 0);

      // Don't schedule if date is in the past
      if (reminderDate.getTime() <= Date.now()) {
        return null;
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '💰 Bill Reminder',
          body: `${billName} is due in 3 days. Amount: ${currency}${amount.toFixed(2)}`,
          sound: true,
          data: { type: 'bill', billName },
        },
        trigger: {
          date: reminderDate,
        },
      });

      return notificationId;
    } catch (error) {
      console.error('Error scheduling bill reminder:', error);
      return null;
    }
  }

  /**
   * Schedule investment maturity alert
   * @param investmentName - Name of the investment
   * @param maturityDate - Maturity date
   * @param amount - Maturity amount
   */
  async scheduleMaturityAlert(
    investmentName: string,
    maturityDate: Date,
    amount: number,
    currency: string
  ): Promise<string | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return null;
      }

      // Schedule 7 days before maturity
      const reminderDate = new Date(maturityDate);
      reminderDate.setDate(reminderDate.getDate() - 7);
      reminderDate.setHours(10, 0, 0, 0);

      // Don't schedule if date is in the past
      if (reminderDate.getTime() <= Date.now()) {
        return null;
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '📈 Investment Maturity Alert',
          body: `${investmentName} matures in 7 days. Expected value: ${currency}${amount.toFixed(2)}`,
          sound: true,
          data: { type: 'maturity', investmentName },
        },
        trigger: {
          date: reminderDate,
        },
      });

      return notificationId;
    } catch (error) {
      console.error('Error scheduling maturity alert:', error);
      return null;
    }
  }

  /**
   * Schedule budget alert
   * @param category - Budget category
   * @param percentage - Percentage spent (50, 80, 100)
   * @param budgetAmount - Total budget amount
   */
  async scheduleBudgetAlert(
    category: string,
    percentage: number,
    budgetAmount: number,
    currency: string
  ): Promise<string | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return null;
      }

      let emoji = '⚠️';
      let message = '';

      if (percentage >= 100) {
        emoji = '🚨';
        message = `You've exceeded your ${category} budget of ${currency}${budgetAmount}!`;
      } else if (percentage >= 80) {
        emoji = '⚠️';
        message = `You've used ${percentage}% of your ${category} budget (${currency}${budgetAmount})`;
      } else {
        emoji = '💡';
        message = `You've used ${percentage}% of your ${category} budget (${currency}${budgetAmount})`;
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: `${emoji} Budget Alert`,
          body: message,
          sound: true,
          data: { type: 'budget', category, percentage },
        },
        trigger: null, // Immediate notification
      });

      return notificationId;
    } catch (error) {
      console.error('Error scheduling budget alert:', error);
      return null;
    }
  }

  /**
   * Cancel a specific notification by ID
   */
  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  }

  /**
   * Cancel all scheduled notifications
   */
  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error canceling all notifications:', error);
    }
  }

  /**
   * Get all scheduled notifications
   */
  async getAllScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  }

  /**
   * Check if notifications are enabled
   */
  async areNotificationsEnabled(): Promise<boolean> {
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
  }
}

export default new NotificationService();
