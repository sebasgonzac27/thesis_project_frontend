import { useDispatch } from 'react-redux'
import { resetUser, updateUser } from '../../redux/states/user'
import { PrivateRoutes } from '../../routes'
import { useNavigate } from 'react-router-dom'
import { RootLayout } from '@/layouts'

export default function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogin = () => {
    dispatch(updateUser({ id: 1, name: 'John Doe', email: 'jhon.doe@email.com' }))
    console.log('login...')
    navigate(`/${PrivateRoutes.DASHBOARD}`)
  }

  const handleLogout = () => {
    dispatch(resetUser())
  }

  return (
    <RootLayout>
      <h1>Login</h1>
      <button onClick={handleLogin}>Iniciar sesión</button>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </RootLayout>
  )
}
