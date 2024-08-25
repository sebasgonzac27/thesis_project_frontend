import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, ForgotPassword } from '@/components'
import { AuthLayout } from '@/layouts'
import { PublicRoutes } from '@/routes'
import { Link } from 'react-router-dom'

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <Card className='w-full max-w-2xl'>
        <CardHeader>
          <CardTitle>Olvidé mi contraseña</CardTitle>
          <CardDescription>Ingresa tu email para solicitar la restauración de la contraseña</CardDescription>
        </CardHeader>
        <CardContent className='space-y-2'>
          <ForgotPassword />
        </CardContent>
        <CardFooter className='flex flex-col'>
          <p className='mx-auto text-center'>
            ¿Recordaste tu contraseña?
            <Link
              className='ml-2 cursor-pointer font-semibold text-primary hover:underline'
              to={`/${PublicRoutes.LOGIN}`}>
              Iniciar sesión
            </Link>
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}
