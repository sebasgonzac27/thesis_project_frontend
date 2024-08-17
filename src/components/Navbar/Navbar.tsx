import { Link } from 'react-router-dom'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '../ui/navigation-menu'
import { cn } from '@/lib/utils'

export default function Navbar() {
  return (
    <header className='bg-background text-foreground w-full h-20 shadow-sm flex items-center'>
      <div className='m-auto w-full p-2 max-w-7xl md:p-0 flex justify-between items-center'>
        <Link to='/'>
          <img src='img/logo.webp' width={50} height={50} alt='Logo Club'></img>
        </Link>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Pilotos</NavigationMenuTrigger>
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
              <NavigationMenuTrigger>Pilotos</NavigationMenuTrigger>
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
              <NavigationMenuTrigger>Pilotos</NavigationMenuTrigger>
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
      </div>
    </header>
  )
}
