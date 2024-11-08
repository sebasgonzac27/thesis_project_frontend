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

  const fetchUserProfile = async (id: number) => {
    const user = await getUser(id)
    setUserProfile(user)
  }

  useEffect(() => {
    if (!id) return
    const idNumber = parseInt(id)
    setIsMyProfile(idNumber === user?.id)
    if (!isMyProfile) {
      ;(async () => {
        await fetchUserProfile(idNumber)
      })()
    }
  }, [id])

  return (
    <RootLayout title={`${isMyProfile ? 'Mi' : ''} Perfil`}>
      <ProfileAvatar user={userProfile} />
      <div className='grid grid-cols-1 md:grid-cols-3 mt-8 gap-5'>
        <ProfileInfo user={userProfile} />
        <div className='md:col-span-2'>
          <ProfileMotorcycles user={userProfile} />
        </div>
      </div>
    </RootLayout>
  )
}
