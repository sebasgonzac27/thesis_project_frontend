import { Team } from '@/models'
import Icon from '../shared/Icon'
import { useEffect, useMemo, useState } from 'react'
import { getLocation } from '@/services'
import clsx from 'clsx'
import { useNavigate } from 'react-router-dom'

interface Props {
  team: Team
}

export function TeamCard({ team }: Readonly<Props>) {
  const navigate = useNavigate()
  const [location, setLocation] = useState<string>('')

  const possibleColors = ['bg-primary', 'bg-success', 'bg-info', 'bg-error', 'bg-warning']
  const color = useMemo(() => {
    const id = Math.floor(Math.random() * possibleColors.length)
    return possibleColors[id]
  }, [])

  useEffect(() => {
    ;(async () => {
      const { name } = await getLocation(team.location_id)
      setLocation(name)
    })()
  }, [team])

  const redirectToTeam = () => {
    navigate(`/teams/${team.id}`)
  }

  return (
    <div
      role='button'
      tabIndex={0}
      className='inline-flex border-accent border-2 hover:bg-accent rounded-md p-4 gap-4 w-full cursor-pointer'
      onClick={redirectToTeam}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          redirectToTeam()
        }
      }}>
      <div className={clsx('p-4 rounded-md', color)}>
        <Icon name='Zap' color='white' size={30} />
      </div>
      <div className='flex flex-col w-9/12'>
        <h3 className='text-xl font-bold truncate'>{team.name}</h3>
        <p className='truncate'>{location}</p>
      </div>
    </div>
  )
}
