import { Team } from '@/models'

interface Props {
  team: Team | undefined
}

export default function TeamInfo({ team }: Readonly<Props>) {
  return <div>{team?.name}</div>
}
