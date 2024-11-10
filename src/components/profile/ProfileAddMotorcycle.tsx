import { useForm } from 'react-hook-form'
import { Dialog, DialogHeader, DialogContent, DialogDescription } from '../ui/dialog'
import { z } from 'zod'
import { motorcycleSchema } from '@/schemas/motorcycle'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useEffect, useMemo, useState } from 'react'
import { Brand, Motorcycle } from '@/models'
import { getBrands } from '@/services/brand'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { createMotorcycle } from '@/services/motorcycle'
import { AxiosError } from 'axios'
import { DialogTitle } from '@radix-ui/react-dialog'

interface Props {
  isOpen: boolean
  onOpenchange: (isOpen: boolean) => void
  userId: number
  addMotorcycle: (motorcycle: Motorcycle) => void
}

export function ProfileAddMotorcycle({ isOpen, onOpenchange, userId, addMotorcycle }: Readonly<Props>) {
  const [brands, setBrands] = useState<Brand[]>([])

  const form = useForm<z.infer<typeof motorcycleSchema>>({
    resolver: zodResolver(motorcycleSchema),
    defaultValues: {
      model: '',
      license_plate: '',
      photo: null,
      brand_id: undefined,
      owner_id: userId,
    },
    mode: 'all',
  })

  useEffect(() => {
    form.setValue('owner_id', userId)
  }, [userId])

  const { handleSubmit, control, formState, setError } = form
  const { errors, isSubmitting } = formState

  const onSubmit = async (values: z.infer<typeof motorcycleSchema>) => {
    await addMotorcycleApi(values)
  }

  const addMotorcycleApi = async (motorcycle: z.infer<typeof motorcycleSchema>) => {
    try {
      const moto = await createMotorcycle(motorcycle)
      addMotorcycle(moto)
      onOpenchange(false)
      form.reset()
    } catch (error) {
      console.error(error)
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
    ;(async () => {
      const { data } = await getBrands()
      setBrands(data)
    })()
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={onOpenchange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar motocicleta</DialogTitle>
          <DialogDescription>Completa la información para crear una nueva motocicleta.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormMessage>{errors.root?.message}</FormMessage>
            <FormField
              control={control}
              name='model'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modelo</FormLabel>
                  <FormControl>
                    <Input placeholder='Ingrese el modelo de la motocicleta' type='number' {...field} />
                  </FormControl>
                  <FormMessage>{errors.model?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name='license_plate'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Placa</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Ingrese la placa de la motocicleta'
                      type='text'
                      {...field}
                      onChange={e => field.onChange(e.target.value.toUpperCase())}
                    />
                  </FormControl>
                  <FormMessage>{errors.license_plate?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name='brand_id'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marca</FormLabel>
                  <Select
                    onValueChange={value => field.onChange(parseInt(value))}
                    defaultValue={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Seleccione una marca' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {brands.map(({ id, name }) => (
                        <SelectItem value={id.toString()} key={`brand-${id}`}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage>{errors.brand_id?.message}</FormMessage>
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
