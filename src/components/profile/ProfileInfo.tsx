import Icon from '../shared/Icon'
import { formatDate } from '@/utils'
import { getLocation, getTeam } from '@/services'
import { useEffect, useMemo, useState } from 'react'
import { UserWithProfile, UserRole } from '@/models'
import { Button } from '../ui/button'
import { ProfileEditUser } from './ProfileEditUser'
import useUserStore from '@/store/user'
import { useAppStore } from '@/store/app'

interface Props {
  user: UserWithProfile
  setUpdatedUser: (user: UserWithProfile) => void
}

export default function ProfileInfo({ user, setUpdatedUser }: Readonly<Props>) {
  const [locationName, setLocationName] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const { isSameUser } = useUserStore()
  const { role_selected } = useAppStore()

  const isMyProfile = useMemo(() => isSameUser(user.id), [user])
  const isAdmin = useMemo(() => role_selected === UserRole.ADMIN, [role_selected])

  useEffect(() => {
    ;(async () => {
      const team = await getTeam(user.profile.team_id)
      const location = await getLocation(team.location_id)
      setLocationName(location.name)
    })()
  }, [user])

  const handleEditInfo = () => {
    if (!isMyProfile && !isAdmin) return
    setIsOpen(true)
  }

  return (
    <>
      <div>
        <div className='flex justify-between items-center'>
          <h2 className='font-bold text-2xl '>Información</h2>
          {(isMyProfile || isAdmin) && (
            <Button variant='secondary' onClick={handleEditInfo}>
              <Icon name='Pencil' size={15} />
              <span className='ml-2'>Editar</span>
            </Button>
          )}
        </div>
        <ul className='flex flex-col gap-3 items-start mt-4'>
          <li className='inline-flex gap-4'>
            <Icon name='Cake' />
            <span>{formatDate(user.profile.birthdate)}</span>
          </li>
          <li className='inline-flex gap-4'>
            <Icon name='MapPinHouse' />
            <span>{locationName}</span>
          </li>
          <li className='inline-flex gap-4 capitalize'>
            <Icon name='PersonStanding' />
            <span>{user.profile.genre}</span>
          </li>
          <li className='inline-flex gap-4'>
            <Icon name='IdCard' />
            <span>{user.profile.document_number}</span>
          </li>
          <li className='inline-flex gap-4'>
            <Icon name='Mail' />
            <span>{user.email}</span>
          </li>
          <li className='inline-flex gap-4'>
            <Icon name='Phone' />
            <span>{user.profile.telephone}</span>
          </li>
        </ul>
      </div>
      <ProfileEditUser user={user} isOpen={isOpen} setOpen={setIsOpen} setUpdatedUser={setUpdatedUser} />
    </>
  )
}
