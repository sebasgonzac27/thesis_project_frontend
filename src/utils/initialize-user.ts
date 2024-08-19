import { getUserMe } from '@/services'
import { getCookie } from 'typescript-cookie'

export async function initializeUser() {
  const accessToken = getCookie('access_token')

  if (accessToken) {
    const user = await getUserMe()
    return user
  }

  return null
}
