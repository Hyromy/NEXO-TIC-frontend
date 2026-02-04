import Menu from "../layout/Menu"
import Foot from "../layout/Foot"

import { useAuth } from "../context/Auth"

export default function Dashboard() {
  const { logout } = useAuth()

  return <>
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
