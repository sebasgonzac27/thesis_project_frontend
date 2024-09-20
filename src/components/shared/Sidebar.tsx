import { useDashboardStore } from '@/store/dashboard'
import clsx from 'clsx'
import { useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import useUserStore from '@/store/user'
import { UserRole } from '@/models'
import { useNavigate, NavLink } from 'react-router-dom'
import Icon from './Icon'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { deleteLocalStorage, deleteToken } from '@/utils'
import { useAppStore } from '@/store/app'
import { SIDEBAR_ROUTES } from '@/routes/sidebar'

export default function Sidebar() {
  const { isOpen } = useDashboardStore()
  const { user, deleteUser } = useUserStore()
  const { role_selected, setRoleSelected } = useAppStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    if (!user) return // Si no hay usuario, no hacemos nada

    const storageRole = localStorage.getItem('role_selected')
    const parsedRole = storageRole ? parseInt(JSON.parse(storageRole)) : null

    const roleToSet = parsedRole || user.role_id

    setRoleSelected(roleToSet as UserRole)
  }, [user, setRoleSelected])

  const handleRoleSelect = (role: string) => {
    setRoleSelected(parseInt(role) as UserRole)
  }

  const handleLogOut = () => {
    deleteUser()
    deleteToken()
    deleteLocalStorage()
    navigate('/')
  }

  return (
    <aside
      className={clsx(
        `bg-background md:border-r-2 border-accent absolute w-screen h-screen md:fixed top-0 md:left-0 md:h-full md:w-[300px] pt-14 flex flex-col transition-all duration-300 ease-in-out`,
        {
          '-left-full': !isOpen,
          'left-0': isOpen,
        },
      )}>
      {user && [UserRole.ADMIN, UserRole.LEADER].includes(user.role_id) && (
        <div className='border-b-2 border-accent p-4'>
          <Select onValueChange={handleRoleSelect} value={role_selected?.toString()}>
            <SelectTrigger>
              <SelectValue placeholder='Rol' />
            </SelectTrigger>
            <SelectContent>
              {user && user.role_id === UserRole.ADMIN && (
                <SelectItem value={UserRole.ADMIN.toString()}>Administrador</SelectItem>
              )}
              <SelectItem value={UserRole.LEADER.toString()}>Líder</SelectItem>
              <SelectItem value={UserRole.MEMBER.toString()}>Piloto</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      <div className='flex flex-col justify-between h-full'>
        <div className='flex flex-col p-4 gap-2 overflow-y-auto'>
          {role_selected &&
            SIDEBAR_ROUTES.map(({ icon, name, path, roles }) => {
              return (
                roles.includes(role_selected) && (
                  <NavLink
                    key={path}
                    to={path}
                    className={({ isActive }) =>
                      clsx('flex items-center gap-2 p-2 hover:bg-accent rounded-md', {
                        'font-medium text-primary bg-accent': isActive,
                      })
                    }>
                    <Icon name={icon} size={20} />
                    <span>{name}</span>
                  </NavLink>
                )
              )
            })}
        </div>
        <div className='w-full border-t-2 border-accent p-4 flex items-center justify-between'>
          <Avatar className='border-2 border-foreground'>
            <AvatarImage src={`https://unavatar.io/${user?.email}`} />
            <AvatarFallback className='uppercase bg-primary font-bold'>
              {user && user.profile.first_name.charAt(0) + user.profile.last_name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className='flex flex-col'>
            <p className='font-bold'>{`${user?.profile.first_name.split(' ')[0]} ${user?.profile.last_name.split(' ')[0]}`}</p>
            <p className='text-sm'>{user?.email}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Icon name='EllipsisVertical' />
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem>
                <Icon name='User' size={20} />
                <span className='ml-2'>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogOut}>
                <Icon name='LogOut' size={20} />
                <span className='ml-2'>Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </aside>
  )
}
