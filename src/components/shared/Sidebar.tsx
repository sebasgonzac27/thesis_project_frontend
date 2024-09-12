import { useDashboardStore } from '@/store/dashboard'
import clsx from 'clsx'
import { useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import useUserStore from '@/store/user'
import { UserRole } from '@/models'
import { Link } from 'react-router-dom'
import Icon from './Icon'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'

export default function Sidebar() {
  const { isOpen } = useDashboardStore()
  const { user } = useUserStore()

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
          <Select>
            <SelectTrigger>
              <SelectValue placeholder='Rol' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='admin'>Administrador</SelectItem>
              <SelectItem value='leader'>Líder</SelectItem>
              <SelectItem value='pilot'>Piloto</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      <div className='flex flex-col justify-between h-full'>
        <div className='flex flex-col p-4'>
          <Link to='#' className='flex items-center gap-2 p-2 hover:bg-accent rounded-md'>
            <Icon name='House' size={20} />
            <span>Home</span>
          </Link>
          <Link to='#' className='flex items-center gap-2 p-2 hover:bg-accent rounded-md'>
            <Icon name='FileChartColumnIncreasing' size={20} />
            <span>Analytics</span>
          </Link>
          <Link to='#' className='flex items-center gap-2 p-2 hover:bg-accent rounded-md'>
            <Icon name='Users' size={20} />
            <span>Clients</span>
          </Link>
        </div>
        <div className='w-full border-t-2 border-accent p-4 flex items-center justify-between'>
          <Avatar>
            <AvatarFallback className='uppercase bg-primary font-bold'>
              {user && user.profile.first_name.charAt(0) + user.profile.last_name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className='flex flex-col'>
            <p className='font-bold'>{`${user?.profile.first_name} ${user?.profile.last_name}`}</p>
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
              <DropdownMenuItem>
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
