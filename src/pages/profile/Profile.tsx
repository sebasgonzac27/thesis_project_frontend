import ProfileAvatar from '@/components/profile/ProfileAvatar'
import ProfileMotorcycles from '@/components/profile/ProfileMotorcycles'
import ProfileInfo from '@/components/profile/ProfileInfo'
import { RootLayout } from '@/layouts'
import useUserStore from '@/store/user'

export default function ProfilePage() {
  const { user } = useUserStore()
  return (
    <RootLayout title='Mi Perfil'>
      <ProfileAvatar user={user!} />
      <div className='grid grid-cols-1 md:grid-cols-3 mt-8 gap-5'>
        <ProfileInfo />
        <div className='md:col-span-2'>
          <ProfileMotorcycles user={user!} />
        </div>
      </div>
    </RootLayout>
  )
}
