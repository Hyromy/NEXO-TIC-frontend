import { type ReactNode } from "react"

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
import Nuevo_Aviso from "./pages/rrhh/Nuevo_Aviso"

import { type UserType } from "./hooks/useUser"

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
    newNotice: "/notices/new",
  },
}

/**
 * Define application routes
 * 
 * - `path`: The URL path for the route
 * - `element`: The React component to render for the route
 * - `notAuthNavigateTo` (optional): A path to navigate to when the user is not authenticated
 * - `notUserNavigateTo` (optional): A path to navigate to when the user is authenticated but doesn't have permissions for the route
 */
export type appRoute = {
  path: string
  element: ReactNode
  allowedFor?: Array<UserType | "all">
  notAuthNavigateTo?: string | null
  notUserNavigateTo?: string | null
  label: string
  icon: string
  type?: "module" | "info"
}

export const publicRoutes: appRoute[] = [
  {
    path: rawRoutes.index.login,
    element: <Login />,
    label: "Inicio de sesión",
    icon: "box-arrow-in-right",
  },
  {
    path: rawRoutes.index.signup,
    element: <Signup />,
    label: "Registro de cuenta",
    icon: "person-plus",
  },
  {
    path: rawRoutes.index.recovery,
    element: <Recovery />,
    label: "Recuperar contraseña",
    icon: "key",
  },
]

export const protectedRoutes: appRoute[] = [
  { 
    path: rawRoutes.common.home,
    element: <Dashboard />,
    allowedFor: ["all"],
    label: "Inicio",
    icon: "house-door",
    type: "module"
  },
  { 
    path: rawRoutes.employee.holidays,
    element: <Vacaciones />,
    allowedFor: ["all"],
    label: "Vacaciones",
    icon: "calendar-check",
    type: "module"
  },
  { 
    path: rawRoutes.rrhh.employees,
    element: <GestionEmpleados />,
    allowedFor: ["rrhh"],
    label: "Empleados",
    icon: "people-fill",
    type: "module"
  },
  { 
    path: rawRoutes.rrhh.approvals,
    element: <Aprobaciones />,
    allowedFor: ["rrhh"],
    label: "Aprobaciones",
    icon: "file-earmark-check-fill",
    type: "module"
  },
  { 
    path: rawRoutes.rrhh.notices,
    element: <AvisosRH />,
    allowedFor: ["rrhh"],
    label: "Avisos",
    icon: "megaphone-fill",
    type: "module"
  },
  { 
    path: rawRoutes.rrhh.newNotice,
    element: <Nuevo_Aviso />,
    allowedFor: ["rrhh"],
    label: "Nuevo aviso",
    icon: "plus-circle-fill",
  },
  { 
    path: `${rawRoutes.rrhh.notices}/edit/:id`, // Construye la ruta /notices/edit/:id
    element: <Nuevo_Aviso />,
    allowedFor: ["rrhh"],
    // No ponemos label ni icon para que sea una ruta "invisible" en el menú
  },
  { 
    path: rawRoutes.common.incidents,
    element: <Incidencias />,
    allowedFor: ["employee", "rrhh"],
    label: "Incidencias",
    icon: "exclamation-triangle-fill",
    type: "module"
  },
  { 
    path: rawRoutes.rrhh.reports,
    element: <Reportes />,
    allowedFor: ["rrhh"],
    label: "Reportes",
    icon: "file-earmark-bar-graph-fill",
    type: "module"
  },
  { 
    path: rawRoutes.common.requests,
    element: <Solicitudes />,
    allowedFor: ["employee", "rrhh"],
    label: "Solicitudes",
    icon: "view-list",
    type: "module"
  },
  { 
    path: rawRoutes.common.rules,
    element: <Rules />,
    allowedFor: ["all"],
    label: "Reglamento",
    icon: "file-earmark-text-fill",
    type: "info"
  },
  { 
    path: rawRoutes.common.terms,
    element: <Terms />,
    allowedFor: ["all"],
    label: "Términos y condiciones",
    icon: "file-ruled-fill",
    type: "info"
  },
]