import { Team } from '@/models'
import UsersList from '../users/UsersList'

interface Props {
  team: Team
}

export default function TeamInfo({ team }: Readonly<Props>) {
  return <UsersList team_id={team.id} />
}
