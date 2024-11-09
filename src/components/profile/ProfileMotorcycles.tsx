import { useEffect, useState } from 'react'
import Icon from '../shared/Icon'
import { Card } from '../ui/card'
import ProfileMotorcycleCard from './ProfileMotorcycleCard'
import { Motorcycle, User } from '@/models'
import { getMotorcycles } from '@/services/motorcycle'
import { ProfileAddMotorcycle } from './ProfileAddMotorcycle'
import { Button } from '../ui/button'

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
      <div className='flex justify-between items-center'>
        <h2 className='font-bold text-2xl'>Motocicletas</h2>
        <Button variant='secondary' onClick={() => setIsOpenModal(true)}>
          <Icon name='Plus' size={20} />
          <span className='ml-2'>Añadir</span>
        </Button>
      </div>
      <div className='flex gap-3 overflow-x-auto mt-5 items-stretch pb-2'>
        {motorcycles.map(motorcycle => (
          <ProfileMotorcycleCard key={motorcycle.id} motorcycle={motorcycle} />
        ))}
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
