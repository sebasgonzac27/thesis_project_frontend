import { BrowserRouter, Navigate, Route } from 'react-router-dom'
import { PrivateRoutes, PublicRoutes } from '@/routes'
import { AuthGuard, RoleGuard } from '@/guards'
import { Suspense, lazy } from 'react'
import { RoutesWithNotFound } from '@/utils'
import { ThemeProvider, Toaster } from '@/components'
import { LoaderSuspense } from './pages'
import { UserRole } from './models'

const LoginPage = lazy(() => import('@/pages/auth/Login'))
const RegisterPage = lazy(() => import('@/pages/auth/Register'))
const ConfirmEmailPage = lazy(() => import('@/pages/auth/ConfirmEmail'))
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPassword'))
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPassword'))
const HomePage = lazy(() => import('@/pages/Home'))
const TeamsPage = lazy(() => import('@/pages/teams/Teams'))
const ChatbotPage = lazy(() => import('@/pages/Chatbot'))

function App() {
  return (
    <ThemeProvider>
      <Toaster position='top-right' richColors expand />
      <Suspense fallback={<LoaderSuspense />}>
        <BrowserRouter>
          <RoutesWithNotFound>
            <Route path='/' element={<Navigate to={PrivateRoutes.HOME} />} />
            {/* Aquí se pueden poner rutas públicas */}
            <Route path={PublicRoutes.LOGIN} element={<LoginPage />} />
            <Route path={PublicRoutes.REGISTER} element={<RegisterPage />} />
            <Route path={`${PublicRoutes.CONFIRM_EMAIL}/:token`} element={<ConfirmEmailPage />} />
            <Route path={PublicRoutes.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
            <Route path={`${PublicRoutes.RESET_PASSWORD}/:token`} element={<ResetPasswordPage />} />
            <Route element={<AuthGuard />}>
              <Route path={PrivateRoutes.HOME} element={<HomePage />} />
              <Route path={PrivateRoutes.CHATBOT} element={<ChatbotPage />} />
              <Route element={<RoleGuard roles={[UserRole.ADMIN]} />}>
                <Route path={PrivateRoutes.TEAMS} element={<TeamsPage />} />
              </Route>
              {/* Aquí se puede poner un componente que solo configure rutas privadas */}
            </Route>
          </RoutesWithNotFound>
        </BrowserRouter>
      </Suspense>
    </ThemeProvider>
  )
}

export default App
