import { UsersList } from '@/components'
import { RootLayout } from '@/layouts'

export default function UsersPage() {
  return (
    <RootLayout title='Usuarios' withBreadcrumb>
      <UsersList />
    </RootLayout>
  )
}
