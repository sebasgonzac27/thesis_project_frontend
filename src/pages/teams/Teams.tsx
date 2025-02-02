import { TeamsList, UsersList } from '@/components'
import { RootLayout } from '@/layouts'
import { UserRole } from '@/models'
import { useAppStore } from '@/store/app'
import useUserStore from '@/store/user'
import { useMemo } from 'react'

export default function TeamsPage() {
  const { role_selected } = useAppStore()
  const { user } = useUserStore()

  const title = useMemo(() => (role_selected === UserRole.ADMIN ? 'Equipos' : 'Mi Equipo'), [role_selected])

  return (
    <RootLayout title={title} withBreadcrumb>
      {role_selected === UserRole.ADMIN ? <TeamsList /> : <UsersList team_id={user?.profile.team_id} />}
    </RootLayout>
  )
}
