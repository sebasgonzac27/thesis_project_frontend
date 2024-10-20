import { Location } from './location'

export interface Team {
  id: number
  name: string
  location_id: number
  created_at: string
  updated_at: string
}

export type TeamWithLocation = Omit<Team, 'location_id'> & { location: Location }
