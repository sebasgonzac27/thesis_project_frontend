import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, RegisterForm } from '@/components'
import { AuthLayout } from '@/layouts'
import { PublicRoutes } from '@/routes'
import { Link } from 'react-router-dom'

export default function RegisterPage() {
  return (
    <AuthLayout>
      <Card className='w-fit'>
        <CardHeader>
          <CardTitle>Regístrate</CardTitle>
          <CardDescription>Llena tus datos y haz parte de esta comunidad.</CardDescription>
        </CardHeader>
        <CardContent className='space-y-2'>
          <RegisterForm />
        </CardContent>
        <CardFooter className='flex flex-col'>
          <p className='mx-auto text-center'>
            ¿Ya tienes una cuenta?
            <Link
              className='ml-2 cursor-pointer font-semibold text-primary hover:underline'
              to={`/${PublicRoutes.LOGIN}`}>
              Inicia sesión
            </Link>
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}
