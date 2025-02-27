
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
    const loadedReminders = getReminders();
    setReminders(loadedReminders);
    
    const loadedSavedReminders = getReminderLibrary();
    setSavedReminders(loadedSavedReminders);
    
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

  const handleSaveToLibrary = async (id: string) => {
    const savedReminder = await saveReminderToLibrary(id);
    if (savedReminder) {
      setSavedReminders((prev) => [...prev, savedReminder]);
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
    await activateReminderFromLibrary(reminder);
    setReminders((prev) => {
      if (prev.some(r => r.id === reminder.id)) {
        return prev;
      }
      return [...prev, reminder];
    });
    notificationService.scheduleNotification(reminder);
    toast({
      title: "Reminder activated",
      description: "The saved reminder has been activated.",
    });
  };

  const handleGithubRedirect = () => {
    window.open("https://github.com/alexanderarmero/watchout-cyber-reminder", "_blank");
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
          
          {/* Github Button */}
          <div className="pt-4">
            <Button 
              onClick={handleGithubRedirect}
              className="bg-gradient-to-r from-cyberpunk-purple to-cyberpunk-accent hover:opacity-90 text-white"
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
                <h2 className="text-2xl font-semibold text-gray-800">Your Reminders</h2>
                <TabsList className="bg-cyberpunk-dark/20">
                  <TabsTrigger 
                    value="active"
                    className="data-[state=active]:bg-cyberpunk-purple data-[state=active]:text-white"
                  >
                    Active
                  </TabsTrigger>
                  <TabsTrigger 
                    value="saved"
                    className="data-[state=active]:bg-cyberpunk-purple data-[state=active]:text-white"
                  >
                    Saved Library
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="active" className="space-y-4 mt-0">
                {reminders.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
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
                  <div className="text-center text-gray-500 py-8">
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
