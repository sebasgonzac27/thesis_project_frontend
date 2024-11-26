import { PqrsList } from '@/components'
import { RootLayout } from '@/layouts'

export default function PqrsPage() {
  return (
    <RootLayout title='Pqrs' withBreadcrumb>
      <PqrsList />
    </RootLayout>
  )
}
