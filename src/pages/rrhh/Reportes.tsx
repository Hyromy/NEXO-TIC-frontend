import Main from "../../layout/Main"
import { useState, useEffect, useCallback } from "react"
import { Card } from "../../components/Card"
import { Button } from "../../components/Button"
import { Form } from "../../components/Form"
import { Table } from "../../components/Table"
import { 
  RowContainer, 
  ColContainer, 
  StackContainer,
  ScrollableContainer
} from "../../layout/Containers"
import useApi from "../../hooks/useApi"
import { reportHistoryService, employeeService } from "../../services/nexotic"
import { decodeJWT } from "../../utils/jwt"
import { getAccessToken } from "../../utils/getters"


interface Reporte {
  id: number;
  type: string;
  start_at: string;
  end_at: string;
  registered_at: string;
  notes: string;
}

export default function Reportes() {
  const [generando, setGenerando] = useState(false)
  const [historial, setHistorial] = useState<Reporte[]>([])
  const { execute: fetchApi } = useApi<any>()
  const token = getAccessToken()
  const decoded: any = token ? decodeJWT(token) : null
  const currentUserId = decoded?.user_id 

  const loadHistorial = useCallback(async () => {
    try {
      const res = await fetchApi(reportHistoryService.getAll())
      if (Array.isArray(res)) {
        setHistorial(res.sort((a, b) => b.id - a.id))
      }
    } catch (e) {
      console.error("Error al cargar historial:", e)
    }
  }, [fetchApi])

  useEffect(() => {
    loadHistorial()
  }, [loadHistorial])
  const handleGenerarReporte = async (data: any) => {
    const { tipoReporte, fechaInicio, fechaFin } = data

    try {
      setGenerando(true)
      const emps = await fetchApi(employeeService.getAll())
      const adminRh = emps.find((e: any) => Number(e.user?.id || e.user) === Number(currentUserId))

      await fetchApi(reportHistoryService.create({
        type: tipoReporte,
        start_at: fechaInicio,
        end_at: fechaFin,
        notes: `Reporte general generado por el administrador: ${adminRh?.user?.first_name || 'RH'}`,
        employee_id: adminRh?.id 
      }))

      alert("Reporte registrado en el historial de administración.")
      loadHistorial() 
    } catch (err: any) {
      alert("Error: " + err.message)
    } finally {
      setGenerando(false)
    }
  }

  return (
    <Main>
      <StackContainer gap={4}>
        <Card header="SELECCIONE EL TIPO DE REPORTE A GENERAR">
          <FormGenerar onSubmit={handleGenerarReporte} isLoading={generando} />
        </Card>
        <Card header="CONSULTA DE REPORTES ANTERIORES">
          <TablaConsultas datos={historial} onDownload={(item) => alert(`Descargando folio #${item.id}`)} />
        </Card>
      </StackContainer>
    </Main>
  )
}

function FormGenerar({ onSubmit, isLoading }: { onSubmit: (data: any) => void, isLoading: boolean }) {
  return (
    <Form onSubmit={onSubmit}>
      <StackContainer gap={3}>
        <RowContainer>
          <ColContainer defaultSize={12}>
            <label className="fw-bold small">TIPO DE REPORTE</label>
            <select name="tipoReporte" className="form-select" required defaultValue="">
              <option value="" disabled>Seleccione una opción...</option>
              <option value="asistencia">Asistencia y Puntualidad</option>
              <option value="vacaciones">Saldos y Uso de Vacaciones</option>
              <option value="movimientos">Movimientos Laborales</option>
              <option value="incidencias">Incidencias Reclamadas</option>
            </select>
          </ColContainer>
        </RowContainer>
        <RowContainer gap={3}>
          <ColContainer md={6}>
            <label className="fw-bold small">FECHA INICIO</label>
            <input name="fechaInicio" type="date" className="form-control" required />
          </ColContainer>
          <ColContainer md={6}>
            <label className="fw-bold small">FECHA FIN</label>
            <input name="fechaFin" type="date" className="form-control" required />
          </ColContainer>
        </RowContainer>
        <Button variant="primary" type="submit" isLoading={isLoading}>
            GENERAR Y REGISTRAR
        </Button>
      </StackContainer>
    </Form>
  )
}

function TablaConsultas({ datos, onDownload }: { datos: Reporte[], onDownload: (i: Reporte) => void }) {
  const headers = ["ID", "TIPO", "PERIODO", "GENERADO EL", "ACCIONES"];
  
  const trDrawer = (item: Reporte) => {
    const inicio = item.start_at.split('T')[0];
    const fin = item.end_at.split('T')[0];
    
    return [
      `#${item.id}`,
      item.type.toUpperCase(),
      `${inicio} al ${fin}`,
      new Date(item.registered_at).toLocaleString(),
      <Button 
        key={`btn-${item.id}`}
        size="sm" 
        variant="info" 
        onClick={() => onDownload(item)}
      >
        Ver Detalle
      </Button>
    ];
  };

  return (
    <ScrollableContainer height={350}>
      <Table headers={headers} rows={datos} trDrawer={trDrawer} />
    </ScrollableContainer>
  )
}