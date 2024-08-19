import { refreshToken } from '@/services'
import axios from 'axios'
import { getCookie, removeCookie, setCookie } from 'typescript-cookie'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(request => {
  if (request.url === '/token') {
    request.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    return request
  }

  const accessToken = getCookie('access_token')
  if (accessToken) {
    request.headers['Authorization'] = `Bearer ${accessToken}`
  }

  return request
})

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config
    const accessToken = getCookie('access_token')

    // Verificar si el error es por token expirado
    if (error.response.status === 401 && accessToken && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Obtener el refresh_token almacenado
        const refresh_token = getCookie('refresh_token') as string

        // Llamar al endpoint para obtener un nuevo token
        const data = await refreshToken(refresh_token)

        setCookie('access_token', data.access_token)
        setCookie('refresh_token', data.refresh_token)

        console.log('Token refreshed')

        // Reintentar la solicitud original
        originalRequest.headers['Authorization'] = `Bearer ${data.access_token}`
        return api(originalRequest)
      } catch (err) {
        // Manejar el error, por ejemplo, redirigir al login si el refresh_token también falla
        // Acción para cerrar la sesión y redirigir al login
        console.log(err)
        removeCookie('access_token')
        removeCookie('refresh_token')
        window.location.href = '/'
      }
    }
    // Si no es un error de 401, rechazar la promesa
    return Promise.reject(error)
  },
)
