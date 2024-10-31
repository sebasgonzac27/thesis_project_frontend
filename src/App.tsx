import { BrowserRouter, Navigate, Route } from 'react-router-dom'
import { PrivateRoutes, PublicRoutes } from '@/routes'
import { AuthGuard, RoleGuard } from '@/guards'
import { Suspense, lazy } from 'react'
import { RoutesWithNotFound } from '@/utils'
import { ThemeProvider, Toaster } from '@/components'
import LoaderSuspense from '@/pages/LoaderSuspense'
import { UserRole } from '@/models'

const LoginPage = lazy(() => import('@/pages/auth/Login'))
const RegisterPage = lazy(() => import('@/pages/auth/Register'))
const ConfirmEmailPage = lazy(() => import('@/pages/auth/ConfirmEmail'))
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPassword'))
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPassword'))
const HomePage = lazy(() => import('@/pages/home/Home'))
const ProfilePage = lazy(() => import('@/pages/profile/Profile'))
const LocationsPage = lazy(() => import('@/pages/locations/Locations'))
const TeamsPage = lazy(() => import('@/pages/teams/Teams'))
const ChatbotPage = lazy(() => import('@/pages/chatbot/Chatbot'))
const EventsPage = lazy(() => import('@/pages/events/Events'))
const PqrsPage = lazy(() => import('@/pages/pqrs/Pqrs'))
const AgreementPage = lazy(() => import('@/pages/agreements/Agreements'))

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

            {/* Aquí van las rutas que requieren autenticación */}
            <Route element={<AuthGuard />}>
              <Route path={PrivateRoutes.HOME} element={<HomePage />} />
              <Route path={PrivateRoutes.PROFILE} element={<ProfilePage />} />
              <Route path={PrivateRoutes.CHATBOT} element={<ChatbotPage />} />
              <Route path={PrivateRoutes.EVENTS} element={<EventsPage />} />
              <Route path={PrivateRoutes.PQRS} element={<PqrsPage />} />
              <Route path={PrivateRoutes.AGREEMENTS} element={<AgreementPage />} />
              <Route element={<RoleGuard roles={[UserRole.ADMIN]} />}>
                <Route path={PrivateRoutes.LOCATIONS} element={<LocationsPage />} />
                <Route path={PrivateRoutes.TEAMS} element={<TeamsPage />} />
              </Route>
            </Route>
          </RoutesWithNotFound>
        </BrowserRouter>
      </Suspense>
    </ThemeProvider>
  )
}

export default App
