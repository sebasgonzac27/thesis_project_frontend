import { RequestParams } from '@/interfaces/request-params'
import { Response } from '@/interfaces/response'
import { Event } from '@/models'
import { api, getParams } from '@/utils'

export async function getEvents(inputParams: Partial<RequestParams> = {}): Promise<Response<Event[]>> {
  const queryString = getParams(inputParams)
  const { data } = await api.get(`/events${queryString}`)
  return data
}

export async function getEvent(id: number): Promise<Event> {
  const { data } = await api.get(`/events/${id}`)
  return data
}

export async function createEvent(event: Partial<Event>): Promise<Response<Event>> {
  const { data } = await api.post('/events', event)
  return data
}

export async function updateEvent(id: number, event: Partial<Event>): Promise<Response<Event>> {
  const { data } = await api.put(`/events/${id}`, event)
  return data
}

export async function deleteEvent(id: number): Promise<Response<void>> {
  const { data } = await api.delete(`/events/${id}`)
  return data
}
