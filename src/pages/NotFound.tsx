import { Icon } from '@/components'
import { AuthLayout } from '@/layouts'
import { PrivateRoutes } from '@/routes'
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <AuthLayout>
      <div className='grid gap-3 place-items-center text-center'>
        <Icon name='CircleX' size={120} />
        <h1 className='text-2xl text-primary font-semibold'>404 - Not Found</h1>
        <p>El recurso al que quieres acceder no ha sido encontrado.</p>
        <Link to={PrivateRoutes.HOME} className='text-primary hover:underline'>
          Volver al inicio
        </Link>
      </div>
    </AuthLayout>
  )
}
