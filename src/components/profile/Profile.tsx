import useUserStore from '@/store/user'
import { Avatar, AvatarImage } from '../ui/avatar'
import { getAvatar } from '@/utils'

export default function Profile() {
  const { user } = useUserStore()

  return (
    <div className='flex items-center justify-center md:justify-start mt-4 gap-10'>
      <Avatar className='w-40 h-40 shadow-lg'>
        <AvatarImage src={getAvatar(user?.email || '')} />
      </Avatar>
      <div className='flex flex-col items-start'>
        <h2 className='text-5xl font-bold'>
          {user?.profile.nickname || `${user?.profile.first_name} ${user?.profile.last_name}`}
        </h2>
        {user?.profile.nickname && (
          <h3 className='text-4xl'>{`${user?.profile.first_name} ${user?.profile.last_name}`}</h3>
        )}
      </div>
    </div>
  )
}
