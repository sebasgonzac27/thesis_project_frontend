import { TeamsList } from '@/components'
import { RootLayout } from '@/layouts'

export default function TeamsPage() {
  return (
    <RootLayout>
      <h1 className='font-bold text-3xl'>Administración de equipos</h1>
      <TeamsList />
    </RootLayout>
  )
}
