import { type JSX } from "react"

import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Recovery from "./pages/Recovery"

import Dashboard from "./pages/common/Dashboard"
import Solicitudes from "./pages/common/Solicitudes"
import Incidencias from "./pages/common/Incidencias"
import Rules from "./pages/common/Rules"
import Terms from "./pages/common/Terms"

import Vacaciones from "./pages/employee/Vacaciones"

import GestionEmpleados from "./pages/rrhh/Gestion_Empleados"
import Aprobaciones from "./pages/rrhh/Aprobaciones"
import Reportes from "./pages/rrhh/Reportes"
import AvisosRH from "./pages/rrhh/Avisos_RH"

/**
 * Object containing all the raw paths for the application
 */
export const rawRoutes = {
  index: {
    login: "/",
    signup: "/signup",
    recovery: "/recovery",
  },
  common: {
    home: "/home",
    requests: "/requests",
    incidents: "/incidents",

    rules: "/rules",
    terms: "/terms",
  },
  employee: {
    holidays: "/holidays",
  },
  rrhh: {
    employees: "/employees",
    approvals: "/approvals",
    reports: "/reports",
    notices: "/notices",
  },
}

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
  { path: rawRoutes.index.login, element: <Login /> },
  { path: rawRoutes.index.signup, element: <Signup /> },
  { path: rawRoutes.index.recovery, element: <Recovery /> },
]

export const protectedRoutes: appRoute[] = [
  { path: rawRoutes.common.home, element: <Dashboard /> },
  { path: rawRoutes.employee.holidays, element: <Vacaciones />},
  { path: rawRoutes.rrhh.employees, element: <GestionEmpleados /> },
  { path: rawRoutes.rrhh.approvals, element: <Aprobaciones /> },
  { path: rawRoutes.rrhh.notices, element: <AvisosRH /> },
  { path: rawRoutes.common.incidents, element: <Incidencias /> },
  { path: rawRoutes.rrhh.reports, element: <Reportes /> },
  { path: rawRoutes.common.requests, element: <Solicitudes /> },
  { path: rawRoutes.common.rules, element: <Rules /> },
  { path: rawRoutes.common.terms, element: <Terms /> },
]
