import { TeamsList } from '@/components'
import { RootLayout } from '@/layouts'

export default function TeamsPage() {
  return (
    <RootLayout title='Equipos' withBreadcrumb>
      <TeamsList />
    </RootLayout>
  )
}
