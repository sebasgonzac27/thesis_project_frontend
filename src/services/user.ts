import { User } from '@/models'
import { api } from '@/utils'

export async function getUserMe(): Promise<User> {
  const { data } = await api.get('/users/me')
  return data
}

export async function getUser(id: number): Promise<User> {
  const { data } = await api.get(`/users/${id}`)
  return data
}

export async function getMembershipCard(id: number, format: 'PDF' | 'PNG' = 'PNG'): Promise<Blob> {
  const { data } = await api.get(`/users/${id}/membership-card?format=${format}`, { responseType: 'blob' })
  return data
}
