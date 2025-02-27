
import { Reminder, FrequencyType } from "@/types/reminder";
import { deleteReminder } from "./reminderUtils";

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
      const targetTime = new Date(frequency.value).getTime();
      const currentTime = Date.now();
      return Math.max(0, targetTime - currentTime); // Ensure non-negative delay
    }

    // Handle recurring frequencies
    const value = frequency.value;
    let milliseconds = 0;

    switch (value) {
      case "30s":
        milliseconds = 30 * 1000; // 30 seconds
        break;
      case "60s":
        milliseconds = 60 * 1000; // 60 seconds
        break;
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
        milliseconds = 30 * 1000; // Default to 30 seconds
    }

    return milliseconds;
  }

  private async showNotification(reminder: Reminder) {
    if (Notification.permission === "granted") {
      console.log(`Showing notification for reminder: ${reminder.title}`);
      new Notification(reminder.title, {
        body: reminder.description,
        icon: "/favicon.ico",
        silent: false,
        requireInteraction: true // Makes the notification stay until user interacts with it
      });

      // If it's a one-time reminder, delete it after it's shown
      if (reminder.frequency.type === "oneTime") {
        console.log(`One-time reminder triggered: ${reminder.title}. Deleting...`);
        // Remove it from our tracking
        this.clearNotification(reminder.id);
        // Delete from storage and state
        await deleteReminder(reminder.id);
        // Refresh the page to update UI
        window.location.reload();
      } else if (reminder.frequency.type === "recurring") {
        // If it's a recurring reminder, schedule the next one
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
    
    // Don't schedule if delay is negative (past time for one-time reminders)
    if (delay <= 0 && reminder.frequency.type === "oneTime") {
      console.warn(`Skipping past-due one-time reminder: ${reminder.title}`);
      return;
    }

    console.log(`Scheduling notification for "${reminder.title}" in ${Math.floor(delay/1000)} seconds (${reminder.frequency.type})`);

    const timeout = setTimeout(() => {
      this.showNotification(reminder);
    }, delay);

    this.timeouts.set(reminder.id, timeout);
  }

  clearNotification(reminderId: string) {
    if (this.timeouts.has(reminderId)) {
      clearTimeout(this.timeouts.get(reminderId));
      this.timeouts.delete(reminderId);
      console.log(`Cleared notification for reminder ID: ${reminderId}`);
    }
  }

  clearAllNotifications() {
    this.timeouts.forEach(timeout => clearTimeout(timeout));
    this.timeouts.clear();
    console.log("Cleared all notifications");
  }
  
  // Return all active notification IDs (for debugging)
  getActiveNotificationIds() {
    return Array.from(this.timeouts.keys());
  }
}

// Create a singleton instance
const notificationService = new NotificationService();
export default notificationService;
