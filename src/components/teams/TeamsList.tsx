import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Team } from '@/models'
import { getTeams } from '@/services'
import { TeamCard } from './TeamCard'
import { TeamAdd } from './TeamAdd'

const fetchTeams = async (name = ''): Promise<Team[]> => {
  const { data } = await getTeams({ filter: `name=${name}` })
  return data
}

export default function TeamsList() {
  const [teams, setTeams] = useState<Team[]>([])
  const [searchTeam, setSearchTeam] = useState<string>('')
  const [searchTeamInput, setSearchTeamInput] = useState<string>('')

  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    fetchTeams(searchTeam).then(teams => setTeams(teams))
  }, [searchTeam])

  const handleChangeSearch = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTeamInput(target.value)
  }

  const handleSearchSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSearchTeam(searchTeamInput)
  }

  const handleAddTeam = (team: Team) => {
    setTeams(currentValue => [...currentValue, team])
  }

  return (
    <>
      <section className='flex flex-col'>
        <div className='flex flex-col md:flex-row justify-between gap-2 w-full'>
          <form className='inline-flex gap-2' onSubmit={handleSearchSubmit}>
            <Input placeholder='Buscar un equipo' value={searchTeamInput} onChange={handleChangeSearch}></Input>
            <Button>Buscar</Button>
          </form>
          <Button className='w-full md:w-fit' onClick={() => setModalOpen(true)}>
            Añadir un equipo
          </Button>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 my-4'>
          {teams.map(team => (
            <TeamCard team={team} key={team.id} />
          ))}
        </div>
      </section>
      <TeamAdd open={modalOpen} isOpen={setModalOpen} addTeam={handleAddTeam} />
    </>
  )
}
