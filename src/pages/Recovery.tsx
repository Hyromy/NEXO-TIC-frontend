import {
  useState,
  useEffect,
} from "react"

import { isEmail } from "../utils/validator"

import { Form, TextField } from "../components/Form"
import { Button } from "../components/Button"
import { Spinner } from "../components/Spinner"
import { Card } from "../components/Card"

import { StackContainer } from "../layout/Containers"

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

export default function Recovery() {
  const { data, error, execute } = useApi<any>()

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (data && data.ok) {
      alert("Si el usuario y correo electrónico son correctos, recibirás un correo con instrucciones para recuperar tu contraseña.")
    }

    if (error) {
      alert("Error al recuperar contraseña: " + error)
    }
  }, [data, error])

  const handleSubmit = (data: expectedData) => {
    const validationMessage = validate(data)
    if (validationMessage != "ok") {
      alert("Error de validación: " + validationMessage)
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
    </main>
  )
}
