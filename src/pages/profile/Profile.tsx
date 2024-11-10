import ProfileAvatar from '@/components/profile/ProfileAvatar'
import ProfileMotorcycles from '@/components/profile/ProfileMotorcycles'
import ProfileInfo from '@/components/profile/ProfileInfo'
import { RootLayout } from '@/layouts'
import useUserStore from '@/store/user'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { User } from '@/models'
import { getUser } from '@/services'

export default function ProfilePage() {
  const { user } = useUserStore()
  const { id } = useParams()
  const [userProfile, setUserProfile] = useState<User>(user!)
  const [isMyProfile, setIsMyProfile] = useState(false)

  useEffect(() => {
    if (id) {
      fetchUserProfile(+id).then(fetchedUser => {
        if (!fetchedUser) return
        setUserProfile(fetchedUser)
        setIsMyProfile(user?.id === fetchedUser.id)
      })
    }
  }, [id])

  const fetchUserProfile = async (id: number) => {
    try {
      const fetchedUser = await getUser(id)
      return fetchedUser
    } catch (error) {
      console.error('Error al cargar el perfil del usuario:', error)
    }
  }

  return (
    <RootLayout title={`${isMyProfile ? 'Mi' : ''} Perfil`}>
      <ProfileAvatar user={userProfile} />
      <hr className='my-8'></hr>
      <div className='grid grid-cols-1 md:grid-cols-3 mt-4 gap-5'>
        <ProfileInfo user={userProfile} setUpdatedUser={setUserProfile} />
        <div className='md:col-span-2'>
          <ProfileMotorcycles user={userProfile} />
        </div>
      </div>
    </RootLayout>
  )
}
