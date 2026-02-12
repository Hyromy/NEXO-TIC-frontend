import {
  type SubmitEvent,
  useEffect,
} from "react"

import { isEmail } from "../utils/validator"
import { getDataFromForm } from "../utils/getters"

import useApi from "../hooks/useApi"
import { authService } from "../services/nexotic"

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

  useEffect(() => {
    if (data && data.ok) {
      alert("Si el usuario y correo electrónico son correctos, recibirás un correo con instrucciones para recuperar tu contraseña.")
    }

    if (error) {
      alert("Error al recuperar contraseña: " + error)
    }
  }, [data, error])

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = getDataFromForm(new FormData(e.currentTarget)) as {
      username: string,
      email: string,
    }
    const validationMessage = validate(fd)
    if (validationMessage != "ok") {
      alert("Error de validación: " + validationMessage)
      return
    }

    execute(authService.recover(
      fd.username,
      fd.email,
    ))
  }

  return (
    <main className="d-flex justify-content-center align-items-center vh-100">
      <section className="card p-4 shadow" style={{width: "22rem"}}>
        <h3 className="text-center mb-4">Recuperar Contraseña</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Usuario</label>
            <input type="text" className="form-control" name="username" id="username" required autoFocus />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Correo Electrónico</label>
            <input type="email" className="form-control" name="email" />
          </div>
          <button type="submit" className="btn btn-primary w-100">Enviar</button>
        </form>
        <div className="mt-3 text-center">
          <small>¿No tienes cuenta? <a href="/signup">Regístrate aquí</a></small>
          <br />
          <small>¿Ya tienes cuenta? <a href="/">Inicia Sesión</a></small>
        </div>
      </section>
    </main>
  )
}
