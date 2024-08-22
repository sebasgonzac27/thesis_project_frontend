import { Team } from '@/models'
import { api } from '@/utils'

export async function getTeams(): Promise<Team[]> {
  const { data } = await api.get('/teams')
  return data
}
