import { useEffect, useState } from 'react'
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
  Textarea,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTrigger,
  DialogTitle,
} from '@/components'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { SelectValue } from '@radix-ui/react-select'
import { toast } from 'sonner'
import { EventType, Event, LocationType, Location, UserRole } from '@/models'
import { getLocations, createEvent } from '@/services'
import useUserStore from '@/store/user'
import { useAppStore } from '@/store/app'

// Mensajes de error del formulario
const eventSchema = z
  .object({
    name: z.string().min(1, 'El nombre del evento es obligatorio'),
    description: z.string().min(1, 'La descripción es obligatoria'),
    type: z.nativeEnum(EventType, { errorMap: () => ({ message: 'El tipo de evento es inválido' }) }),
    meeting_point: z.string().min(1, 'El punto de encuentro es obligatorio'),
    department: z.string().min(1, 'El departamento es obligatorio'),
    city: z.string().min(1, 'La ciudad es obligatoria'),
    start_date: z.date({ required_error: 'La fecha de inicio es obligatoria' }),
    end_date: z.date({ required_error: 'La fecha de finalización es obligatoria' }),
  })
  .superRefine(({ end_date, start_date }, ctx) => {
    if (end_date < start_date) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'La fecha de finalización debe ser posterior a la fecha de inicio',
        path: ['end_date'],
      })
    }
  })

export default function EventCreateForm() {
  const { role_selected } = useAppStore()

  // Define el esquema del formulario
  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      type: EventType.Ride,
      name: '',
      description: '',
      start_date: new Date(),
      end_date: new Date(),
      meeting_point: '',
      department: '',
      city: '',
    },
    mode: 'all',
  })

  const { handleSubmit, control, formState } = form
  const { errors, isSubmitting } = formState

  const { user } = useUserStore()

  const [departments, setDepartments] = useState<Location[]>([])
  const [cities, setCities] = useState<Location[]>([])
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null)

  const [isOpen, setIsOpen] = useState(false)

  // Obtiene las ubicaciones
  useEffect(() => {
    const fetchDepartments = async () => {
      const { data: locations } = await getLocations() // Extraer `data` de la respuesta
      const departments = locations.filter(loc => loc.type === LocationType.Department)
      setDepartments(departments)
    }
    fetchDepartments()
  }, [])

  const handleDepartmentChange = async (value: string) => {
    const departmentId = Number(value)
    setSelectedDepartment(departmentId)

    const { data: allLocations } = await getLocations({
      filter: `department_id=${departmentId}`,
      skip: 0,
      limit: 500,
      sort: 'name',
    })
    const filteredCities = allLocations.filter(loc => loc.type === LocationType.City)
    setCities(filteredCities)
  }

  // Lógica para la creación del evento en la BD
  const onSubmit = async (values: z.infer<typeof eventSchema>) => {
    try {
      const { city, description, end_date, meeting_point, name, start_date, type } = values

      const event: Partial<Event> = {
        name: name,
        description: description,
        type: type,
        meeting_point: meeting_point,
        location_id: Number(city),
        start_date: start_date,
        end_date: end_date,
        organizer_id: user?.id,
        team_id: user?.profile?.team_id,
        path_id: 0,
      }
      console.log(event)
      await createEvent(event)
      toast.success('Evento creado exitosamente')
      form.reset()
    } catch (error) {
      console.error(error)
      toast.error('Hubo un error al crear el evento')
    }
  }

  // Función para formatear la fecha en el formato local "YYYY-MM-DDTHH:mm"
  const formatLocalDateTime = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const dateDay = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${dateDay}T${hours}:${minutes}`
  }

  return (
    <>
      {[UserRole.ADMIN, UserRole.LEADER].includes(role_selected!) && (
        <div className='flex flex-col sm:flex-row sm:justify-end'>
          <Button className='w-full sm:w-auto' onClick={() => setIsOpen(true)}>
            Agregar Evento
          </Button>
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger />
        <DialogContent className='max-w-lg max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Crear Evento</DialogTitle>
          </DialogHeader>
          <DialogDescription>Llena el formulario para crear un nuevo evento.</DialogDescription>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-2'>
              <FormMessage>{errors.root?.message}</FormMessage>

              <div className='grid grid-cols-1'>
                <FormField
                  control={control}
                  name='type'
                  render={({ field }) => (
                    <FormItem className='mt-4'>
                      <FormLabel>Tipo de Evento</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Seleccione el tipo de evento' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(EventType).map(([key, value]) => (
                            <SelectItem value={value} key={key}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage>{errors.type?.message}</FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name='name'
                  render={({ field }) => (
                    <FormItem className='mt-4'>
                      <FormLabel>Nombre del Evento</FormLabel>
                      <FormControl>
                        <Input placeholder='Ingrese el nombre del evento' {...field} />
                      </FormControl>
                      <FormMessage>{errors.name?.message}</FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name='description'
                  render={({ field }) => (
                    <FormItem className='mt-4'>
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <Textarea placeholder='Descripción del evento' {...field} />
                      </FormControl>
                      <FormMessage>{errors.description?.message}</FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name='start_date'
                  render={({ field }) => (
                    <FormItem className='mt-4'>
                      <FormLabel>Fecha y hora de Inicio</FormLabel>
                      <FormControl>
                        <Input
                          type='datetime-local'
                          {...field}
                          value={field.value ? formatLocalDateTime(new Date(field.value)) : ''}
                          onChange={e => {
                            const dateValue = new Date(e.target.value)
                            field.onChange(dateValue)
                          }}
                        />
                      </FormControl>
                      <FormMessage>{errors.start_date?.message}</FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name='end_date'
                  render={({ field }) => (
                    <FormItem className='mt-4'>
                      <FormLabel>Fecha y hora de Finalización</FormLabel>
                      <FormControl>
                        <Input
                          type='datetime-local'
                          {...field}
                          value={field.value ? formatLocalDateTime(new Date(field.value)) : ''}
                          onChange={e => {
                            const dateValue = new Date(e.target.value)
                            field.onChange(dateValue)
                          }}
                        />
                      </FormControl>
                      <FormMessage>{errors.end_date?.message}</FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name='department'
                  render={({ field }) => (
                    <FormItem className='mt-4'>
                      <FormLabel>Departamento</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={value => {
                            field.onChange(value)
                            handleDepartmentChange(value)
                          }}
                          defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Seleccione un departamento' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {departments.map(department => (
                              <SelectItem value={String(department.id)} key={department.id}>
                                {department.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage>{errors.department?.message}</FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name='city'
                  render={({ field }) => (
                    <FormItem className='mt-4'>
                      <FormLabel>Ciudad</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Seleccione una ciudad' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {cities.map(city => (
                              <SelectItem value={String(city.id)} key={city.id}>
                                {city.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage>{errors.city?.message}</FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name='meeting_point'
                  render={({ field }) => (
                    <FormItem className='mt-4'>
                      <FormLabel>Punto de Encuentro</FormLabel>
                      <FormControl>
                        <Input placeholder='Ingrese el punto de encuentro' {...field} />
                      </FormControl>
                      <FormMessage>{errors.meeting_point?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              <Button className='mt-4 w-full' disabled={isSubmitting}>
                {isSubmitting ? 'Creando...' : 'Crear Evento'}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
