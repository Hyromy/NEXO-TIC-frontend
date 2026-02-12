import { type ReactNode } from "react"

import Menu from "./Menu"
import Navbar from "./Navbar"
import Foot from "./Foot"

import { Canvas } from "../components/Canvas"
import { Button } from "../components/Button"

import { rawRoutes } from "../routes"

import { useNavigate } from "react-router-dom"

type module = {
  label: string
  icon: string
  path?: string
}

type MainProps = {
  children: ReactNode
}
export default function Main({
  children
}: MainProps) {
  const modules: module[] = [
    { 
      label: "Inicio",
      path: rawRoutes.common.home,
      icon: "house-door",
    },
    { 
      label: "Vacaciones",
      path: rawRoutes.employee.holidays,
      icon: "calendar-check",
    },
    { 
      label: "Solicitudes",
      path: rawRoutes.common.requests,
      icon: "view-list",
    },
    { 
      label: "Incidencias",
      path: rawRoutes.common.incidents,
      icon: "exclamation-triangle-fill",
    },
    { 
      label: "Empleados",
      path: rawRoutes.rrhh.employees,
      icon: "people-fill",
    },
    { 
      label: "Aprobaciones",
      path: rawRoutes.rrhh.approvals,
      icon: "file-earmark-check-fill",
    },
    { 
      label: "Reportes",
      path: rawRoutes.rrhh.reports,
      icon: "file-earmark-bar-graph-fill",
    },
    { 
      label: "Avisos",
      path: rawRoutes.rrhh.notices,
      icon: "megaphone-fill",
    },
  ]

  const infoModules = [
    { 
      label: "Reglamento",
      path: rawRoutes.common.rules,
      icon: "file-ruled-fill",
    },
    { 
      label: "Términos y políticas",
      path: rawRoutes.common.terms,
      icon: "shield-check",
    },
  ]

  const navigate = useNavigate()

  const bsIconClasses = (icon: string) => `bi bi-${icon} me-2`
  const currentPath = window.location.pathname
  const menu = (
    <Menu 
      modules={modules.map((module, index) => (
        <Button 
          key={index}
          variant={currentPath.includes(module.path!) ? "primary" : "light"}
          fat
          onClick={() => navigate(module.path!)}
        >
          <i className={bsIconClasses(module.icon)}></i>
          {module.label}
        </Button>
      ))}
      bottom={infoModules.map((module, index) => (
        <Button
          key={index}
          variant={currentPath.includes(module.path!) ? "primary" : "light"}
          fat
          onClick={() => navigate(module.path!)}
        >
          <i className={bsIconClasses(module.icon)}></i>
          {module.label}
        </Button>
      ))}
    />
  )

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="flex-grow-1 d-flex">
        <aside
          className="bg-light border-end p-3 position-sticky d-none d-md-block"
          style={{ minWidth: 220, top: 0, height: '100vh', zIndex: 1020 }}
        >
          {menu}
        </aside>
        <div className="flex-grow-1 d-flex flex-column">
          <Navbar />
          <div className="d-md-none">
            <Canvas id="menuCanvas" title="Menú de navegación">
              {menu}
            </Canvas>
          </div>
          <main className="flex-grow-1 p-4">
            {children}
          </main>
        </div>
      </div>
      <Foot />
    </div>
  )
}
