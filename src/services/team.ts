import { RequestParams } from '@/interfaces/request-params'
import { Response } from '@/interfaces/response'
import { Team } from '@/models'
import { teamSchema } from '@/schemas'
import { api, getParams } from '@/utils'
import { z } from 'zod'

export async function getTeams(inputParams: Partial<RequestParams> = {}): Promise<Response<Team[]>> {
  const queryString = getParams(inputParams)
  const { data } = await api.get(`/teams${queryString}`)
  return data
}

export async function getTeam(id: number): Promise<Team> {
  const { data } = await api.get(`/teams/${id}`)
  return data
}

export async function createTeam(body: z.infer<typeof teamSchema>) {
  const { data } = await api.post('/teams', body)
  return data
}
