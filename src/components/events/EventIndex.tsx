import { useState } from 'react';
import { CalendarGrid } from './CalendarGrid';
import { CalendarHeader } from './CalendarHeader';
import { AgendaView } from './AgendaView';
import { HistoricoView } from './HistoricoView';
import { EventDialog } from './EventDialog';
import { useCalendar, useEvents } from './utils';


export default function Calendar() {
  const [view, setView] = useState<'calendar' | 'agenda' | 'historico'>('calendar');
  const { currentDate, selectedDate, setSelectedDate, changeMonth, resetToToday } = useCalendar();
  const { events, isDialogOpen, setIsDialogOpen, handleDeleteEvent } = useEvents();

  return (
    <div className="mt-5 rounded-lg">
      <CalendarHeader
        view={view}
        setView={setView}
        currentDate={currentDate}
        changeMonth={changeMonth}
        resetToToday={resetToToday}
      />

      {(() => {
        switch (view) {
          case 'calendar':
            return (
              <>
                <CalendarGrid
                  currentDate={currentDate}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  events={events}
                  setIsDialogOpen={setIsDialogOpen}
                />
                <EventDialog
                  isOpen={isDialogOpen}
                  setIsOpen={setIsDialogOpen}
                  selectedDate={selectedDate}
                  events={events}
                  onDeleteEvent={handleDeleteEvent}
                />
              </>
            );
          case 'agenda':
            return (
              <AgendaView
                events={events}
                onDeleteEvent={handleDeleteEvent}
              />
            );
          default:
            return (
              <HistoricoView
                events={events}
                onDeleteEvent={handleDeleteEvent}
              />
            );
        }
      })()}
    </div>
  );
}