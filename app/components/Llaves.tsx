'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type Jugador = {
  id: string;
  name: string;
  level: string;
  ranking: number;
  groupPosition?: number; // Añadimos esta propiedad para saber si fue primero o segundo en su grupo
}

type Enfrentamiento = {
  id: string;
  jugador1: Jugador | null;
  jugador2: Jugador | null;
  ganador: Jugador | null;
}

export default function Llaves({ groups }: { groups: Jugador[][] }) {
  const [rondas, setRondas] = useState<Enfrentamiento[][]>([])
  const [resultadosSets, setResultadosSets] = useState<{ [key: string]: { ganador: number, perdedor: number } }>({})
  const [currentEnfrentamiento, setCurrentEnfrentamiento] = useState<{ rondaIndex: number, enfrentamientoIndex: number } | null>(null)
  const [setsJugador1, setSetsJugador1] = useState(0)
  const [setsJugador2, setSetsJugador2] = useState(0)
  const [error, setError] = useState("")
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null)

  useEffect(() => {
    const jugadoresClasificados = obtenerJugadoresClasificados(groups);
    const enfrentamientosIniciales = crearEnfrentamientos(jugadoresClasificados)
    setRondas([enfrentamientosIniciales, [], [], [], []])
  }, [groups])

  const obtenerJugadoresClasificados = (groups: Jugador[][]): Jugador[] => {
    const sortedPlayers = groups.flatMap((group, groupIndex) => 
      group.map((jugador, playerIndex) => ({
        ...jugador,
        groupPosition: playerIndex + 1,
        groupIndex: groupIndex + 1
      }))
    ).sort((a, b) => {
      // Primero, ordenar por posición en el grupo
      if (a.groupPosition !== b.groupPosition) {
        return a.groupPosition - b.groupPosition;
      }
      // Si la posición en el grupo es la misma, ordenar por ranking
      return b.ranking - a.ranking;
    });

    const seededPlayers = sortedPlayers.map((jugador, index) => ({
      ...jugador,
      seed: index + 1
    }));

    // Imprimir los jugadores y sus seeds para verificación
    seededPlayers.forEach(jugador => {
      console.log(`Jugador: ${jugador.name}, Grupo: ${jugador.groupIndex}, Posición: ${jugador.groupPosition}, Ranking: ${jugador.ranking}, Seed: ${jugador.seed}`);
    });

    return seededPlayers.filter(jugador => jugador.groupPosition <= 2);
  }

  const crearEnfrentamientos = (jugadores: Jugador[]): Enfrentamiento[] => {
    // Ordenar jugadores primero por posición en el grupo y luego por ranking
    const jugadoresOrdenados = [...jugadores].sort((a, b) => {
      if (a.groupPosition !== b.groupPosition) {
        return a.groupPosition! - b.groupPosition!;
      }
      return b.ranking - a.ranking;
    });

    // Asignar seeds basados en el nuevo orden
    const jugadoresConSeed = jugadoresOrdenados.map((jugador, index) => ({
      ...jugador,
      seed: index + 1
    }));

    const numJugadores = jugadoresConSeed.length;
    const enfrentamientos: Enfrentamiento[] = [];

    // Función auxiliar para crear un enfrentamiento
    const crearEnfrentamiento = (seed1: number, seed2: number) => {
      enfrentamientos.push({
        id: `${enfrentamientos.length + 1}`,
        jugador1: jugadoresConSeed.find(j => j.seed === seed1) || null,
        jugador2: jugadoresConSeed.find(j => j.seed === seed2) || null,
        ganador: null
      });
    };

    // Lógica de emparejamiento basada en el número de jugadores
    if (numJugadores <= 4) {
      crearEnfrentamiento(1, 4);
      crearEnfrentamiento(2, 3);
    } else if (numJugadores <= 8) {
      crearEnfrentamiento(1, 8);
      crearEnfrentamiento(4, 5);
      crearEnfrentamiento(2, 7);
      crearEnfrentamiento(3, 6);
    } else if (numJugadores <= 16) {
      crearEnfrentamiento(1, 16);
      crearEnfrentamiento(8, 9);
      crearEnfrentamiento(4, 13);
      crearEnfrentamiento(5, 12);
      crearEnfrentamiento(2, 15);
      crearEnfrentamiento(7, 10);
      crearEnfrentamiento(3, 14);
      crearEnfrentamiento(6, 11);
    } else if (numJugadores <= 32) {
      crearEnfrentamiento(1, 32);
      crearEnfrentamiento(16, 17);
      crearEnfrentamiento(8, 25);
      crearEnfrentamiento(9, 24);
      crearEnfrentamiento(4, 29);
      crearEnfrentamiento(13, 20);
      crearEnfrentamiento(5, 28);
      crearEnfrentamiento(12, 21);
      crearEnfrentamiento(2, 31);
      crearEnfrentamiento(15, 18);
      crearEnfrentamiento(7, 26);
      crearEnfrentamiento(10, 23);
      crearEnfrentamiento(3, 30);
      crearEnfrentamiento(14, 19);
      crearEnfrentamiento(6, 27);
      crearEnfrentamiento(11, 22);
    } else if (numJugadores <= 64) {
      crearEnfrentamiento(1, 64);
      crearEnfrentamiento(32, 33);
      crearEnfrentamiento(16, 49);
      crearEnfrentamiento(17, 48);
      crearEnfrentamiento(8, 57);
      crearEnfrentamiento(25, 40);
      crearEnfrentamiento(9, 56);
      crearEnfrentamiento(24, 41);
      crearEnfrentamiento(4, 61);
      crearEnfrentamiento(29, 36);
      crearEnfrentamiento(13, 52);
      crearEnfrentamiento(20, 45);
      crearEnfrentamiento(5, 60);
      crearEnfrentamiento(28, 37);
      crearEnfrentamiento(12, 53);
      crearEnfrentamiento(21, 44);
      crearEnfrentamiento(2, 63);
      crearEnfrentamiento(31, 34);
      crearEnfrentamiento(15, 50);
      crearEnfrentamiento(18, 47);
      crearEnfrentamiento(7, 58);
      crearEnfrentamiento(26, 39);
      crearEnfrentamiento(10, 55);
      crearEnfrentamiento(23, 42);
      crearEnfrentamiento(3, 62);
      crearEnfrentamiento(30, 35);
      crearEnfrentamiento(14, 51);
      crearEnfrentamiento(19, 46);
      crearEnfrentamiento(6, 59);
      crearEnfrentamiento(27, 38);
      crearEnfrentamiento(11, 54);
      crearEnfrentamiento(22, 43);
    } else if (numJugadores <= 128) {
      // Implementar lógica para 128 jugadores
      // Sigue el mismo patrón, emparejando 1 vs 128, 64 vs 65, 32 vs 97, etc.
    } else if (numJugadores <= 256) {
      // Implementar lógica para 256 jugadores
      // Sigue el mismo patrón, emparejando 1 vs 256, 128 vs 129, 64 vs 193, etc.
    } else {
      console.error("Número de jugadores no soportado");
    }

    return enfrentamientos;
  }

  const avanzarJugador = (rondaIndex: number, enfrentamientoIndex: number, jugadorGanador: Jugador) => {
    const nuevasRondas = [...rondas];
    const enfrentamientoActual = nuevasRondas[rondaIndex][enfrentamientoIndex];

    // Determinar el verdadero ganador basado en los sets
    if (setsJugador1 > setsJugador2) {
      jugadorGanador = enfrentamientoActual.jugador1!;
    } else {
      jugadorGanador = enfrentamientoActual.jugador2!;
    }

    enfrentamientoActual.ganador = jugadorGanador;

    // Solo actualizar los resultados de sets cuando se guarda desde el diálogo
    setResultadosSets(prev => ({
      ...prev,
      [enfrentamientoActual.id]: { ganador: Math.max(setsJugador1, setsJugador2), perdedor: Math.min(setsJugador1, setsJugador2) }
    }));

    if (rondaIndex < nuevasRondas.length - 1) {
      const siguienteRondaIndex = rondaIndex + 1;
      const nuevoEnfrentamientoIndex = Math.floor(enfrentamientoIndex / 2);

      if (!nuevasRondas[siguienteRondaIndex][nuevoEnfrentamientoIndex]) {
        nuevasRondas[siguienteRondaIndex][nuevoEnfrentamientoIndex] = {
          id: `${siguienteRondaIndex}-${nuevoEnfrentamientoIndex}`,
          jugador1: null,
          jugador2: null,
          ganador: null
        };
      }

      if (enfrentamientoIndex % 2 === 0) {
        nuevasRondas[siguienteRondaIndex][nuevoEnfrentamientoIndex].jugador1 = jugadorGanador;
      } else {
        nuevasRondas[siguienteRondaIndex][nuevoEnfrentamientoIndex].jugador2 = jugadorGanador;
      }
    }

    // Reiniciar los sets para el siguiente enfrentamiento
    setSetsJugador1(0);
    setSetsJugador2(0);

    setRondas(nuevasRondas);
  }

  const nombresRondas = ["Llave de 16", "Octavos de Final", "Cuartos de Final", "Semifinal", "Final"];

  const guardarSets = () => {
    if (setsJugador1 === setsJugador2) {
      setError("Los sets no pueden ser iguales.");
      return;
    }
    if (setsJugador1 < 3 && setsJugador2 < 3) {
      setError("El jugador ganador debe tener 3 sets a favor.");
      return;
    }
    const { rondaIndex, enfrentamientoIndex } = currentEnfrentamiento!;
    const jugadorGanador = setsJugador1 > setsJugador2 ? rondas[rondaIndex][enfrentamientoIndex].jugador1! : rondas[rondaIndex][enfrentamientoIndex].jugador2!;
    avanzarJugador(rondaIndex, enfrentamientoIndex, jugadorGanador);
    setOpenPopoverId(null); // Cerrar el popover
    setError("");
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Fase de Llaves</h1>
      <div className="flex flex-nowrap overflow-x-auto gap-4">
        {rondas.map((ronda, rondaIndex) => (
          <div key={rondaIndex} className="flex-none w-64">
            <h2 className="text-xl font-semibold mb-4 text-center">{nombresRondas[rondaIndex]}</h2>
            <div className="space-y-4">
              {ronda.map((enfrentamiento, enfrentamientoIndex) => {
                const popoverId = `${rondaIndex}-${enfrentamientoIndex}`;
                const resultado = resultadosSets[enfrentamiento.id] || { ganador: null, perdedor: null };
                const cardOpacity = enfrentamiento.ganador ? 'opacity-60' : 'opacity-100';

                return (
                  <Popover 
                    key={popoverId}
                    open={openPopoverId === popoverId} 
                    onOpenChange={(open) => {
                      if (open) {
                        setOpenPopoverId(popoverId);
                        setCurrentEnfrentamiento({ rondaIndex, enfrentamientoIndex });
                      } else {
                        setOpenPopoverId(null);
                      }
                    }}
                  >
                    <PopoverTrigger asChild>
                      <Card 
                        className={`bg-white shadow-md cursor-pointer ${cardOpacity}`}
                      >
                        <CardContent className="p-4">
                          {enfrentamiento.jugador1 && (
                            <div className="flex justify-between items-center">
                              <span className={`w-full mb-2 ${enfrentamiento.ganador === enfrentamiento.jugador1 ? 'text-orange-500 font-bold' : 'text-black'}`}>
                                {enfrentamiento.jugador1.name}
                              </span>
                              {enfrentamiento.ganador && (
                                <span className={`mb-2 ml-2 ${enfrentamiento.ganador === enfrentamiento.jugador1 ? 'text-orange-500 font-bold' : 'text-black'}`}>
                                  {enfrentamiento.ganador === enfrentamiento.jugador1 ? resultado.ganador : resultado.perdedor}
                                </span>
                              )}
                            </div>
                          )}
                          {enfrentamiento.jugador2 && (
                            <div className="flex justify-between items-center">
                              <span className={`w-full ${enfrentamiento.ganador === enfrentamiento.jugador2 ? 'text-orange-500 font-bold' : 'text-black'}`}>
                                {enfrentamiento.jugador2.name}
                              </span>
                              {enfrentamiento.ganador && (
                                <span className={`ml-2 ${enfrentamiento.ganador === enfrentamiento.jugador2 ? 'text-orange-500 font-bold' : 'text-black'}`}>
                                  {enfrentamiento.ganador === enfrentamiento.jugador2 ? resultado.ganador : resultado.perdedor}
                                </span>
                              )}
                            </div>
                          )}
                          {!enfrentamiento.jugador1 || !enfrentamiento.jugador2 ? (
                            <p className="text-sm text-gray-500 text-center mt-2">Esperando oponente...</p>
                          ) : null}
                        </CardContent>
                      </Card>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <h3 className="font-semibold mb-4">Ingrese los sets</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="mr-2">{enfrentamiento.jugador1?.name}</span>
                          <select
                            value={setsJugador1}
                            onChange={(e) => setSetsJugador1(parseInt(e.target.value, 10))}
                            className="w-auto p-2 border rounded"
                          >
                            {[0, 1, 2, 3].map(num => (
                              <option key={num} value={num}>{num}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="mr-2">{enfrentamiento.jugador2?.name}</span>
                          <select
                            value={setsJugador2}
                            onChange={(e) => setSetsJugador2(parseInt(e.target.value, 10))}
                            className="w-auto p-2 border rounded"
                          >
                            {[0, 1, 2, 3].map(num => (
                              <option key={num} value={num}>{num}</option>
                            ))}
                          </select>
                        </div>
                        {error && <p className="text-red-500">{error}</p>}
                        <div className="flex justify-end space-x-2 mt-4">
                          <Button onClick={guardarSets}>Guardar</Button>
                          <Button onClick={() => setOpenPopoverId(null)} variant="secondary">Cancelar</Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}