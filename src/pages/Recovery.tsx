import {
  useState,
  useEffect,
} from "react"

import { isEmail } from "../utils/validator"

import { Form, TextField } from "../components/Form"
import { Button } from "../components/Button"
import { Spinner } from "../components/Spinner"
import { Card } from "../components/Card"
import { Alert, launchAlert } from "../components/Alert"

import { FloatContainer, StackContainer } from "../layout/Containers"

import useApi from "../hooks/useApi"
import { authService } from "../services/nexotic"

import { rawRoutes } from "../routes"

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
  if (err.includes("Invalid email address")) {
    return {
      known: true,
      message: "Dirección de correo electrónico rechazada."
    }
  }

  return {
    known: false,
    message: "Ocurrió un error inesperado. Por favor, intenta de nuevo más tarde."
  }
}

export default function Recovery() {
  const { data, error, execute } = useApi<any>()

  const [loading, setLoading] = useState(false)

  const alertContainerId = "alert-container-recovery"

  useEffect(() => {
    if (data && data.ok) {
      launchAlert(alertContainerId, 
        <Alert icon="success" type="success" notDismissible timeout={8000}>
          Si la información es correcta, recibirás un correo con instrucciones para recuperar tu contraseña.
        </Alert>
      )
    }

    if (error) {
      const { known, message } = translateError(error)
      if (!known) {
        console.error("Recovery error:", error)
      }
      launchAlert(alertContainerId, 
        <Alert icon={known ? "warning" : "error"} type={known ? "warning" : "danger"} notDismissible>
          {message}
        </Alert>
      )
    }
  }, [data, error])

  const handleSubmit = (data: expectedData) => {
    const validationMessage = validate(data)
    if (validationMessage != "ok") {
      launchAlert(alertContainerId, 
        <Alert icon="warning" type="warning" notDismissible>
          {validationMessage}
        </Alert>
      )
      return
    }

    setLoading(true)
    execute(authService.recover(
      data.username,
      data.email,
    
    )).finally(
      () => setLoading(false)
    )
  }

  return (
    <main className="d-flex justify-content-center align-items-center vh-100">
      <Card shadow>
        <h3 className="text-center mb-4">Recuperar Contraseña</h3>
        <Form onSubmit={handleSubmit}>
          <StackContainer>
            <TextField name="username" label="Usuario" />
            <TextField name="email" label="Correo Electrónico" />
            <div className="my-3">
              <Button type="submit" fat isLoading={loading}>
                { loading ? <Spinner small /> : "Enviar" }
              </Button>
            </div>
          </StackContainer>
        </Form>
        <StackContainer center>
          <small>¿Ya tienes cuenta? <a href={rawRoutes.index.login}>Inicia Sesión</a></small>
          <small>¿No tienes cuenta? <a href={rawRoutes.index.signup}>Regístrate aquí</a></small>
        </StackContainer>
      </Card>
      <FloatContainer id={alertContainerId} />
    </main>
  )
}
