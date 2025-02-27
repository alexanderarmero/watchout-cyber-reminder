
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

// Load reminders from localStorage
const loadRemindersFromStorage = (): Reminder[] => {
  try {
    const savedReminders = localStorage.getItem('reminders');
    return savedReminders ? JSON.parse(savedReminders) : reminders;
  } catch (error) {
    console.error('Failed to load reminders from storage:', error);
    return reminders;
  }
};

// Save reminders to localStorage
const saveRemindersToStorage = (updatedReminders: Reminder[]): void => {
  try {
    localStorage.setItem('reminders', JSON.stringify(updatedReminders));
  } catch (error) {
    console.error('Failed to save reminders to storage:', error);
  }
};

// Library storage for saved reminders
let reminderLibrary: Reminder[] = [];

// Load reminder library from localStorage
const loadReminderLibraryFromStorage = (): Reminder[] => {
  try {
    const savedLibrary = localStorage.getItem('reminderLibrary');
    return savedLibrary ? JSON.parse(savedLibrary) : [];
  } catch (error) {
    console.error('Failed to load reminder library from storage:', error);
    return [];
  }
};

// Save reminder library to localStorage
const saveReminderLibraryToStorage = (updatedLibrary: Reminder[]): void => {
  try {
    localStorage.setItem('reminderLibrary', JSON.stringify(updatedLibrary));
  } catch (error) {
    console.error('Failed to save reminder library to storage:', error);
  }
};

// Initialize reminders and library from localStorage
reminders = loadRemindersFromStorage();
reminderLibrary = loadReminderLibraryFromStorage();

export const getReminders = (): Reminder[] => {
  return reminders;
};

export const getReminderLibrary = (): Reminder[] => {
  return reminderLibrary;
};

export const addReminder = async (reminder: Omit<Reminder, "id" | "createdAt">) => {
  const newReminder: Reminder = {
    ...reminder,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  
  reminders = [...reminders, newReminder];
  saveRemindersToStorage(reminders);
  return newReminder;
};

export const deleteReminder = async (id: string) => {
  // Make sure the reminder is fully removed from memory
  reminders = reminders.filter(reminder => reminder.id !== id);
  
  // Make sure to save the updated reminders to localStorage
  saveRemindersToStorage(reminders);
  
  console.log(`Deleted reminder ID: ${id}, remaining reminders: ${reminders.length}`);
};

export const saveReminderToLibrary = async (reminderId: string) => {
  const reminderToSave = reminders.find(r => r.id === reminderId);
  
  if (reminderToSave) {
    // Check if this reminder is already in the library
    const isAlreadySaved = reminderLibrary.some(r => r.id === reminderId);
    
    if (!isAlreadySaved) {
      reminderLibrary = [...reminderLibrary, reminderToSave];
      saveReminderLibraryToStorage(reminderLibrary);
    }
    
    return reminderToSave;
  }
  
  return null;
};

export const activateReminderFromLibrary = async (reminderFromLibrary: Reminder) => {
  // Check if this reminder is already active
  const isAlreadyActive = reminders.some(r => r.id === reminderFromLibrary.id);
  
  if (!isAlreadyActive) {
    reminders = [...reminders, reminderFromLibrary];
    saveRemindersToStorage(reminders);
  }
  
  return reminderFromLibrary;
};

export const removeReminderFromLibrary = async (id: string) => {
  reminderLibrary = reminderLibrary.filter(reminder => reminder.id !== id);
  saveReminderLibraryToStorage(reminderLibrary);
};
