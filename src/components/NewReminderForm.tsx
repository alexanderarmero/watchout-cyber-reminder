
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const FREQUENCY_OPTIONS = [
  { value: "30min", label: "Every 30 minutes" },
  { value: "1h", label: "Every hour" },
  { value: "12h", label: "Every 12 hours" },
  { value: "24h", label: "Daily" },
  { value: "custom", label: "Custom time" },
];

export const NewReminderForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log({ title, description, frequency });
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

          <Button
            type="submit"
            className="w-full bg-cyberpunk-purple hover:bg-cyberpunk-purple/90 text-white"
          >
            Create Reminder
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
