import { getCookie, removeCookie, setCookie } from 'typescript-cookie'

export function getToken() {
  return {
    access_token: getCookie('access_token'),
    refresh_token: getCookie('refresh_token'),
  }
}

export function setToken(access_token: string, refresh_token: string) {
  setCookie('access_token', access_token)
  setCookie('refresh_token', refresh_token)
}

export function deleteToken() {
  removeCookie('access_token')
  removeCookie('refresh_token')
}
