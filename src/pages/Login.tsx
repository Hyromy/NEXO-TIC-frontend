import {
  useState,
  useEffect,
} from "react"

import { useNavigate } from "react-router-dom"

import useApi from "../hooks/useApi"
import { authService } from "../services/nexotic"
import { setPairTokens } from "../utils/setters"

import { rawRoutes } from "../routes"

import { Form, TextField ,PasswordField } from "../components/Form"
import { Button } from "../components/Button"
import { Spinner } from "../components/Spinner"
import { Card } from "../components/Card"

import { StackContainer } from "../layout/Containers"

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

export default function Login() {
  const { data, error, execute } = useApi<any>()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (data && data.access && data.refresh) {
      setPairTokens(data.access, data.refresh)
      navigate("/dashboard")
    }
    if (error) {
      alert("Error iniciando sesión: " + error)
    }
  }, [data, error])

  const handleSubmit = (data: expectedData) => {
    const validationError = validate(data)
    if (validationError != "ok") {
      alert("Error de validación: " + validationError)
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
    </main>
  )
}
