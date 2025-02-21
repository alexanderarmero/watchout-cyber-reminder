
import { Reminder } from "@/types/reminder";
import remindersData from "@/data/reminders.json";

export const getReminders = (): Reminder[] => {
  return remindersData.reminders;
};

export const addReminder = async (reminder: Omit<Reminder, "id" | "createdAt">) => {
  const newReminder: Reminder = {
    ...reminder,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  
  remindersData.reminders.push(newReminder);
  return newReminder;
};

export const deleteReminder = async (id: string) => {
  const index = remindersData.reminders.findIndex((reminder) => reminder.id === id);
  if (index !== -1) {
    remindersData.reminders.splice(index, 1);
  }
};
