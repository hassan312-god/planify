export interface Appointment {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  category?: AppointmentCategory;
  priority?: AppointmentPriority;
  duration?: number; // in minutes
  location?: string;
  attendees?: string[];
  isRecurring?: boolean;
  recurringPattern?: RecurringPattern;
  createdAt: string;
  updatedAt: string;
}

export type AppointmentFormData = Omit<
  Appointment,
  'id' | 'createdAt' | 'updatedAt'
>;

export type AppointmentCategory =
  | 'meeting'
  | 'appointment'
  | 'reminder'
  | 'task'
  | 'event'
  | 'other';

export type AppointmentPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface RecurringPattern {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number; // every X days/weeks/months/years
  endDate?: string;
  daysOfWeek?: number[]; // 0-6 (Sunday-Saturday)
  dayOfMonth?: number; // 1-31
}

export interface AppointmentFilters {
  category?: AppointmentCategory;
  priority?: AppointmentPriority;
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
}

export interface AppointmentStats {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  byCategory: Record<AppointmentCategory, number>;
  byPriority: Record<AppointmentPriority, number>;
}
