import { PqrsList } from '@/components'
import { RootLayout } from '@/layouts'

export default function PqrsPage() {
  return (
    <RootLayout title='PQRS' withBreadcrumb>
      <PqrsList />
    </RootLayout>
  )
}
