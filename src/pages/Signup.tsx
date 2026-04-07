import {
  useEffect,
  useState,
} from "react"

import useApi from "../hooks/useApi"
import { authService } from "../services/nexotic"

import { rawRoutes } from "../routes"

import { Form, TextField, GroupField, GroupFieldText } from "../components/Form"
import { Button } from "../components/Button"
import { Spinner } from "../components/Spinner"
import { Card } from "../components/Card"
import { Alert, launchAlert } from "../components/Alert"

import { FloatContainer, StackContainer } from "../layout/Containers"

import { isEmail } from "../utils/validator"

type expectedData = {
  username: string,
  email: string,
}

const validate = (data: {
  username: string,
  email: string,
}) => {
  const { username, email } = data

  if (!username || !email) {
    return "Todos los campos son obligatorios."
  }

  if (!isEmail(email)) {
    return "El correo electrónico no es válido."
  }

  return "ok"
}

const translateError = (err: string) => {
  if (err.includes("User already exists")) {
    return {
      known: true,
      message: "El nombre de usuario ya está en uso. Por favor, elige otro nombre de usuario o correo electrónico."
    }
  }

  return {
    known: false,
    message: "Ocurrió un error inesperado. Por favor, intenta de nuevo más tarde."
  }
}

export default function Signup() {
  const { data, error, execute } = useApi<any>()

  const [loading, setLoading] = useState(false)

  const alertContainerId = "alert-container-signup"

  useEffect(() => {
    if (data && data.ok) {
      launchAlert(alertContainerId,
        <Alert icon="success" type="success" notDismissible>
          Usuario creado exitosamente. Revise su correo para confirmar la cuenta.
        </Alert>
      )
    }
    if (error) {
      const { known, message } = translateError(error)
      if (!known) {
        console.error("Signup error:", error)
      }
      launchAlert(alertContainerId,
        <Alert icon={known ? "warning" : "error"} type={known ? "warning" : "danger"} notDismissible>
          {message}
        </Alert>
      )
    }
  }, [data, error])

  const handleSubmit = (data: expectedData) => {
    data.email = data.email + "@nexotic.com"
    const validationError = validate(data)
    if (validationError != "ok") {
      launchAlert(alertContainerId,
        <Alert icon="warning" type="warning" notDismissible>
          {validationError}
        </Alert>
      )
      return
    }

    setLoading(true)
    execute(authService.signup(
      data.username,
      data.email,
    
    )).finally(
      () => setLoading(false)
    )
  }

  return (
    <main className="d-flex justify-content-center align-items-center vh-100">
      <Card shadow>
        <h3 className="text-center mb-4">Crear Cuenta</h3>
        <Form onSubmit={handleSubmit}>
          <StackContainer>
            <TextField name="username" label="Usuario" />
            <GroupField label="Correo Electrónico">
              <TextField name="email" />
              <GroupFieldText text="@nexotic.com" />
            </GroupField>
            <div className="my-3">
              <Button type="submit" variant="success" fat isLoading={loading}>
                { loading ? <Spinner small /> : "Registrarse" }
              </Button>
            </div>
          </StackContainer>
        </Form>
        <StackContainer center>
          <small>¿Ya tienes cuenta? <a href={rawRoutes.index.login}>Inicia Sesión</a></small>
          <small>¿Olvidaste tu contraseña? <a href={rawRoutes.index.recovery}>Recupérala aquí</a></small>
        </StackContainer>
      </Card>
      <FloatContainer id={alertContainerId} />
    </main>
  )
}
