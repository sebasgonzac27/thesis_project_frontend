import { AgreementList } from '@/components'
import { RootLayout } from '@/layouts'

export default function AgreementPage() {
  return (
    <RootLayout title='Convenios' withBreadcrumb>
      <AgreementList />
    </RootLayout>
  )
}
