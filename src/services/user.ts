import { Motorcycle, User } from '@/models'
import { userSchema } from '@/schemas'
import { api } from '@/utils'
import { z } from 'zod'

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

export async function getUserMotorcycles(id: number): Promise<Motorcycle[]> {
  const { data } = await api.get(`/users/${id}/motorcycles`)
  return data
}

export async function updateUser(id: number, user: z.infer<typeof userSchema>): Promise<User> {
  const { data } = await api.put(`/users/${id}`, user)
  return data
}
