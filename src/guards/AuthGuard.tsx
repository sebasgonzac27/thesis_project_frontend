import { Navigate, Outlet } from 'react-router-dom'
import { PublicRoutes } from '../routes'
import { UserStatus } from '@/models'
import { toast } from 'sonner'
import { deleteToken } from '@/utils'
import useUserStore from '@/store/user'

export default function AuthGuard() {
  const { user, deleteUser } = useUserStore()

  if (user?.status === UserStatus.ACTIVE) {
    return <Outlet />
  }

  if (user?.status === UserStatus.INACTIVE) {
    toast.error('Tu cuenta está inactiva. Por favor revisa tu bandeja de entrada o contacta con el administrador.')
    deleteUser()
    deleteToken()
  }

  return <Navigate replace to={PublicRoutes.LOGIN} />
}
