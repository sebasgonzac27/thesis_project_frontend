import { TeamsList } from '@/components'
import { RootLayout } from '@/layouts'
import { UserRole } from '@/models'
import { useAppStore } from '@/store/app'

export default function TeamsPage() {
  const { role_selected } = useAppStore()
  return (
    <RootLayout title='Equipos' withBreadcrumb>
      {role_selected === UserRole.ADMIN && <TeamsList />}
      {role_selected === UserRole.LEADER && <h1>Leader</h1>}
      {role_selected === UserRole.MEMBER && <h1>Member</h1>}
    </RootLayout>
  )
}
