import Main from "../../layout/Main"

import { Table } from "../../components/Table"
import { Button, type ButtonProps } from "../../components/Button"
import {
  ColContainer,
  RowContainer,
  ScrollableContainer,
  StackContainer
} from "../../layout/Containers"
import { useState, type ReactElement } from "react"
import { Navigate } from "react-router-dom"
import { Card } from "../../components/Card"
import { TextField } from "../../components/Form"
import { Alert, launchAlert } from "../../components/Alert"

type holydayRequest = {
  id: number,
  employeeName: string,
  date: string,
  days: number,
}

type incidentRequest = {
  id: number,
  employeeName: string,
  date: string,
  type: string,
}

type currentView = "table" | "holiday" | "incident"

const headerView = (
  title: string,
  goBackButton: ReactElement<ButtonProps>
) => (
  <RowContainer>
    <ColContainer defaultSize={10}>
      <h2>
        Detalles de la {title}
      </h2>
    </ColContainer>
    <ColContainer defaultSize={2}>
      {goBackButton}
    </ColContainer>
  </RowContainer>
)

const btnsView = (
  approveHandler: () => void,
  rejectHandler: () => void,
) => (
  <RowContainer>
    <ColContainer defaultSize={6}>
      <Button variant="success" fat onClick={approveHandler}>
        Aprobar
      </Button>
    </ColContainer>
    <ColContainer defaultSize={6}>
      <Button variant="danger" fat onClick={rejectHandler}>
        Rechazar
      </Button>
    </ColContainer>
  </RowContainer>
)

export default function Aprobaciones() {
  const [view, setView] = useState<currentView>("table")
  const [selectedItem, setSelectedItem] = useState<holydayRequest | incidentRequest | null>(null)

  const goBackButton = (
    <Button 
      variant="secondary"
      onClick={() => {
        setSelectedItem(null)
        setView("table")
      }}
    >
      Volver
    </Button>
  )

  const render = () => {
    switch (view) {
      case "table":
        return <TableView
          goToHolidayRequest={(item: holydayRequest) => {
            setSelectedItem(item)
            setView("holiday")
          }}
          goToIncidentRequest={(item: incidentRequest) => {
            setSelectedItem(item)
            setView("incident")
          }}
        />
      
      case "holiday":
        return <HolidayView
          item={selectedItem as holydayRequest}
          goBackButton={goBackButton}
        />
      
      case "incident":
        return <IncidentView
          item={selectedItem as incidentRequest}
          goBackButton={goBackButton}
        />

      default:
        return <Navigate to="/" />
    }
  }

  return (
    <Main> 
      {render()}
    </Main>
  )
}

type TableViewProps = {
  goToHolidayRequest: (item: holydayRequest) => void,
  goToIncidentRequest: (item: incidentRequest) => void,
}
function TableView({
  goToHolidayRequest,
  goToIncidentRequest,
}: TableViewProps) {
  const holydayRequests: holydayRequest[] = [
    { id: 1, employeeName: "Mateo Villanueva Rojas", date: "2026-12-12", days: 7 },
    { id: 2, employeeName: "Elena Garrido Soto", date: "2026-04-22", days: 2 },
    { id: 3, employeeName: "Carlos Mendoza Luna", date: "2026-02-18", days: 4 },
    { id: 4, employeeName: "Valeria Quintana Díaz", date: "2026-03-31", days: 3 },
  ]

  const incidentRequests: incidentRequest[] = [
    { id: 1, employeeName: "Julian Torres Blanco", date: "2026-03-31", type: "Inasistencia" },
    { id: 2, employeeName: "Elena Garrido Soto", date: "2026-04-22", type: "Salida anticipada" },
    { id: 3, employeeName: "Carlos Mendoza Luna", date: "2026-02-18", type: "Ausencia sin aviso" },
  ]

  const trForHoliday = (row: holydayRequest) => [
    row.employeeName,
    row.date,
    row.days,
    <Button onClick={() => goToHolidayRequest(row)}>
      Ver
    </Button>,
  ]

  const trForIncident = (row: incidentRequest) => [
    row.employeeName,
    row.date,
    row.type,
    <Button onClick={() => goToIncidentRequest(row)}>
      Ver
    </Button>,
  ]

  return (
    <StackContainer gap={4}>
      <div>
        <h2>Solicitudes de vacaciones</h2>
        <Table
          headers={["Nombre Empleado", "Fecha Solicitud", "Días Solicitados", "Acciones"]}
          rows={holydayRequests}
          trDrawer={trForHoliday}
        />
      </div>
      <div>
        <h2>Justificación de incidencias</h2>
        <Table
          headers={["Nombre Empleado", "Fecha Incidencia", "Tipo Incidencia", "Acciones"]}
          rows={incidentRequests}
          trDrawer={trForIncident}
        />
      </div>
    </StackContainer>
  )
}

type SomeViewProps = {
  item: holydayRequest | incidentRequest,
  goBackButton: ReactElement<ButtonProps>,
}

function HolidayView({
  item,
  goBackButton
}: SomeViewProps) {
  item = item as holydayRequest

  const datesRequested = [
    { day: 16, month: 1, year: 2026 },
    { day: 19, month: 1, year: 2026 },
    { day: 20, month: 1, year: 2026 },
  ]

  const textFieldName = "comments"

  const approveHandler = (item: holydayRequest) => {
    console.log(item)
    launchAlert("main-float-container",
      <Alert icon="info" type="info">
        {"{{ DEBUG }} Solicitud aprobada exitosamente."}
      </Alert>,
    )
    goBackButton.props.onClick?.()
  }

  const rejectHandler = (item: holydayRequest) => {
    console.log(item)
    launchAlert("main-float-container",
      <Alert icon="info" type="info">
        {"{{ DEBUG }} Solicitud rechazada."}
      </Alert>,
    )
    goBackButton.props.onClick?.()
  }

  const summary = (
    <RowContainer>
      <ColContainer defaultSize={12} md={4}>
        <Card header="Nombre" padding={3}>
          {item.employeeName}
        </Card>
      </ColContainer>
      <ColContainer defaultSize={12} md={4}>
        <Card header="Fecha Solicitud" padding={3}>
          {item.date}
        </Card>
      </ColContainer>
      <ColContainer defaultSize={12} md={4}>
        <Card header="Días Solicitados" padding={3}>
          {item.days}
        </Card>
      </ColContainer>
    </RowContainer>
  )

  const calendarAndComments = (
    <RowContainer>
      <ColContainer defaultSize={12} lg={8}>
        <Card header={`Fecha${item.days > 1 && "s"} solicitada${item.days > 1 && "s"}`}>
          <RowContainer>
            <ColContainer defaultSize={12} md={6}>
              <ScrollableContainer height={128}>
                <Table
                  headers={["Dia", "Mes", "Año"]}
                  rows={datesRequested}
                  trDrawer={(row) => [row.day, row.month, row.year]}
                />
              </ScrollableContainer>
            </ColContainer>
            <ColContainer defaultSize={12} md={6}>
              <Card>
                {"{{ calendar here }}"}
              </Card>
            </ColContainer>
          </RowContainer>
        </Card>
      </ColContainer>
      <ColContainer defaultSize={12} lg={4}>
        <Card header="Comentario">
          <TextField 
            name={textFieldName}
            type="area"
            rows={3}
            placeholder="Escribe aqui tu comentario"
          />
        </Card>
      </ColContainer>
    </RowContainer>
  )

  return (
    <StackContainer gap={4}>
      {headerView("solicitud", goBackButton)}
      {summary}
      {calendarAndComments}
      {btnsView(
        () => approveHandler(item),
        () => rejectHandler(item)
      )}
    </StackContainer>
  )
}

function IncidentView({
  item,
  goBackButton
}: SomeViewProps) {
  item = item as incidentRequest

  const approveHandler = (item: incidentRequest) => {
    console.log(item)
    launchAlert("main-float-container",
      <Alert icon="info" type="info">
        {"{{ DEBUG }} Justificación aprobada exitosamente."}
      </Alert>,
    )
    goBackButton.props.onClick?.()
  }

  const rejectHandler = (item: incidentRequest) => {
    console.log(item)
    launchAlert("main-float-container",
      <Alert icon="info" type="info">
        {"{{ DEBUG }} Justificación rechazada."}
      </Alert>,
    )
    goBackButton.props.onClick?.()
  }

  const evidences = [
    { id: 1, name: "Evidencia 1", url: "https://example.com/evidence1.jpg" },
    { id: 2, name: "Evidencia 2", url: "https://example.com/evidence2.jpg" },
    { id: 3, name: "Evidencia 3", url: "https://example.com/evidence3.jpg" },
  ]

  const incidentsDetails = [
    { id: 1, date: "2026-01-15", time: "08:30", type: "Entrada tardía" },
  ]

  const summary = (
    <StackContainer gap={2}>
      <RowContainer>
        <ColContainer>
          <Card header="Nombre" padding={3}>
            {item.employeeName}
          </Card>
        </ColContainer>
        <ColContainer>
          <Card header="Fecha de la justificación" padding={3}>
            {item.date}
          </Card>
        </ColContainer>
      </RowContainer>
      <Card header="Motivo de la incidencia" padding={3}>
        {"{{ some reason here }}"}
      </Card>
      <StackContainer orientation="row">
        {evidences.map(evidence => (
          <Card key={evidence.id}>
            {evidence.name}
          </Card>
        ))}
      </StackContainer>
    </StackContainer>
  )

  const table = (
    <Card header="Detalles de incidencias a justificar">
      <Table
        headers={["ID", "Fecha", "Hora", "Tipo"]}
        rows={incidentsDetails}
        trDrawer={(item) => [item.id, item.date, item.time, item.type]}
      />
    </Card>
  )

  const comments = (
    <Card header="Comentario">
      <TextField 
        name="comments"
        type="area"
        rows={3}
        placeholder="Escribe aqui tu comentario"
      />
    </Card>
  )

  return (
    <StackContainer gap={4}>
      {headerView("justificación", goBackButton)}
      {summary}
      {table}
      {comments}
      {btnsView(
        () => approveHandler(item),
        () => rejectHandler(item)
      )}
    </StackContainer>
  )
}
