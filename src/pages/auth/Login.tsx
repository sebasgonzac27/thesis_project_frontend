import { AuthLayout } from '@/layouts'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, LoginForm } from '@/components'
import { Link } from 'react-router-dom'

export default function LoginPage() {
  return (
    <AuthLayout>
      <Card className='w-fit'>
        <CardHeader>
          <CardTitle>Iniciar Sesión</CardTitle>
          <CardDescription>Manténte actualizado sobre los eventos de tu club.</CardDescription>
        </CardHeader>
        <CardContent className='space-y-2'>
          <LoginForm />
        </CardContent>
        <CardFooter className='flex flex-col'>
          <p className='mx-auto text-center'>
            ¿No tienes una cuenta?
            <Link className='ml-2 cursor-pointer font-semibold text-primary hover:underline' to='#'>
              Regístrate
            </Link>
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}
