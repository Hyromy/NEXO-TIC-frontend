import { 
  useEffect,
  type SubmitEvent
} from "react"

import { useNavigate } from "react-router-dom"

import useApi from "../hooks/useApi"
import { authService } from "../services/nexotic"
import { getDataFromForm } from "../utils/getters"
import { setPairTokens } from "../utils/setters"

const validate = (data: {
  username: string,
  password: string,
}) => {
  const { username, password } = data

  if (!username || !password) {
    return "Todos los campos son obligatorios."
  }
  
  return "ok"
}

export default function Login() {
  const { data, error, execute } = useApi<any>()
  const navigate = useNavigate()

  useEffect(() => {
    if (data && data.access && data.refresh) {
      setPairTokens(data.access, data.refresh)
      navigate("/dashboard")
    }
    if (error) {
      alert("Error iniciando sesión: " + error)
    }
  }, [data, error])

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = getDataFromForm(new FormData(e.currentTarget)) as {
      username: string,
      password: string,
    }
    const validationError = validate(fd)
    if (validationError != "ok") {
      alert("Error de validación: " + validationError)
      return
    }

    execute(authService.login(
      fd.username,
      fd.password,
    ))
  }

  return (
    <main className="d-flex justify-content-center align-items-center vh-100">
      <section className="card p-4 shadow" style={{width: "22rem"}}>
        <h3 className="text-center mb-4">Iniciar Sesión</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Usuario</label>
            <input type="text" className="form-control" name="username" id="username" required autoFocus />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input type="password" className="form-control" name="password" id="password" required />
          </div>
          <button type="submit" className="btn btn-primary w-100">Entrar</button>
        </form>
        <div className="mt-3 text-center">
          <small>¿No tienes cuenta? <a href="/signup">Regístrate aquí</a></small>
        </div>
      </section>
    </main>
  )
}
