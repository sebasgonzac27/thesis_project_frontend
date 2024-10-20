import { EventWithDetails } from '@/models';
import { EventCard } from './EventCard';


interface AgendaViewProps {
  events: EventWithDetails[];
  onDeleteEvent: (id: number) => void;
}


export function AgendaView({ events, onDeleteEvent }: Readonly<AgendaViewProps>) {
  const getFutureEvents = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return events
      .filter(event => new Date(event.start_date) >= today)
      .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
  };

  const futureEvents = getFutureEvents();

  return (
    <div className="space-y-4">
      {futureEvents.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No hay eventos futuros programados</p>
      ) : (
        futureEvents.map((event, idx) => (
          <EventCard
            key={event.id ?? idx}
            event={event}
            onDelete={onDeleteEvent}
            view='any'
          />
        ))
      )}
    </div>
  );
}
