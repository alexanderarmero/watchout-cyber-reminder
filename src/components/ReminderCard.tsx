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
  createdAt,
  onDelete, 
  onSaveToLibrary, 
  onActivate,
  isSavedView = false
}: ReminderCardProps) => {
  return (
    <Card className="bg-blue-50/50 border border-blue-100 hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-600" />
            {title}
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{frequency.label}</span>
            </div>
            <div className="flex gap-1">
              <Button
                onClick={() => onDelete(id)}
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 h-8"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              
              {!isSavedView ? (
                <Button
                  onClick={() => onSaveToLibrary?.(id)}
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-1 h-8"
                >
                  <BookmarkPlus className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={() => onActivate?.({id, title, description, frequency, createdAt})}
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-1 h-8"
                >
                  <Play className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-gray-600">{description}</CardDescription>
      </CardContent>
    </Card>
  );
};
