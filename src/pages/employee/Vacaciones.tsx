import Main from "../../layout/Main";
import { useState, type ReactNode } from "react";
import {
  RowContainer,
  ColContainer,
  StackContainer,
} from "../../layout/Containers";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { Table } from "../../components/Table";

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
  mes: string;
  anio: number;
}

export default function Vacaciones() {
  const [verDetalle, setVerDetalle] = useState(false);

  if (verDetalle) {
    return <DetalleSolicitud onVolver={() => setVerDetalle(false)} />;
  }

  const tarjetas: TarjetaData[] = [
    { titulo: "AÑO", valor: 2026 },
    { titulo: "DIAS ASIGNADOS", valor: 12 },
    { titulo: "DIAS USADOS", valor: 8 },
    { titulo: "DIAS DISPONIBLES", valor: 4 },
  ];

  const solicitudes: Solicitud[] = [
    {
      id: "Solicitud #12343",
      fechas: "09/01/2026, 12/01/2026, 13/01/2026",
      dias: 3,
      estatus: "Aprobada",
    },
    {
      id: "Solicitud #13753",
      fechas: "23/02/2026",
      dias: 1,
      estatus: "Pendiente",
    },
  ];
  const dataTabla: Solicitud[] = solicitudes.map((s) => ({
    ...s,
    acciones: (
      <Button size="sm" variant="info" onClick={() => setVerDetalle(true)}>
        Detalles
      </Button>
    ),
  }));

  return (
    <Main>
      <Card>
        <StackContainer gap={3}>
          <h2>INFORMACION DE SU PERIODO VACACIONAL</h2>

          <__VacacionesLayout
            tarjetas={<TarjetasVacaciones data={tarjetas} />}
            boton={<BotonSolicitar />}
            tabla={<TablaSolicitudes data={dataTabla} />}
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
  return (
    <div style={{ width: "fit-content" }}>
      <Button variant="primary">Solicitar Vacaciones</Button>
    </div>
  );
}

function TablaSolicitudes({ data }: { data: Solicitud[] }) {
  const encabezados = [
    "ID",
    "FECHA(S)",
    "DIAS SOLICITADOS",
    "ESTATUS",
    "ACCIONES",
  ];

  return (
    <Card header="HISTORIAL DE SOLICITUDES">
      <Table
        headers={encabezados}
        rows={data}
        trDrawer={(item: Solicitud) => [
          item.id,
          item.fechas,
          item.dias,
          <span
            key={`status-${item.id}`}
            className={
              item.estatus === "Aprobada" ? "text-success" : "text-warning"
            }
          >
            {item.estatus}
          </span>,
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

function DetalleSolicitud({ onVolver }: { onVolver: () => void }) {
  const fechas: FechaDetalle[] = [
    { dia: 9, mes: "01", anio: 2026 },
    { dia: 12, mes: "01", anio: 2026 },
    { dia: 13, mes: "01", anio: 2026 },
  ];

  return (
    <Main>
      <Card>
        <StackContainer gap={4}>
          <RowContainer>
            <ColContainer>
              <h2>DETALLES DE LA SOLICITUD</h2>
            </ColContainer>
            <ColContainer md={4}>
              <div className="text-end">
                <Button variant="primary" onClick={onVolver}>
                  VOLVER
                </Button>
              </div>
            </ColContainer>
          </RowContainer>

          <RowContainer gap={2}>
            <ColContainer md={6}>
              <Card>Nombre: Jonathan Hernández</Card>
            </ColContainer>
            <ColContainer md={6}>
              <Card>Fecha de la Solicitud: 18/09/2024</Card>
            </ColContainer>
            <ColContainer md={6}>
              <Card>Dias Solicitados: 3</Card>
            </ColContainer>
            <ColContainer md={6}>
              <Card>Estatus: Aprobada</Card>
            </ColContainer>
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
                        <p>caledario</p>
                      </StackContainer>
                    </Card>
                  </ColContainer>
                </RowContainer>
              </Card>
            </ColContainer>
            <ColContainer lg={4}>
              <Card header="COMENTARIO">
                <p>Sus vacaciones serán aprobadas...</p>
              </Card>
            </ColContainer>
          </RowContainer>
        </StackContainer>
      </Card>
    </Main>
  );
}
