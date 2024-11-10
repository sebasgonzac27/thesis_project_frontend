import { useEffect, useState } from 'react'
import Icon from '../shared/Icon'
import ProfileMotorcycleCard from './ProfileMotorcycleCard'
import { Motorcycle, User } from '@/models'
import { ProfileAddMotorcycle } from './ProfileAddMotorcycle'
import { Button } from '../ui/button'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { getUserMotorcycles } from '@/services'

interface Props {
  user: User
}

export default function ProfileMotorcycles({ user }: Readonly<Props>) {
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([])
  const [isOpenModal, setIsOpenModal] = useState(false)

  useEffect(() => {
    ;(async () => {
      const data = await getUserMotorcycles(user.id)
      setMotorcycles(data)
    })()
  }, [])

  const handleAddMotorcycle = () => {
    setIsOpenModal(true)
  }

  const addMotorcycle = (motorcycle: Motorcycle) => {
    setMotorcycles(prev => [...prev, motorcycle])
  }

  const removeMotorcycle = (id: number) => {
    const newMotorcycles = motorcycles.filter(m => m.id !== id)
    setMotorcycles(newMotorcycles)
  }

  return (
    <div>
      <div className='flex justify-between items-center mb-5'>
        <h2 className='font-bold text-2xl'>Motocicletas</h2>
        <Button variant='secondary' onClick={handleAddMotorcycle}>
          <Icon name='Plus' size={20} />
          <span className='ml-2'>Añadir</span>
        </Button>
      </div>
      {motorcycles.length > 0 ? (
        <div className='flex gap-3 overflow-x-auto items-stretch pb-2'>
          {motorcycles.map(motorcycle => (
            <ProfileMotorcycleCard key={motorcycle.id} motorcycle={motorcycle} />
          ))}
        </div>
      ) : (
        <Alert>
          <AlertTitle>Aún no tienes motocicletas registradas</AlertTitle>
          <AlertDescription>Registra tus motocicletas para verlas en esta sección</AlertDescription>
        </Alert>
      )}

      <ProfileAddMotorcycle
        isOpen={isOpenModal}
        onOpenchange={setIsOpenModal}
        userId={user.id}
        addMotorcycle={addMotorcycle}
      />
    </div>
  )
}
