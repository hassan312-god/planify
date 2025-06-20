'use client';

import { useState, useEffect } from 'react';
import { useAppointments } from '@/context/AppointmentContext';
import {
  AppointmentFormData,
  AppointmentCategory,
  AppointmentPriority,
} from '@/types/appointment';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Tag,
  AlertTriangle,
  Repeat,
  FileText,
} from 'lucide-react';

interface AppointmentFormProps {
  appointmentId?: string;
  onClose: () => void;
}

const categoryOptions = [
  { value: 'meeting', label: 'Meeting', icon: Users },
  { value: 'appointment', label: 'Appointment', icon: Calendar },
  { value: 'reminder', label: 'Reminder', icon: AlertTriangle },
  { value: 'task', label: 'Task', icon: FileText },
  { value: 'event', label: 'Event', icon: Calendar },
  { value: 'other', label: 'Other', icon: Tag },
];

const priorityOptions = [
  { value: 'low', label: 'Low', color: 'text-green-600' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
  { value: 'high', label: 'High', color: 'text-orange-600' },
  { value: 'urgent', label: 'Urgent', color: 'text-red-600' },
];

export function AppointmentForm({
  appointmentId,
  onClose,
}: AppointmentFormProps) {
  const { addAppointment, updateAppointment, getAppointment } =
    useAppointments();
  const [formData, setFormData] = useState<AppointmentFormData>({
    title: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: format(new Date(), 'HH:mm'),
    description: '',
    category: 'appointment',
    priority: 'medium',
    duration: 60,
    location: '',
    attendees: [],
    isRecurring: false,
  });

  const [attendeeInput, setAttendeeInput] = useState('');
  const isEditMode = !!appointmentId;

  useEffect(() => {
    if (appointmentId) {
      const appointment = getAppointment(appointmentId);
      if (appointment) {
        setFormData({
          title: appointment.title,
          date: appointment.date,
          time: appointment.time,
          description: appointment.description,
          category: appointment.category || 'appointment',
          priority: appointment.priority || 'medium',
          duration: appointment.duration || 60,
          location: appointment.location || '',
          attendees: appointment.attendees || [],
          isRecurring: appointment.isRecurring || false,
          recurringPattern: appointment.recurringPattern,
        });
      }
    }
  }, [appointmentId, getAppointment]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAttendeeAdd = () => {
    if (
      attendeeInput.trim() &&
      !formData.attendees?.includes(attendeeInput.trim())
    ) {
      setFormData(prev => ({
        ...prev,
        attendees: [...(prev.attendees || []), attendeeInput.trim()],
      }));
      setAttendeeInput('');
    }
  };

  const handleAttendeeRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attendees: prev.attendees?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode && appointmentId) {
      updateAppointment(appointmentId, formData);
    } else {
      addAppointment(formData);
    }
    onClose();
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      onSubmit={handleSubmit}
      className='space-y-6'
    >
      {/* Title */}
      <div>
        <label htmlFor='title' className='block text-sm font-medium mb-2'>
          Title *
        </label>
        <input
          type='text'
          id='title'
          name='title'
          value={formData.title}
          onChange={handleChange}
          required
          className='input w-full'
          placeholder='Enter appointment title'
        />
      </div>

      {/* Date and Time */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div>
          <label htmlFor='date' className='block text-sm font-medium mb-2'>
            <Calendar className='inline w-4 h-4 mr-1' />
            Date *
          </label>
          <input
            type='date'
            id='date'
            name='date'
            value={formData.date}
            onChange={handleChange}
            required
            className='input'
          />
        </div>
        <div>
          <label htmlFor='time' className='block text-sm font-medium mb-2'>
            <Clock className='inline w-4 h-4 mr-1' />
            Time *
          </label>
          <input
            type='time'
            id='time'
            name='time'
            value={formData.time}
            onChange={handleChange}
            required
            className='input'
          />
        </div>
        <div>
          <label htmlFor='duration' className='block text-sm font-medium mb-2'>
            Duration (min)
          </label>
          <input
            type='number'
            id='duration'
            name='duration'
            value={formData.duration}
            onChange={handleChange}
            min='15'
            step='15'
            className='input'
          />
        </div>
      </div>

      {/* Category and Priority */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <label htmlFor='category' className='block text-sm font-medium mb-2'>
            Category
          </label>
          <select
            id='category'
            name='category'
            value={formData.category}
            onChange={handleChange}
            className='input'
          >
            {categoryOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor='priority' className='block text-sm font-medium mb-2'>
            Priority
          </label>
          <select
            id='priority'
            name='priority'
            value={formData.priority}
            onChange={handleChange}
            className='input'
          >
            {priorityOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Location */}
      <div>
        <label htmlFor='location' className='block text-sm font-medium mb-2'>
          <MapPin className='inline w-4 h-4 mr-1' />
          Location
        </label>
        <input
          type='text'
          id='location'
          name='location'
          value={formData.location}
          onChange={handleChange}
          className='input'
          placeholder='Enter location or meeting link'
        />
      </div>

      {/* Attendees */}
      <div>
        <label className='block text-sm font-medium mb-2'>
          <Users className='inline w-4 h-4 mr-1' />
          Attendees
        </label>
        <div className='flex gap-2 mb-2'>
          <input
            type='text'
            value={attendeeInput}
            onChange={e => setAttendeeInput(e.target.value)}
            onKeyPress={e =>
              e.key === 'Enter' && (e.preventDefault(), handleAttendeeAdd())
            }
            className='input flex-1'
            placeholder='Add attendee email or name'
          />
          <button
            type='button'
            onClick={handleAttendeeAdd}
            className='btn btn-secondary'
          >
            Add
          </button>
        </div>
        {formData.attendees && formData.attendees.length > 0 && (
          <div className='flex flex-wrap gap-2'>
            {formData.attendees.map((attendee, index) => (
              <span
                key={index}
                className='inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              >
                {attendee}
                <button
                  type='button'
                  onClick={() => handleAttendeeRemove(index)}
                  className='ml-1 text-blue-600 hover:text-blue-800'
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor='description' className='block text-sm font-medium mb-2'>
          <FileText className='inline w-4 h-4 mr-1' />
          Description
        </label>
        <textarea
          id='description'
          name='description'
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className='input'
          placeholder='Add details about your appointment'
        />
      </div>

      {/* Recurring */}
      <div className='flex items-center space-x-2'>
        <input
          type='checkbox'
          id='isRecurring'
          name='isRecurring'
          checked={formData.isRecurring}
          onChange={e =>
            setFormData(prev => ({ ...prev, isRecurring: e.target.checked }))
          }
          className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
        />
        <label htmlFor='isRecurring' className='text-sm font-medium'>
          <Repeat className='inline w-4 h-4 mr-1' />
          Recurring appointment
        </label>
      </div>

      {/* Form Actions */}
      <div className='flex justify-end space-x-3 pt-4'>
        <button type='button' onClick={onClose} className='btn btn-secondary'>
          Cancel
        </button>
        <button type='submit' className='btn btn-primary'>
          {isEditMode ? 'Update' : 'Add'} Appointment
        </button>
      </div>
    </motion.form>
  );
}
