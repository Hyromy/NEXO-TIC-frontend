import Main from "../../layout/Main"
import { Table } from "../../components/Table"
import { Button, type ButtonProps } from "../../components/Button"
import {
  ColContainer,
  RowContainer,
  ScrollableContainer,
  StackContainer
} from "../../layout/Containers"
import { useEffect, useState, useCallback, type ReactElement } from "react"
import { Navigate } from "react-router-dom"
import { Card } from "../../components/Card"
import { TextField } from "../../components/Form"
import useApi from "../../hooks/useApi"
import { 
  vacationRequestService, 
  incidentService, 
  employeeService 
} from "../../services/nexotic"

type holydayRequest = {
  id: number,
  employeeName: string,
  date: string,
  days: number,
  raw?: any // Para guardar el objeto original de la BD
}

type incidentRequest = {
  id: number,
  employeeName: string,
  date: string,
  type: string,
  reason?: string,
  raw?: any // Para guardar el objeto original de la BD
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
  const { execute: fetchData } = useApi<any>()
  const [holydayRequests, setHolydayRequests] = useState<holydayRequest[]>([])
  const [incidentRequests, setIncidentRequests] = useState<incidentRequest[]>([])

  const loadData = useCallback(async () => {
    try {
      const [vacs, incs, emps] = await Promise.all([
        fetchData(vacationRequestService.getAll()),
        fetchData(incidentService.getAll()),
        fetchData(employeeService.getAll())
      ])

      const employees = Array.isArray(emps) ? emps : []
      
      if (Array.isArray(vacs)) {
        const pending = vacs.filter((v: any) => v.status === "pending" || v.status === "PENDING").map((v: any) => {
          const emp = v.employee || employees.find((e: any) => e.id === v.employee)
          const name = emp?.user 
            ? `${emp.user.first_name} ${emp.user.last_name}`
            : `Empleado #${v.employee?.id || v.employee}`;

          return {
            id: v.id,
            employeeName: name,
            date: v.date ? new Date(v.date.includes("T") ? v.date : v.date + "T00:00:00").toLocaleDateString() : "Sin fecha",
            days: v.days || 0, 
            raw: v
          }
        })
        setHolydayRequests(pending)
      }
      if (Array.isArray(incs)) {
        const pendingIncs = incs.filter((i: any) => i.justified === "No justificado" || i.justified === "NOT_JUSTIFIED").map((i: any) => {
          const emp = i.employee || employees.find((e: any) => e.id === i.employee)
          const name = emp?.user 
            ? `${emp.user.first_name} ${emp.user.last_name}`
            : `Empleado #${i.employee?.id || i.employee}`;

          return {
            id: i.id,
            employeeName: name,
            date: i.date ? new Date(i.date.includes("T") ? i.date : i.date + "T00:00:00").toLocaleDateString() : "Sin fecha",
            type: i.type,
            reason: i.justification_data?.reason || i.notes || "El empleado aún no ha redactado su justificación.",
            raw: i
          }
        })
        setIncidentRequests(pendingIncs)
      }
    } catch (e) { console.error(e) }
  }, [fetchData])

  useEffect(() => { loadData() }, [loadData])

  const goBackButton = (
    <Button 
      variant="secondary"
      onClick={() => {
        setSelectedItem(null)
        setView("table")
        loadData() 
      }}
    >
      Volver
    </Button>
  )

  const render = () => {
    switch (view) {
      case "table":
        return <TableView
          holydayRequests={holydayRequests}
          incidentRequests={incidentRequests}
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
  holydayRequests: holydayRequest[],
  incidentRequests: incidentRequest[],
  goToHolidayRequest: (item: holydayRequest) => void,
  goToIncidentRequest: (item: incidentRequest) => void,
}

function TableView({
  holydayRequests,
  incidentRequests,
  goToHolidayRequest,
  goToIncidentRequest,
}: TableViewProps) {

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
  const holiday = item as holydayRequest
  const { execute: fetchData } = useApi<any>()
  const datesRequested = holiday.raw?.requested_days?.map((d: string) => {
    const dateObj = new Date(d.includes("T") ? d : d + "T00:00:00")
    return { day: dateObj.getDate(), month: dateObj.getMonth() + 1, year: dateObj.getFullYear() }
  }) || []

  const textFieldName = "comments"

  const approveHandler = async () => {
    try {
      await fetchData(vacationRequestService.update(holiday.id, { status: "approved" }))
      alert("Aprobar solicitud")
      goBackButton.props.onClick?.()
    } catch (e) { alert("Error al procesar la aprobación") }
  }

  const rejectHandler = async () => {
    try {
      await fetchData(vacationRequestService.update(holiday.id, { status: "rejected" }))
      alert("Rechazar solicitud")
      goBackButton.props.onClick?.()
    } catch (e) { alert("Error al procesar el rechazo") }
  }

  const summary = (
    <RowContainer>
      <ColContainer defaultSize={12} md={4}>
        <Card header="Nombre" padding={3}>
          {holiday.employeeName}
        </Card>
      </ColContainer>
      <ColContainer defaultSize={12} md={4}>
        <Card header="Fecha Solicitud" padding={3}>
          {holiday.date}
        </Card>
      </ColContainer>
      <ColContainer defaultSize={12} md={4}>
        <Card header="Días Solicitados" padding={3}>
          {holiday.days}
        </Card>
      </ColContainer>
    </RowContainer>
  )

  const calendarAndComments = (
    <RowContainer>
      <ColContainer defaultSize={12} lg={8}>
        <Card header={`Fecha${holiday.days > 1 ? "s" : ""} solicitada${holiday.days > 1 ? "s" : ""}`}>
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
            value={holiday.raw?.notes || "Sin comentarios adicionales"}
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
        approveHandler,
        rejectHandler)}
    </StackContainer>
  )
}

function IncidentView({
  item,
  goBackButton
}: SomeViewProps) {
  const incident = item as incidentRequest
  const { execute: fetchData } = useApi<any>()

  const approveHandler = async () => {
    try {
      await fetchData(incidentService.update(incident.id, { justified: "Justificado" }))
      alert("Aprobar justificación")
      goBackButton.props.onClick?.()
    } catch (e) { alert("Error en el servidor") }
  }

  const rejectHandler = async () => {
    try {
      await fetchData(incidentService.update(incident.id, { justified: "No justificado" }))
      alert("Rechazar justificación")
      goBackButton.props.onClick?.()
    } catch (e) { alert("Error en el servidor") }
  }

  const evidences = incident.raw?.evidences?.map((ev: any, idx: number) => ({
    id: ev.id || idx,
    name: `Evidencia ${idx + 1}`,
    url: ev.file || ev.url
  })) || []

  const incidentsDetails = [
    { id: incident.id, date: incident.date, time: incident.raw?.time || "---", type: incident.type },
  ]

  const summary = (
    <StackContainer gap={2}>
      <RowContainer>
        <ColContainer>
          <Card header="Nombre" padding={3}>
            {incident.employeeName}</Card>
        </ColContainer>
        <ColContainer>
          <Card header="Fecha de la justificación" padding={3}>
            {incident.date}</Card>
        </ColContainer>
      </RowContainer>
      <Card header="Motivo de la incidencia" padding={3}>
       {incident.reason || "No se especificó un motivo en la solicitud."}
      </Card>
      <StackContainer orientation="row">
        {evidences.length > 0 ? evidences.map((evidence: any) => (
          <Card key={evidence.id}>
             <a href={evidence.url} target="_blank" rel="noreferrer">
               📄 {evidence.name}
             </a>
          </Card>
        )) : <p>No se adjuntaron evidencias gráficas.</p>}
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
      {btnsView(approveHandler, rejectHandler)}
    </StackContainer>
  )
}