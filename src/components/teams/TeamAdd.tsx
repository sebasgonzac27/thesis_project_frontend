import { useForm } from 'react-hook-form'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { z } from 'zod'
import { teamSchema } from '@/schemas'
import { useEffect, useMemo, useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Location, Team } from '@/models'
import { createTeam, getLocations } from '@/services'
import { Button } from '../ui/button'
import { AxiosError } from 'axios'

interface Props {
  open: boolean
  isOpen: (isOpen: boolean) => void
  addTeam: (team: Team) => void
}

export function TeamAdd({ open, isOpen, addTeam }: Readonly<Props>) {
  const form = useForm<z.infer<typeof teamSchema>>({
    defaultValues: {
      name: '',
      location_id: undefined,
    },
    mode: 'all',
  })

  const [locations, setLocations] = useState<Location[]>([])

  const { handleSubmit, control, formState, setError } = form
  const { errors, isSubmitting } = formState

  const onSubmit = async (values: z.infer<typeof teamSchema>) => {
    try {
      const team = await createTeam(values)
      addTeam(team)
      isOpen(false)
    } catch (error) {
      if (error instanceof AxiosError) {
        setError('root', { message: error.response?.data.detail })
      }
    }
  }

  const buttonProperties = useMemo(() => {
    let text = 'Agregar'
    if (isSubmitting) {
      text = 'Guardando...'
    }
    return {
      text,
      disabled: isSubmitting,
    }
  }, [isSubmitting])

  useEffect(() => {
    getLocations().then(({ data }) => setLocations(data))
  }, [])

  return (
    <Dialog open={open} onOpenChange={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar un equipo</DialogTitle>
          <DialogDescription>Llena la información requerida para agregar un nuevo equipo</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormMessage>{errors.root?.message}</FormMessage>
            <FormField
              control={control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder='Ingrese el nombre del equipo' type='text' {...field} />
                  </FormControl>
                  <FormMessage>{errors.name?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name='location_id'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marca</FormLabel>
                  <Select
                    onValueChange={value => field.onChange(parseInt(value))}
                    defaultValue={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Seleccione una ubicación' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {locations.map(({ id, name }) => (
                        <SelectItem value={id.toString()} key={`location-${id}`}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage>{errors.location_id?.message}</FormMessage>
                </FormItem>
              )}
            />
            <Button className='mt-4 w-full' disabled={buttonProperties.disabled}>
              {buttonProperties.text}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
