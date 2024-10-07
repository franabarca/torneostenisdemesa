import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Trophy, Users, Star } from "lucide-react"

export default function TournamentHero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-secondary">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl">Sistema de Gestión de Torneos</h1>
          <p className="max-w-[700px] text-muted-foreground md:text-xl">
            Crea, gestiona y participa en torneos. Sigue el ranking de jugadores y mantente actualizado sobre las últimas competiciones.
          </p>
        </div>

        <div className="grid gap-6 mt-12 md:grid-cols-2 lg:grid-cols-3">
          {/* Create Tournaments Section */}
          <Card className="flex flex-col h-full pb-4">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="w-6 h-6" />
                <span>Crear Torneos</span>
              </CardTitle>
              <CardDescription>Configura nuevos torneos para que los jugadores se unan.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground mb-4">
                Esta función estará disponible próximamente. La creación de torneos estará disponible en futuras actualizaciones.
              </p>
            </CardContent>
            <Button className="mt-auto self-center mb-4 w-full" disabled>Crear Torneo</Button>
          </Card>

          {/* View Tournaments Section */}
          <Card className="flex flex-col h-full pb-4">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-6 h-6" />
                <span>Ver Torneos</span>
              </CardTitle>
              <CardDescription>Consulta los torneos en curso y los próximos.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground mb-4">
                Explora torneos y ve los jugadores registrados. La inscripción se gestiona a través de Google Forms.
              </p>
            </CardContent>
            <Link href="/tournaments">
              <Button className="mt-auto self-center mb-4 w-full">Ver Torneos</Button>
            </Link>
          </Card>

          {/* Player Rankings Section */}
          <Card className="flex flex-col h-full pb-4">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="w-6 h-6" />
                <span>Clasificación de Jugadores</span>
              </CardTitle>
              <CardDescription>Consulta los mejores jugadores según sus actuaciones recientes en torneos.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground mb-4">
                Ve las clasificaciones de los jugadores que han participado en torneos recientes.
              </p>
            </CardContent>
            <Link href="/rankings " >
              <Button className="mt-auto self-center mb-4 w-full">Ver Clasificaciones</Button>
            </Link>
          </Card>
        </div>
      </div>
    </section>
  )
}