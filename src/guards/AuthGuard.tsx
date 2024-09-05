import { useDispatch, useSelector } from 'react-redux'
import { AppStore } from '../redux/store'
import { Navigate, Outlet } from 'react-router-dom'
import { PublicRoutes } from '../routes'
import { UserStatus } from '@/models'
import { toast } from 'sonner'
import { resetUser } from '@/redux/states/user'
import { deleteToken } from '@/utils'

export default function AuthGuard() {
  const userState = useSelector((store: AppStore) => store.user)
  const dispatch = useDispatch()

  if (userState && userState.status === UserStatus.ACTIVE) {
    return <Outlet />
  }

  if (userState && userState.status === UserStatus.INACTIVE) {
    toast.error('Tu cuenta está inactiva. Por favor revisa tu bandeja de entrada o contacta con el administrador.')
    dispatch(resetUser())
    deleteToken()
  }

  return <Navigate replace to={PublicRoutes.LOGIN} />
}
