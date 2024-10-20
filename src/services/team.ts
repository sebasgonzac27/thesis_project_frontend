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

export async function getTeam(id: number): Promise<Team> {
  const { data } = await api.get(`/teams/${id}`)
  return data
<<<<<<< Updated upstream
}
=======
}
>>>>>>> Stashed changes
