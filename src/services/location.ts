import { RequestParams } from '@/interfaces/request-params'
import { Response } from '@/interfaces/response'
import { Location } from '@/models'
import { api } from '@/utils'
import { getParams } from '@/utils'

export async function getLocations(inputParams: Partial<RequestParams> = {}): Promise<Response<Location[]>> {
  const queryString = getParams(inputParams)
  const { data } = await api.get(`/locations${queryString}`)
  return data
}

export async function getLocation(id: number): Promise<Location> {
  const { data } = await api.get(`/locations/${id}`)
  return data
}
