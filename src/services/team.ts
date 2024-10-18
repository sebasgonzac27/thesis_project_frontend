import { RequestParams } from '@/interfaces/request-params'
import { Response } from '@/interfaces/response'
import { Team } from '@/models'
import { api } from '@/utils'
import { getParams } from '@/utils'

export async function getTeams(inputParams: Partial<RequestParams> = {}): Promise<Response<Team[]>> {
  const queryString = getParams(inputParams)
  const { data } = await api.get(`/teams${queryString}`)
  return data
}
