import { RequestParams } from '@/interfaces/request-params'
import { Response } from '@/interfaces/response'
import { Motorcycle } from '@/models'
import { motorcycleSchema } from '@/schemas/motorcycle'
import { api, getParams } from '@/utils'
import { z } from 'zod'

export async function getMotorcycles(inputParams: Partial<RequestParams> = {}): Promise<Response<Motorcycle[]>> {
  const queryString = getParams(inputParams)
  const { data } = await api.get(`/motorcycles${queryString}`)
  return data
}

export async function getMotorcycle(id: number): Promise<Motorcycle> {
  const { data } = await api.get(`/motorcycles/${id}`)
  return data
}

export async function createMotorcycle(motorcycle: z.infer<typeof motorcycleSchema>): Promise<Motorcycle> {
  const { data } = await api.post('/motorcycles', motorcycle)
  return data
}
