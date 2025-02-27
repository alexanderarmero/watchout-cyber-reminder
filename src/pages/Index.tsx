import { useState, useEffect } from "react";
import { ReminderCard } from "@/components/ReminderCard";
import { NewReminderForm } from "@/components/NewReminderForm";
import { 
  getReminders, 
  addReminder, 
  deleteReminder, 
  saveReminderToLibrary, 
  getReminderLibrary, 
  removeReminderFromLibrary,
  activateReminderFromLibrary 
} from "@/utils/reminderUtils";
import { Reminder } from "@/types/reminder";
import { useToast } from "@/components/ui/use-toast";
import notificationService from "@/utils/notificationService";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [savedReminders, setSavedReminders] = useState<Reminder[]>([]);
  const [activeTab, setActiveTab] = useState<string>("active");
  const { toast } = useToast();

  useEffect(() => {
    // Load reminders from storage
    const loadedReminders = getReminders();
    setReminders(loadedReminders);
    
    // Load saved reminders from storage
    const loadedSavedReminders = getReminderLibrary();
    setSavedReminders(loadedSavedReminders);
    
    // Clear any existing notifications first to prevent duplicates
    notificationService.clearAllNotifications();
    
    // Then schedule notifications for all active reminders
    loadedReminders.forEach(reminder => {
      notificationService.scheduleNotification(reminder);
    });
    
    console.log(`Loaded ${loadedReminders.length} active reminders and ${loadedSavedReminders.length} saved reminders`);

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
    // First clear the notification
    notificationService.clearNotification(id);
    
    // Then delete the reminder
    await deleteReminder(id);
    
    // Update the UI
    setReminders((prev) => prev.filter((reminder) => reminder.id !== id));
    
    toast({
      title: "Reminder deleted",
      description: "The reminder has been removed successfully.",
    });
    
    console.log(`Deleted reminder ID: ${id}`);
    console.log(`Active notifications after deletion: ${notificationService.getActiveNotificationIds().join(', ')}`);
  };

  const handleSaveToLibrary = async (id: string) => {
    const savedReminder = await saveReminderToLibrary(id);
    if (savedReminder) {
      setSavedReminders((prev) => {
        // Check if this reminder is already in the saved list
        if (prev.some(r => r.id === id)) {
          return prev;
        }
        return [...prev, savedReminder];
      });
      toast({
        title: "Reminder saved",
        description: "Your reminder has been saved to the library.",
      });
    }
  };

  const handleDeleteFromLibrary = async (id: string) => {
    await removeReminderFromLibrary(id);
    setSavedReminders((prev) => prev.filter((reminder) => reminder.id !== id));
    toast({
      title: "Removed from library",
      description: "The reminder has been removed from your library.",
    });
  };

  const handleActivateFromLibrary = async (reminder: Reminder) => {
    const activatedReminder = await activateReminderFromLibrary(reminder);
    
    // Update UI to include the activated reminder in the active list
    setReminders((prev) => {
      if (prev.some(r => r.id === reminder.id)) {
        return prev;
      }
      return [...prev, reminder];
    });
    
    // Schedule notification for the activated reminder
    notificationService.scheduleNotification(reminder);
    
    // Switch to the active tab
    setActiveTab("active");
    
    toast({
      title: "Reminder activated",
      description: "The saved reminder has been activated and scheduled.",
    });
    
    console.log(`Activated reminder: ${reminder.id} - ${reminder.title}`);
    console.log(`Active notifications: ${notificationService.getActiveNotificationIds().join(', ')}`);
  };

  const handleGithubRedirect = () => {
    window.open("https://github.com/alexanderarmero/watchout-cyber-reminder", "_blank");
  };

  return (
    <div className="relative min-h-screen bg-gray-50 text-gray-800 overflow-hidden">
      {/* Wave Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `url('data:image/svg+xml,${encodeURIComponent(`
            <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style="stop-color: #1e40af" />
                  <stop offset="100%" style="stop-color: #3b82f6" />
                </linearGradient>
              </defs>
              <path 
                fill="url(#wave-gradient)" 
                d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ></path>
              <path 
                fill="url(#wave-gradient)" 
                opacity="0.5"
                d="M0,256L48,245.3C96,235,192,213,288,192C384,171,480,149,576,165.3C672,181,768,235,864,234.7C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ></path>
              <path 
                fill="url(#wave-gradient)" 
                opacity="0.3"
                d="M0,128L48,154.7C96,181,192,235,288,234.7C384,235,480,181,576,181.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ></path>
            </svg>
          `)}')`,
          backgroundRepeat: 'repeat-x',
          backgroundPosition: 'bottom',
          backgroundSize: 'contain',
          transform: 'scale(1.2)',
          filter: 'blur(1px)'
        }}
      />

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: `url('data:image/svg+xml,${encodeURIComponent(`
            <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e40af" stroke-width="0.5"/>
              </pattern>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          `)}')`,
          backgroundRepeat: 'repeat'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto p-6 md:p-8 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-4 animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Course Correct
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Stay focused and productive with intelligent reminders that keep you on track. 
            Design personalized notifications that help you maintain efficiency and avoid 
            distractions in your workflow.
          </p>
          
          {/* Github Button - updating to match theme */}
          <div className="pt-4">
            <Button 
              onClick={handleGithubRedirect}
              className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-700"
            >
              <Github className="mr-2 h-4 w-4" />
              View on GitHub
            </Button>
          </div>
        </section>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Reminders List with Tabs */}
          <section className="space-y-6">
            <Tabs defaultValue="active" onValueChange={setActiveTab} value={activeTab}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-900">Your Reminders</h2>
                <TabsList className="bg-blue-50">
                  <TabsTrigger 
                    value="active"
                    className="data-[state=active]:bg-blue-500/10 data-[state=active]:text-blue-700"
                  >
                    Active
                  </TabsTrigger>
                  <TabsTrigger 
                    value="saved"
                    className="data-[state=active]:bg-blue-500/10 data-[state=active]:text-blue-700"
                  >
                    Saved Library
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="active" className="space-y-4 mt-0">
                {reminders.length === 0 ? (
                  <div className="text-center text-gray-500 py-8 bg-blue-50/50 rounded-lg shadow-sm border border-blue-100">
                    <p>No active reminders. Create one to get started!</p>
                  </div>
                ) : (
                  reminders.map((reminder) => (
                    <ReminderCard 
                      key={reminder.id} 
                      {...reminder} 
                      onDelete={handleDeleteReminder}
                      onSaveToLibrary={handleSaveToLibrary}
                    />
                  ))
                )}
              </TabsContent>
              
              <TabsContent value="saved" className="space-y-4 mt-0">
                {savedReminders.length === 0 ? (
                  <div className="text-center text-gray-500 py-8 bg-blue-50/50 rounded-lg shadow-sm border border-blue-100">
                    <p>No saved reminders in your library yet.</p>
                    <p className="mt-2">Click the bookmark icon on a reminder to save it here.</p>
                  </div>
                ) : (
                  savedReminders.map((reminder) => (
                    <ReminderCard 
                      key={reminder.id} 
                      {...reminder} 
                      onDelete={handleDeleteFromLibrary}
                      onActivate={handleActivateFromLibrary}
                      isSavedView={true}
                    />
                  ))
                )}
              </TabsContent>
            </Tabs>
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
