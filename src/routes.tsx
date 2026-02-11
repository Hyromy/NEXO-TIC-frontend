import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import { type JSX } from "react"
import AdministracionGeneral from "./pages/Administracion_General"
import AvisosRH from "./pages/Avisos_RH"
import GestionEmpleados from "./pages/Gestion_Empleados"
import Incidencias from "./pages/Incidencias"
import Reportes from "./pages/Reportes"
import Solicitudes from "./pages/Solicitudes"
import Aprobaciones from "./pages/Aprobaciones"
import Vacaciones from "./pages/Vacaciones"

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
 
]

export const protectedRoutes: appRoute[] = [
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/vacaciones", element: <Vacaciones/>},
  { path: "/administracion", element: <AdministracionGeneral /> },
  { path: "/gestion-empleados", element: <GestionEmpleados /> },
  { path: "/aprobaciones", element: <Aprobaciones/> },
  { path: "/avisos", element: <AvisosRH /> },
  { path: "/incidencias", element: <Incidencias /> },
  { path: "/reportes", element: <Reportes /> },
  { path: "/solicitudes", element: <Solicitudes /> },
  
]
