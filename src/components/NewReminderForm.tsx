
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FrequencyType } from "@/types/reminder";

const FREQUENCY_OPTIONS: { value: string; label: string; type: 'recurring' | 'oneTime' }[] = [
  { value: "30min", label: "Every 30 minutes", type: "recurring" },
  { value: "1h", label: "Every hour", type: "recurring" },
  { value: "12h", label: "Every 12 hours", type: "recurring" },
  { value: "24h", label: "Daily", type: "recurring" },
  { value: "custom", label: "Custom time", type: "oneTime" },
];

interface NewReminderFormProps {
  onSubmit: (data: { title: string; description: string; frequency: FrequencyType }) => void;
}

export const NewReminderForm = ({ onSubmit }: NewReminderFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState("");
  const [customDateTime, setCustomDateTime] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedFrequency = FREQUENCY_OPTIONS.find((option) => option.value === frequency);
    if (selectedFrequency && title && description) {
      onSubmit({
        title,
        description,
        frequency: {
          type: selectedFrequency.type,
          value: selectedFrequency.type === "oneTime" ? customDateTime : selectedFrequency.value,
          label: selectedFrequency.type === "oneTime" 
            ? `One time at ${new Date(customDateTime).toLocaleString()}`
            : selectedFrequency.label,
        },
      });
      setTitle("");
      setDescription("");
      setFrequency("");
      setCustomDateTime("");
    }
  };

  return (
    <Card className="bg-cyberpunk-dark border border-cyberpunk-purple/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-white">Create New Reminder</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-cyberpunk-dark border-cyberpunk-purple/30 text-white"
              placeholder="Enter reminder title"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-cyberpunk-dark border-cyberpunk-purple/30 text-white"
              placeholder="Enter reminder description"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency" className="text-white">Frequency</Label>
            <Select onValueChange={setFrequency} value={frequency}>
              <SelectTrigger className="bg-cyberpunk-dark border-cyberpunk-purple/30 text-white">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent className="bg-cyberpunk-dark border-cyberpunk-purple/30">
                {FREQUENCY_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="text-white hover:bg-cyberpunk-purple/20"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {frequency === "custom" && (
            <div className="space-y-2">
              <Label htmlFor="customDateTime" className="text-white">Reminder Date & Time</Label>
              <Input
                id="customDateTime"
                type="datetime-local"
                value={customDateTime}
                onChange={(e) => setCustomDateTime(e.target.value)}
                className="bg-cyberpunk-dark border-cyberpunk-purple/30 text-white"
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-cyberpunk-purple hover:bg-cyberpunk-purple/90 text-white"
            disabled={!title || !description || !frequency || (frequency === "custom" && !customDateTime)}
          >
            Create Reminder
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
