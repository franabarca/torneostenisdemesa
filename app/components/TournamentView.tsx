'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Users } from "lucide-react"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { DndContext, useSensors, useSensor, PointerSensor, DragEndEvent, DragStartEvent, DragOverlay, TouchSensor } from '@dnd-kit/core'
import { useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import Llaves from './Llaves'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Simulated data types
type Player = {
  id: string
  name: string
  birthDate: string
  level: 'Principiante' | 'Intermedio' | 'Avanzado' | 'Bye'
  ranking: number
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
        { id: '1', name: 'John Doe', birthDate: '1990-01-01', level: 'Intermedio', ranking: 120 },
        { id: '2', name: 'Jane Smith', birthDate: '1992-05-15', level: 'Avanzado', ranking: 100 },
        { id: '3', name: 'Bob Johnson', birthDate: '1988-11-30', level: 'Principiante', ranking: 80 },
        { id: '4', name: 'Alice Brown', birthDate: '1995-03-20', level: 'Intermedio', ranking: 110 },
        { id: '5', name: 'Charlie Davis', birthDate: '1991-09-05', level: 'Avanzado', ranking: 90 },
        { id: '6', name: 'Eva Wilson', birthDate: '1993-07-12', level: 'Principiante', ranking: 70 },
        { id: '7', name: 'María García', birthDate: '1994-08-22', level: 'Avanzado', ranking: 130 },
        { id: '8', name: 'Carlos Rodríguez', birthDate: '1989-03-17', level: 'Intermedio', ranking: 105 },
        { id: '9', name: 'Ana Martínez', birthDate: '1997-11-05', level: 'Principiante', ranking: 65 },
        { id: '10', name: 'Javier López', birthDate: '1993-06-30', level: 'Avanzado', ranking: 95 },
        { id: '11', name: 'Elena Sánchez', birthDate: '1996-02-18', level: 'Principiante', ranking: 55 },
        { id: '12', name: 'Miguel Herrera', birthDate: '1992-09-25', level: 'Intermedio', ranking: 115 },
        { id: '13', name: 'Laura Fernández', birthDate: '1998-04-10', level: 'Principiante', ranking: 75 },
        { id: '14', name: 'Diego Gómez', birthDate: '1994-07-03', level: 'Avanzado', ranking: 125 },
        { id: '15', name: 'Sofía López', birthDate: '1995-12-14', level: 'Principiante', ranking: 60 },
        { id: '16', name: 'Andrés Ramírez', birthDate: '1990-08-09', level: 'Intermedio', ranking: 110 },
        { id: '17', name: 'Isabella Castro', birthDate: '1997-01-28', level: 'Principiante', ranking: 50 },
        { id: '18', name: 'Emilio Gutiérrez', birthDate: '1993-05-19', level: 'Avanzado', ranking: 105 },
        { id: '19', name: 'Valeria Morales', birthDate: '1996-09-12', level: 'Principiante', ranking: 45 },
        { id: '20', name: 'Mateo Pérez', birthDate: '1992-03-24', level: 'Intermedio', ranking: 100 },
        { id: '21', name: 'Nicolás Gómez', birthDate: '1991-07-13', level: 'Intermedio', ranking: 110 },
        { id: '22', name: 'Camila Torres', birthDate: '1995-05-10', level: 'Avanzado', ranking: 120 },
        { id: '23', name: 'Fernando Rivas', birthDate: '1993-12-20', level: 'Principiante', ranking: 60 },
        { id: '24', name: 'Clara Sánchez', birthDate: '1994-11-01', level: 'Intermedio', ranking: 115 },
        { id: '25', name: 'Lucas Blanco', birthDate: '1992-02-14', level: 'Avanzado', ranking: 125 },
        { id: '26', name: 'Marta Vázquez', birthDate: '1996-06-15', level: 'Principiante', ranking: 50 },
        { id: '27', name: 'Sebastián Molina', birthDate: '1990-10-21', level: 'Intermedio', ranking: 105 },
        { id: '28', name: 'Patricia Ruiz', birthDate: '1997-09-07', level: 'Avanzado', ranking: 135 },
        { id: '29', name: 'Alberto Castillo', birthDate: '1993-04-18', level: 'Principiante', ranking: 65 },
        { id: '30', name: 'Natalia Ramírez', birthDate: '1991-11-29', level: 'Intermedio', ranking: 115 },
        { id: '31', name: 'Gabriel Ortega', birthDate: '1992-08-22', level: 'Avanzado', ranking: 95 },
        { id: '32', name: 'Daniela Suárez', birthDate: '1995-10-17', level: 'Principiante', ranking: 55 },
        { id: '33', name: 'Héctor Mendoza', birthDate: '1994-03-08', level: 'Intermedio', ranking: 105 },
        { id: '34', name: 'Lorena Peña', birthDate: '1990-12-27', level: 'Avanzado', ranking: 125 },
        { id: '35', name: 'Alejandro Gil', birthDate: '1996-05-19', level: 'Principiante', ranking: 60 },
        { id: '36', name: 'Claudia Vargas', birthDate: '1992-09-06', level: 'Intermedio', ranking: 110 },
        { id: '37', name: 'Ignacio Paredes', birthDate: '1993-11-02', level: 'Avanzado', ranking: 130 },
        { id: '38', name: 'Paola Méndez', birthDate: '1997-07-24', level: 'Principiante', ranking: 45 },
        { id: '39', name: 'Jorge Figueroa', birthDate: '1994-04-30', level: 'Intermedio', ranking: 100 },
        { id: '40', name: 'Carolina Navarro', birthDate: '1991-01-15', level: 'Avanzado', ranking: 120 },
        { id: '41', name: 'Ricardo Espinoza', birthDate: '1995-08-04', level: 'Principiante', ranking: 50 },
        { id: '42', name: 'Lucía Rojas', birthDate: '1992-11-22', level: 'Intermedio', ranking: 115 },
        { id: '43', name: 'Sergio Delgado', birthDate: '1990-06-03', level: 'Avanzado', ranking: 125 },
        { id: '44', name: 'Carmen Estrada', birthDate: '1997-02-19', level: 'Principiante', ranking: 45 },
        { id: '45', name: 'Manuel Torres', birthDate: '1993-09-11', level: 'Intermedio', ranking: 100 },
        { id: '46', name: 'Elisa Romero', birthDate: '1994-05-05', level: 'Avanzado', ranking: 120 },
        { id: '47', name: 'Esteban Silva', birthDate: '1991-10-10', level: 'Principiante', ranking: 50 },
        { id: '48', name: 'Verónica Flores', birthDate: '1996-01-25', level: 'Intermedio', ranking: 110 }
      ]
    },
    {
      id: '2',
      name: 'Winter Challenge 2023',
      date: '2023-12-10',
      players: [
        { id: '49', name: 'Alice Brown', birthDate: '1995-03-20', level: 'Intermedio', ranking: 110 },
        { id: '50', name: 'Charlie Davis', birthDate: '1991-09-05', level: 'Avanzado', ranking: 90 },
        { id: '51', name: 'Eva Wilson', birthDate: '1993-07-12', level: 'Principiante', ranking: 70 },
        // Add more players as needed
      ]
    },
  ]
}

// Function to organize players into groups
const organizeGroups = (players: Player[]): Player[][] => {
  const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
  const AvanzadoPlayers = shuffledPlayers.filter(p => p.level === 'Avanzado');
  const IntermedioPlayers = shuffledPlayers.filter(p => p.level === 'Intermedio');
  const PrincipiantePlayers = shuffledPlayers.filter(p => p.level === 'Principiante');

  const newGroups: Player[][] = [];
  const groupSize = 3; // Tamaño del grupo

  const createGroup = (topLevel: Player[], midLevel: Player[], lowLevel: Player[]): Player[] => {
    const group: Player[] = [];

    // Añadir jugadores de cada nivel al grupo
    if (topLevel.length > 0) group.push(topLevel.shift()!);
    if (midLevel.length > 0) group.push(midLevel.shift()!);
    if (lowLevel.length > 0) group.push(lowLevel.shift()!);

    // Completar el grupo con jugadores de cualquier nivel si es necesario
    while (group.length < groupSize && (topLevel.length > 0 || midLevel.length > 0 || lowLevel.length > 0)) {
      if (lowLevel.length > 0) group.push(lowLevel.shift()!);
      else if (midLevel.length > 0) group.push(midLevel.shift()!);
      else if (topLevel.length > 0) group.push(topLevel.shift()!);
    }

    return group;
  };

  // Crear grupos hasta que no queden jugadores
  while (AvanzadoPlayers.length > 0 || IntermedioPlayers.length > 0 || PrincipiantePlayers.length > 0) {
    const group = createGroup(AvanzadoPlayers, IntermedioPlayers, PrincipiantePlayers);
    newGroups.push(group);
  }

  // Añadir "bye" a los grupos incompletos
  newGroups.forEach(group => {
    while (group.length < groupSize) {
      group.push({ id: `bye-${Math.random()}`, name: 'Bye', birthDate: '', level: 'Bye', ranking: 0 });
    }
  });

  return newGroups;
}

export function Droppable({ id, children }: { id: string; children: React.ReactNode }) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className="group">
      {children}
    </div>
  );
}

// Definimos un tipo para playingGroups
type PlayingGroupsType = boolean | undefined;

function SortablePlayer({ player, index, playingGroups, groupsFinished }: { player: Player; index: number, playingGroups: PlayingGroupsType, groupsFinished: boolean }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: player.id,
    disabled: groupsFinished // Deshabilita el sorting cuando los grupos están finalizados
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getPositionColor = (index: number, playingGroups: PlayingGroupsType, groupsFinished: boolean) => {
    if (playingGroups !== undefined) {
      let color = '';
      switch (index) {
        case 0: color = 'bg-yellow-200'; break;
        case 1: color = 'bg-yellow-200'; break;
        case 2: color = 'bg-red-200'; break;
        default: color = 'bg-gray-100';
      }
      return groupsFinished ? `${color} opacity-50` : color;
    }
    return 'bg-gray-100';
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`mb-2 p-2 rounded flex justify-between items-center ${getPositionColor(index, playingGroups, groupsFinished)}`}
    >
      <span className="mr-2 font-bold">{index + 1}</span>
      <span className="truncate flex-grow">{player.name} - {player.level}</span>
    </li>
  );
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
  const [searchQuery, setSearchQuery] = useState('')
  const [groupsLocked, setGroupsLocked] = useState(false)
  const [playingGroups, setPlayingGroups] = useState(false)
  const [activePlayer, setActivePlayer] = useState<Player | null>(null)
  const [matchStatus, setMatchStatus] = useState<{ [key: number]: boolean }>({})
  const [allMatchesFinished, setAllMatchesFinished] = useState(false)
  const [tournamentPhase, setTournamentPhase] = useState('groups')
  const [groupsFinished, setGroupsFinished] = useState(false)
  const [editingGroups, setEditingGroups] = useState(false)
  const [tempGroups, setTempGroups] = useState<Player[][]>([])
  const [showEditDialog, setShowEditDialog] = useState(false)
  //const [tournamentStarted, setTournamentStarted] = useState(false)

  useEffect(() => {
    fetchTournaments().then(data => {
      setTournaments(data)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    // Verifica si todos los partidos han finalizado
    const allFinished = Object.values(matchStatus).every(status => status)
    setAllMatchesFinished(allFinished && Object.keys(matchStatus).length === groups.length)
  }, [matchStatus, groups])

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

  const handleOrganizeGroups = () => {
    if (selectedTournament) {
      const organizedGroups = organizeGroups(selectedTournament.players)
      setGroups(organizedGroups)
      setGroupsLocked(false)
    }
  }

  const handleStartTournament = () => {
    setGroupsLocked(true)
    setPlayingGroups(true)
    //setTournamentStarted(true)
    toast.success('Torneo comenzado con éxito')
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setCurrentPage(0)
    if (selectedTournament && tab === 'grupos') {
      if (groups.length === 0) {
        const organizedGroups = organizeGroups(selectedTournament.players)
        setGroups(organizedGroups)
      }
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

  const filteredPlayers = selectedTournament
    ? selectedTournament.players.filter(player =>
      player.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : []

  const paginatedPlayers = searchQuery
    ? (filteredPlayers || []).slice(currentPage * playersPerPage, (currentPage + 1) * playersPerPage)
    : selectedTournament
      ? (selectedTournament.players || []).slice(currentPage * playersPerPage, (currentPage + 1) * playersPerPage)
      : []

  const totalPages = searchQuery
    ? Math.ceil(filteredPlayers.length / playersPerPage)
    : selectedTournament
      ? Math.ceil(selectedTournament.players.length / playersPerPage)
      : 0


  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    if (groupsFinished) return;
    
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setTempGroups((prevGroups) => {
        const activeGroupIndex = prevGroups.findIndex(group => group.some(player => player.id === active.id));
        const overGroupIndex = prevGroups.findIndex(group => group.some(player => player.id === over.id));
        
        if (activeGroupIndex !== -1 && overGroupIndex !== -1) {
          const newGroups = [...prevGroups];
          const activeGroup = [...newGroups[activeGroupIndex]];
          const overGroup = [...newGroups[overGroupIndex]];
          
          const activePlayerIndex = activeGroup.findIndex(player => player.id === active.id);
          const overPlayerIndex = overGroup.findIndex(player => player.id === over.id);
          
          const [movedPlayer] = activeGroup.splice(activePlayerIndex, 1);
          
          if (activeGroupIndex === overGroupIndex) {
            // Cambio dentro del mismo grupo
            activeGroup.splice(overPlayerIndex, 0, movedPlayer);
            newGroups[activeGroupIndex] = activeGroup;
          } else {
            // Cambio entre grupos diferentes
            overGroup.splice(overPlayerIndex, 0, movedPlayer);
            newGroups[activeGroupIndex] = activeGroup;
            newGroups[overGroupIndex] = overGroup;
          }
          
          return newGroups;
        }
        
        return prevGroups;
      });
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    if (groupsFinished) return; // No hacer nada si los grupos están finalizados
    
    const playerId = event.active.id as string;
    const player = groups.flat().find(p => p.id === playerId);
    setActivePlayer(player || null);
  }

  const toggleMatchStatus = (groupIndex: number) => {
    setMatchStatus(prevStatus => ({
      ...prevStatus,
      [groupIndex]: !prevStatus[groupIndex]
    }))
  }

  const handleAdvanceToKnockout = () => {
    setTournamentPhase('knockout')
    setGroupsFinished(true)
    setActiveTab('llaves')  // Añade esta línea
  }

  const handleEditGroups = () => {
    setShowEditDialog(true)
  }

  const confirmEditGroups = () => {
    setEditingGroups(true)
    setGroupsFinished(false)
    setTempGroups([...groups])
    setShowEditDialog(false)
  }

  const handleSaveGroups = () => {
    setEditingGroups(false)
    setGroupsFinished(true)
    setGroups([...tempGroups]) // Actualiza los grupos principales con los temporales
  }

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
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="grid w-full grid-cols-3 gap-1">
                <TabsTrigger 
                  value="inscritos"
                  className="data-[state=active]:bg-orange-500 data-[state=active]:text-white hover:bg-orange-300 hover:text-white"
                >
                  Inscritos
                </TabsTrigger>
                <TabsTrigger 
                  value="grupos"
                  className="data-[state=active]:bg-orange-500 data-[state=active]:text-white hover:bg-orange-300 hover:text-white"
                >
                  Fase de Grupos
                </TabsTrigger>
                <TabsTrigger 
                  value="llaves" 
                  disabled={tournamentPhase !== 'knockout'}
                  className="data-[state=active]:bg-orange-500 data-[state=active]:text-white hover:bg-orange-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Fase de Llaves
                </TabsTrigger>
              </TabsList>
              <TabsContent value="inscritos">
                {/* Contenido de la pestaña Inscritos */}
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Buscar jugador..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setCurrentPage(0)
                    }}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div style={{ height: 'calc(8 * 3.8rem)', overflow: 'hidden' }}>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead style={{ width: '80px' }}>#</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Nivel</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedPlayers.map((player, index) => (
                        <TableRow key={player.id} className="h-12">
                          <TableCell>{currentPage * playersPerPage + index + 1}</TableCell>
                          <TableCell>{player.name}</TableCell>
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
              </TabsContent>
              <TabsContent value="grupos">
                {/* Contenido de la pestaña Fase de Grupos */}
                <div>
                  <div className="flex space-x-2 mt-4">
                    <Button
                      onClick={handleOrganizeGroups}
                      disabled={groupsLocked}
                      className={`${groupsLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <Users className="mr-2 h-4 w-4" /> Organizar Grupos de Singles
                    </Button>
                    {groups.length > 0 && (
                      <Button onClick={handleStartTournament} disabled={groupsLocked}>
                        Comenzar Torneo
                      </Button>
                    )}
                    {tournamentPhase === 'knockout' && !editingGroups && (
                      <Button onClick={handleEditGroups} className="bg-yellow-500 text-white">
                        Editar Grupos
                      </Button>
                    )}
                    {editingGroups && (
                      <Button onClick={handleSaveGroups} className="bg-green-500 text-white">
                        Guardar Cambios
                      </Button>
                    )}
                  </div>
                  {playingGroups && tournamentPhase === 'groups' && !groupsFinished && (
                    <div className="mt-4 flex items-center justify-center">
                      <h3 className="text-xl font-bold mr-2">Jugando fase de grupos</h3>
                      <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                  )}
                  {groupsFinished && (
                    <div className="mt-4 flex items-center justify-center">
                      <h3 className="text-xl font-bold">Fase de grupos finalizada</h3>
                    </div>
                  )}
                  {allMatchesFinished && tournamentPhase === 'groups' && (
                    <div className="flex justify-center mt-4">
                      <Button onClick={handleAdvanceToKnockout} className="bg-green-500 text-white">
                        Avanzar a la fase de llaves
                      </Button>
                    </div>
                  )}
                  <DndContext 
                    sensors={sensors} 
                    onDragEnd={handleDragEnd} 
                    onDragStart={handleDragStart}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                      {(editingGroups ? tempGroups : groups).map((group, groupIndex) => (
                        <Droppable key={`group-${groupIndex}`} id={`group-${groupIndex}`}>
                          <div className={`p-4 border rounded ${groupsFinished && !editingGroups ? 'opacity-75' : ''}`}>
                            <h3 className="font-bold mb-2">Grupo {groupIndex + 1}</h3>
                            <SortableContext items={group.map(p => p.id)} strategy={verticalListSortingStrategy}>
                              <ul className="space-y-2">
                                {group.map((player, playerIndex) => (
                                  <SortablePlayer 
                                    key={player.id} 
                                    player={player} 
                                    index={playerIndex} 
                                    playingGroups={playingGroups}
                                    groupsFinished={groupsFinished && !editingGroups}
                                  />
                                ))}
                              </ul>
                            </SortableContext>
                            {playingGroups && (
                              <Button
                                onClick={() => toggleMatchStatus(groupIndex)}
                                className={`mt-2 ${matchStatus[groupIndex] ? 'bg-green-500' : 'bg-blue-500'} text-white ${groupsFinished && !editingGroups ? 'opacity-50' : ''}`}
                                disabled={groupsFinished && !editingGroups}
                              >
                                {matchStatus[groupIndex] ? 'Partido Finalizado' : 'Finalizar Partido'}
                              </Button>
                            )}
                          </div>
                        </Droppable>
                      ))}
                    </div>
                    <DragOverlay>
                      {activePlayer ? (
                        <div className="p-2 bg-orange-400 text-white rounded shadow-lg flex items-center">
                          <span className="mr-2 font-bold">{groups.flat().findIndex(p => p.id === activePlayer.id) + 1}</span>
                          <span className="truncate flex-grow">{activePlayer.name} - {activePlayer.level}</span>
                        </div>
                      ) : null}
                    </DragOverlay>
                  </DndContext>
                </div>
              </TabsContent>
              <TabsContent value="llaves">
                {/* Contenido de la pestaña Fase de Llaves */}
                {tournamentPhase === 'knockout' && (
                  <Llaves groups={groups} />
                )}
              </TabsContent>
            </Tabs>
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

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar edición de grupos</DialogTitle>
            <DialogDescription>
              ¿Estás seguro que quieres editar los grupos? Ten en cuenta que la fase de llaves ya ha comenzado.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancelar</Button>
            <Button onClick={confirmEditGroups}
            className="bg-orange-500 hover:bg-orange-400 text-white"
            >Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}