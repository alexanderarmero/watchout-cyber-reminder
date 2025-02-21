
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Clock } from "lucide-react";

interface ReminderCardProps {
  title: string;
  description: string;
  frequency: string;
}

export const ReminderCard = ({ title, description, frequency }: ReminderCardProps) => {
  return (
    <Card className="bg-cyberpunk-dark border border-cyberpunk-purple/20 hover:border-cyberpunk-purple/40 transition-all duration-300 backdrop-blur-sm animate-fadeIn">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-cyberpunk-accent animate-glow" />
            {title}
          </CardTitle>
          <div className="flex items-center gap-2 text-cyberpunk-muted">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{frequency}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-cyberpunk-muted">{description}</CardDescription>
      </CardContent>
    </Card>
  );
};
