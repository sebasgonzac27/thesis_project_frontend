import { RootLayout } from '@/layouts'
import { useParams } from 'react-router-dom'

export default function TeamPage() {
  const { id } = useParams()

  return <RootLayout title='Nómadas Urbanos'>{id}</RootLayout>
}
