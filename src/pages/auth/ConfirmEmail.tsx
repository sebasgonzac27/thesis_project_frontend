import { ConfirmEmail } from '@/components'
import { AuthLayout } from '@/layouts'
import { useParams } from 'react-router-dom'

export default function ConfirmEmailPage() {
  const { token } = useParams()
  return <AuthLayout>{token && <ConfirmEmail token={token} />}</AuthLayout>
}
