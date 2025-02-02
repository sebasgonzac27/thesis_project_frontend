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
    name: 'Equipos',
    path: `/${PrivateRoutes.TEAMS}`,
    icon: 'ShieldHalf',
    roles: [UserRole.ADMIN, UserRole.LEADER, UserRole.MEMBER],
  },
  {
    name: 'Usuarios',
    path: `/${PrivateRoutes.USERS}`,
    icon: 'Users',
    roles: [UserRole.ADMIN, UserRole.LEADER],
  },
  {
    name: 'Eventos',
    path: `/${PrivateRoutes.EVENTS}`,
    icon: 'CalendarDays',
    roles: [UserRole.ADMIN, UserRole.LEADER, UserRole.MEMBER],
  },
  {
    name: 'Convenios',
    path: `/${PrivateRoutes.AGREEMENTS}`,
    icon: 'Handshake',
    roles: [UserRole.ADMIN, UserRole.LEADER, UserRole.MEMBER],
  },
  {
    name: 'Publicaciones',
    path: `/${PrivateRoutes.POSTS}`,
    icon: 'Newspaper',
    roles: [UserRole.ADMIN, UserRole.LEADER, UserRole.MEMBER],
  },
  {
    name: 'PQRS',
    path: `/${PrivateRoutes.PQRS}`,
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
