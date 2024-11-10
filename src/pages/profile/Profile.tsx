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
    if (!id) return

    const idNumber = parseInt(id)

    // Verifica si es el perfil del usuario actual
    const esMiPerfil = idNumber === user?.id
    setIsMyProfile(esMiPerfil)

    // Si no es el perfil del usuario actual, carga el perfil del usuario desde el servicio
    if (!esMiPerfil) {
      fetchUserProfile(idNumber)
    }
  }, [])

  // Función para cargar el perfil del usuario
  const fetchUserProfile = async (id: number) => {
    try {
      const fetchedUser = await getUser(id)
      setUserProfile(fetchedUser)
    } catch (error) {
      console.error('Error al cargar el perfil del usuario:', error)
    }
  }

  return (
    <RootLayout title={`${isMyProfile ? 'Mi' : ''} Perfil`}>
      <ProfileAvatar user={userProfile} />
      <hr className='my-8'></hr>
      <div className='grid grid-cols-1 md:grid-cols-3 mt-4 gap-5'>
        <ProfileInfo user={userProfile} />
        <div className='md:col-span-2'>
          <ProfileMotorcycles user={userProfile} />
        </div>
      </div>
    </RootLayout>
  )
}
