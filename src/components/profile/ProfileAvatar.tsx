import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { getAvatar } from '@/utils'
import { User } from '@/models'
import { Button } from '../ui/button'

interface Props {
  user: User
}

export default function ProfileAvatar({ user }: Readonly<Props>) {
  return (
    <div className='flex flex-col md:flex-row items-center gap-2 md:gap-5'>
      <Avatar className='size-20 md:size-32 shadow-lg'>
        <AvatarImage src={getAvatar(user?.email || '')} />
      </Avatar>
      <div className='flex flex-col text-center md:text-start md:flex-1'>
        <h2 className='text-2xl md:text-3xl font-bold'>
          {user?.profile.nickname ?? `${user?.profile.first_name} ${user?.profile.last_name}`}
        </h2>
        {user?.profile.nickname && (
          <h3 className='text-xl md:text-2xl text-pretty'>{`${user?.profile.first_name} ${user?.profile.last_name}`}</h3>
        )}
      </div>
      <Button className='w-full mt-2 md:w-56'>Modificar perfil</Button>
    </div>
  )
}
