import { Location } from './location'
import { Team } from './team'


export interface Company {
  id?: number
  name: string
  contact_name: string
  contact_telephone: string
  contact_address: string
  location_id: number
}

export type CompanyWithDetails = Omit<Company, 'location_id'> & {
  location: Location
}


export interface Agreement {
  id?: number
  name: string
  description: string
  start_date: Date
  end_date: Date
  active: boolean
  company_id: number
}

export interface AgreementWithDetails extends Omit<Agreement, 'company_id'> {
  company: CompanyWithDetails
  teams?: Team[]
}
