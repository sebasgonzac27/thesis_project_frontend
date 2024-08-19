import { useSelector } from 'react-redux'
import { AppStore } from '../redux/store'
import { Navigate, Outlet } from 'react-router-dom'
import { PublicRoutes } from '../routes'
import { UserStatus } from '@/models'

export default function AuthGuard() {
  const userState = useSelector((store: AppStore) => store.user)

  if (userState && userState.status === UserStatus.ACTIVE) {
    return <Outlet />
  }

  return <Navigate replace to={PublicRoutes.LOGIN} />
}
