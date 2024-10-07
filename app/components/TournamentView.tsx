'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Users } from "lucide-react"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Simulated data types
type Player = {
  id: string
  name: string
  birthDate: string
  singles: boolean
  doubles: boolean
  level: 'Principiante' | 'Intermedio' | 'Avanzado' | 'Bye'
}

type Tournament = {
  id: string
  name: string
  date: string
  players: Player[]
}

// Simulated API call to fetch tournaments
const fetchTournaments = async (): Promise<Tournament[]> => {
  // In a real application, this would be an API call to your backend
  // which would then fetch data from Google Sheets
  await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate network delay
  return [
    {
      id: '1',
      name: 'Summer Slam 2023',
      date: '2023-07-15',
      players: [
        { id: '1', name: 'John Doe', birthDate: '1990-01-01', singles: true, doubles: true, level: 'Intermedio' },
        { id: '2', name: 'Jane Smith', birthDate: '1992-05-15', singles: true, doubles: false, level: 'Avanzado' },
        { id: '3', name: 'Bob Johnson', birthDate: '1988-11-30', singles: false, doubles: true, level: 'Principiante' },
        { id: '4', name: 'Alice Brown', birthDate: '1995-03-20', singles: true, doubles: true, level: 'Intermedio' },
        { id: '5', name: 'Charlie Davis', birthDate: '1991-09-05', singles: true, doubles: true, level: 'Avanzado' },
        { id: '6', name: 'Eva Wilson', birthDate: '1993-07-12', singles: false, doubles: true, level: 'Principiante' },
        { id: '7', name: 'María García', birthDate: '1994-08-22', singles: true, doubles: true, level: 'Avanzado' },
        { id: '8', name: 'Carlos Rodríguez', birthDate: '1989-03-17', singles: true, doubles: false, level: 'Intermedio' },
        { id: '9', name: 'Ana Martínez', birthDate: '1997-11-05', singles: false, doubles: true, level: 'Principiante' },
        { id: '10', name: 'Javier López', birthDate: '1993-06-30', singles: true, doubles: true, level: 'Avanzado' },
        { id: '11', name: 'Elena Sánchez', birthDate: '1996-02-18', singles: true, doubles: false, level: 'Principiante' },
        { id: '12', name: 'Miguel Herrera', birthDate: '1992-09-25', singles: true, doubles: true, level: 'Intermedio' },
        { id: '13', name: 'Laura Fernández', birthDate: '1998-04-10', singles: false, doubles: true, level: 'Principiante' },
        { id: '14', name: 'Diego Gómez', birthDate: '1994-07-03', singles: true, doubles: true, level: 'Avanzado' },
        { id: '15', name: 'Sofía López', birthDate: '1995-12-14', singles: false, doubles: true, level: 'Principiante' },
        { id: '16', name: 'Andrés Ramírez', birthDate: '1990-08-09', singles: true, doubles: true, level: 'Intermedio' },
        { id: '17', name: 'Isabella Castro', birthDate: '1997-01-28', singles: false, doubles: true, level: 'Principiante' },
        { id: '18', name: 'Emilio Gutiérrez', birthDate: '1993-05-19', singles: true, doubles: true, level: 'Avanzado' },
        { id: '19', name: 'Valeria Morales', birthDate: '1996-09-12', singles: true, doubles: false, level: 'Principiante' },
        { id: '20', name: 'Mateo Pérez', birthDate: '1992-03-24', singles: true, doubles: true, level: 'Intermedio' }
      ]
    },
    {
      id: '2',
      name: 'Winter Challenge 2023',
      date: '2023-12-10',
      players: [
        { id: '4', name: 'Alice Brown', birthDate: '1995-03-20', singles: true, doubles: true, level: 'Intermedio' },
        { id: '5', name: 'Charlie Davis', birthDate: '1991-09-05', singles: true, doubles: true, level: 'Avanzado' },
        { id: '6', name: 'Eva Wilson', birthDate: '1993-07-12', singles: false, doubles: true, level: 'Principiante' },
        // Add more players as needed
      ]
    },
  ]
}

// Function to organize players into groups
const organizeGroups = (players: Player[]): Player[][] => {
  const shuffledPlayers = [...players].sort(() => Math.random() - 0.5)
  const AvanzadoPlayers = shuffledPlayers.filter(p => p.level === 'Avanzado')
  const IntermedioPlayers = shuffledPlayers.filter(p => p.level === 'Intermedio')
  const PrincipiantePlayers = shuffledPlayers.filter(p => p.level === 'Principiante')

  const newGroups: Player[][] = []

  const createGroup = (topLevel: Player[], midLevel: Player[], lowLevel: Player[]): Player[] => {
    const group: Player[] = []

    if (topLevel.length > 0) {
      group.push(topLevel.pop()!)
    } else if (midLevel.length > 0) {
      group.push(midLevel.pop()!)
    } else if (lowLevel.length > 0) {
      group.push(lowLevel.pop()!)
    }

    while (group.length < 3) {
      if (lowLevel.length > 0) {
        group.push(lowLevel.pop()!)
      } else if (midLevel.length > 0) {
        group.push(midLevel.pop()!)
      } else if (topLevel.length > 0) {
        group.push(topLevel.pop()!)
      } else {
        group.push({ id: 'bye', name: 'Bye', birthDate: '', singles: false, doubles: false, level: 'Bye' })
      }
    }

    return group
  }

  while (AvanzadoPlayers.length > 0 || IntermedioPlayers.length > 0 || PrincipiantePlayers.length > 0) {
    if (PrincipiantePlayers.length >= 2) {
      newGroups.push(createGroup(AvanzadoPlayers, IntermedioPlayers, PrincipiantePlayers))
    } else if (IntermedioPlayers.length >= 2) {
      newGroups.push(createGroup(AvanzadoPlayers, IntermedioPlayers, PrincipiantePlayers))
    } else {
      newGroups.push(createGroup(AvanzadoPlayers, IntermedioPlayers, PrincipiantePlayers))
    }
  }

  return newGroups
}


export default function TournamentView() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null)
  const [loading, setLoading] = useState(true)
  const [groups, setGroups] = useState<Player[][]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [activeTab, setActiveTab] = useState('inscritos')
  const playersPerPage = 8
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ show: boolean; playerId: string | null }>({ show: false, playerId: null })

  useEffect(() => {
    fetchTournaments().then(data => {
      setTournaments(data)
      setLoading(false)
    })
  }, [])

  const handleTournamentSelect = (tournamentId: string) => {
    const tournament = tournaments.find(t => t.id === tournamentId)
    setSelectedTournament(tournament || null)
    setGroups([])
    setCurrentPage(0)
  }

  const handleLevelChange = (playerId: string, level: 'Principiante' | 'Intermedio' | 'Avanzado') => {
    if (selectedTournament) {
      const updatedPlayers = selectedTournament.players.map(player =>
        player.id === playerId ? { ...player, level } : player
      )
      setSelectedTournament({ ...selectedTournament, players: updatedPlayers })
    }
  }

  const handleOrganizeGroups = (category: 'singles' | 'doubles') => {
    if (selectedTournament) {
      const playersInCategory = selectedTournament.players.filter(player => player[category])
      const organizedGroups = organizeGroups(playersInCategory)
      setGroups(organizedGroups)
    }
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setCurrentPage(0)
    if (selectedTournament) {
      const playersInCategory = selectedTournament.players.filter(player => player[tab as 'singles' | 'doubles'])
      const organizedGroups = organizeGroups(playersInCategory)
      setGroups(organizedGroups)
    }
  }

  const handleDeletePlayer = (playerId: string) => {
    setDeleteConfirmation({ show: true, playerId })
  }

  const confirmDelete = () => {
    if (selectedTournament && deleteConfirmation.playerId) {
      const updatedPlayers = selectedTournament.players.filter(player => player.id !== deleteConfirmation.playerId)
      setSelectedTournament({ ...selectedTournament, players: updatedPlayers })
      
      const updatedTournaments = tournaments.map(tournament => 
        tournament.id === selectedTournament.id 
          ? { ...tournament, players: updatedPlayers }
          : tournament
      )
      setTournaments(updatedTournaments)

      toast.success('Jugador eliminado con éxito')
      setDeleteConfirmation({ show: false, playerId: null })
    }
  }

  const cancelDelete = () => {
    setDeleteConfirmation({ show: false, playerId: null })
  }

  const paginatedPlayers = selectedTournament
    ? selectedTournament.players.slice(currentPage * playersPerPage, (currentPage + 1) * playersPerPage)
    : []

  const totalPages = selectedTournament ? Math.ceil(selectedTournament.players.length / playersPerPage) : 0

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Vista del Torneo</h1>
        <Button onClick={() => window.location.href = '/'} className="flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Selecciona un Torneo</CardTitle>
        </CardHeader>
        <CardContent>
          <Select onValueChange={handleTournamentSelect}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Elige un torneo" />
            </SelectTrigger>
            <SelectContent>
              {tournaments.map(tournament => (
                <SelectItem key={tournament.id} value={tournament.id}>
                  {tournament.name} - {tournament.date}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedTournament && (
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedTournament.name} - Jugadores ({selectedTournament.players.length} inscritos)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mb-4 space-x-2">
              <Button onClick={() => handleTabChange('inscritos')} className={activeTab === 'inscritos' ? 'bg-blue-500 text-white' : ''}>
                Inscritos
              </Button>
              <Button onClick={() => handleTabChange('singles')} className={activeTab === 'singles' ? 'bg-blue-500 text-white' : ''}>
                Grupos Singles
              </Button>
              <Button onClick={() => handleTabChange('doubles')} className={activeTab === 'doubles' ? 'bg-blue-500 text-white' : ''}>
                Grupos Dobles
              </Button>
            </div>

            {activeTab === 'inscritos' && (
              <div style={{ height: 'calc(8 * 3.7rem)', overflow: 'hidden' }}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead style={{ width: '80px' }}>#</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Singles</TableHead>
                      <TableHead>Dobles</TableHead>
                      <TableHead>Nivel</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedPlayers.map((player, index) => (
                      <TableRow key={player.id} className="h-12">
                        <TableCell>{currentPage * playersPerPage + index + 1}</TableCell>
                        <TableCell>{player.name}</TableCell>
                        <TableCell>{player.singles ? 'Sí' : 'No'}</TableCell>
                        <TableCell>{player.doubles ? 'Sí' : 'No'}</TableCell>
                        <TableCell>
                          <Select
                            defaultValue={player.level}
                            onValueChange={(value: 'Principiante' | 'Intermedio' | 'Avanzado') => handleLevelChange(player.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Principiante">Principiante</SelectItem>
                              <SelectItem value="Intermedio">Intermedio</SelectItem>
                              <SelectItem value="Avanzado">Avanzado</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Button onClick={() => handleDeletePlayer(player.id)} className="bg-red-500 text-white">
                            Eliminar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {(activeTab === 'singles' || activeTab === 'doubles') && (
              <div>
                <Button onClick={() => handleOrganizeGroups(activeTab)} className="mt-4">
                  <Users className="mr-2 h-4 w-4" /> Organizar Grupos de {activeTab === 'singles' ? 'Singles' : 'Dobles'}
                </Button>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {groups.map((group, index) => (
                    <div key={index} className="p-4 border rounded">
                      <h3 className="font-bold mb-2">Grupo {index + 1}</h3>
                      <ul>
                        {group.map(player => (
                          <li key={player.id}>{player.name} - {player.level}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {selectedTournament && activeTab === 'inscritos' && (
        <div className="flex justify-center mt-4">
          {Array.from({ length: totalPages }, (_, index) => (
            <Button
              key={index}
              onClick={() => handlePageChange(index)}
              className={index === currentPage ? 'bg-blue-500 text-white' : ''}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      )}

      {deleteConfirmation.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Confirmar eliminación</h2>
            <p className="mb-4">¿Estás seguro de que deseas eliminar este jugador?</p>
            <div className="flex justify-end">
              <Button onClick={cancelDelete} className="mr-2">Cancelar</Button>
              <Button onClick={confirmDelete} className="bg-red-500 text-white">Eliminar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}