import { ConfirmEmail } from '@/components'
import { AuthLayout } from '@/layouts'
import { PrivateRoutes } from '@/routes'
import { Navigate, useParams } from 'react-router-dom'

export default function ConfirmEmailPage() {
  const { token } = useParams()
  if (!token) return <Navigate to={PrivateRoutes.HOME} />
  return (
    <AuthLayout>
      <ConfirmEmail token={token} />
    </AuthLayout>
  )
}
