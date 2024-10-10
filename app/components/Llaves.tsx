'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

type Jugador = {
  id: string;
  name: string;
  level: string;
}

type Enfrentamiento = {
  id: number;
  jugador1: Jugador | null;
  jugador2: Jugador | null;
  ganador: Jugador | null;
}

type LlavesProps = {
  groups: Jugador[][];
}

export default function Llaves({ groups }: LlavesProps) {
  const [rondas, setRondas] = useState<Enfrentamiento[][]>([])

  useEffect(() => {
    const jugadoresClasificados = groups.flatMap(group => group.slice(0, 2))
    const enfrentamientosIniciales = crearEnfrentamientos(jugadoresClasificados)
    setRondas([enfrentamientosIniciales, [], [], [], []])
  }, [groups])

  const crearEnfrentamientos = (jugadores: Jugador[]): Enfrentamiento[] => {
    return jugadores.reduce((acc, jugador, index, array) => {
      if (index % 2 === 0) {
        acc.push({
          id: acc.length + 1,
          jugador1: jugador,
          jugador2: array[index + 1] || null,
          ganador: null
        });
      }
      return acc;
    }, [] as Enfrentamiento[]);
  }

  const avanzarJugador = (rondaIndex: number, enfrentamientoIndex: number, jugadorGanador: Jugador) => {
    const nuevasRondas = [...rondas];
    nuevasRondas[rondaIndex][enfrentamientoIndex].ganador = jugadorGanador;

    if (rondaIndex < nuevasRondas.length - 1) {
      const siguienteRondaIndex = rondaIndex + 1;
      const nuevoEnfrentamientoIndex = Math.floor(enfrentamientoIndex / 2);

      if (!nuevasRondas[siguienteRondaIndex][nuevoEnfrentamientoIndex]) {
        nuevasRondas[siguienteRondaIndex][nuevoEnfrentamientoIndex] = {
          id: nuevasRondas[siguienteRondaIndex].length + 1,
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

    setRondas(nuevasRondas);
  }

  const nombresRondas = ["Llave de 32", "Llave de 16", "Cuartos de Final", "Semifinal", "Final"];

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Fase de Llaves</h1>
      <div className="flex flex-nowrap overflow-x-auto gap-4">
        {rondas.map((ronda, rondaIndex) => (
          <div key={rondaIndex} className="flex-none w-64">
            <h2 className="text-xl font-semibold mb-4 text-center">{nombresRondas[rondaIndex]}</h2>
            <div className="space-y-4">
              {ronda.map((enfrentamiento, enfrentamientoIndex) => (
                <Card key={enfrentamiento.id} className="bg-white shadow-md">
                  <CardContent className="p-4">
                    {enfrentamiento.jugador1 && (
                      <Button
                        onClick={() => avanzarJugador(rondaIndex, enfrentamientoIndex, enfrentamiento.jugador1!)}
                        className={`w-full mb-2 justify-start ${enfrentamiento.ganador === enfrentamiento.jugador1 ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'}`}
                        disabled={!!enfrentamiento.ganador}
                      >
                        {enfrentamiento.jugador1.name}
                      </Button>
                    )}
                    {enfrentamiento.jugador2 && (
                      <Button
                        onClick={() => avanzarJugador(rondaIndex, enfrentamientoIndex, enfrentamiento.jugador2!)}
                        className={`w-full justify-start ${enfrentamiento.ganador === enfrentamiento.jugador2 ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'}`}
                        disabled={!!enfrentamiento.ganador}
                      >
                        {enfrentamiento.jugador2.name}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
