import { UserRole } from '@/models'
import { PrivateRoutes } from '@/routes'
import { useAppStore } from '@/store/app'
import { Navigate, Outlet } from 'react-router-dom'

interface Props {
  roles: UserRole[]
}

export default function RoleGuard({ roles }: Props) {
  const { role_selected } = useAppStore()
  return role_selected && roles.includes(role_selected) ? <Outlet /> : <Navigate to={PrivateRoutes.HOME} />
}
