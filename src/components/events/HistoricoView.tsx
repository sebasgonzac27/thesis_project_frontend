import { EventWithDetails } from '@/models';
import { EventCard } from './EventCard';


interface HistoricoViewProps {
  events: EventWithDetails[];
  onDeleteEvent: (id: number) => void;
}


export function HistoricoView({ events, onDeleteEvent }: Readonly<HistoricoViewProps>) {
  const getPastEvents = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return events
      .filter(
        event => new Date(event.start_date) <= today && new Date(event.end_date) <= today
      )
      .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
  };

  const pastEvents = getPastEvents();

  return (
    <div className="space-y-4">
      {pastEvents.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No hay eventos antiguos programados</p>
      ) : (
        pastEvents.map((event, idx) => (
          <EventCard
            key={event.id ?? idx}
            event={event}
            onDelete={onDeleteEvent}
            view='historico'
          />
        ))
      )}
    </div>
  );
}