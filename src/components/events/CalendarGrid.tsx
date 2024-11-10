import { weekDays, getCalendarDays, getDatesBetween } from './utils';
import { EventWithDetails, eventTypeColors } from '@/models';


interface CalendarGridProps {
  currentDate: Date;
  selectedDate: Date | null;
  setSelectedDate: (date: Date) => void;
  events: EventWithDetails[];
  setIsDialogOpen: (isOpen: boolean) => void;
}


export function CalendarGrid({ currentDate, selectedDate, setSelectedDate, events, setIsDialogOpen }: Readonly<CalendarGridProps>) {
  const calendarDays = getCalendarDays(currentDate);

  const getDayEvents = (date: Date) => {
    return events.filter(event => {
      const eventStartDate = new Date(event.start_date);
      const eventEndDate = new Date(event.end_date);
      const eventDates = getDatesBetween(eventStartDate, eventEndDate);

      return eventDates.some(eventDate =>
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    const dayEvents = getDayEvents(date);
    if (dayEvents.length > 0) {
      setIsDialogOpen(true);
    }
  };

  return (
    <div className="grid grid-cols-7 gap-1">
      {weekDays.map(day => (
        <div key={day} className="text-center font-semibold p-2">
          {day}
        </div>
      ))}

      {calendarDays.map(({ date, isCurrentMonth }) => {
        const dayEvents = getDayEvents(date);
        const isToday = date.toDateString() === new Date().toDateString();
        const isSelected = selectedDate?.getDate() === date.getDate() &&
                        selectedDate?.getMonth() === date.getMonth() &&
                        selectedDate?.getFullYear() === date.getFullYear();

        let backgroundColorClass = 'hover:bg-gray-50';
        if (isSelected) {
          backgroundColorClass = 'bg-blue-100';
        } else if (isToday) {
          backgroundColorClass = 'bg-green-100';
        }

        return (
          <button
            key={date.toISOString()}
            className={`min-h-12 sm:min-h-24 p-1 border cursor-pointer transition-colors flex flex-col
              ${backgroundColorClass}
              ${!isCurrentMonth ? 'text-gray-400 bg-slate-50' : ''}
              ${dayEvents.length > 0 ? 'border-blue-200' : 'border-gray-200'}`}
            onClick={() => handleDateClick(date)}
          >
            <div className="font-medium">{date.getDate()}</div>
            <div className="space-y-1 w-full">
              {dayEvents.map((event, idx) => (
                <div
                  key={event.id ?? idx}
                  className={`text-xs p-1 rounded truncate w-full ${
                    eventTypeColors[event.type]?.bg || 'bg-gray-500'
                  } ${eventTypeColors[event.type]?.text || 'text-white'}`}
                  title={event.name}
                >
                  {event.name}
                </div>
              ))}
            </div>
          </button>
        );
      })}
    </div>
  );
}
