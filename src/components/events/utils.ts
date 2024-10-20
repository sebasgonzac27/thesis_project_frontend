import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { getEvents, deleteEvent, getLocation, getUser, getTeam } from '@/services';
import { EventWithDetails, CalendarDay } from '@/models';


export function useCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const changeMonth = (increment: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1));
  };

  const resetToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  return {
    currentDate,
    selectedDate,
    setSelectedDate,
    changeMonth,
    resetToToday,
  };
}


export function useEvents() {
  const [events, setEvents] = useState<EventWithDetails[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
      fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const response = await getEvents();
    const data = response.data;

    const eventsWithDetails = await Promise.all(
      data.map(async event => {
        const location = await getLocation(event.location_id);
        const organizer = await getUser(event.organizer_id);
        const team = await getTeam(event.team_id);
        const { location_id, organizer_id, team_id, ...rest } = event;
        return { ...rest, location, organizer, team };
      })
    );
    setEvents(eventsWithDetails);
  };

  const handleDeleteEvent = async (eventId: number) => {
    try {
      await deleteEvent(eventId);
      toast.success('Evento eliminado con éxito');
      await fetchEvents();
      const remainingEvents = events.filter(event => event.id !== eventId);
      if (remainingEvents.length === 0) {
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Hubo un error al intentar eliminar el evento');
    }
  };

  return {
    events,
    isDialogOpen,
    setIsDialogOpen,
    handleDeleteEvent,
    fetchEvents,
  };
}


export const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
export const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

export function getCalendarDays(currentDate: Date): CalendarDay[] {
  const calendarDays: CalendarDay[] = [];
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();

  // Previous month days
  const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
  for (let i = firstDayWeekday - 1; i >= 0; i--) {
    const date = new Date(prevMonthLastDay);
    date.setDate(prevMonthLastDay.getDate() - i);
    calendarDays.push({ date, isCurrentMonth: false });
  }

  // Current month days
  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
    calendarDays.push({ date, isCurrentMonth: true });
  }

  // Next month days
  const remainingDays = 42 - calendarDays.length;
  const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
  for (let i = 0; i < remainingDays; i++) {
    const date = new Date(nextMonth);
    date.setDate(nextMonth.getDate() + i);
    calendarDays.push({ date, isCurrentMonth: false });
  }

  return calendarDays;
}

export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export function getDatesBetween(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = [];
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
}
