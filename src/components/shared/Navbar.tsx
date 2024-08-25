import { Link, useNavigate } from 'react-router-dom'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '../ui/navigation-menu'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import { removeCookie } from 'typescript-cookie'
import { useDispatch } from 'react-redux'
import { resetUser } from '@/redux/states/user'
import Logo from '@/assets/img/logo.webp'

export default function Navbar() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const handleLogout = () => {
    removeCookie('access_token')
    removeCookie('refresh_token')
    dispatch(resetUser())
    navigate('/')
  }

  return (
    <header className='fixed bg-background text-foreground w-full h-20 border-b-2 border-accent flex items-center'>
      <div className='m-auto w-full px-4 max-w-7xl flex justify-between items-center'>
        <Link to='/'>
          <img src={Logo} width={60} height={60} alt='Logo Club'></img>
        </Link>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Pilotos</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className='grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] '>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        to='#'
                        className={cn(
                          'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                        )}>
                        <div className='text-sm font-medium leading-none'>Eventos</div>
                        <p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>
                          Los mejores eventos a tu disposición
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <a
                        href='#'
                        className={cn(
                          'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                        )}>
                        <div className='text-sm font-medium leading-none'>Eventos</div>
                        <p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>
                          Los mejores eventos a tu disposición
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Líderes</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className='grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] '>
                  <li>
                    <NavigationMenuLink asChild>
                      <a
                        href='#'
                        className={cn(
                          'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                        )}>
                        <div className='text-sm font-medium leading-none'>Eventos</div>
                        <p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>
                          Los mejores eventos a tu disposición
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <a
                        href='#'
                        className={cn(
                          'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                        )}>
                        <div className='text-sm font-medium leading-none'>Eventos</div>
                        <p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>
                          Los mejores eventos a tu disposición
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Administradores</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className='grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] '>
                  <li>
                    <NavigationMenuLink asChild>
                      <a
                        href='#'
                        className={cn(
                          'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                        )}>
                        <div className='text-sm font-medium leading-none'>Eventos</div>
                        <p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>
                          Los mejores eventos a tu disposición
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <a
                        href='#'
                        className={cn(
                          'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                        )}>
                        <div className='text-sm font-medium leading-none'>Eventos</div>
                        <p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>
                          Los mejores eventos a tu disposición
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <Button onClick={handleLogout}>Cerrar Sesión</Button>
      </div>
    </header>
  )
}
