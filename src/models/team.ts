import { Location } from './location'

export interface Team {
  id: number
  name: string
  location_id: number
}

export type TeamWithLocation = Omit<Team, 'location_id'> & { location: Location }
