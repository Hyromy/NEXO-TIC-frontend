import Main from "../../layout/Main"
import { Button } from "../../components/Button"
import { Table } from "../../components/Table"
import { useEffect, useState } from "react"
import { ColContainer, RowContainer, StackContainer } from "../../layout/Containers"
import { Form, TextField } from "../../components/Form"
import { Card } from "../../components/Card"
import useApi from "../../hooks/useApi"
import { decodeJWT } from "../../utils/jwt"
import { getAccessToken } from "../../utils/getters"
import { 
  incidentsService, 
  employeeService, 
} from "../../services/nexotic"

const defaultGap = 4
const maxEvidences = 2

type thisViewPort = "history" | "justify"

type IncidentOBJ = {
  id: number,
  dateTime: Date,
  type: string,
  status: string
}

export default function Incidencias () {
  const [viewPort, setViewPort] = useState<thisViewPort>("history")
  const [incident, setIncident] = useState<IncidentOBJ>()

  const handleClick = (incident: IncidentOBJ | undefined, view: thisViewPort) => {
    setIncident(view == "history" ? undefined : incident)
    setViewPort(view)
  }

  const render = () => {
    switch (viewPort) {
      case "history":
        return (
          <IndicentsHistory
            goToJustify={(incident) => handleClick(incident, "justify")}
          />
        )
      case "justify":
        return (
          <NewIncident
            incident={incident}
            goBack={() => handleClick(undefined, "history")}
          />
        )
    }
  }

  return (
    <Main>
      {render()}
    </Main>
  )
}

type IndicentsHistoryProps = {
  goToJustify: (incident: IncidentOBJ) => void
}
function IndicentsHistory({
  goToJustify
}: IndicentsHistoryProps) {
  const { execute: fetchData } = useApi<any>()
  const [incidents, setIncidents] = useState<IncidentOBJ[]>([])

  const token = getAccessToken()
  const decoded: any = token ? decodeJWT(token) : null
  const userId = decoded?.user_id

  useEffect(() => {
    const loadIncidents = async () => {
      if (!userId) return
      try {
        const empRes = await fetchData(employeeService.get(userId))
        const employee = Array.isArray(empRes) ? empRes[0] : empRes

        if (employee) {
          const res = await fetchData(incidentsService.get())
          if (Array.isArray(res)) {
            const mapped = res
              .filter((i: any) => i.employee === employee.id)
              .map((i: any) => ({
                id: i.id,
                dateTime: new Date(i.date),
                type: i.type,
                status: i.justified 
              }))
            setIncidents(mapped)
          }
        }
      } catch (e) { console.error(e) }
    }
    loadIncidents()
  }, [userId, fetchData])

  const sortByDate = (a: IncidentOBJ, b: IncidentOBJ) => (
    b.dateTime.getTime() - a.dateTime.getTime()
  )

  const drawer = (incident: IncidentOBJ) => [
    incident.id,
    incident.dateTime.toLocaleDateString(),
    incident.dateTime.toLocaleTimeString(),
    incident.type,
    incident.status,
    <Button
      variant={incident.status != "No justificado" ? "secondary" : "primary"}
      isLoading={incident.status != "No justificado"}
      onClick={() => goToJustify(incident)}
    >
      Justificar
    </Button>
  ]

  return (
    <StackContainer gap={defaultGap}>
      <h2>Historial de incidencias</h2>
      <Table 
        headers={["ID", "Fecha", "Hora", "Tipo", "Estatus", "Acciones"]}
        rows={incidents.sort(sortByDate)}
        trDrawer={drawer}
      />
    </StackContainer>
  )
}

type expectedData = {
  reason: string
  evidences: any[]
}
const validate = (data: expectedData) => {
  const { reason, evidences } = data
  if (!reason) {
    return "El motivo de justificación es obligatorio."
  }
  if (evidences.every(evidence => evidence == null)) {
    return "Debe adjuntar al menos una evidencia."
  }
  
  return "ok"
}

type NewIncidentProps = {
  incident: IncidentOBJ | undefined
  goBack: () => void
}
function NewIncident({
  incident,
  goBack
}: NewIncidentProps) {
  const [evidences, setEvidences] = useState<any[]>([
    null,
    null,
  ])

  const drawer = (incident: IncidentOBJ) => [
    incident.id,
    incident.dateTime.toLocaleDateString(),
    incident.dateTime.toLocaleTimeString(),
    incident.type,
  ]

  const emptyCols = () => {
    const cells: any[] = []
    for (let i = 0; i < maxEvidences; i++) {
      cells.push(evidences[i] != null
        ? <Card key={i}>Evidencia</Card>
        : null
      )
    }
    return cells
  }

  const addEvidence = (evidence: any) => {
    const emptyIndex = evidences[0] == null ? 0 : 1
    if (emptyIndex < maxEvidences) {
      const newEvidences = [...evidences]
      newEvidences[emptyIndex] = evidence
      setEvidences(newEvidences)
    }
  }

  const handleSubmit = (data: expectedData) => {
    data.evidences = evidences
    const validationError = validate(data)
    if (validationError != "ok") {
      alert("Error de validación: " + validationError)
      return
    }
    alert("Justificación enviada con éxito.")
    goBack()
  }

  return (
    <StackContainer gap={defaultGap}>
      <h2>Justificación de incidencia</h2>
      <Button variant="secondary" onClick={goBack} h_padding={5}>Volver</Button>
      <Table
        headers={["ID", "Fecha", "Hora", "Tipo"]}
        rows={incident ? [incident] : []}
        trDrawer={drawer}
      />
      <h3>Motivo de justificación</h3>
      <Form onSubmit={handleSubmit}>
        <StackContainer gap={defaultGap}>
          <div>
            <TextField type="area" name="reason" label="Especifique el motivo" />
          </div>
          <RowContainer>
            <ColContainer defaultSize={3}>
              <Button onClick={() => addEvidence(true)} isLoading={evidences.every(evidence => evidence != null)}>
                Adjuntar evidencia
              </Button>
            </ColContainer>
            {emptyCols().map((cell, index) => (
              <ColContainer key={index} defaultSize={3}>
                {cell}
              </ColContainer>
            ))}
            <ColContainer defaultSize={3}>
              <Button type="submit" variant="success" fat>
                Enviar
              </Button>
            </ColContainer>
          </RowContainer>
        </StackContainer>
      </Form>
    </StackContainer>
  )
}