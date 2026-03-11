import Main from "../../layout/Main"

import { Button } from "../../components/Button"
import { Table } from "../../components/Table"
import { useState } from "react"
import { ColContainer, FloatContainer, RowContainer, StackContainer } from "../../layout/Containers"
import { Form, TextField } from "../../components/Form"
import { Card } from "../../components/Card"
import { Alert, launchAlert } from "../../components/Alert"

const defaultGap = 4
const maxEvidences = 2

const floatContainerId = "incident-float-container"

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
      <FloatContainer id={floatContainerId} />
    </Main>
  )
}

type IndicentsHistoryProps = {
  goToJustify: (incident: IncidentOBJ) => void
}
function IndicentsHistory({
  goToJustify
}: IndicentsHistoryProps) {
  const incidents: IncidentOBJ[] = [
    {id: 1, dateTime: new Date(2026, 3, 9, 12, 36, 34), type: "Entrada tardía", status: "Pendiente"},
    {id: 2, dateTime: new Date(2026, 2, 23, 0, 0, 46), type: "Dia económico", status: "Justificado"},
    {id: 3, dateTime: new Date(2025, 1, 10, 14, 25, 12), type: "Entrada tardía", status: "No justificado"},
    {id: 4, dateTime: new Date(2025, 7, 19, 0, 0, 8), type: "Vacaciones", status: "Justificado"},
  ]

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
        ? <Card>Evidencia</Card>
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
      launchAlert(floatContainerId,
        <Alert type="warning" icon="warning">
          {validationError}
        </Alert>,
        true
      )
      return
    }

    launchAlert(floatContainerId,
      <Alert type="success" icon="success">
        Incidencia justificada correctamente.
      </Alert>,
      true
    )
    goBack()
  }

  return (
    <StackContainer gap={defaultGap}>
      <h2>Justificación de incidencia</h2>
      <Button variant="secondary" onClick={goBack} h_padding={5}>Volver</Button>
      <Table
        headers={["ID", "Fecha", "Hora", "Tipo"]}
        rows={[incident] as IncidentOBJ[]}
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
