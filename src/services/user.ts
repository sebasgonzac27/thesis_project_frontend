import { User } from '@/models'
import { api } from '@/utils'

export async function getUserMe(): Promise<User> {
  const { data } = await api.get('/users/me')
  return data
}
