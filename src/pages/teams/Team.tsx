import { TeamInfo } from '@/components'
import { RootLayout } from '@/layouts'
import { Team } from '@/models'
import { getTeam } from '@/services'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export default function TeamPage() {
  const { id } = useParams()
  const [team, setTeam] = useState<Team>()

  useEffect(() => {
    ;(async () => {
      const team = await getTeam(parseInt(id!))
      setTeam(team)
    })()
  }, [id])

  return (
    <RootLayout>
      <TeamInfo team={team}></TeamInfo>
    </RootLayout>
  )
}
