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
  employeeService,
  vacationDetailService 
} from "../../services/nexotic"
import { getAccessToken } from "../../utils/getters"
import { decodeJWT } from "../../utils/jwt"
type holydayRequest = {
  id: number,
  employeeName: string,
  date: string,
  days: number,
  raw?: any 
}

type incidentRequest = {
  id: number,
  employeeName: string,
  date: string,
  type: string,
  reason?: string,
  raw?: any 
}

type currentView = "table" | "holiday" | "incident"

type SomeViewProps = {
  item: holydayRequest | incidentRequest,
  goBackButton: ReactElement<ButtonProps>,
}

// --- COMPONENTES DE APOYO ---
const headerView = (title: string, goBackButton: ReactElement<ButtonProps>) => (
  <RowContainer>
    <ColContainer defaultSize={10}>
      <h2>Detalles de la {title}</h2>
    </ColContainer>
    <ColContainer defaultSize={2}>{goBackButton}</ColContainer>
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
      const [vacs, incs, emps, details] = await Promise.all([
        fetchData(vacationRequestService.getAll()),
        fetchData(incidentService.getAll()),
        fetchData(employeeService.getAll()),
        fetchData(vacationDetailService.getAll())
      ])

      const employees = Array.isArray(emps) ? emps : []
      const allDetails = Array.isArray(details) ? details : []
      const token = getAccessToken();
      const decoded: any = token ? decodeJWT(token) : null;
      const currentUserId = decoded?.user_id;

      if (Array.isArray(vacs)) {
        const pending = vacs.filter((v: any) => {
          const isPending = v.status === "pending" || v.status === "PENDING";
          const emp = v.employee || employees.find((e: any) => e.id === (v.employee?.id || v.employee));
          const isNotMine = Number(emp?.user?.id || emp?.user) !== Number(currentUserId);
          return isPending && isNotMine;
        }).map((v: any) => {
          const emp = v.employee || employees.find((e: any) => e.id === (v.employee?.id || v.employee));
          const name = emp?.user ? `${emp.user.first_name} ${emp.user.last_name}` : `Empleado #${v.id}`;
          
          const myDetails = allDetails.filter((d: any) => 
            Number(d.vacation_request?.id || d.vacation_request_id || d.vacation_request) === Number(v.id)
          );

          return {
            id: v.id,
            employeeName: name,
            date: v.date ? new Date(v.date.includes("T") ? v.date : v.date + "T00:00:00").toLocaleDateString() : "Sin fecha",
            days: myDetails.length,
            raw: { ...v, requested_days_list: myDetails.map(d => d.selected_day) }
          }
        })
        setHolydayRequests(pending)
      }
      if (Array.isArray(incs)) {
        const pendingIncs = incs.filter((i: any) => {
          const isPending = i.justified === "No justificado" || i.justified === "NOT_JUSTIFIED";
          const emp = i.employee || employees.find((e: any) => e.id === (i.employee?.id || i.employee));
          const isNotMine = Number(emp?.user?.id || emp?.user) !== Number(currentUserId);
          return isPending && isNotMine;
        }).map((i: any) => {
          const emp = i.employee || employees.find((e: any) => e.id === (i.employee?.id || i.employee))
          return {
            id: i.id,
            employeeName: emp?.user ? `${emp.user.first_name} ${emp.user.last_name}` : `Empleado #${i.id}`,
            date: i.date ? new Date(i.date.includes("T") ? i.date : i.date + "T00:00:00").toLocaleDateString() : "Sin fecha",
            type: i.type,
            reason: i.justification_data?.reason || i.notes || "Sin redactar.",
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
        loadData();
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
      default: return <Navigate to="/" />
    }
  }

  return <Main>{render()}</Main>
}

// --- VISTAS HIJAS ---

function TableView({ holydayRequests, incidentRequests, goToHolidayRequest, goToIncidentRequest }: any) {
  return (
    <StackContainer gap={4}>
      <div>
        <h2>Solicitudes de vacaciones</h2>
        <Table
          headers={["Nombre Empleado", "Fecha Solicitud", "Días Solicitados", "Acciones"]}
          rows={holydayRequests}
          trDrawer={(row: holydayRequest) => [row.employeeName, row.date, row.days, <Button onClick={() => goToHolidayRequest(row)}>Ver</Button>]}
        />
      </div>
      <div>
        <h2>Justificación de incidencias</h2>
        <Table
          headers={["Nombre Empleado", "Fecha Incidencia", "Tipo Incidencia", "Acciones"]}
          rows={incidentRequests}
          trDrawer={(row: incidentRequest) => [row.employeeName, row.date, row.type, <Button onClick={() => goToIncidentRequest(row)}>Ver</Button>]}
        />
      </div>
    </StackContainer>
  )
}

function HolidayView({ item, goBackButton }: SomeViewProps) {
  const holiday = item as holydayRequest
  const { execute: executeUpdate } = useApi<any>()

  const datesForCalendar = holiday.raw?.requested_days_list?.map((d: string) => {
    const dateObj = new Date(d.includes("T") ? d : d + "T00:00:00")
    return { dia: dateObj.getDate(), mes: dateObj.getMonth() + 1, anio: dateObj.getFullYear() }
  }) || []

  const approveHandler = async () => {
    try {
      await executeUpdate(vacationRequestService.update(holiday.id, { status: "approved" }))
      alert("Solicitud aprobada"); goBackButton.props.onClick?.();
    } catch (e) { alert("Error al aprobar") }
  }

  const rejectHandler = async () => {
    try {
      await executeUpdate(vacationRequestService.update(holiday.id, { status: "rejected" }))
      alert("Solicitud rechazada"); goBackButton.props.onClick?.();
    } catch (e) { alert("Error al rechazar") }
  }

  return (
    <StackContainer gap={4}>
      {headerView("solicitud", goBackButton)}
      <RowContainer>
        <ColContainer md={4}><Card header="Nombre" padding={3}>{holiday.employeeName}</Card></ColContainer>
        <ColContainer md={4}><Card header="Fecha Solicitud" padding={3}>{holiday.date}</Card></ColContainer>
        <ColContainer md={4}><Card header="Días Solicitados" padding={3}>{holiday.days}</Card></ColContainer>
      </RowContainer>
      
      <RowContainer gap={3}>
        <ColContainer lg={8}>
          <Card header="Fechas Solicitadas">
            <RowContainer gap={2}>
              <ColContainer md={5}>
                <ScrollableContainer height={300}>
                  <Table headers={["D", "M", "A"]} rows={datesForCalendar} trDrawer={(r: any) => [r.dia, r.mes, r.anio]} />
                </ScrollableContainer>
              </ColContainer>
              <ColContainer md={7}>
                <CalendarioVista fechas={datesForCalendar} />
              </ColContainer>
            </RowContainer>
          </Card>
        </ColContainer>
        <ColContainer lg={4}>
          <Card header="Comentario">
            <TextField name="comments" type="area" rows={12} value={holiday.raw?.notes || "Sin notas."} readOnly />
          </Card>
        </ColContainer>
      </RowContainer>
      {btnsView(approveHandler, rejectHandler)}
    </StackContainer>
  )
}

function IncidentView({ item, goBackButton }: SomeViewProps) {
  const incident = item as incidentRequest
  const { execute: executeUpdate } = useApi<any>()
  const approveHandler = async () => {
    try {
      await executeUpdate(incidentService.update(incident.id, { justified: "Justificado" }))
      alert("Aprobado"); goBackButton.props.onClick?.();
    } catch (e) { alert("Error") }
  }
  const rejectHandler = async () => {
    try {
      await executeUpdate(incidentService.update(incident.id, { justified: "No justificado" }))
      alert("Rechazado"); goBackButton.props.onClick?.();
    } catch (e) { alert("Error") }
  }

  return (
    <StackContainer gap={4}>
      {headerView("justificación", goBackButton)}
      <RowContainer>
        <ColContainer md={6}><Card header="Nombre" padding={3}>{incident.employeeName}</Card></ColContainer>
        <ColContainer md={6}><Card header="Fecha" padding={3}>{incident.date}</Card></ColContainer>
      </RowContainer>
      <Card header="Motivo">{incident.reason}</Card>
      {btnsView(approveHandler, rejectHandler)}
    </StackContainer>
  )
}
function CalendarioVista({ fechas }: { fechas: any[] }) {
  const [currentMonth, setCurrentMonth] = useState(() => fechas.length > 0 ? fechas[0].mes : new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(() => fechas.length > 0 ? fechas[0].anio : new Date().getFullYear());
  if (fechas.length === 0) return <p>No hay fechas</p>;
  const diasSemana = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
  const mesIndice = currentMonth - 1;
  const nombreMes = new Intl.DateTimeFormat("es-ES", { month: "long" }).format(new Date(currentYear, mesIndice)).toUpperCase();
  const primerDiaMes = new Date(currentYear, mesIndice, 1).getDay();
  const totalDiasMes = new Date(currentYear, mesIndice + 1, 0).getDate();
  const diasArr: (number | null)[] = [];
  for (let i = 0; i < primerDiaMes; i++) diasArr.push(null);
  for (let d = 1; d <= totalDiasMes; d++) diasArr.push(d);
  const semanasArr = [];
  for (let i = 0; i < diasArr.length; i += 7) { semanasArr.push(diasArr.slice(i, i + 7)); }
  const cambiarMes = (dir: "ant" | "sig") => {
    let nM = currentMonth + (dir === "sig" ? 1 : -1); let nY = currentYear;
    if (nM > 12) { nM = 1; nY++; } else if (nM < 1) { nM = 12; nY--; }
    setCurrentMonth(nM); setCurrentYear(nY);
  };
  return (
    <StackContainer gap={2}>
      <RowContainer>
        <ColContainer defaultSize={3}><Button variant="info" size="sm" onClick={() => cambiarMes("ant")}>&lt;</Button></ColContainer>
        <ColContainer defaultSize={6}><div style={{ textAlign: 'center', fontWeight: 'bold' }}>{nombreMes} {currentYear}</div></ColContainer>
        <ColContainer defaultSize={3}><div style={{ textAlign: 'right' }}><Button variant="info" size="sm" onClick={() => cambiarMes("sig")}>&gt;</Button></div></ColContainer>
      </RowContainer>
      <Table headers={diasSemana} rows={semanasArr} trDrawer={(semana: (number | null)[]) =>
        semana.map((dia, index) => {
          if (!dia) return <div key={index} />;
          const selected = fechas.some(f => f.dia === dia && f.mes === currentMonth && f.anio === currentYear);
          return <div key={index} style={{ textAlign: "center", padding: "5px", backgroundColor: selected ? "#007bff" : "transparent", color: selected ? "white" : "inherit", borderRadius: "4px" }}>{dia}</div>;
        })} />
    </StackContainer>
  );
}