
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Reminder } from "@/types/reminder";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  frequency: z.object({
    type: z.enum(["oneTime", "recurring"]),
    value: z.string(),
    label: z.string(),
  }),
});

interface NewReminderFormProps {
  onSubmit: (data: Pick<Reminder, "title" | "description" | "frequency">) => void;
}

export function NewReminderForm({ onSubmit }: NewReminderFormProps) {
  const [frequencyType, setFrequencyType] = useState<"recurring" | "oneTime">("recurring");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<string>("12:00");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      frequency: {
        type: "recurring",
        value: "30s",
        label: "Every 30 seconds",
      },
    },
  });

  const handleFrequencyChange = (value: string) => {
    const [type, val] = value.split(":");
    
    if (type === "oneTime" && val === "custom") {
      // For custom date/time
      setFrequencyType("oneTime");
      const selectedDateTime = combineDateTime();
      const formattedDate = format(selectedDateTime, "PPP");
      const formattedTime = format(selectedDateTime, "p");
      
      form.setValue("frequency", {
        type: "oneTime",
        value: selectedDateTime.toISOString(),
        label: `${formattedDate} at ${formattedTime}`,
      });
    } else {
      // For recurring frequencies
      setFrequencyType("recurring");
      const label = {
        "30s": "Every 30 seconds",
        "60s": "Every minute",
        "30min": "Every 30 minutes",
        "1h": "Every hour",
        "12h": "Every 12 hours",
        "24h": "Every 24 hours",
      }[val] || "Custom time";

      form.setValue("frequency", {
        type: "recurring",
        value: val,
        label,
      });
    }
  };

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    updateCustomDateTime(newDate, time);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTime(newTime);
    updateCustomDateTime(date, newTime);
  };

  const updateCustomDateTime = (selectedDate?: Date, selectedTime?: string) => {
    if (selectedDate && selectedTime) {
      const dateTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':').map(Number);
      dateTime.setHours(hours, minutes, 0, 0);
      
      const formattedDate = format(dateTime, "PPP");
      const formattedTime = format(dateTime, "p");
      
      form.setValue("frequency", {
        type: "oneTime",
        value: dateTime.toISOString(),
        label: `${formattedDate} at ${formattedTime}`,
      });
    }
  };

  const combineDateTime = (): Date => {
    const combined = new Date(date || new Date());
    const [hours, minutes] = time.split(':').map(Number);
    combined.setHours(hours, minutes, 0, 0);
    return combined;
  };

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    // If it's a custom date/time, make sure we have the latest values
    if (frequencyType === "oneTime" && values.frequency.value.includes("custom")) {
      const selectedDateTime = combineDateTime();
      values.frequency.value = selectedDateTime.toISOString();
      
      const formattedDate = format(selectedDateTime, "PPP");
      const formattedTime = format(selectedDateTime, "p");
      values.frequency.label = `${formattedDate} at ${formattedTime}`;
    }
    
    onSubmit(values);
    
    // Reset the form
    form.reset({
      title: "",
      description: "",
      frequency: {
        type: "recurring",
        value: "30s",
        label: "Every 30 seconds",
      },
    });
    setFrequencyType("recurring");
    setDate(new Date());
    setTime("12:00");
  };

  return (
    <Card className="bg-blue-50/50 border border-blue-100 hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Create New Reminder</CardTitle>
        <CardDescription className="text-gray-600">
          Set up a new reminder with custom timing.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter reminder title" 
                      {...field} 
                      className="bg-white border-blue-100 focus:border-blue-200 focus:ring-blue-100"
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Description</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter reminder description" 
                      {...field} 
                      className="bg-white border-blue-100 focus:border-blue-200 focus:ring-blue-100"
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Frequency</FormLabel>
                  <Select
                    onValueChange={handleFrequencyChange}
                    defaultValue="recurring:30s"
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white border-blue-100 focus:border-blue-200 focus:ring-blue-100">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="recurring:30s">Every 30 seconds</SelectItem>
                      <SelectItem value="recurring:60s">Every minute</SelectItem>
                      <SelectItem value="recurring:30min">Every 30 minutes</SelectItem>
                      <SelectItem value="recurring:1h">Every hour</SelectItem>
                      <SelectItem value="recurring:12h">Every 12 hours</SelectItem>
                      <SelectItem value="recurring:24h">Every 24 hours</SelectItem>
                      <SelectItem value="oneTime:custom">Custom date & time</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            {frequencyType === "oneTime" && (
              <div className="grid gap-4">
                <div>
                  <FormLabel className="text-gray-700">Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal bg-white border-blue-100",
                          !date && "text-muted-foreground"
                        )}
                      >
                        {date ? format(date, "PPP") : "Select date"}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleDateChange}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div>
                  <FormLabel className="text-gray-700">Time</FormLabel>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <Input
                      type="time"
                      value={time}
                      onChange={handleTimeChange}
                      className="bg-white border-blue-100 focus:border-blue-200 focus:ring-blue-100"
                    />
                  </div>
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-700"
            >
              Create Reminder
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
