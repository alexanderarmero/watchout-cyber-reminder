
import { ReminderCard } from "@/components/ReminderCard";
import { NewReminderForm } from "@/components/NewReminderForm";

// Example reminders (will be replaced with real data later)
const EXAMPLE_REMINDERS = [
  {
    title: "Take a Break",
    description: "Step away from AI tools and solve the problem with your expertise",
    frequency: "Every 30 minutes",
  },
  {
    title: "Code Review",
    description: "Review your recent code changes with a fresh perspective",
    frequency: "Daily",
  },
];

const Index = () => {
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
              {EXAMPLE_REMINDERS.map((reminder, index) => (
                <ReminderCard key={index} {...reminder} />
              ))}
            </div>
          </section>

          {/* New Reminder Form */}
          <section>
            <NewReminderForm />
          </section>
        </div>
      </div>
    </div>
  );
};

export default Index;
