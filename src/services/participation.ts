import { Response } from '@/interfaces/response'
import { Participation } from '@/models'
import { api } from '@/utils'


export async function getEventParticipations(eventId: number): Promise<Response<Participation[]>> {
  const { data } = await api.get(`/events/${eventId}/participations`)
  return data
}

export async function getUserParticipations(userId: number): Promise<Response<Participation[]>> {
  const { data } = await api.get(`/users/${userId}/participations`)
  return data
}

export async function getParticipation(eventId: number, userId: number): Promise<Response<Participation>> {
    const { data } = await api.get(`/events/${eventId}/users/${userId}/participations`)
    return data
  }

export async function createParticipation(eventId: number, userId: number): Promise<Response<Participation>> {
  const { data } = await api.post(`/events/${eventId}/users/${userId}/participations`, {
    attended: false,
    event_id: eventId,
    member_id: userId
  })
  return data
}

export async function deleteParticipation(eventId: number, userId: number): Promise<Response<void>> {
  const { data } = await api.delete(`/events/${eventId}/users/${userId}/participations`)
  return data
}
