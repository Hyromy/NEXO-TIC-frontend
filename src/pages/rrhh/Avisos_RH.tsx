import Main from "../../layout/Main"
import { Card } from "../../components/Card"
import { Button } from "../../components/Button"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

type Aviso = {
  id: number
  tipo: "Urgente" | "Aviso importante" | "Informe"
  titulo: string
  contenido: string
  tiempo: string
}

const AVISOS_INICIALES: Aviso[] = [
  {
    id: 1,
    tipo: "Urgente",
    titulo: "Todos los empleados deben presentarse a pruebas médicas",
    contenido: "Las pruebas se realizarán del 18/03/2026 al 29/03/2026 de 13:30 hrs a 16:00 hrs.",
    tiempo: "Publicado hace 6 horas"
  },
  {
    id: 2,
    tipo: "Aviso importante",
    titulo: "Suspensión de labores por mantenimiento",
    contenido: "El próximo viernes 06/02/2026 a las 14:00 hrs las labores se suspenderán hasta el día siguiente por mantenimiento.",
    tiempo: "Publicado hace 2 horas"
  },
  {
    id: 3,
    tipo: "Informe",
    titulo: "Suspensión oficial y celebración interna",
    contenido: "Recuerda que este martes 16/09/2026 por disposición oficial se suspenden labores y el 27/09/2026 tendremos nuestra celebración “Tarde Mexica”.",
    tiempo: "Publicado hace 3 días"
  },
  {
    id: 4,
    tipo: "Aviso importante",
    titulo: "Revisión de equipo de cómputo",
    contenido: "Se realizará revisión de equipo de cómputo en el área administrativa durante esta semana.",
    tiempo: "Publicado hace 5 días"
  }
]

export default function Avisos_RH() {
  const navigate = useNavigate()
  const [avisos, setAvisos] = useState<Aviso[]>([])

  useEffect(() => {
    const avisosGuardados = localStorage.getItem("avisosRH")

    if (avisosGuardados) {
      setAvisos(JSON.parse(avisosGuardados))
    } else {
      localStorage.setItem("avisosRH", JSON.stringify(AVISOS_INICIALES))
      setAvisos(AVISOS_INICIALES)
    }
  }, [])

  const getIcono = (tipo: Aviso["tipo"]) => {
    if (tipo === "Urgente") return "🚨"
    if (tipo === "Aviso importante") return "⚠️"
    return "📢"
  }

  const getColorClasses = (tipo: Aviso["tipo"]) => {
    if (tipo === "Urgente") {
      return "border border-danger bg-danger-subtle"
    }
    if (tipo === "Aviso importante") {
      return "border border-warning bg-warning-subtle"
    }
    return "border border-info bg-info-subtle"
  }

  const getTitleClasses = (tipo: Aviso["tipo"]) => {
    if (tipo === "Urgente") {
      return "text-danger"
    }
    if (tipo === "Aviso importante") {
      return "text-warning-emphasis"
    }
    return "text-info-emphasis"
  }

  const avisosRecientes = avisos.slice(0, 3)

  const renderAviso = (aviso: Aviso) => (
    <div
      key={aviso.id}
      className={`rounded p-3 ${getColorClasses(aviso.tipo)}`}
    >
      <p className={`fw-bold mb-2 ${getTitleClasses(aviso.tipo)}`}>
        {getIcono(aviso.tipo)} {aviso.tipo}: {aviso.titulo}
      </p>

      <p className="mb-2">
        {aviso.contenido}
      </p>

      <small className="text-muted">{aviso.tiempo}</small>
    </div>
  )

  return (
    <Main>
      <Card shadow>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3>Avisos</h3>

          <Button
            variant="primary"
            onClick={() => navigate("/notices/new")}
          >
            Nuevo aviso
          </Button>
        </div>

        <div className="mb-4">
          <h5 className="mb-3">Recientes (5 días anteriores a la fecha actual)</h5>

          <div className="d-flex flex-column gap-3">
            {avisosRecientes.map(renderAviso)}
          </div>
        </div>

        <div>
          <h5 className="mb-3">Todos los anuncios</h5>

          <div className="d-flex flex-column gap-3">
            {avisos.map(renderAviso)}
          </div>
        </div>
      </Card>
    </Main>
  )
}