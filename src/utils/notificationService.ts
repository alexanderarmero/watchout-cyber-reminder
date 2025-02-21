
import { Reminder, FrequencyType } from "@/types/reminder";

class NotificationService {
  private timeouts: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    this.requestPermission();
  }

  async requestPermission() {
    if (!("Notification" in window)) {
      console.error("This browser does not support desktop notifications");
      return;
    }

    if (Notification.permission !== "granted") {
      await Notification.requestPermission();
    }
  }

  private calculateNextTrigger(frequency: FrequencyType): number {
    if (frequency.type === "oneTime") {
      return new Date(frequency.value).getTime() - Date.now();
    }

    // Handle recurring frequencies
    const value = frequency.value;
    let milliseconds = 0;

    switch (value) {
      case "30min":
        milliseconds = 30 * 1000; // Changed to 30 seconds for testing
        break;
      case "1h":
        milliseconds = 60 * 1000; // Changed to 1 minute for testing
        break;
      case "12h":
        milliseconds = 120 * 1000; // Changed to 2 minutes for testing
        break;
      case "24h":
        milliseconds = 180 * 1000; // Changed to 3 minutes for testing
        break;
      default:
        milliseconds = 30 * 1000; // Default to 30 seconds
    }

    return milliseconds;
  }

  private showNotification(reminder: Reminder) {
    if (Notification.permission === "granted") {
      new Notification(reminder.title, {
        body: reminder.description,
        icon: "/favicon.ico", // You can customize this
        silent: false
      });

      // If it's a recurring reminder, schedule the next one
      if (reminder.frequency.type === "recurring") {
        this.scheduleNotification(reminder);
      }
    }
  }

  scheduleNotification(reminder: Reminder) {
    // Clear existing timeout for this reminder if it exists
    if (this.timeouts.has(reminder.id)) {
      clearTimeout(this.timeouts.get(reminder.id));
    }

    const delay = this.calculateNextTrigger(reminder.frequency);
    const timeout = setTimeout(() => {
      this.showNotification(reminder);
    }, delay);

    this.timeouts.set(reminder.id, timeout);
  }

  clearNotification(reminderId: string) {
    if (this.timeouts.has(reminderId)) {
      clearTimeout(this.timeouts.get(reminderId));
      this.timeouts.delete(reminderId);
    }
  }

  clearAllNotifications() {
    this.timeouts.forEach(timeout => clearTimeout(timeout));
    this.timeouts.clear();
  }
}

// Create a singleton instance
const notificationService = new NotificationService();
export default notificationService;
