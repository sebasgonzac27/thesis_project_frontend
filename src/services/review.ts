import { Response } from '@/interfaces/response'
import { Review } from '@/models'
import { api } from '@/utils'


export async function getEventReviews(eventId: number): Promise<Review[]> {
  const { data } = await api.get(`/events/${eventId}/reviews`)
  return data
}

export async function getUserReviews(userId: number): Promise<Response<Review[]>> {
  const { data } = await api.get(`/users/${userId}/reviews`)
  return data
}

export async function getReview(eventId: number, userId: number): Promise<Response<Review>> {
    const { data } = await api.get(`/events/${eventId}/users/${userId}/reviews`)
    return data
  }

export async function createReview(eventId: number, userId: number, payload: any): Promise<Response<Review>> {
  const { data } = await api.post(`/events/${eventId}/users/${userId}/reviews`, payload)
  return data
}

export async function deleteReview(eventId: number, userId: number): Promise<Response<void>> {
  const { data } = await api.delete(`/events/${eventId}/users/${userId}/reviews`)
  return data
}
