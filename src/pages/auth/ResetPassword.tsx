import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, ResetPassword } from '@/components'
import { AuthLayout } from '@/layouts'
import { PrivateRoutes, PublicRoutes } from '@/routes'
import { Link, Navigate, useParams } from 'react-router-dom'

export default function ResetPasswordPage() {
  const { token } = useParams()
  if (!token) return <Navigate to={PrivateRoutes.HOME} />
  return (
    <AuthLayout>
      <Card className='w-full max-w-2xl'>
        <CardHeader>
          <CardTitle>Restaurar contraseña</CardTitle>
          <CardDescription>Crea una contraseña nueva</CardDescription>
        </CardHeader>
        <CardContent className='space-y-2'>
          <ResetPassword token={token} />
        </CardContent>
        <CardFooter className='flex flex-col'>
          <Link
            className='mx-auto cursor-pointer font-semibold text-primary hover:underline'
            to={`/${PublicRoutes.LOGIN}`}>
            Regresar a iniciar sesión
          </Link>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}
