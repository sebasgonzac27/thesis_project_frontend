import { Navigation } from '@/components'
import { RootLayout } from '@/layouts'
import useUserStore from '@/store/user'

export default function HomePage() {
  const { user } = useUserStore()
  const { profile } = user!
  const { first_name, nickname } = profile

  return (
    <RootLayout>
      <p className='text-3xl'>
        Hola, <span className='font-bold capitalize'>{nickname ? nickname : first_name}</span>✌️
      </p>
      <p className='text-xl'>Nos encanta saludarte de nuevo!</p>
      <p className='text-xl'>No te pierdas las últimas noticias de tu club Nómadas Urbanos Colombia</p>
      <Navigation />
    </RootLayout>
  )
}
