import { forgotPasswordSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '@/components'
import { useMemo } from 'react'
import { requestPasswordReset } from '@/services'
import { AxiosError } from 'axios'
import { toast } from 'sonner'

export default function ForgotPassword() {
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
    mode: 'all',
  })

  const { handleSubmit, control, formState, setError } = form
  const { errors, isSubmitting } = formState

  const buttonProperties = useMemo(
    () => ({
      disabled: isSubmitting,
      children: isSubmitting ? 'Solicitando...' : 'Solicitar',
    }),
    [isSubmitting],
  )

  const onSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
    try {
      await requestPasswordReset(values)
      toast.success('Solicitud realizada', { description: 'Revisa tu email para restaurar la contraseña' })
      form.reset()
    } catch (error) {
      console.error(error)
      if (error instanceof AxiosError) {
        setError('root', { message: error.response?.data.detail })
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormMessage>{errors.root?.message}</FormMessage>
        <FormField
          control={control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo electrónico</FormLabel>
              <FormControl>
                <Input placeholder='Ingrese su correo electrónico' type='text' {...field} />
              </FormControl>
              <FormMessage>{errors.email?.message}</FormMessage>
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
