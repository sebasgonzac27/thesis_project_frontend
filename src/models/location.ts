enum LocationType {
  City = 'ciudad',
  Department = 'departamento',
}

export interface Location {
  id: number
  name: string
  type: LocationType
  is_capital: boolean
  department_id: number | null
  created_at: Date
  updated_at: Date
}
