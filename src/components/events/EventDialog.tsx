import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EventWithDetails } from '@/models';
import { EventCard } from './EventCard';
import { months } from './utils';


interface EventDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedDate: Date | null;
  events: EventWithDetails[];
  onDeleteEvent: (id: number) => void;
}


export function EventDialog({ isOpen, setIsOpen, selectedDate, events, onDeleteEvent }: Readonly<EventDialogProps>) {

  function getDatesBetween(startDate: Date, endDate: Date): Date[] {
    const dates: Date[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  }

  const getDayEvents = (date: Date) => {
    return events
      .filter(event => {
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Eventos para {selectedDate?.getDate()} de {selectedDate ? months[selectedDate.getMonth()] : ''}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>Listado de eventos del día seleccionado</DialogDescription>
        <div className="space-y-4">
          {selectedDate && getDayEvents(selectedDate).map((event, idx) => (
            <EventCard
              key={event.id ?? idx}
              event={event}
              onDelete={onDeleteEvent}
              view='any'
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
