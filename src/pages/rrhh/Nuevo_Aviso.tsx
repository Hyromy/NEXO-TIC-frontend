import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Main from "../../layout/Main"
import { Card } from "../../components/Card"
import { Button } from "../../components/Button"
import { Form, TextField, Select, Option, setFormValues } from "../../components/Form"
import { Alert, launchAlert } from "../../components/Alert"
import useApi from "../../hooks/useApi"
import { announcementService, employeeService } from "../../services/nexotic"
import { Spinner } from "../../components/Spinner"
import { getAccessToken } from "../../utils/getters"
import { decodeJWT } from "../../utils/jwt"

type NuevoAvisoData = {
  titulo: string
  contenido: string
  prioridad: string
}

const asCollection = <T,>(value: unknown): T[] => {
  if (Array.isArray(value)) return value as T[]
  if (!value || typeof value != "object") return []

  const source = value as Record<string, unknown>
  if (Array.isArray(source.results)) return source.results as T[]
  if (Array.isArray(source.data)) return source.data as T[]

  return []
}

const getEntityId = (value: unknown): number | null => {
  if (typeof value == "number") return Number.isNaN(value) ? null : value

  if (typeof value == "string") {
    const parsed = parseInt(value, 10)
    return Number.isNaN(parsed) ? null : parsed
  }

  if (value && typeof value == "object") {
    const source = value as Record<string, unknown>
    return getEntityId(source.id)
  }

  return null
}

export default function Nuevo_Aviso() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const { execute, loading, data, error } = useApi<any>()
  
  // --- NUEVO: Estados para controlar los inputs ---
  const [titulo, setTitulo] = useState("")
  const [contenido, setContenido] = useState("")
  const [prioridad, setPrioridad] = useState("")

  useEffect(() => {
    if (isEdit && id) {
      const loadAviso = async () => {
        try {
          const response = await announcementService.getById(parseInt(id));
          const aviso = (response as any).data || response;

          if (aviso) {
            // Actualizamos los estados (Esto llena los inputs automáticamente)
            setTitulo(aviso.title);
            setContenido(aviso.content);
            setPrioridad(aviso.priority);

            // También actualizamos el Form interno por si usa validaciones basadas en el DOM
            setTimeout(() => {
              const form = document.querySelector("form");
              if (form) {
                setFormValues(form, {
                  titulo: aviso.title,
                  contenido: aviso.content,
                  prioridad: aviso.priority
                });
              }
            }, 100);
          }
        } catch (err) {
          console.error("Error cargando aviso:", err);
          launchAlert("main-float-container", <Alert type="danger">No se pudo cargar la información.</Alert>);
        }
      };
      loadAviso();
    }
  }, [id, isEdit]);

  // ... (Manejo de data y error se mantienen igual)
  useEffect(() => {
    if (data) {
      launchAlert("main-float-container",
        <Alert icon="success" type="success">
          {isEdit ? "Aviso actualizado correctamente." : "Aviso creado correctamente."}
        </Alert>
      )
      navigate("/notices")
    }
  }, [data, navigate, isEdit])

  useEffect(() => {
    if (error) {
      launchAlert("main-float-container",
        <Alert icon="error" type="danger">Ocurrió un error al procesar el aviso.</Alert>
      )
    }
  }, [error])

  const handleSubmit = async (formData: NuevoAvisoData) => {
    // Usamos los datos del formData que envía el componente Form
    const { titulo: fTitulo, contenido: fContenido, prioridad: fPrioridad } = formData

    if (!fTitulo || !fContenido || !fPrioridad) {
      return launchAlert("main-float-container",
        <Alert icon="warning" type="warning">Todos los campos son obligatorios.</Alert>
      )
    }

    const basePayload = {
      title: fTitulo,
      content: fContenido,
      priority: fPrioridad,
    }

    if (isEdit) {
      return execute(announcementService.update(parseInt(id!), basePayload))
    }

    try {
      const token = getAccessToken()
      const decodedToken = token ? decodeJWT(token) : null
      const tokenEmployeeId = getEntityId(
        decodedToken?.employee_id ?? decodedToken?.employee ?? decodedToken?.id
      )
      const tokenUserId = getEntityId(
        decodedToken?.user_id ?? decodedToken?.sub
      )

      const employeesResponse = await employeeService.getAll()
      const employees = asCollection<any>(employeesResponse)

      const employeeByEmployeeId = tokenEmployeeId
        ? employees.find((employee) => getEntityId(employee?.id) == tokenEmployeeId)
        : null

      const employeeByUserId = tokenUserId
        ? employees.find((employee) => getEntityId(employee?.user) == tokenUserId)
        : null

      const authorId = getEntityId(
        employeeByEmployeeId?.id ?? employeeByUserId?.id
      )

      if (authorId) {
        return execute(announcementService.create({
          ...basePayload,
          author_id: authorId,
        }))
      }

      // Para usuarios staff sin registro en employees, intentamos crear sin author_id
      // en caso de que el backend lo resuelva desde request.user.
      const createWithoutAuthor = await execute(
        announcementService.create(basePayload as any)
      )

      if (!createWithoutAuthor) {
        console.warn("Could not resolve employee author id", {
          tokenEmployeeId,
          tokenUserId,
          employeesCount: employees.length,
          sampleEmployee: employees[0],
        })
        return launchAlert(
          "main-float-container",
          <Alert icon="warning" type="warning">
            Tu usuario no tiene un empleado asociado para crear avisos. Solicita vincular tu cuenta en la tabla de empleados.
          </Alert>
        )
      }

      return
    } catch (err) {
      console.error("Error al crear/editar aviso:", err)
      launchAlert("main-float-container", <Alert icon="error" type="danger">No fue posible guardar el aviso.</Alert>)
    }
  }

  return (
    <Main>
      <Card shadow>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3>{isEdit ? "Editar aviso" : "Nuevo aviso"}</h3>
          <Button variant="secondary" onClick={() => navigate("/notices")} disabled={loading}>
            Volver
          </Button>
        </div>

        <Form onSubmit={handleSubmit}>
          <div className="mb-3">
            <TextField
              name="titulo"
              label="Título"
              value={titulo} // Vinculado al estado
              onChange={(v) => setTitulo(v)} // Mantiene el estado sincronizado
              placeholder="Escribe el título del aviso"
              disabled={loading}
            />
          </div>

          <div className="mb-3">
            <TextField
              name="contenido"
              type="area"
              rows={5}
              label="Contenido"
              value={contenido} // Vinculado al estado
              onChange={(v) => setContenido(v)} // Mantiene el estado sincronizado
              placeholder="Escribe el contenido del aviso"
              disabled={loading}
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Prioridad</label>
            <Select
              name="prioridad"
              value={prioridad}
              onChange={(v) => setPrioridad(v)}
              disabled={loading}
              options={[
                <Option key="default" value="" text="Seleccione una prioridad" disabled />,
                <Option key="baja" value="Baja" text="Baja (Informe)" />,
                <Option key="media" value="Media" text="Media (Aviso importante)" />,
                <Option key="alta" value="Alta" text="Alta (Urgente)" />
              ]}
            />
          </div>

          <div className="d-flex gap-2">
            <Button variant="primary" type="submit" isLoading={loading}>
              {loading ? <Spinner small /> : (isEdit ? "Actualizar" : "Crear")}
            </Button>
          </div>
        </Form>
      </Card>
    </Main>
  )
}