
import { Reminder } from "@/types/reminder";

// In-memory storage for reminders
let reminders: Reminder[] = [
  {
    id: "1",
    title: "Take a Break",
    description: "Step away from AI tools and solve the problem with your expertise",
    frequency: {
      type: "recurring",
      value: "30s",
      label: "Every 30 seconds"
    },
    createdAt: "2024-03-20T10:00:00.000Z"
  },
  {
    id: "2",
    title: "Code Review",
    description: "Review your recent code changes with a fresh perspective",
    frequency: {
      type: "recurring",
      value: "60s",
      label: "Every 60 seconds"
    },
    createdAt: "2024-03-20T10:00:00.000Z"
  }
];

export const getReminders = (): Reminder[] => {
  return reminders;
};

export const addReminder = async (reminder: Omit<Reminder, "id" | "createdAt">) => {
  const newReminder: Reminder = {
    ...reminder,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  
  reminders = [...reminders, newReminder];
  return newReminder;
};

export const deleteReminder = async (id: string) => {
  reminders = reminders.filter(reminder => reminder.id !== id);
};
