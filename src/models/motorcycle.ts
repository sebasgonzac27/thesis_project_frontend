import { Brand } from './brand'

export interface Motorcycle {
  id: number
  model: string
  photo: string
  license_plate: string
  brand_id: number
  owner_id: number
}

export interface MotorcycleWithBrand extends Motorcycle {
  brand: Brand
}
