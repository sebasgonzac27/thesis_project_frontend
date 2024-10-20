import { useDashboardStore } from '@/store/dashboard'
import clsx from 'clsx'
import { useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import useUserStore from '@/store/user'
import { UserRole } from '@/models'
import { useNavigate, NavLink } from 'react-router-dom'
import Icon from './Icon'
import { Avatar, AvatarImage } from '../ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { deleteLocalStorage, deleteToken, getAvatar } from '@/utils'
import { useAppStore } from '@/store/app'
import { SIDEBAR_ROUTES } from '@/routes/sidebar'
import { PrivateRoutes } from '@/routes'

export default function Sidebar() {
  const { isOpen, toggleOpen } = useDashboardStore()
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
    localStorage.setItem('role_selected', roleToSet.toString())
  }, [user, setRoleSelected])

  const handleRoleSelect = (role: string) => {
    setRoleSelected(parseInt(role) as UserRole)
    localStorage.setItem('role_selected', role)
  }

  const handleViewProfile = () => {
    onClick()
    navigate(`/${PrivateRoutes.PROFILE}`)
  }

  const handleLogOut = () => {
    deleteUser()
    deleteToken()
    deleteLocalStorage()
    navigate('/')
  }

  const onClick = () => {
    toggleOpen()
  }

  return (
    <aside
      className={clsx(
        `bg-background md:border-r-2 border-accent absolute w-screen h-screen md:fixed top-0 md:left-0 md:h-full md:w-[300px] pt-14 flex flex-col transition-all duration-300 ease-in-out z-10`,
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
                    }
                    onClick={onClick}>
                    <Icon name={icon} size={20} />
                    <span>{name}</span>
                  </NavLink>
                )
              )
            })}
        </div>
        <div className='w-full border-t-2 border-accent p-4 flex items-center justify-between'>
          <Avatar className='border-2 border-foreground'>
            <AvatarImage src={getAvatar(user!.email)} />
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
              <DropdownMenuItem onClick={handleViewProfile}>
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
