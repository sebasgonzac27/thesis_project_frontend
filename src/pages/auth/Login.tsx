import { AuthLayout } from '@/layouts'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, LoginForm } from '@/components'
import { Link } from 'react-router-dom'
import { PublicRoutes } from '@/routes'
import Logo from '@/assets/img/logo.webp'

export default function LoginPage() {
  return (
    <AuthLayout>
      <div className='flex flex-col items-center justify-center w-full h-full space-y-8'>
        <img src={Logo} alt='Logo Club' className='w-[40vw] max-w-[250px]' />
        <Card className='w-full max-w-2xl'>
          <CardHeader>
            <CardTitle>Iniciar Sesión</CardTitle>
            <CardDescription>Manténte actualizado sobre la información de tu club.</CardDescription>
          </CardHeader>
          <CardContent className='space-y-2'>
            <LoginForm />
          </CardContent>
          <CardFooter className='flex flex-col'>
            <p className='mx-auto text-center'>
              ¿No tienes una cuenta?
              <Link
                className='ml-2 cursor-pointer font-semibold text-primary hover:underline'
                to={`/${PublicRoutes.REGISTER}`}>
                Regístrate
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </AuthLayout>
  )
}
