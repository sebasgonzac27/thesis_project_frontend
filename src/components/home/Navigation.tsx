import { User, UserRole } from '@/models'
import { AppStore } from '@/redux/store'
import { PrivateRoutes } from '@/routes'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

export default function Navigation() {
  const { role_id } = useSelector((state: AppStore) => state.user) as User
  return (
    <section className='mt-5 flex flex-col gap-2'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <NavigationItem
          title='Eventos'
          description='Los mejores eventos a tu disposición'
          image='https://cdn.pixabay.com/photo/2019/01/18/06/46/biker-3939225_960_720.jpg'
          href='#'
        />
        <NavigationItem
          title='Convenios'
          description='Aprovecha los convenios que tenemos para ti'
          image='https://cdn.pixabay.com/photo/2020/11/23/03/56/handshake-5768632_1280.jpg'
          href='#'
        />
        <NavigationItem
          title='Publicaciones'
          description='Publicaciones de interés para ti'
          image='https://cdn.pixabay.com/photo/2015/01/27/20/40/laptop-614213_1280.jpg'
          href='#'
        />
        <NavigationItem
          title='PQRS'
          description='Peticiones, quejas, reclamos y sugerencias'
          image='https://cdn.pixabay.com/photo/2020/10/01/08/28/smileys-5617876_960_720.jpg'
          href='#'
        />
        <NavigationItem
          title='Chatbot'
          description='Habla con nuestro chatbot y resuelve tus dudas'
          image='https://cdn.pixabay.com/photo/2023/02/05/17/33/ai-generated-7770055_1280.jpg'
          href='#'
        />
      </div>
      {role_id === UserRole.LEADER && (
        <>
          <hr />
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <NavigationItem
              title='Miembros'
              description='Administra los miembros de tu equipo'
              image='https://cdn.pixabay.com/photo/2016/03/31/19/58/avatar-1295429_960_720.png'
              href='#'
            />
            <NavigationItem
              title='Convenios'
              description='Administra los convenios de tu equipo'
              image='https://cdn.pixabay.com/photo/2016/03/31/19/58/avatar-1295429_960_720.png'
              href='#'
            />
            <NavigationItem
              title='Eventos'
              description='Administra los eventos de tu equipo'
              image='https://cdn.pixabay.com/photo/2016/03/31/19/58/avatar-1295429_960_720.png'
              href='#'
            />
          </div>
        </>
      )}
      {role_id === UserRole.ADMIN && (
        <>
          <hr />
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <NavigationItem
              title='Equipos'
              description='Administra los equipos del club'
              image='https://cdn.pixabay.com/photo/2023/05/16/09/56/motorcyclists-7997148_1280.jpg'
              href={`/${PrivateRoutes.TEAMS}`}
            />
            <NavigationItem
              title='Miembros'
              description='Administra los miembros del club'
              image='https://cdn.pixabay.com/photo/2022/07/23/19/18/traffic-7340488_960_720.jpg'
              href='#'
            />
            <NavigationItem
              title='Convenios'
              description='Administra los convenios del club'
              image='https://cdn.pixabay.com/photo/2020/11/23/03/56/handshake-5768632_1280.jpg'
              href='#'
            />
            <NavigationItem
              title='Eventos'
              description='Administra los eventos del club'
              image='https://cdn.pixabay.com/photo/2019/01/18/06/46/biker-3939225_960_720.jpg'
              href='#'
            />
          </div>
        </>
      )}
    </section>
  )
}

interface Props {
  title: string
  description: string
  image: string
  href: string
}

function NavigationItem({ title, description, image, href }: Props) {
  return (
    <Link
      to={href}
      role='article'
      className='w-full p-4 rounded-xl aspect-video bg-accent shadow-md flex flex-col gap-2 cursor-pointer'>
      <img src={image} alt={`Fondo ${title}`} className='w-full aspect-video object-cover object-center rounded-sm' />
      <div>
        <h3 className='text-xl font-bold antialiased'>{title}</h3>
        <p className='antialiased'>{description}</p>
      </div>
    </Link>
  )
}
