import { RequestParams } from '@/interfaces/request-params'

export default function getParams({ skip, limit, sort, filter }: Partial<RequestParams>): string {
  const params = new URLSearchParams()

  if (skip) params.append('skip', skip.toString())
  if (limit) params.append('limit', limit.toString())
  if (sort) params.append('sort', sort)
  if (filter) params.append('filter', filter)

  const queryString = params.toString() ? `?${params.toString()}` : ''
  return queryString
}
