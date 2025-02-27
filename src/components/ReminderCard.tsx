
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Clock, Trash2, BookmarkPlus, Play } from "lucide-react";
import { Reminder } from "@/types/reminder";
import { Button } from "@/components/ui/button";

interface ReminderCardProps extends Reminder {
  onDelete: (id: string) => void;
  onSaveToLibrary?: (id: string) => void;
  onActivate?: (reminder: Reminder) => void;
  isSavedView?: boolean;
}

export const ReminderCard = ({ 
  id, 
  title, 
  description, 
  frequency, 
  onDelete, 
  onSaveToLibrary, 
  onActivate,
  isSavedView = false
}: ReminderCardProps) => {
  return (
    <Card className="bg-cyberpunk-dark/80 border-2 border-black hover:border-cyberpunk-purple/40 transition-all duration-300 backdrop-blur-sm animate-fadeIn">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-cyberpunk-accent animate-glow" />
            {title}
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-cyberpunk-muted">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{frequency.label}</span>
            </div>
            {isSavedView ? (
              <Button 
                variant="ghost"
                size="sm"
                onClick={() => onActivate && onActivate({id, title, description, frequency, createdAt})}
                className="text-cyberpunk-accent hover:text-cyberpunk-accent/80 transition-colors p-1 h-8"
              >
                <Play className="w-4 h-4" />
              </Button>
            ) : (
              <Button 
                variant="ghost"
                size="sm"
                onClick={() => onSaveToLibrary && onSaveToLibrary(id)}
                className="text-cyberpunk-accent hover:text-cyberpunk-accent/80 transition-colors p-1 h-8"
              >
                <BookmarkPlus className="w-4 h-4" />
              </Button>
            )}
            <button 
              onClick={() => onDelete(id)}
              className="text-cyberpunk-muted hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-cyberpunk-muted">{description}</CardDescription>
      </CardContent>
    </Card>
  );
};
