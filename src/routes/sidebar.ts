import { IconName } from '@/components'
import { UserRole } from '@/models'
import { PrivateRoutes } from './routes'

interface Route {
  name: string
  path: string
  icon: IconName
  roles: UserRole[]
}

export const SIDEBAR_ROUTES: Route[] = [
  {
    name: 'Inicio',
    path: `/${PrivateRoutes.HOME}`,
    icon: 'House',
    roles: [UserRole.ADMIN, UserRole.LEADER, UserRole.MEMBER],
  },
  {
    name: 'Locaciones',
    path: `/${PrivateRoutes.LOCATIONS}`,
    icon: 'MapPin',
    roles: [UserRole.ADMIN],
  },
  {
    name: 'Equipos',
    path: `/${PrivateRoutes.TEAMS}`,
    icon: 'ShieldHalf',
    roles: [UserRole.ADMIN],
  },
  {
    name: 'Usuarios',
    path: '/users',
    icon: 'Users',
    roles: [UserRole.ADMIN, UserRole.LEADER],
  },
  {
    name: 'Eventos',
    path: '/events',
    icon: 'CalendarDays',
    roles: [UserRole.ADMIN, UserRole.LEADER, UserRole.MEMBER],
  },
  {
    name: 'Convenios',
    path: '/agreements',
    icon: 'Handshake',
    roles: [UserRole.ADMIN, UserRole.LEADER, UserRole.MEMBER],
  },
  {
    name: 'Publicaciones',
    path: '/posts',
    icon: 'Newspaper',
    roles: [UserRole.ADMIN, UserRole.LEADER, UserRole.MEMBER],
  },
  {
    name: 'PQRS',
    path: '/pqrs',
    icon: 'Mailbox',
    roles: [UserRole.ADMIN, UserRole.LEADER, UserRole.MEMBER],
  },
  {
    name: 'Chatbot',
    path: `/${PrivateRoutes.CHATBOT}`,
    icon: 'Bot',
    roles: [UserRole.ADMIN, UserRole.LEADER, UserRole.MEMBER],
  },
]
