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
        Hola, <span className='font-bold capitalize'>{nickname ?? first_name}</span>✌️
      </p>
      <Navigation />
    </RootLayout>
  )
}
