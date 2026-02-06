import Menu from "../layout/Menu"
import Foot from "../layout/Foot"
import Navbar from "../layout/Navbar"

import { useAuth } from "../context/Auth"

export default function Dashboard() {
  const { logout } = useAuth()

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
