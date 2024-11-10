import { RequestParams } from '@/interfaces/request-params'
import { Response } from '@/interfaces/response'
import { Brand } from '@/models'
import { api, getParams } from '@/utils'

export async function getBrands(inputParams: Partial<RequestParams> = {}): Promise<Response<Brand[]>> {
  const queryString = getParams(inputParams)
  const { data } = await api.get(`/brands${queryString}`)
  return data
}

export async function getBrand(id: number): Promise<Brand> {
  const { data } = await api.get(`/brands/${id}`)
  return data
}
