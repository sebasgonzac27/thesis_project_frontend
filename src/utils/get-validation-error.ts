import { AxiosError } from 'axios'

type TypeWithKey<T> = { [key: string]: T }

export function getValidationError(error: AxiosError): string {
  const codeMatcher: TypeWithKey<string> = {
    ERR_BAD_REQUEST: 'Por favor verifica los datos ingresados',
    ERR_UNAUTHORIZED: 'Por favor inicia sesión',
    ERR_FORBIDDEN: 'No tienes permisos para realizar esta acción',
  }

  return codeMatcher[error.code!] || 'Ocurrió un error inesperado'
}
