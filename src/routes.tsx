import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import { type JSX } from "react"
import Vacacionenes from "./pages/Vacaciones"
import AdministracionGeneral from "./pages/Administración_General"
import AprobacionesRH from "./pages/Aprobaciones_RH"
import Aprobaciones from "./pages/Aprobaciones"
import AvisosRH from "./pages/Avisos_RH"
import DashboardRH from "./pages/Dashboard_RH"
import GestionEmpleados from "./pages/Gestión_Empleados"
import IncidenciasRH from "./pages/Incidencias_RH"
import Incidencias from "./pages/Incidencias"
import Reportes from "./pages/Reportes"
import SolicitudesRH from "./pages/Solicitudes _RH"
import SolicitudesEmpleado from "./pages/Solicitudes_Empleado"

/**
 * Define application routes
 * 
 * - `path`: The URL path for the route
 * - `element`: The React component to render for the route
 * - `navigateTo` (optional): A path to navigate to under certain conditions, if is used with [ProtectedRoute](./context/Auth.tsx) this is the path to navigate to when the user is not authenticated
 */
export type appRoute = {
  path: string
  element: JSX.Element
  navigateTo?: string | null
}

export const publicRoutes: appRoute[] = [
  { path: "/", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/Vacacionens", element: <Vacacionenes/>},
  { path: "/dashboard-rh", element: <DashboardRH /> },
  { path: "/administracion-general", element: <AdministracionGeneral /> },
  { path: "/gestion-empleados", element: <GestionEmpleados /> },
  { path: "/aprobaciones", element: <Aprobaciones /> },
  { path: "/aprobaciones-rh", element: <AprobacionesRH /> },
  { path: "/avisos-rh", element: <AvisosRH /> },
  { path: "/incidencias", element: <Incidencias /> },
  { path: "/incidencias-rh", element: <IncidenciasRH /> },
  { path: "/reportes", element: <Reportes /> },
  { path: "/solicitudes-empleado", element: <SolicitudesEmpleado /> },
  { path: "/solicitudes-rh", element: <SolicitudesRH /> },
]

export const protectedRoutes: appRoute[] = [
  { path: "/dashboard", element: <Dashboard /> },
]
