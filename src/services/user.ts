import { RequestParams } from '@/interfaces/request-params'
import { Response } from '@/interfaces/response'
import { Motorcycle, UserBase, UserWithProfile } from '@/models'
import { userSchema } from '@/schemas'
import { api, getParams } from '@/utils'
import { z } from 'zod'

export async function getUserMe(): Promise<UserWithProfile> {
  const { data } = await api.get('/users/me')
  return data
}

export async function getUsers(inputParams: Partial<RequestParams> = {}): Promise<Response<UserWithProfile[]>> {
  const queryString = getParams(inputParams)
  const { data } = await api.get<Response<UserBase[]>>(`/users${queryString}`)

  const usersWithProfiles = await Promise.all(
    data.data.map(async user => {
      const { profile } = await getUser(user.id)
      return { ...user, profile }
    }),
  )

  return { data: usersWithProfiles, pagination: data.pagination }
}

export async function getUser(id: number): Promise<UserWithProfile> {
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

export async function updateUser(id: number, user: z.infer<typeof userSchema>): Promise<UserWithProfile> {
  const { data } = await api.put(`/users/${id}`, user)
  return data
}
