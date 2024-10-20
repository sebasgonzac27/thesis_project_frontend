import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components'
import { useShowPassword } from '@/hooks'
import { Team, UserRole, UserStatus } from '@/models'
import { registerSchema } from '@/schemas'
import { getTeams, register } from '@/services'
import { zodResolver } from '@hookform/resolvers/zod'
import { SelectValue } from '@radix-ui/react-select'
import { AxiosError } from 'axios'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

export default function RegisterForm() {
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirm_password: '',
      role_id: UserRole.MEMBER,
      status: UserStatus.INACTIVE as string,
      profile: {
        telephone: '',
        first_name: '',
        last_name: '',
        nickname: null,
        document_type: 'cédula de ciudadanía',
        document_number: '',
        rh: 'O+',
        birthdate: '',
        genre: 'masculino',
        photo: null,
        team_id: 0,
      },
    },
    mode: 'all',
  })

  const { handleSubmit, control, formState, setError } = form
  const { errors, isSubmitting } = formState

  const { toggleShowPassword, passwordProperties } = useShowPassword()

  const { toggleShowPassword: toggleShowPasswordConfirm, passwordProperties: passwordPropertiesConfirm } =
    useShowPassword()

  const buttonProperties = useMemo(
    () => ({
      disabled: isSubmitting,
      children: isSubmitting ? 'Registrando...' : 'Registrarse',
    }),
    [isSubmitting],
  )

  const [teams, setTeams] = useState<Team[]>([])

  useEffect(() => {
    ;(async () => {
      const { data } = await getTeams()
      setTeams(data)
    })()
  }, [])

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    try {
      await register(values)
      toast.success('Usuario registrado', { description: 'Revisa tu email para validar la cuenta.' })
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
      <form onSubmit={handleSubmit(onSubmit)} id='register-form' className='flex flex-col gap-2'>
        <FormMessage>{errors.root?.message}</FormMessage>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
          <FormField
            control={control}
            name='profile.first_name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder='Ingrese su nombre' {...field} />
                </FormControl>
                <FormMessage>{errors.profile?.first_name?.message}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='profile.last_name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellido</FormLabel>
                <FormControl>
                  <Input placeholder='Ingrese su apellido' {...field} />
                </FormControl>
                <FormMessage>{errors.profile?.last_name?.message}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='profile.nickname'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apodo</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Ingrese su apodo'
                    {...field}
                    value={field.value || ''}
                    onChange={({ target }) =>
                      target.value !== '' ? field.onChange(target.value) : field.onChange(null)
                    }
                  />
                </FormControl>
                <FormMessage>{errors.profile?.nickname?.message}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='profile.telephone'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input placeholder='Ingrese su teléfono' {...field} type='number' />
                </FormControl>
                <FormMessage>{errors.profile?.telephone?.message}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='profile.document_type'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de documento</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Seleccione un tipo de documento' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {['Cédula de ciudadanía', 'Cédula de extranjería', 'Pasaporte'].map((document, index) => (
                      <SelectItem value={document.toLowerCase()} key={`document-type-${index}`}>
                        {document}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage>{errors.profile?.document_type?.message}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='profile.document_number'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de documento</FormLabel>
                <FormControl>
                  <Input placeholder='Ingrese su número de documento' {...field} type='number' />
                </FormControl>
                <FormMessage>{errors.profile?.document_number?.message}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='profile.rh'
            render={({ field }) => (
              <FormItem>
                <FormLabel>RH</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Seleccione su RH' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((rh, index) => (
                      <SelectItem value={rh} key={`rh-${index}`}>
                        {rh}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage>{errors.profile?.rh?.message}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='profile.birthdate'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de nacimiento</FormLabel>
                <FormControl>
                  <Input type='date' {...field} />
                </FormControl>
                <FormMessage>{errors.profile?.birthdate?.message}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='profile.genre'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Género</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Seleccione su género' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {['Masculino', 'Femenino', 'Otro'].map((genre, index) => (
                      <SelectItem value={genre.toLowerCase()} key={`genre-${index}`}>
                        {genre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage>{errors.profile?.genre?.message}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='profile.team_id'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Equipo</FormLabel>
                <Select onValueChange={value => field.onChange(parseInt(value))} defaultValue=''>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Seleccione un equipo' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {teams.map(team => (
                      <SelectItem value={team.id.toString()} key={`team-${team.id}`}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage>{errors.profile?.team_id?.message}</FormMessage>
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo electrónico</FormLabel>
              <FormControl>
                <Input placeholder='Ingrese su correo electrónico' {...field} />
              </FormControl>
              <FormMessage>{errors.email?.message}</FormMessage>
            </FormItem>
          )}
        />
        <div className='grid gap-2 md:grid-cols-2'>
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
                            tabIndex={-1}
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
          <FormField
            control={control}
            name='confirm_password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar contraseña</FormLabel>
                <FormControl>
                  <div className='relative'>
                    <Input placeholder='Ingrese su contraseña' type={passwordPropertiesConfirm.typeInput} {...field} />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type='button'
                            variant='ghost'
                            className='absolute right-0 top-1/2 w-fit -translate-y-1/2 -scale-90 cursor-pointer text-primary hover:text-primary'
                            tabIndex={-1}
                            onClick={toggleShowPasswordConfirm}>
                            <passwordPropertiesConfirm.icon />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{passwordPropertiesConfirm.tooltipText}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </FormControl>
                <FormMessage>{errors.confirm_password?.message}</FormMessage>
              </FormItem>
            )}
          />
        </div>

        <Button className='mt-4 w-full' disabled={buttonProperties.disabled}>
          {buttonProperties.children}
        </Button>
      </form>
    </Form>
  )
}
