import { Location } from '@/models'
import { api } from '@/utils'

export async function getLocations(): Promise<Location> {
  const { data } = await api.get('/locations')
  return data
}

export async function getLocation(id: number): Promise<Location> {
  const { data } = await api.get(`/locations/${id}`)
  return data
}
