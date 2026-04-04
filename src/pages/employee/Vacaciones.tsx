import Main from "../../layout/Main";
import { useState, useEffect, type ReactNode } from "react";
import {
  RowContainer,
  ColContainer,
  StackContainer,
} from "../../layout/Containers";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { Table } from "../../components/Table";
import { Badge } from "../../components/Badge";
import useApi from "../../hooks/useApi";
import {
  vacationPeriodService,
  vacationRequestService,
  vacationDetailService,
  employeeService, 
} from "../../services/nexotic";
import { useNavigate } from "react-router-dom";
import { decodeJWT } from "../../utils/jwt";
import { getAccessToken } from "../../utils/getters";

interface TarjetaData {
  titulo: string;
  valor: number;
}

interface Solicitud {
  id: string;
  fechas: string;
  dias: number;
  estatus: string;
  acciones?: ReactNode;
}

interface VacacionesLayoutProps {
  tarjetas: ReactNode;
  boton: ReactNode;
  tabla: ReactNode;
}

interface FechaDetalle {
  dia: number;
  mes: number;
  anio: number;
}

export default function Vacaciones() {
  const [selectedSolicitud, setSelectedSolicitud] = useState<any>(null);
  const { execute, data } = useApi<any>();
  const { execute: executeRequests, data: dataRequests } = useApi<any>();
  const { execute: executeDetails, data: dataDetails } = useApi<any>();
  const { execute: fetchEmp, data: employees } = useApi<any>();
  const token = getAccessToken();
  const decoded: any = token ? decodeJWT(token) : null;
  const userId = decoded?.user_id;

  useEffect(() => {
    fetchEmp(employeeService.getAll());
    execute(vacationPeriodService.getAll()); 
    executeRequests(vacationRequestService.getAll());
    executeDetails(vacationDetailService.getAll());
  }, [execute, executeRequests, executeDetails, fetchEmp]);

  if (selectedSolicitud) {
    return (
      <DetalleSolicitud
        solicitud={selectedSolicitud}
        onVolver={() => setSelectedSolicitud(null)}
      />
    );
  }
  //FILTRADO: Buscamos al empleado para que no salgan datos de otros
  const myEmployee = Array.isArray(employees) 
    ? employees.find((e: any) => Number(e.user?.id || e.user) === Number(userId)) 
    : null;
  // añadimos el filtro y solicitudes
  const tarjetas: TarjetaData[] =
    Array.isArray(data) && myEmployee
      ? data
          .filter((p: any) => (p.employee?.id || p.employee) === myEmployee.id)
          .map((p: any) => ([
            { titulo: "AÑO", valor: p.year },
            { titulo: "DIAS ASIGNADOS", valor: p.days_assigned },
            { titulo: "DIAS USADOS", valor: p.days_used },
            { titulo: "DIAS DISPONIBLES", valor: p.days_remaining },
          ]))[0] || [] 
      : [];
  const solicitudes: Solicitud[] =
    Array.isArray(dataRequests) && myEmployee
      ? dataRequests
          .filter((req: any) => (req.employee?.id || req.employee) === myEmployee.id)
          .map((req: any) => {
            const detalles = Array.isArray(dataDetails)
              ? dataDetails.filter((d: any) => 
                  (d.vacation_request?.id || d.vacation_request_id || d.vacation_request) === req.id
                )
              : [];

            return {
              id: `Solicitud #${req.id}`,
              fechas: detalles.length > 0 ? detalles.map((d: any) => d.selected_day).join(", ") : "-",
              dias: detalles.length,
              estatus: req.status,
              acciones: (
                <Button
                  size="sm"
                  variant="info" 
                  onClick={() =>
                    setSelectedSolicitud({
                    nombre: `${myEmployee.user?.first_name} ${myEmployee.user?.last_name}`,
                    fechaSolicitud: new Date(req.date || Date.now()).toLocaleDateString(),
                    dias: detalles.length,
                    estatus: req.status,
                    comentario: req.notes || "Sin comentario",
                    fechas: detalles.map((d: any) => {
                      const dateObj = new Date(d.selected_day);
                      return {
                        dia: dateObj.getDate(),
                        mes: dateObj.getMonth() + 1,
                        anio: dateObj.getFullYear(),
                      };
                    }),
                  })}
                >
                  Detalles
                </Button>
              ),
            };
          })
      : [];

  return (
    <Main>
      <Card>
        <StackContainer gap={3}>
          <h2>INFORMACION DE SU PERIODO VACACIONAL</h2>
          <__VacacionesLayout
            tarjetas={<TarjetasVacaciones data={tarjetas} />}
            boton={<BotonSolicitar />}
            tabla={<TablaSolicitudes data={solicitudes} />}
          />
        </StackContainer>
      </Card>
    </Main>
  );
}

function TarjetaVacacion({ titulo, valor }: TarjetaData) {
  return (
    <Card header={titulo}>
      <StackContainer center height={100}>
        <h3>{valor}</h3>
      </StackContainer>
    </Card>
  );
}

function TarjetasVacaciones({ data }: { data: TarjetaData[] }) {
  return (
    <RowContainer gap={3}>
      {data.map((item, index) => (
        <ColContainer key={index} defaultSize={12} md={6} lg={3}>
          <TarjetaVacacion titulo={item.titulo} valor={item.valor} />
        </ColContainer>
      ))}
    </RowContainer>
  );
}

function BotonSolicitar() {
const navigate = useNavigate();
  return (
    <div>
      <Button
        variant="primary"
       onClick={() => navigate("/requests")}
      >
        Solicitar Vacaciones
      </Button>
    </div>
  );
}

function TablaSolicitudes({ data }: { data: Solicitud[] }) {
  const encabezados = ["ID", "FECHA(S)", "DIAS SOLICITADOS", "ESTATUS", "ACCIONES"];
  return (
    <Card header="HISTORIAL DE SOLICITUDES">
      <Table
        headers={encabezados}
        rows={data}
        trDrawer={(item: Solicitud) => [
          item.id,
          item.fechas,
          item.dias,
          <Badge
            key={`status-${item.id}`}
            text={item.estatus}
            type={item.estatus === "APPROVED" || item.estatus === "Aprobada" ? "success" : "warning"}
          />,
          item.acciones,
        ]}
      />
    </Card>
  );
}

function __VacacionesLayout({ tarjetas, boton, tabla }: VacacionesLayoutProps) {
  return (
    <StackContainer gap={3}>
      {tarjetas}
      {boton}
      {tabla}
    </StackContainer>
  );
}

function DetalleSolicitud({ solicitud, onVolver }: { solicitud: any; onVolver: () => void }) {
  const fechas: FechaDetalle[] = solicitud.fechas || [];
  return (
    <Main>
      <Card>
        <StackContainer gap={4}>
          <RowContainer>
            <ColContainer><h2>DETALLES DE LA SOLICITUD</h2></ColContainer>
            <ColContainer md={4}>
              <div className="text-end">
                <Button variant="primary" onClick={onVolver}>VOLVER</Button>
              </div>
            </ColContainer>
          </RowContainer>
          <RowContainer gap={2}>
            <ColContainer md={6}><Card>Nombre: {solicitud.nombre}</Card></ColContainer>
            <ColContainer md={6}><Card>Fecha de la Solicitud: {solicitud.fechaSolicitud}</Card></ColContainer>
            <ColContainer md={6}><Card>Días Solicitados: {solicitud.dias}</Card></ColContainer>
            <ColContainer md={6}><Card>Estatus: {solicitud.estatus}</Card></ColContainer>
          </RowContainer>
          <RowContainer gap={3}>
            <ColContainer lg={8}>
              <Card header="FECHA(S) SOLICITADA(S)">
                <RowContainer gap={2}>
                  <ColContainer md={6}>
                    <Table
                      headers={["DIA", "MES", "AÑO"]}
                      rows={fechas}
                      trDrawer={(f: FechaDetalle) => [f.dia, f.mes, f.anio]}
                    />
                  </ColContainer>
                  <ColContainer md={6}>
                    <Card>
                      <StackContainer center height={150}>
                        <p>calendario</p>
                      </StackContainer>
                    </Card>
                  </ColContainer>
                </RowContainer>
              </Card>
            </ColContainer>
            <ColContainer lg={4}>
              <Card header="COMENTARIO">
                <p>{solicitud.comentario}</p>
              </Card>
            </ColContainer>
          </RowContainer>
        </StackContainer>
      </Card>
    </Main>
  );
}