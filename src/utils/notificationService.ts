
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
        milliseconds = 30 * 60 * 1000; // 30 minutes
        break;
      case "1h":
        milliseconds = 60 * 60 * 1000; // 1 hour
        break;
      case "12h":
        milliseconds = 12 * 60 * 60 * 1000; // 12 hours
        break;
      case "24h":
        milliseconds = 24 * 60 * 60 * 1000; // 24 hours
        break;
      default:
        milliseconds = 30 * 60 * 1000; // Default to 30 minutes
    }

    return milliseconds;
  }

  private showNotification(reminder: Reminder) {
    if (Notification.permission === "granted") {
      console.log(`Showing notification for reminder: ${reminder.title}`);
      new Notification(reminder.title, {
        body: reminder.description,
        icon: "/favicon.ico",
        silent: false,
        requireInteraction: true // Makes the notification stay until user interacts with it
      });

      // If it's a recurring reminder, schedule the next one
      if (reminder.frequency.type === "recurring") {
        console.log(`Scheduling next notification for recurring reminder: ${reminder.title}`);
        this.scheduleNotification(reminder);
      }
    } else {
      console.warn("Notification permission not granted");
    }
  }

  scheduleNotification(reminder: Reminder) {
    // Clear existing timeout for this reminder if it exists
    if (this.timeouts.has(reminder.id)) {
      clearTimeout(this.timeouts.get(reminder.id));
    }

    const delay = this.calculateNextTrigger(reminder.frequency);
    console.log(`Scheduling notification for "${reminder.title}" in ${delay/1000} seconds`);

    // Don't schedule if delay is negative (past time for one-time reminders)
    if (delay < 0 && reminder.frequency.type === "oneTime") {
      console.warn(`Skipping past-due one-time reminder: ${reminder.title}`);
      return;
    }

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
