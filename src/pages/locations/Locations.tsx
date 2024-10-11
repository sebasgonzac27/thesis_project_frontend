import LocationsList from '@/components/locations/LocationsList'
import { RootLayout } from '@/layouts'

export default function LocationsPage() {
  return (
    <RootLayout title='Locaciones'>
      <LocationsList />
    </RootLayout>
  )
}
