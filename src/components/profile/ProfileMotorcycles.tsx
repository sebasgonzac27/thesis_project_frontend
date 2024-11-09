import { useEffect, useState } from 'react'
import Icon from '../shared/Icon'
import { Card } from '../ui/card'
import ProfileMotorcycleCard from './ProfileMotorcycleCard'
import { Motorcycle, User } from '@/models'
import { getMotorcycles } from '@/services/motorcycle'
import { ProfileAddMotorcycle } from './ProfileAddMotorcycle'

interface Props {
  user: User
}

export default function ProfileMotorcycles({ user }: Readonly<Props>) {
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([])
  const [isOpenModal, setIsOpenModal] = useState(false)

  useEffect(() => {
    ;(async () => {
      const { data } = await getMotorcycles({ filter: `owner_id=${user.id}` })
      setMotorcycles(data)
    })()
  }, [user])

  return (
    <div>
      <h2 className='font-bold text-2xl'>Motocicletas</h2>
      <div className='flex gap-3 overflow-x-auto mt-5 items-stretch'>
        {motorcycles.map(motorcycle => (
          <ProfileMotorcycleCard key={motorcycle.id} motorcycle={motorcycle} />
        ))}
        <Card
          className='hover:bg-accent p-4 flex flex-col justify-center items-center gap-2 max-w-40'
          onClick={() => setIsOpenModal(true)}>
          <Icon name='Plus' size={30} />
          <p className='text-center text-pretty'>Añadir motocicleta</p>
        </Card>
      </div>
      <ProfileAddMotorcycle
        isOpen={isOpenModal}
        onOpenchange={setIsOpenModal}
        userId={user.id}
        updateMotorcycles={motorcycle => setMotorcycles(prev => [...prev, motorcycle])}
      />
    </div>
  )
}
