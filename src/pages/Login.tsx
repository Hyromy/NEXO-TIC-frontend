import { useEffect } from "react"

import useApi from "../hooks/useApi"
import { userService } from "../services/nexotic"

export default function Login() {
  const { data, loading, error, execute } = useApi<any>()

  useEffect(() => {
    execute(userService.get())
  }, [execute])

  if (loading) console.log("Cargando usuarios...")
  if (error) console.error("Error cargando usuarios:", error)
  if (data) console.log("Usuarios cargados:", data)

  return (
    <main className="d-flex justify-content-center align-items-center vh-100">
      <section className="card p-4 shadow" style={{width: "22rem"}}>
        <h3 className="text-center mb-4">Iniciar Sesión</h3>
        <form>
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
