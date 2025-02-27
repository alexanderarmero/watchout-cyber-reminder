import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Reminder } from "@/types/reminder";

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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    onValueChange={(value) => {
                      const [type, val] = value.split(":");
                      const label = {
                        "30s": "Every 30 seconds",
                        "60s": "Every minute",
                        "30min": "Every 30 minutes",
                        "1h": "Every hour",
                        "12h": "Every 12 hours",
                        "24h": "Every 24 hours",
                      }[val] || "Custom time";

                      field.onChange({
                        type,
                        value: val,
                        label,
                      });
                    }}
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
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

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
