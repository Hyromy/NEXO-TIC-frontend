import {
  useState,
  useEffect,
} from "react"

import { useNavigate } from "react-router-dom"

import useApi from "../hooks/useApi"
import { authService } from "../services/nexotic"
import { setPairTokens } from "../utils/setters"
import { useAuth } from "../context/Auth"

import { rawRoutes } from "../routes"

import { Form, TextField ,PasswordField } from "../components/Form"
import { Button } from "../components/Button"
import { Spinner } from "../components/Spinner"
import { Card } from "../components/Card"

import { FloatContainer, StackContainer } from "../layout/Containers"

import { Alert, launchAlert } from "../components/Alert"

type expectedData = {
  username: string,
  password: string,
}

const validate = (data: expectedData) => {
  const { username, password } = data

  if (!username || !password) {
    return "Todos los campos son obligatorios."
  }
  
  return "ok"
}

const translateError = (err: string) => {
  if (err.includes("No active account")) {
    return {
      known: true,
      message: "Credenciales inválidas. Por favor, verifica tu usuario y contraseña."
    }
  }

  return {
    known: false,
    message: "Ocurrió un error inesperado. Por favor, intenta de nuevo más tarde."
  }
}

export default function Login() {
  const { data, error, execute } = useApi<any>()
  const { checkAuth } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)

  const alertContainerId = "alert-container-login"

  useEffect(() => {
    if (data && data.access && data.refresh) {
      setPairTokens(data.access, data.refresh)
      checkAuth()
      navigate(rawRoutes.common.home)
    }
    if (error) {
      const { known, message } = translateError(error)
      if (!known) {
        console.error("Login error:", error)
      }
      launchAlert(alertContainerId, 
        <Alert icon={known ? "warning" : "error"} type={known ? "warning" : "danger"} notDismissible>
          {message}
        </Alert>
      )
    }
  }, [data, error])

  const handleSubmit = (data: expectedData) => {
    const validationError = validate(data)
    if (validationError != "ok") {
      const variant = "warning"
      launchAlert(alertContainerId, 
        <Alert icon={variant} type={variant} notDismissible>
          {validationError}
        </Alert>
      )
      return
    }

    setLoading(true)
    execute(authService.login(
      data.username,
      data.password,

    )).finally(
      () => setLoading(false)
    )
  }

  return (
    <main className="d-flex justify-content-center align-items-center vh-100">
      <Card shadow>
        <h3 className="text-center mb-4">Iniciar Sesión</h3>
        <Form onSubmit={handleSubmit}>
          <StackContainer>
            <TextField name="username" label="Usuario" />
            <PasswordField name="password" label="Contraseña" />
            <div className="my-3">
              <Button type="submit" variant="primary" fat isLoading={loading}>
                { loading ? <Spinner small /> : "Iniciar Sesión" }
              </Button>
            </div>
          </StackContainer>
        </Form>
        <StackContainer center>
          <small>¿No tienes cuenta? <a href={rawRoutes.index.signup}>Regístrate aquí</a></small>
          <small>¿Olvidaste tu contraseña? <a href={rawRoutes.index.recovery}>Recupérala aquí</a></small>
        </StackContainer>
      </Card>
      <FloatContainer id={alertContainerId} />
    </main>
  )
}
