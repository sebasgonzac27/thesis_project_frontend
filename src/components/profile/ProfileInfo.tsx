import useUserStore from '@/store/user'
import Icon from '../shared/Icon'
import { formatDate } from '@/utils'
import { getLocation, getTeam } from '@/services'
import { useEffect, useState } from 'react'

export default function ProfileInfo() {
  const { user } = useUserStore()
  const [locationName, setLocationname] = useState('')

  useEffect(() => {
    ;(async () => {
      const team = await getTeam(user!.profile.team_id)
      const location = await getLocation(team.location_id)
      setLocationname(location.name)
    })()
  }, [user])

  return (
    <div>
      <h2 className='font-bold text-2xl '>Información</h2>
      <ul className='flex flex-col gap-3 items-start mt-4'>
        <li className='inline-flex gap-4'>
          <Icon name='Cake' />
          <span>{formatDate(user!.profile.birthdate)}</span>
        </li>
        <li className='inline-flex gap-4'>
          <Icon name='MapPinHouse' />
          <span>{locationName}</span>
        </li>
        <li className='inline-flex gap-4 capitalize'>
          <Icon name='PersonStanding' />
          <span>{user!.profile.genre}</span>
        </li>
        <li className='inline-flex gap-4'>
          <Icon name='IdCard' />
          <span>{user!.profile.document_number}</span>
        </li>
        <li className='inline-flex gap-4'>
          <Icon name='Mail' />
          <span>{user!.email}</span>
        </li>
        <li className='inline-flex gap-4'>
          <Icon name='Phone' />
          <span>{user!.profile.telephone}</span>
        </li>
      </ul>
    </div>
  )
}
