import { BrowserRouter, Navigate, Route } from 'react-router-dom'
import { PrivateRoutes, PublicRoutes } from '@/routes'
import { AuthGuard } from '@/guards'
import { Suspense, lazy } from 'react'
import { Provider } from 'react-redux'
import store from '@/redux/store'
import RoutesWithNotFound from '@/utils/routes-with-not-found'
import { ThemeProvider } from '@/components'

const Login = lazy(() => import('@/pages/Login/Login'))
const Dashboard = lazy(() => import('@/pages/Dashboard/Dashboard'))
const Member = lazy(() => import('@/pages/Member/Member'))

function App() {
  return (
    <Suspense fallback={<h1>Cargando...</h1>}>
      <Provider store={store}>
        <ThemeProvider>
          <BrowserRouter>
            <RoutesWithNotFound>
              <Route path='/' element={<Navigate to={PrivateRoutes.DASHBOARD} />} />
              <Route path={PublicRoutes.LOGIN} element={<Login />} />
              <Route element={<AuthGuard />}>
                <Route path={PrivateRoutes.DASHBOARD} element={<Dashboard />} />
                <Route path={PrivateRoutes.MEMBER} element={<Member />} />
                {/* Aquí se puede poner un componente que solo configure rutas privadas */}
              </Route>
            </RoutesWithNotFound>
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    </Suspense>
  )
}

export default App
