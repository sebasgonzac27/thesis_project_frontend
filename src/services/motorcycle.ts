import { RequestParams } from '@/interfaces/request-params'
import { Response } from '@/interfaces/response'
import { Motorcycle } from '@/models'
import { api } from '@/utils'
import { getParams } from '@/utils'

export async function getMotorcycles(inputParams: Partial<RequestParams> = {}): Promise<Response<Motorcycle[]>> {
  const queryString = getParams(inputParams)
  const { data } = await api.get(`/motorcycles${queryString}`)
  return data
}

export async function getMotorcycle(id: number): Promise<Motorcycle> {
  const { data } = await api.get(`/motorcycles/${id}`)
  return data
}
