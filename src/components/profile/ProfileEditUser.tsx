import { Team, UserWithProfile, UserRole, UserStatus } from '@/models'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { userSchema } from '@/schemas'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { useEffect, useMemo, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { getTeams, updateUser } from '@/services'
import { Button } from '../ui/button'
import { AxiosError } from 'axios'
import { toast } from 'sonner'
import { useAppStore } from '@/store/app'

interface Props {
  user: UserWithProfile
  isOpen: boolean
  setOpen: (open: boolean) => void
  setUpdatedUser: (user: UserWithProfile) => void
}

export function ProfileEditUser({ user, isOpen, setOpen, setUpdatedUser }: Readonly<Props>) {
  const { role_selected } = useAppStore()

  const isAdmin = useMemo(() => role_selected === UserRole.ADMIN, [role_selected])

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role_id: undefined,
      status: undefined,
      profile: {
        telephone: undefined,
        first_name: undefined,
        last_name: undefined,
        nickname: undefined,
        team_id: undefined,
      },
    },
  })

  const [teams, setTeams] = useState<Team[]>([])

  useEffect(() => {
    ;(async () => {
      const { data } = await getTeams()
      setTeams(data)
    })()
  }, [])

  useEffect(() => {
    form.reset(user)
  }, [user, isOpen])

  const { handleSubmit, control, formState, setError } = form
  const { errors, isSubmitting } = formState

  const buttonProperties = useMemo(() => {
    let text = 'Guardar cambios'
    if (isSubmitting) {
      text = 'Guardando...'
    }
    return {
      text,
      disabled: isSubmitting,
    }
  }, [isSubmitting])

  const onSumbit = async (values: z.infer<typeof userSchema>) => {
    try {
      const updatedUser = await updateUser(user.id, values)
      setUpdatedUser(updatedUser)
      setOpen(false)
    } catch (error) {
      toast.error('Ocurrió un error al actualizar el usuario')
      if (error instanceof AxiosError) {
        setError('root', { message: error.response?.data.detail })
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar usuario</DialogTitle>
          <DialogDescription>Modificar la información de {user.profile.first_name}</DialogDescription>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSumbit)}>
              <FormMessage>{errors.root?.message}</FormMessage>
              <FormField
                control={control}
                name='profile.first_name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder='Ingrese el nombre' {...field} />
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
                      <Input placeholder='Ingrese el apellido' {...field} />
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
                        placeholder='Ingrese el apodo'
                        {...field}
                        value={field.value ?? ''}
                        onChange={({ target }) =>
                          target.value !== '' ? field.onChange(target.value) : field.onChange(null)
                        }
                      />
                    </FormControl>
                    <FormMessage>{errors.profile?.last_name?.message}</FormMessage>
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
                      <Input placeholder='Ingrese el teléfono' {...field} type='number' />
                    </FormControl>
                    <FormMessage>{errors.profile?.last_name?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name='profile.team_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Equipo</FormLabel>
                    <Select onValueChange={value => field.onChange(parseInt(value))} value={field.value.toString()}>
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
              {isAdmin && (
                <>
                  <FormField
                    control={control}
                    name='status'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Seleccione el estado' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={UserStatus.ACTIVE}>Activo</SelectItem>
                            <SelectItem value={UserStatus.INACTIVE}>Inactivo</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage>{errors.profile?.team_id?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name='role_id'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rol</FormLabel>
                        <Select onValueChange={value => field.onChange(parseInt(value))} value={field.value.toString()}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Seleccione el estado' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={UserRole.ADMIN.toString()}>Administrador</SelectItem>
                            <SelectItem value={UserRole.LEADER.toString()}>Líder</SelectItem>
                            <SelectItem value={UserRole.MEMBER.toString()}>Piloto</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage>{errors.profile?.team_id?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                </>
              )}

              <Button className='mt-4 w-full' disabled={buttonProperties.disabled}>
                {buttonProperties.text}
              </Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
