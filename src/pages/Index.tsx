
import { useState, useEffect } from "react";
import { ReminderCard } from "@/components/ReminderCard";
import { NewReminderForm } from "@/components/NewReminderForm";
import { getReminders, addReminder, deleteReminder } from "@/utils/reminderUtils";
import { Reminder } from "@/types/reminder";
import { useToast } from "@/components/ui/use-toast";
import notificationService from "@/utils/notificationService";

const Index = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const { toast } = useToast();

  // Initialize notifications for existing reminders
  useEffect(() => {
    const loadedReminders = getReminders();
    setReminders(loadedReminders);
    
    // Schedule notifications for all existing reminders
    loadedReminders.forEach(reminder => {
      notificationService.scheduleNotification(reminder);
    });

    // Cleanup on unmount
    return () => {
      notificationService.clearAllNotifications();
    };
  }, []);

  const handleAddReminder = async (data: { title: string; description: string; frequency: Reminder["frequency"] }) => {
    const newReminder = await addReminder(data);
    setReminders((prev) => [...prev, newReminder]);
    notificationService.scheduleNotification(newReminder);
    toast({
      title: "Reminder created",
      description: "Your new reminder has been added successfully.",
    });
  };

  const handleDeleteReminder = async (id: string) => {
    await deleteReminder(id);
    notificationService.clearNotification(id);
    setReminders((prev) => prev.filter((reminder) => reminder.id !== id));
    toast({
      title: "Reminder deleted",
      description: "The reminder has been removed successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-cyberpunk-dark text-white p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-4 animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyberpunk-purple to-cyberpunk-accent">
            Welcome to WatchOut
          </h1>
          <p className="text-lg md:text-xl text-cyberpunk-muted max-w-3xl mx-auto">
            Stay focused and productive with intelligent reminders that keep you on track. 
            Design personalized notifications that help you maintain efficiency and avoid 
            distractions in your workflow.
          </p>
        </section>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Reminders List */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold">Your Reminders</h2>
            <div className="space-y-4">
              {reminders.map((reminder) => (
                <ReminderCard 
                  key={reminder.id} 
                  {...reminder} 
                  onDelete={handleDeleteReminder}
                />
              ))}
            </div>
          </section>

          {/* New Reminder Form */}
          <section>
            <NewReminderForm onSubmit={handleAddReminder} />
          </section>
        </div>
      </div>
    </div>
  );
};

export default Index;
