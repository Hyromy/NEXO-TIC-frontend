import { useNavigate } from "react-router-dom"

import Main from "../../layout/Main"
import { Card } from "../../components/Card"
import { Button } from "../../components/Button"
import { Form, TextField, Select, Option } from "../../components/Form"
import { Alert, launchAlert } from "../../components/Alert"

type NuevoAvisoData = {
  titulo: string
  contenido: string
  prioridad: string
}

export default function Nuevo_Aviso() {
  const navigate = useNavigate()

  const handleSubmit = (data: NuevoAvisoData) => {
    const { titulo, contenido, prioridad } = data

    if (!titulo || !contenido || !prioridad) {
      return launchAlert("main-float-container",
        <Alert icon="warning" type="warning">
          Todos los campos son obligatorios.
        </Alert>
      )
    }

    launchAlert("main-float-container",
      <Alert icon="success" type="success">
        Aviso creado correctamente.
      </Alert>
    )
    // la alerta apenas es visible por la redirección
    navigate("/notices")
  }

  return (
    <Main>
      <Card shadow>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3>Nuevo aviso</h3>

          <Button variant="secondary" onClick={() => navigate("/notices")}>
            Volver
          </Button>
        </div>

        <Form onSubmit={handleSubmit}>
          <div className="mb-3">
            <TextField
              name="titulo"
              label="Título"
              placeholder="Escribe el título del aviso"
            />
          </div>

          <div className="mb-3">
            <TextField
              name="contenido"
              type="area"
              rows={5}
              label="Contenido"
              placeholder="Escribe el contenido del aviso"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="field-prioridad" className="form-label">
              Prioridad
            </label>

            <Select
              name="prioridad"
              options={[
                <Option key="default" value="" text="Seleccione una prioridad" disabled />,
                <Option key="informe" value="Informe" text="Informe" />,
                <Option key="importante" value="Aviso importante" text="Aviso importante" />,
                <Option key="urgente" value="Urgente" text="Urgente" />
              ]}
            />
          </div>

          <div className="d-flex gap-2">
            <Button variant="primary" type="submit">
              Crear
            </Button>
          </div>
        </Form>
      </Card>
    </Main>
  )
}