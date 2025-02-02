import { TeamsList, UsersList } from '@/components'
import { RootLayout } from '@/layouts'
import { UserRole } from '@/models'
import { useAppStore } from '@/store/app'
import { useMemo } from 'react'

export default function TeamsPage() {
  const { role_selected } = useAppStore()

  const title = useMemo(() => (role_selected === UserRole.ADMIN ? 'Equipos' : 'Mi Equipo'), [role_selected])

  return (
    <RootLayout title={title} withBreadcrumb>
      {role_selected === UserRole.ADMIN ? <TeamsList /> : <UsersList />}
    </RootLayout>
  )
}
