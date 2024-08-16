import { useSelector } from 'react-redux'
import { AppStore } from '../redux/store'
import { Navigate, Outlet } from 'react-router-dom'
import { PublicRoutes } from '../routes'

export default function AuthGuard() {
  const userState = useSelector((store: AppStore) => store.user)
  return userState.name ? <Outlet /> : <Navigate replace to={PublicRoutes.LOGIN} />
}
