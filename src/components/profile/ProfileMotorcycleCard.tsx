import { Motorcycle } from '@/models/motorcycle'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import Icon from '../shared/Icon'
import { useEffect, useMemo, useState } from 'react'
import { getBrand } from '@/services/brand'
import { Brand, UserRole } from '@/models'
import { deleteMotorcycle } from '@/services/motorcycle'
import { toast } from 'sonner'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from '../ui/dialog'
import { DialogTitle } from '@radix-ui/react-dialog'
import { Button } from '../ui/button'
import useUserStore from '@/store/user'
import { useAppStore } from '@/store/app'

interface Props {
  motorcycle: Motorcycle
  removeMotorcycle: (id: number) => void
}

export default function ProfileMotorcycleCard({ motorcycle, removeMotorcycle }: Readonly<Props>) {
  const [brand, setBrand] = useState<Brand>()

  const { isSameUser } = useUserStore()
  const { role_selected } = useAppStore()

  const isMyProfile = useMemo(() => isSameUser(motorcycle.owner_id), [motorcycle])
  const isAdmin = useMemo(() => role_selected === UserRole.ADMIN, [role_selected])

  useEffect(() => {
    ;(async () => {
      const brand = await getBrand(motorcycle.brand_id)
      setBrand(brand)
    })()
  }, [])

  const handleDelete = async () => {
    try {
      await deleteMotorcycle(motorcycle.id)
      removeMotorcycle(motorcycle.id)
    } catch {
      toast.error('No se pudo eliminar la motocicleta')
    }
  }

  return (
    <Card className='p-2 min-w-40 relative'>
      {(isMyProfile || isAdmin) && (
        <Dialog>
          <DialogTrigger asChild>
            <div className='absolute top-2 right-2 hover:bg-accent rounded-full p-1 '>
              <Icon name='CircleMinus' color='red' />
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Eliminar motocicleta</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              ¿Estás seguro que deseas eliminar la motocicleta con placa <b>{motorcycle.license_plate}</b>?
            </DialogDescription>
            <DialogFooter>
              <div className='flex justify-end gap-3 mt-5'>
                <DialogClose asChild>
                  <Button onClick={() => handleDelete()}>Eliminar</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button variant='secondary'>Cancelar</Button>
                </DialogClose>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      <CardHeader>
        <Icon name='Bike' size={50} className='mx-auto' />
        <CardTitle className='text-xl text-center font-bold'>{motorcycle.license_plate}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className='text-primary font-bold'>{brand?.name}</CardDescription>
        <CardDescription className='text-foreground'>{motorcycle.model}</CardDescription>
      </CardContent>
    </Card>
  )
}
