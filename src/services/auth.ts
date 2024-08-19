import { LoginResponse } from '@/models'
import { loginSchema } from '@/schemas'
import { api } from '@/utils'
import { z } from 'zod'

export async function login({ username, password }: z.infer<typeof loginSchema>): Promise<LoginResponse> {
  const { data } = await api.post('/token', { username, password })
  return data
}

export async function refreshToken(refresh_token: string): Promise<LoginResponse> {
  const { data } = await api.post('/refresh-token', { refresh_token })
  return data
}
