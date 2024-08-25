import { LoginResponse } from '@/models'
import { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema } from '@/schemas'
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

export async function register(body: z.infer<typeof registerSchema>) {
  const { data } = await api.post('/register', body)
  return data
}

export async function confirmEmail(token: string) {
  const { data } = await api.get(`/confirm-email/${token}`)
  return data
}

export async function requestPasswordReset({ email }: z.infer<typeof forgotPasswordSchema>) {
  const { data } = await api.post('/request-password-reset', { email })
  return data
}

export async function resetPassword(token: string, { new_password }: z.infer<typeof resetPasswordSchema>) {
  const { data } = await api.post(`/reset-password/${token}`, { new_password })
  return data
}
