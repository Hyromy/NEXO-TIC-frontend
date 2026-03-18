import { useState } from "react"
import { useNavigate } from "react-router-dom"

import Main from "../../layout/Main"
import { Card } from "../../components/Card"
import { Button } from "../../components/Button"

type Aviso = {
  id: number
  tipo: "Urgente" | "Aviso importante" | "Informe"
  titulo: string
  contenido: string
  tiempo: string
}

export default function Nuevo_Aviso() {
  const navigate = useNavigate()

  const [titulo, setTitulo] = useState("")
  const [contenido, setContenido] = useState("")
  const [prioridad, setPrioridad] = useState("")

  const handleSubmit = () => {
    if (!titulo || !contenido || !prioridad) {
      alert("Todos los campos son obligatorios.")
      return
    }

    const avisosGuardados = localStorage.getItem("avisosRH")
    const avisosActuales: Aviso[] = avisosGuardados ? JSON.parse(avisosGuardados) : []

    const nuevoAviso: Aviso = {
      id: Date.now(),
      tipo: prioridad as "Urgente" | "Aviso importante" | "Informe",
      titulo: titulo,
      contenido: contenido,
      tiempo: "Publicado hace unos segundos"
    }

    const nuevosAvisos = [nuevoAviso, ...avisosActuales]

    localStorage.setItem("avisosRH", JSON.stringify(nuevosAvisos))

    alert("Aviso creado correctamente.")
    navigate("/notices")
  }

  return (
    <Main>
      <Card shadow>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3>Nuevo aviso</h3>

          <Button variant="secondary" onClick={() => navigate("/notices")}>
            Volver
          </Button>
        </div>

        <div className="mb-3">
          <label htmlFor="titulo" className="form-label">
            Título
          </label>
          <input
            id="titulo"
            className="form-control"
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Escribe el título del aviso"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="contenido" className="form-label">
            Contenido
          </label>
          <textarea
            id="contenido"
            className="form-control"
            rows={5}
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            placeholder="Escribe el contenido del aviso"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="prioridad" className="form-label">
            Prioridad
          </label>
          <select
            id="prioridad"
            className="form-select"
            value={prioridad}
            onChange={(e) => setPrioridad(e.target.value)}
          >
            <option value="">Seleccione una prioridad</option>
            <option value="Informe">Informe</option>
            <option value="Aviso importante">Aviso importante</option>
            <option value="Urgente">Urgente</option>
          </select>
        </div>

        <div className="d-flex gap-2">
          <Button variant="primary" onClick={handleSubmit}>
            Crear
          </Button>

        </div>
      </Card>
    </Main>
  )
}