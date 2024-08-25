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
import { useShowPassword } from '@/hooks'
import { resetPasswordSchema } from '@/schemas'
import { resetPassword } from '@/services'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

interface Props {
  token: string
}

export default function ResetPassword({ token }: Props) {
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      new_password: '',
      confirm_password: '',
    },
    mode: 'all',
  })

  const { handleSubmit, control, formState, setError } = form
  const { errors, isSubmitting } = formState

  const { toggleShowPassword, passwordProperties } = useShowPassword()
  const { toggleShowPassword: toggleShowConfirmPassword, passwordProperties: confirmPasswordProperties } =
    useShowPassword()

  const buttonProperties = useMemo(
    () => ({
      disabled: isSubmitting,
      children: isSubmitting ? 'Restaurando contraseña...' : 'Restaurar contraseña',
    }),
    [isSubmitting],
  )

  const onSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
    try {
      await resetPassword(token, values)
      toast.success('Contraseña restaurada correctamente', {
        description: 'Ahora puedes iniciar sesión con tu nueva contraseña',
      })
      form.reset()
    } catch (error) {
      console.error(error)
      if (error instanceof AxiosError) {
        setError('root', { message: error.response?.data.message })
      }
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-2'>
        <FormMessage>{errors.root?.message}</FormMessage>
        <FormField
          control={control}
          name='new_password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nueva contraseña</FormLabel>
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
                          onClick={toggleShowPassword}
                          tabIndex={-1}>
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
              <FormMessage>{errors.new_password?.message}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='confirm_password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar contraseña</FormLabel>
              <FormControl>
                <div className='relative'>
                  <Input placeholder='Ingrese su contraseña' type={confirmPasswordProperties.typeInput} {...field} />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type='button'
                          variant='ghost'
                          className='absolute right-0 top-1/2 w-fit -translate-y-1/2 -scale-90 cursor-pointer text-primary hover:text-primary'
                          onClick={toggleShowConfirmPassword}
                          tabIndex={-1}>
                          <confirmPasswordProperties.icon />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{confirmPasswordProperties.tooltipText}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </FormControl>
              <FormMessage>{errors.confirm_password?.message}</FormMessage>
            </FormItem>
          )}
        />
        <Button className='mt-4 w-full' disabled={buttonProperties.disabled}>
          {buttonProperties.children}
        </Button>
      </form>
    </Form>
  )
}
