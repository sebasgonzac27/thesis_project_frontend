import { Location } from './location'
import { Team } from './team'
import { User } from './user'


export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
}

export enum EventType {
  Ride = 'rodada',
  Meeting = 'reunión informativa',
  Social = 'reunión social',
  Charity = 'evento de caridad',
  Exhibition = 'exhibición',
  Competition = 'competición',
  Training = 'educacional',
}

export const eventTypeColors = {
  'rodada': { bg: 'bg-blue-100', text: 'text-blue-800' },
  'reunión informativa': { bg: 'bg-green-100', text: 'text-green-800' },
  'reunión social': { bg: 'bg-pink-100', text: 'text-pink-800' },
  'evento de caridad': { bg: 'bg-red-100', text: 'text-red-800' },
  'exhibición': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  'competición': { bg: 'bg-purple-100', text: 'text-purple-800' },
  'educacional': { bg: 'bg-teal-100', text: 'text-teal-800' },
};

export interface Event {
  id?: number
  type: EventType
  name: string
  description: string
  start_date: Date
  end_date: Date
  meeting_point: string
  location_id: number
  organizer_id: number
  team_id: number
  path_id: number
}

export type EventWithDetails = Omit<Event, 'location_id' | 'organizer_id' | 'team_id'> & {
  location: Location
  organizer: User
  team: Team
 }

export interface Participation {
  attended: boolean
  event_id: number
  member_id: number
}
