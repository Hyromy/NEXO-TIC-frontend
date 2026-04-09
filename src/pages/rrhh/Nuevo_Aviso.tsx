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

type NuevoAvisoData = {
  titulo: string
  contenido: string
  prioridad: string
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

    try {
      const empResponse = await employeeService.getAll()
      const employees = (empResponse as any) || []
      const storedToken = localStorage.getItem("accessToken")
      const payloadBase64 = storedToken?.split('.')[1] || ""
      const decodedToken = JSON.parse(atob(payloadBase64))
      const myUserId = decodedToken.user_id

      const myEmployee = employees.find((e: any) => e.user.id == myUserId || e.user == myUserId)

      if (!myEmployee) {
        return launchAlert("main-float-container", <Alert type="danger">Error de perfil.</Alert>)
      }

      const payload = {
        title: fTitulo,
        content: fContenido,
        priority: fPrioridad,
        author_id: myEmployee.id
      }

      if (isEdit) {
        execute(announcementService.update(parseInt(id!), payload))
      } else {
        execute(announcementService.create(payload as any))
      }
    } catch (err) {
      console.error("Error:", err)
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