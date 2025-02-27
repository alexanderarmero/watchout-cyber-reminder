
export type FrequencyType = {
  type: 'recurring' | 'oneTime';
  value: string; // "30s" | "1h" | "12h" | "24h" | ISO string for custom
  label: string; // Human readable format
};

export type Reminder = {
  id: string;
  title: string;
  description: string;
  frequency: FrequencyType;
  createdAt: string;
};
