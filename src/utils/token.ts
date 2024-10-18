import { getCookie, removeCookie, setCookie } from 'typescript-cookie'

export function getToken() {
  return {
    accessToken: getCookie('access_token'),
    refreshToken: getCookie('refresh_token'),
  }
}

export function setToken(accessToken: string, refreshToken: string) {
  setCookie('access_token', accessToken)
  setCookie('refresh_token', refreshToken)
}

export function deleteToken() {
  removeCookie('access_token')
  removeCookie('refresh_token')
}
