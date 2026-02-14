import { useEffect } from "react"

import Menu from "../layout/Menu"
import Foot from "../layout/Foot"
import Navbar from "../layout/Navbar"

import { useAuth } from "../context/Auth"
import { userService } from "../services/nexotic"
import useApi from "../hooks/useApi"

export default function Dashboard() {
  const { logout } = useAuth()
  const { execute, data, error, loading } = useApi<any>()

  useEffect(() => {
    execute(userService.get())
  }, [execute])

  console.log("Dashboard data:", data)
  console.log("Dashboard error:", error)
  console.log("Dashboard loading:", loading)

  return <>
    <Navbar />
    <Menu modules={[
      <span onClick={logout} className="text-primary text-decoration-underline">Cerrar sesion</span>
    ]}/>
    <main className="container mt-5">
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard!</p>
    </main>
    <Foot />
  </>
}
