import { useEffect, type ReactNode } from "react"

import Menu from "./Menu"
import Navbar from "./Navbar"
import Foot from "./Foot"

import { Canvas, closeCanvas } from "../components/Canvas"
import { Button } from "../components/Button"

import { protectedRoutes } from "../routes"

import { useLocation, useNavigate } from "react-router-dom"
import useUser from "../hooks/useUser"
import { Spinner } from "../components/Spinner"

import { useTheme } from "../context/Theme"
import { FloatContainer } from "./Containers"

type MainProps = {
  children: ReactNode
}
export default function Main({
  children
}: MainProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { loading, userType } = useUser()
  const { theme } = useTheme()
  const menuCanvasId = "menuCanvas"

  const handleMenuNavigation = (path: string) => {
    closeCanvas(menuCanvasId)
    navigate(path)
  }

  useEffect(() => {
    closeCanvas(menuCanvasId)
  }, [location.pathname])

  const routeAvaiability = (route: typeof protectedRoutes[0]) => (
    route.allowedFor!.includes("all") || route.allowedFor!.includes(userType!)
  )

  const moduleFilter = (route: typeof protectedRoutes[0]) => (
    route.type == "module"
    && routeAvaiability(route) 
  )

  const infoFilter = (route: typeof protectedRoutes[0]) => (
    route.type == "info"
    && routeAvaiability(route) 
  )

  const bsIconClasses = (icon: string) => `bi bi-${icon} me-2`
  const currentPath = location.pathname
  const menu = (
    <Menu 
      modules={protectedRoutes.filter(moduleFilter).map((module, index) => (
        <Button 
          key={index}
          variant={currentPath.includes(module.path!) ? "primary" : theme}
          fat
          onClick={() => handleMenuNavigation(module.path!)}
        >
          <i className={bsIconClasses(module.icon)}></i>
          {module.label}
        </Button>
      ))}
      bottom={protectedRoutes.filter(infoFilter).map((module, index) => (
        <Button
          key={index}
          variant={currentPath.includes(module.path!) ? "primary" : theme}
          fat
          onClick={() => handleMenuNavigation(module.path!)}
        >
          <i className={bsIconClasses(module.icon)}></i>
          {module.label}
        </Button>
      ))}
    />
  )

  return loading ? <Spinner /> : (
    <div className="d-flex flex-column min-vh-100">
      <div className="flex-grow-1 d-flex">
        <aside
          className={`bg-${theme} border-end p-3 position-sticky d-none d-md-block`}
          style={{ minWidth: 220, top: 0, height: '100vh', zIndex: 1020 }}
        >
          {menu}
        </aside>
        <div className="flex-grow-1 d-flex flex-column">
          <Navbar />
          <div className="d-md-none">
            <Canvas id={menuCanvasId} title="Menú de navegación">
              {menu}
            </Canvas>
          </div>
          <main className="p-4 container-xxl">
            {children}
          </main>
        </div>
      </div>
      <Foot />
      <FloatContainer id="main-float-container" />
    </div>
  )
}
