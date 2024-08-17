import { AppStore } from '@/redux/store'
import { PrivateRoutes } from '@/routes'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

interface Props {
  role: string
}

export default function RoleGuard({ role }: Props) {
  const userState = useSelector((state: AppStore) => state.user)
  return userState.role === role ? <Outlet /> : <Navigate to={PrivateRoutes.DASHBOARD} />
}
