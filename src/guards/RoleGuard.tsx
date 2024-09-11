import { PrivateRoutes } from '@/routes'
import useUserStore from '@/store/user'
import { Navigate, Outlet } from 'react-router-dom'

interface Props {
  role: number
}

export default function RoleGuard({ role }: Props) {
  const { user } = useUserStore()
  return user?.role_id === role ? <Outlet /> : <Navigate to={PrivateRoutes.HOME} />
}
