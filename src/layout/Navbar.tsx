import { type ReactNode } from "react"

import { getHumanName } from "../utils/getters"
import { clearTokens } from "../utils/setters"

import { useAuth } from "../context/Auth"

import { Dropdown } from "../components/Dropdown"
import { Button } from "../components/Button"

import { useTheme } from "../context/Theme"

type NavbarGroupProps = {
  children?: ReactNode
  gap?: number
}
function NavbarGroup({
  children,
  gap = 2
}: NavbarGroupProps) {
  return (
    <div className={`navbar-group d-flex align-items-center gap-${gap}`}>
      {children}
    </div>
  )
}

export default function Navbar() {
  const { logout, checkAuth } = useAuth()
  const { toggleTheme, theme } = useTheme()


  const changePasswordHandler = () => {
    alert("Cambiar contraseña")
  }

  const logoutHandler = () => {
    const confirmation = confirm("¿Estás seguro que quieres cerrar sesión?")
    if (confirmation) {
      logout()
      clearTokens()
      checkAuth()
    }
  }

  const dropdownItems = [
    <Button variant="secondary" onClick={changePasswordHandler} fat>
      Cambiar contraseña
    </Button>,
    <Button variant="danger" onClick={logoutHandler} fat>
      Cerrar sesión 
    </Button>
  ]

  return (
    <nav className="navbar bg-body-tertiary navbar-expand-sm px-0 sticky-top">
      <div className="container-xxl d-flex justify-content-between align-items-center">
        <button
          className="btn d-md-none mx-2 p-0"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#menuCanvas"
          aria-controls="menuCanvas"
        >
          <i className="bi bi-list fs-3"></i>
        </button>
        <NavbarGroup />
        <NavbarGroup>
          <Dropdown items={dropdownItems} variant={theme} inverted>
            <i className="bi bi-person-circle me-2"></i>
            Hola {getHumanName()}
          </Dropdown>
          <Button onClick={toggleTheme} variant={theme}>
            <i className={`bi bi-${theme == "dark" ? "moon-stars" : "sun"}-fill`}></i>
          </Button>
        </NavbarGroup>
      </div>
    </nav>
  )
}
