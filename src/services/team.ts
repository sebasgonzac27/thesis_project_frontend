import { Team } from '@/models'
import { api } from '@/utils'

export async function getTeams({
  skip,
  limit,
  sort,
  filter,
}: {
  skip?: number
  limit?: number
  sort?: string
  filter?: string
} = {}): Promise<Team[]> {
  const params = new URLSearchParams()

  if (skip !== undefined) params.append('skip', skip.toString())
  if (limit !== undefined) params.append('limit', limit.toString())
  if (sort) params.append('sort', sort)
  if (filter) params.append('filter', filter)

  const queryString = params.toString() ? `?${params.toString()}` : ''

  const { data } = await api.get(`/teams${queryString}`)
  return data
}
