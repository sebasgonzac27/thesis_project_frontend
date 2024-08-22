import { BrowserRouter, Navigate, Route } from 'react-router-dom'
import { PrivateRoutes, PublicRoutes } from '@/routes'
import { AuthGuard } from '@/guards'
import { Suspense, lazy } from 'react'
import { Provider } from 'react-redux'
import store from '@/redux/store'
import { RoutesWithNotFound } from '@/utils'
import { Loader, ThemeProvider, Toaster } from '@/components'

const LoginPage = lazy(() => import('@/pages/auth/Login'))
const RegisterPage = lazy(() => import('@/pages/auth/Register'))
const HomePage = lazy(() => import('@/pages/Home'))

function App() {
  return (
    <ThemeProvider>
      <Toaster />
      <Suspense fallback={<Loader />}>
        <Provider store={store}>
          <BrowserRouter>
            <RoutesWithNotFound>
              <Route path='/' element={<Navigate to={PrivateRoutes.HOME} />} />
              <Route path={PublicRoutes.LOGIN} element={<LoginPage />} />
              <Route path={PublicRoutes.REGISTER} element={<RegisterPage />} />
              <Route element={<AuthGuard />}>
                <Route path={PrivateRoutes.HOME} element={<HomePage />} />
                {/* Aquí se puede poner un componente que solo configure rutas privadas */}
              </Route>
            </RoutesWithNotFound>
          </BrowserRouter>
        </Provider>
      </Suspense>
    </ThemeProvider>
  )
}

export default App
