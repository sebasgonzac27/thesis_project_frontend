import { refreshToken as refreshTokenService } from '@/services'
import axios from 'axios'
import { toast } from 'sonner'
import { CONFIG } from '@/config'
import getValidationError from './get-validation-error'
import { deleteToken, getToken, setToken } from './token'

const api = axios.create({
  baseURL: CONFIG.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(request => {
  if (request.url === '/token') {
    request.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    return request
  }

  const { accessToken } = getToken()
  if (accessToken) {
    request.headers['Authorization'] = `Bearer ${accessToken}`
  }

  return request
})

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config
    const { accessToken } = getToken()

    // Verificar si el error es por token expirado
    if (error.response.status === 401 && accessToken && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Obtener el refresh_token almacenado
        const { refreshToken } = getToken()

        // Llamar al endpoint para obtener un nuevo token
        const data = await refreshTokenService(refreshToken || '')

        setToken(data.access_token, data.refresh_token)

        const { accessToken } = getToken()

        // Reintentar la solicitud original
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`
        return api(originalRequest)
      } catch (err) {
        // Manejar el error, por ejemplo, redirigir al login si el refresh_token también falla
        // Acción para cerrar la sesión y redirigir al login
        console.log(err)
        deleteToken()
        window.location.href = '/'
      }
    }
    // Si no es un error de 401, rechazar la promesa
    if (error.response.status !== 404) {
      const errorMsg = getValidationError(error)
      toast.error(errorMsg)
      return Promise.reject(error)
    }
  },
)

export default api
