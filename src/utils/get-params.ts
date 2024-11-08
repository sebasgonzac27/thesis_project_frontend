import { RequestParams } from '@/interfaces/request-params'

export default function getParams({ skip = 0, limit = -1, sort = '', filter = '' }: Partial<RequestParams>): string {
  const params = new URLSearchParams()

  if (skip) params.append('skip', skip.toString())
  if (limit) params.append('limit', limit.toString())
  if (sort) params.append('sort', sort)
  if (filter) params.append('filter', filter)
  const paramsString = params.toString()
  const queryString = paramsString ? `?${paramsString}` : ''
  return queryString
}
