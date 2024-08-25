import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { setCookie } from 'typescript-cookie'
import { loginSchema } from '@/schemas'
import { login } from '@/services'
import { useDispatch } from 'react-redux'
import { createUser } from '@/redux/states/user'
import { User } from '@/models'
import { initializeUser } from '@/utils'
import { PrivateRoutes } from '@/routes'
import { useShowPassword } from '@/hooks'
import { AxiosError } from 'axios'

export default function LoginForm() {
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
    mode: 'all',
  })

  const { handleSubmit, control, formState } = form
  const { errors, isSubmitting } = formState

  const { toggleShowPassword, passwordProperties } = useShowPassword()

  const buttonProperties = useMemo(
    () => ({
      disabled: isSubmitting,
      children: isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión',
    }),
    [isSubmitting],
  )

  const dispatch = useDispatch()

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      const { access_token, refresh_token } = await login(values)

      setCookie('access_token', access_token)
      setCookie('refresh_token', refresh_token)

      const user = await initializeUser()
      dispatch(createUser(user as User))
      navigate(`/${PrivateRoutes.HOME}`)
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error)
        form.setError('root', { message: error.response?.data.detail })
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} id='login-form' className='flex flex-col gap-2'>
        <FormMessage>{errors.root?.message}</FormMessage>
        <FormField
          control={control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo electrónico</FormLabel>
              <FormControl>
                <Input placeholder='Ingrese su correo electrónico' type='text' {...field} />
              </FormControl>
              <FormMessage>{errors.username?.message}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <div className='relative'>
                  <Input placeholder='Ingrese su contraseña' type={passwordProperties.typeInput} {...field} />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type='button'
                          variant='ghost'
                          className='absolute right-0 top-1/2 w-fit -translate-y-1/2 -scale-90 cursor-pointer text-primary hover:text-primary'
                          onClick={toggleShowPassword}>
                          <passwordProperties.icon />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{passwordProperties.tooltipText}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </FormControl>
              <FormMessage>{errors.password?.message}</FormMessage>
            </FormItem>
          )}
        />
        <Link className='w-fit text-start text-sm hover:text-primary' to='#'>
          ¿Olvidaste tu contraseña?
        </Link>
        <Button className='mt-4 w-full' disabled={buttonProperties.disabled}>
          {buttonProperties.children}
        </Button>
      </form>
    </Form>
  )
}
