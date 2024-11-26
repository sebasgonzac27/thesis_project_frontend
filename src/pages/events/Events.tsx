import { EventsList } from '@/components'
import { RootLayout } from '@/layouts'

export default function EventsPage() {
  return (
    <RootLayout title='Eventos' withBreadcrumb>
      <EventsList />
    </RootLayout>
  )
}
