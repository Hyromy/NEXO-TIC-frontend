import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import { type JSX } from "react"

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
]
