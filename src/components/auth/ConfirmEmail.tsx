import { confirmEmail } from '@/services'
import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import Loader from '../shared/Loader'
import Icon from '../shared/Icon'
import { Link } from 'react-router-dom'

interface Props {
  token: string
}

export default function ConfirmEmail({ token }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<boolean>(false)

  useEffect(() => {
    ;(async () => {
      try {
        const response = await confirmEmail(token)
        console.log(response)
        setIsLoading(false)
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error(error)
          setError(error.response?.data.detail)
          setIsLoading(false)
        }
      }
    })()
  }, [token])

  return (
    <div className='grid place-items-center gap-3 text-center'>
      {isLoading ? (
        <Loader text='Validando' />
      ) : !error ? (
        <>
          <div className='text-success'>
            <Icon name='MailCheck' size={120} />
          </div>
          <h1 className='text-2xl font-semibold'>¡Email validado correctamente!</h1>
          <p>Gracias por confirmar tu dirección de correo electrónico.</p>
          <Link to='/' className='text-primary underline'>
            Volver al inicio
          </Link>
        </>
      ) : (
        <>
          <div className='text-error'>
            <Icon name='MailX' size={120} />
          </div>
          <h1 className='text-2xl font-semibold'>Error al validar el email</h1>
          <p>{error}</p>
        </>
      )}
    </div>
  )
}
