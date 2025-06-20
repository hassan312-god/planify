'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import {
  Appointment,
  AppointmentFormData,
  AppointmentFilters,
  AppointmentStats,
  AppointmentCategory,
  AppointmentPriority,
} from '@/types/appointment';
import { format, isToday, isThisWeek, isThisMonth, parseISO } from 'date-fns';
import toast from 'react-hot-toast';

type AppointmentContextType = {
  appointments: Appointment[];
  filteredAppointments: Appointment[];
  stats: AppointmentStats;
  filters: AppointmentFilters;
  addAppointment: (data: AppointmentFormData) => void;
  updateAppointment: (id: string, data: AppointmentFormData) => void;
  deleteAppointment: (id: string) => void;
  getAppointment: (id: string) => Appointment | undefined;
  setFilters: (filters: Partial<AppointmentFilters>) => void;
  clearFilters: () => void;
  getAppointmentsByDate: (date: string) => Appointment[];
  getUpcomingAppointments: (limit?: number) => Appointment[];
};

const AppointmentContext = createContext<AppointmentContextType | undefined>(
  undefined
);

const STORAGE_KEY = 'planify-appointments';

export function AppointmentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filters, setFiltersState] = useState<AppointmentFilters>({});

  // Load appointments from localStorage on initial render
  useEffect(() => {
    const savedAppointments = localStorage.getItem(STORAGE_KEY);
    if (savedAppointments) {
      try {
        const parsed = JSON.parse(savedAppointments);
        setAppointments(parsed);
      } catch (error) {
        console.error('Failed to parse appointments:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Save appointments to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
  }, [appointments]);

  // Filter appointments based on current filters
  const filteredAppointments = useMemo(() => {
    let filtered = [...appointments];

    if (filters.category) {
      filtered = filtered.filter(app => app.category === filters.category);
    }

    if (filters.priority) {
      filtered = filtered.filter(app => app.priority === filters.priority);
    }

    if (filters.dateRange) {
      filtered = filtered.filter(app => {
        const appDate = parseISO(app.date);
        const startDate = parseISO(filters.dateRange!.start);
        const endDate = parseISO(filters.dateRange!.end);
        return appDate >= startDate && appDate <= endDate;
      });
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        app =>
          app.title.toLowerCase().includes(searchLower) ||
          app.description.toLowerCase().includes(searchLower) ||
          app.location?.toLowerCase().includes(searchLower)
      );
    }

    return filtered.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA.getTime() - dateB.getTime();
    });
  }, [appointments, filters]);

  // Calculate stats
  const stats = useMemo((): AppointmentStats => {
    const now = new Date();
    const today = format(now, 'yyyy-MM-dd');

    const byCategory: Record<AppointmentCategory, number> = {
      meeting: 0,
      appointment: 0,
      reminder: 0,
      task: 0,
      event: 0,
      other: 0,
    };

    const byPriority: Record<AppointmentPriority, number> = {
      low: 0,
      medium: 0,
      high: 0,
      urgent: 0,
    };

    appointments.forEach(app => {
      if (app.category) byCategory[app.category]++;
      if (app.priority) byPriority[app.priority]++;
    });

    return {
      total: appointments.length,
      today: appointments.filter(app => app.date === today).length,
      thisWeek: appointments.filter(app => isThisWeek(parseISO(app.date)))
        .length,
      thisMonth: appointments.filter(app => isThisMonth(parseISO(app.date)))
        .length,
      byCategory,
      byPriority,
    };
  }, [appointments]);

  const addAppointment = useCallback((data: AppointmentFormData) => {
    const now = new Date().toISOString();
    const newAppointment: Appointment = {
      ...data,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now,
    };
    setAppointments(prev => [...prev, newAppointment]);
    toast.success('Appointment added successfully');
  }, []);

  const updateAppointment = useCallback(
    (id: string, data: AppointmentFormData) => {
      const now = new Date().toISOString();
      setAppointments(prev =>
        prev.map(appointment =>
          appointment.id === id
            ? { ...data, id, updatedAt: now, createdAt: appointment.createdAt }
            : appointment
        )
      );
      toast.success('Appointment updated successfully');
    },
    []
  );

  const deleteAppointment = useCallback((id: string) => {
    setAppointments(prev => prev.filter(appointment => appointment.id !== id));
    toast.success('Appointment deleted successfully');
  }, []);

  const getAppointment = useCallback(
    (id: string) => {
      return appointments.find(appointment => appointment.id === id);
    },
    [appointments]
  );

  const setFilters = useCallback((newFilters: Partial<AppointmentFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFiltersState({});
  }, []);

  const getAppointmentsByDate = useCallback(
    (date: string) => {
      return appointments.filter(app => app.date === date);
    },
    [appointments]
  );

  const getUpcomingAppointments = useCallback(
    (limit = 5) => {
      const now = new Date();
      return appointments
        .filter(app => {
          const appDateTime = new Date(`${app.date}T${app.time}`);
          return appDateTime > now;
        })
        .sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.time}`);
          const dateB = new Date(`${b.date}T${b.time}`);
          return dateA.getTime() - dateB.getTime();
        })
        .slice(0, limit);
    },
    [appointments]
  );

  const value = {
    appointments,
    filteredAppointments,
    stats,
    filters,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    getAppointment,
    setFilters,
    clearFilters,
    getAppointmentsByDate,
    getUpcomingAppointments,
  };

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
}

export function useAppointments() {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error(
      'useAppointments must be used within an AppointmentProvider'
    );
  }
  return context;
}
