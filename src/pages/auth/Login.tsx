import { AuthLayout } from '@/layouts'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, LoginForm } from '@/components'
import { Link } from 'react-router-dom'
import { PublicRoutes } from '@/routes'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex w-full max-w-full bg-white shadow-md rounded-lg overflow-hidden">
        {/* Imagen al lado izquierdo */}
        <div className="hidden md:block md:w-1/2 bg-cover bg-center h-screen border-8 border-white box-border transition-all duration-300 ease-in-out transform hover:scale-100 hover:blur-sm hover:border-gray-300"
             style={{
               backgroundImage: 'url("motorbiker.jpg")',
               backgroundSize: 'cover',
               backgroundPosition: 'center'
             }}>
        </div>

        {/* Formulario al lado derecho */}
        <div className="w-full md:w-1/2 px-8">
          <AuthLayout>
            <Card className='w-full max-w-2xl'>
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
                  <Link
                    className='ml-2 cursor-pointer font-semibold text-primary hover:underline'
                    to={`/${PublicRoutes.REGISTER}`}>
                    Regístrate
                  </Link>
                </p>
              </CardFooter>
            </Card>
          </AuthLayout>
        </div>
      </div>
    </div>
  )
}
