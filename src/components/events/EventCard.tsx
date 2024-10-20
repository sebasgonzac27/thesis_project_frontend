import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Check } from 'lucide-react';
import { eventTypeColors, EventWithDetails } from '@/models';
import { formatDate } from './utils';
import { EventDescription } from './EventDescription';
import { createParticipation, deleteParticipation, getParticipation } from '@/services';
import useUserStore from '@/store/user';
import { toast } from 'sonner';


interface EventCardProps {
  event: EventWithDetails;
  onDelete: (id: number) => void;
  onParticipationChange?: (eventId: number, isParticipating: boolean) => void;
  view: 'any' | 'historico';
}


export function EventCard({ event, onDelete, onParticipationChange, view }: Readonly<EventCardProps>) {
  const { user } = useUserStore();
  const [isParticipating, setIsParticipating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const startDate = new Date(event.start_date);
  const endDate = new Date(event.end_date);


  const checkParticipation = async () => {
    if (user?.id && event.id) {
      setIsLoading(true);
      try {
        const response = await getParticipation(event.id, user.id);
        const newParticipationState = !!response;
        setIsParticipating(newParticipationState);
        if (onParticipationChange) {
          onParticipationChange(event.id, newParticipationState);
        }
      } catch (error) {
        setIsParticipating(false);
        if (onParticipationChange) {
          onParticipationChange(event.id, false);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    checkParticipation();
  }, [event.id, user?.id]);

  const handleParticipation = async () => {
    if (!user?.id || !event.id) return;

    setIsLoading(true);
    try {
      if (isParticipating) {
        await deleteParticipation(event.id, user.id);
        setIsParticipating(false);
        if (onParticipationChange) {
          onParticipationChange(event.id, false);
        }
        toast.success('Participación cancelada');
      } else {
        await createParticipation(event.id, user.id);
        setIsParticipating(true);
        if (onParticipationChange) {
          onParticipationChange(event.id, true);
        }
        toast.success('Participación confirmada');
      }
    } catch (error) {
      toast.error('Error al procesar la participación');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <Card className="p-4">
      <div className="grid gap-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-red-500">{event.name}</h3>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-medium px-2 py-1 rounded ${
                eventTypeColors[event.type]?.bg || 'bg-gray-100'
              } ${eventTypeColors[event.type]?.text || 'text-gray-800'}`}
            >
              {event.type}
            </span>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => event.id && onDelete(event.id)}
              className="ml-2"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="text-sm text-gray-600">
          <div className="flex items-center gap-2 mt-3">
            <span className="font-bold">Horario:</span>
            {formatDate(startDate)} - {formatDate(endDate)}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-bold">Punto de encuentro:</span>
            <p className="mt-2 pl-3">{event.meeting_point}</p>
          </div>
          <div>
            <span className="font-bold">Ubicación:</span>
            <p className="mt-2 pl-3">{event.location?.name}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-bold">Organizador:</span>
            <p className="mt-2 pl-3">{event.organizer?.profile.first_name} {event.organizer?.profile.last_name}</p>
          </div>
          <div>
            <span className="font-bold">Equipo:</span>
            <p className="mt-2 pl-3">{event.team?.name}</p>
          </div>
        </div>
        <EventDescription description={event.description} />

        <div className="mt-4">
          {view === 'historico' && isParticipating ? (
            <Button
              variant="secondary"
              className="w-full bg-blue-500 hover:bg-blue-600"
              onClick={() => console.log('reseña')}
            >
              Añadir Reseña
            </Button>
          ) : view === 'any' ? (
            <Button
              variant={isParticipating ? "default" : "secondary"}
              className={`w-full ${isParticipating ? 'bg-green-500 hover:bg-green-600' : ''}`}
              onClick={handleParticipation}
              disabled={isLoading}
            >
              {isParticipating ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Asistiré
                </>
              ) : (
                'Confirmar Asistencia'
              )}
            </Button>
          ) : ''}
        </div>
      </div>
    </Card>
  );
}
