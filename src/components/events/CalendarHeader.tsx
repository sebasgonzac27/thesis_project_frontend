import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, List, History } from 'lucide-react';
import { months } from './utils';
import EventCreateForm from './EventCreateForm';


interface CalendarHeaderProps {
  view: 'calendar' | 'agenda' | 'historico';
  setView: (view: 'calendar' | 'agenda' | 'historico') => void;
  currentDate: Date;
  changeMonth: (increment: number) => void;
  resetToToday: () => void;
}


export function CalendarHeader({view, setView, currentDate, changeMonth, resetToToday}: Readonly<CalendarHeaderProps>) {
  return (
    <div className="mb-4 space-y-4 sm:space-y-0">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <EventCreateForm />
          <div className="flex gap-1">
            <Button
              variant={view === 'calendar' ? 'default' : 'outline'}
              onClick={() => setView('calendar')}
              className="flex items-center gap-2"
              size="sm"
            >
              <CalendarIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Calendario</span>
            </Button>
            <Button
              variant={view === 'agenda' ? 'default' : 'outline'}
              onClick={() => setView('agenda')}
              className="flex items-center gap-2"
              size="sm"
            >
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">Agenda</span>
            </Button>
            <Button
              variant={view === 'historico' ? 'default' : 'outline'}
              onClick={() => setView('historico')}
              className="flex items-center gap-2"
              size="sm"
            >
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">Histórico</span>
            </Button>
          </div>
        </div>

        {view === 'calendar' && (
          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4 mt-4 sm:mt-0">
            <Button
              variant="outline"
              size="sm"
              onClick={resetToToday}
              className={`${
                currentDate.getMonth() === new Date().getMonth() &&
                currentDate.getFullYear() === new Date().getFullYear()
                  ? 'bg-blue-50'
                  : ''
              }`}
            >
              Hoy
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => changeMonth(-1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-base sm:text-xl font-semibold text-center min-w-40">
                {months[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <Button variant="outline" size="sm" onClick={() => changeMonth(1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
