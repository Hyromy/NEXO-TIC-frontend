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
  vacationService,
  vacationRequestService,
  vacationDetailService,
} from "../../services/nexotic";
import { useNavigate } from "react-router-dom";

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
 

  useEffect(() => {
    execute(vacationService.get());
    executeRequests(vacationRequestService.get());
    executeDetails(vacationDetailService.get());
  }, [execute, executeRequests, executeDetails]);

  if (selectedSolicitud) {
    return (
      <DetalleSolicitud
        solicitud={selectedSolicitud}
        onVolver={() => setSelectedSolicitud(null)}
      />
    );
  }
  const tarjetas: TarjetaData[] =
    data && data.length > 0
      ? [
          { titulo: "AÑO", valor: data[0]?.year },
          { titulo: "DIAS ASIGNADOS", valor: data[0]?.days_assigned },
          { titulo: "DIAS USADOS", valor: data[0]?.days_used },
          { titulo: "DIAS DISPONIBLES", valor: data[0]?.days_remaining },
        ]
      : [];

  //filtrando los detalles por solicitud
  const solicitudes: Solicitud[] =
    dataRequests?.map((req: any) => {
      const detalles =
        dataDetails?.filter(
          (d: any) => d.vacation_request === req.id
        ) || [];

      return {
        id: `Solicitud #${req.id}`,
        fechas:
          detalles.length > 0
            ? detalles.map((d: any) => d.selected_day).join(", ")
            : "-",
        dias: detalles.length,
        estatus: req.status,
        acciones: (
          <Button
            size="sm"
            variant="info"
            onClick={() =>
              setSelectedSolicitud({
                nombre: req.employee 
      ? `${req.employee.name} ${req.employee.surname} ${req.employee.mothers_name}` 
      : "Empleado sin nombre",
 
    fechaSolicitud: new Date(req.date).toLocaleDateString(),
                dias: detalles.length,
                estatus: req.status,
                comentario: "Sin comentario",
                fechas: detalles.map((d: any) => {
                  const dateObj = new Date(d.selected_day);
                  return {
                    dia: dateObj.getUTCDate(),
                    mes: dateObj.getUTCMonth() + 1,
                    anio: dateObj.getUTCFullYear(),
                  };
                }),
              })
            }
          >
            Detalles
          </Button>
        ),
      };
    }) || [];

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