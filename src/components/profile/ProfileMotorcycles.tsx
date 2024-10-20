import { useEffect, useState } from 'react'
import Icon from '../shared/Icon'
import { Card } from '../ui/card'
import ProfileMotorcycleCard from './ProfileMotorcycleCard'
import { Motorcycle, User } from '@/models'
import { getMotorcycles } from '@/services/motorcycle'

interface Props {
  user: User
}

export default function ProfileMotorcycles({ user }: Props) {
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([])

  useEffect(() => {
    ;(async () => {
      const { data } = await getMotorcycles({ filter: `owner_id=${user.id}` })
      setMotorcycles(data)
    })()
  }, [user])

  return (
    <div>
      <h2 className='font-bold text-2xl'>Motocicletas</h2>
      <div className='flex gap-3  overflow-x-auto py-4'>
        {motorcycles.map(motorcycle => (
          <ProfileMotorcycleCard key={motorcycle.id} motorcycle={motorcycle} />
        ))}
        <Card className='hover:bg-accent min-w-36'>
          <Icon name='Plus' size={60} className='m-auto h-full' />
        </Card>
      </div>
    </div>
  )
}
