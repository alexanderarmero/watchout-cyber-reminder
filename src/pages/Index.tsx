
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

  useEffect(() => {
    const loadedReminders = getReminders();
    setReminders(loadedReminders);
    
    loadedReminders.forEach(reminder => {
      notificationService.scheduleNotification(reminder);
    });

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
    <div className="relative min-h-screen bg-[#F1F0FB] text-gray-800">
      {/* Background Image */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `url('data:image/svg+xml,${encodeURIComponent(`
            <svg width="800" height="600" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
              <!-- Barrel 1 -->
              <g transform="translate(300,250)">
                <rect x="-40" y="-60" width="80" height="120" rx="10" fill="#333"/>
                <rect x="-35" y="-55" width="70" height="110" rx="8" fill="#444"/>
                <path d="M-30 -20 L30 -20 L20 40 L-20 40 Z" fill="#39FF14"/>
                <circle cx="0" cy="-40" r="15" fill="#39FF14">
                  <animate attributeName="r" values="15;17;15" dur="2s" repeatCount="indefinite"/>
                </circle>
              </g>
              <!-- Barrel 2 -->
              <g transform="translate(450,300)">
                <rect x="-40" y="-60" width="80" height="120" rx="10" fill="#333"/>
                <rect x="-35" y="-55" width="70" height="110" rx="8" fill="#444"/>
                <path d="M-30 -20 L30 -20 L20 40 L-20 40 Z" fill="#39FF14"/>
                <circle cx="0" cy="-40" r="15" fill="#39FF14">
                  <animate attributeName="r" values="15;17;15" dur="2.5s" repeatCount="indefinite"/>
                </circle>
              </g>
              <!-- Barrel 3 -->
              <g transform="translate(375,350)">
                <rect x="-40" y="-60" width="80" height="120" rx="10" fill="#333"/>
                <rect x="-35" y="-55" width="70" height="110" rx="8" fill="#444"/>
                <path d="M-30 -20 L30 -20 L20 40 L-20 40 Z" fill="#39FF14"/>
                <circle cx="0" cy="-40" r="15" fill="#39FF14">
                  <animate attributeName="r" values="15;17;15" dur="1.8s" repeatCount="indefinite"/>
                </circle>
              </g>
            </svg>
          `)}')`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'contain'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto p-6 md:p-8 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-4 animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyberpunk-purple to-cyberpunk-accent">
            Welcome to WatchOut
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Stay focused and productive with intelligent reminders that keep you on track. 
            Design personalized notifications that help you maintain efficiency and avoid 
            distractions in your workflow.
          </p>
        </section>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Reminders List */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Your Reminders</h2>
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
