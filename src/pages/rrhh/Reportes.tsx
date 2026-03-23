import { useState } from "react"

import Main from "../../layout/Main"
import { Card } from "../../components/Card"
import { Button } from "../../components/Button"
import { Form } from "../../components/Form"
import { reportService } from "../../services/nexotic"

type ReporteData = {
  tipoReporte: string
  fechaInicio: string
  fechaFin: string
}

export default function Reportes() {
  const [generando, setGenerando] = useState(false)
  const [error, setError] = useState("")

  const handleGenerarReporte = async (data: ReporteData) => {
    const { tipoReporte, fechaInicio, fechaFin } = data

    if (!tipoReporte || !fechaInicio || !fechaFin) {
      alert("Todos los campos son obligatorios.")
      return
    }

    try {
      setGenerando(true)
      setError("")

      await reportService.download({
        tipoReporte,
        fechaInicio,
        fechaFin,
      })
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al generar el reporte.")
    } finally {
      setGenerando(false)
    }
  }

  return (
    <Main>
      <Card shadow>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3>Reportes</h3>
        </div>

        <Form onSubmit={handleGenerarReporte}>
          <div className="mb-4">
            <label htmlFor="tipoReporte" className="form-label">
              Tipo de reporte
            </label>

            <select
              id="tipoReporte"
              name="tipoReporte"
              title="Tipo de reporte"
              className="form-select"
              defaultValue=""
            >
              <option value="" disabled>
                Seleccione el tipo de reporte
              </option>
              <option value="asistencia">Asistencia y puntualidad</option>
              <option value="vacaciones">Saldos y uso de vacaciones</option>
              <option value="movimientos">Movimientos laborales</option>
              <option value="incidencias">Incidencias reclamadas</option>
            </select>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="fechaInicio" className="form-label">
                Fecha inicio de periodo
              </label>

              <input
                id="fechaInicio"
                name="fechaInicio"
                type="date"
                className="form-control"
              />
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="fechaFin" className="form-label">
                Fecha fin de periodo
              </label>

              <input
                id="fechaFin"
                name="fechaFin"
                type="date"
                className="form-control"
              />
            </div>
          </div>

          <div className="d-flex gap-2">
            <Button variant="primary" type="submit" isLoading={generando}>
              {generando ? "Generando..." : "Generar reporte"}
            </Button>
          </div>
        </Form>

        {error && (
          <div className="alert alert-danger mt-3 mb-0" role="alert">
            {error}
          </div>
        )}
      </Card>
    </Main>
  )
}