import {
  type SubmitEvent,
  useEffect
} from "react"

import useApi from "../hooks/useApi"
import { userService } from "../services/nexotic"

const getDataFromForm = (formData: FormData) => {
  return {
    username: formData.get("username") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirm_password") as string,
  }
}

const validate = (data: {
  username: string,
  email: string,
  password: string,
  confirmPassword: string
}) => {
  const { username, email, password, confirmPassword } = data

  if (!username || !email || !password || !confirmPassword) {
    return "Todos los campos son obligatorios."
  }

  if (password != confirmPassword) {
    return "Las contraseñas no coinciden."
  }

  return "ok"
}

export default function Signup() {
  const { data, error, execute } = useApi<any>()

  useEffect(() => {
    if (data) {
      console.log("Usuario creado:", data)
    }
    if (error) {
      console.error("Error creando usuario:", error)
    }
  }, [data, error])

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = getDataFromForm(new FormData(e.currentTarget))
    const validationError = validate(fd)
    if (validationError != "ok") {
      alert("Error de validación: " + validationError)
      return
    }

    execute(userService.create(fd))
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
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input type="password" className="form-control" name="password" />
          </div>
          <div className="mb-3">
            <label htmlFor="confirm_password" className="form-label">Confirmar Contraseña</label>
            <input type="password" className="form-control" name="confirm_password" />
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
