import {
  type SubmitEvent,
  useEffect
} from "react"

import useApi from "../hooks/useApi"
import { authService } from "../services/nexotic"
import { getDataFromForm } from "../utils/getters"

const validate = (data: {
  username: string,
  email: string,
}) => {
  const { username, email } = data

  if (!username || !email) {
    return "Todos los campos son obligatorios."
  }

  return "ok"
}

const userCreated = () => {
  alert("Usuario creado exitosamente. Revise su correo para confirmar la cuenta.")
}

export default function Signup() {
  const { data, error, execute } = useApi<any>()

  useEffect(() => {
    if (data && data.ok) {
      userCreated()
    }
    if (error) {
      alert("Error creando usuario: " + error)
    }
  }, [data, error])

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = getDataFromForm(new FormData(e.currentTarget)) as {
      username: string,
      email: string,
    }
    const validationError = validate(fd)
    if (validationError != "ok") {
      alert("Error de validación: " + validationError)
      return
    }

    execute(authService.signup(
      fd.username,
      fd.email,
    ))
  }

  return (
    <main className="d-flex justify-content-center align-items-center vh-100">
      <section className="card p-4 shadow" style={{width: "25rem"}}>
        <h3 className="text-center mb-4">Crear Cuenta</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Usuario</label>
            <input type="text" className="form-control" name="username" />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Correo Electrónico</label>
            <input type="email" className="form-control" name="email" />
          </div>
          <button type="submit" className="btn btn-success w-100">Registrarse</button>
        </form>
        <div className="mt-3 text-center">
          <small>¿Ya tienes cuenta? <a href="/">Inicia Sesión</a></small>
        </div>
      </section>
    </main>
  )
}
