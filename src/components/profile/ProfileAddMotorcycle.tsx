import { useForm } from 'react-hook-form'
import { Dialog, DialogHeader, DialogContent, DialogDescription } from '../ui/dialog'
import { z } from 'zod'
import { motorcycleSchema } from '@/schemas/motorcycle'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

interface Props {
  isOpen: boolean
  onOpenchange: (isOpen: boolean) => void
  isEditing?: boolean
  userId: number
}

export function ProfileAddMotorcycle({ isOpen, onOpenchange, isEditing = false, userId }: Readonly<Props>) {
  const form = useForm<z.infer<typeof motorcycleSchema>>({
    resolver: zodResolver(motorcycleSchema),
    defaultValues: {
      model: '',
      license_plate: '',
      photo: '',
      brand_id: 0,
      owner_id: userId,
    },
  })

  const { handleSubmit, control, formState } = form
  const { errors, isSubmitting } = formState

  const onSubmit = async (values: z.infer<typeof motorcycleSchema>) => {
    console.log({ values })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenchange}>
      <DialogContent>
        <DialogHeader>{`${isEditing ? 'Editar' : 'Agregar'} motocicleta`}</DialogHeader>
        <DialogDescription>
          {isEditing
            ? 'Edita la información de la motocicleta.'
            : 'Completa la información para crear una nueva motocicleta.'}
        </DialogDescription>
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
                    <Input placeholder='Ingrese la placa de la motocicleta' type='text' {...field} />
                  </FormControl>
                  <FormMessage>{errors.license_plate?.message}</FormMessage>
                </FormItem>
              )}
            />
            <Button className='mt-4 w-full'>Agregar</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
