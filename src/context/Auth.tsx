import { 
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react"

import { Navigate } from "react-router-dom"

import useApi from "../hooks/useApi"
import useUser, { type UserType } from "../hooks/useUser"
import { authService } from "../services/nexotic"
import { clearTokens } from "../utils/setters"
import { getRefreshToken, getPairTokens } from "../utils/getters"
import { isTokenExpired } from "../utils/jwt"

type AuthContextType = {
  isAuthenticated: boolean
  isLoading: boolean
  logout: () => void
  checkAuth: () => void
}
const AuthContext = createContext<AuthContextType | undefined>(undefined)

type AuthProviderProps = {
  children: ReactNode
}
/**
 * Provider for managing authentication state.
 * 
 * Checks for valid tokens on mount and provides logout functionality.
 * Handles token expiration and ensures the app knows if the user is authenticated.
 * 
 * @example
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 * 
 * @param children - The child components that will have access to the authentication context.
 * @returns The AuthContext provider with authentication state and functions.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { execute } = useApi<any>()

  const checkAuth = () => {
    const { accessToken, refreshToken } = getPairTokens()
    if (!accessToken || !refreshToken) {
      setIsAuthenticated(false)
      return
    }
    
    if (isTokenExpired(refreshToken, 0)) {
      clearTokens()
      setIsAuthenticated(false)
      return
    }

    setIsAuthenticated(true)
  }

  useEffect(() => {
    checkAuth()
    setIsLoading(false)
  }, [])

  const logout = async () => {
    try{
      await execute(authService.logout(
        getRefreshToken()
      ))
    } catch (err) {
      console.error("Error during logout:", err)

    } finally {
      clearTokens()
      setIsAuthenticated(false)
    }
  }

  return <AuthContext.Provider value={{isAuthenticated, isLoading, logout, checkAuth }}>
    {children}
  </AuthContext.Provider>
}

/**
 * Hook to access authentication state and functions from the AuthContext.
 * 
 * @example
 * const { isAuthenticated, isLoading, logout, checkAuth } = useAuth()
 * 
 * if (isLoading) console.log("Checking authentication...")
 * if (isAuthenticated) console.log("User is authenticated")
 * 
 * logout() // to log the user out
 * checkAuth() // to re-check authentication status
 * 
 * @throws Will throw an error if used outside of an AuthProvider.
 * 
 * @returns An object containing authentication state and functions:
 * - `isAuthenticated`: boolean indicating if the user is authenticated.
 * - `isLoading`: boolean indicating if the authentication state is still loading.
 * - `logout`: function to log the user out.
 * - `checkAuth`: function to check the current authentication status (useful after login/logout).
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }

  return context
}

type ProtectedRouteProps = { 
  children: ReactNode,
  notAuthNavigateTo?: string,
  notUserNavigateTo?: string,
  allowedFor?: Array<UserType | "all">
}
/**
 * A route component that protects its children from unauthenticated or unauthorized access.
 * 
 * Checks if the user is authenticated and has the required permissions before rendering the children. If not authenticated, it redirects to a specified route. If authenticated but not authorized, it redirects to another specified route.
 * 
 * @example
 * <ProtectedRoute 
 *   allowedFor={["admin", "editor"]}
 *   notAuthNavigateTo="/login"
 *   notUserNavigateTo="/no-access"
 * >
 *   <AdminDashboard />
 * </ProtectedRoute>
 * 
 * @param children - The components to render if the user is authenticated and authorized.
 * @param notAuthNavigateTo - The route to navigate to if the user is not authenticated (default: "/").
 * @param notUserNavigateTo - The route to navigate to if the user is authenticated but not authorized (default: "/").
 * @param allowedFor - An array of user types that are allowed to access the children. If it includes "all", any authenticated user can access.
 * 
 * @returns The protected route component.
 */
export function ProtectedRoute({ 
  children,
  notAuthNavigateTo = "/",
  notUserNavigateTo = "/",
  allowedFor
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { userType, loading: permissionsLoading } = useUser()

  const hasPermissions = allowedFor?.includes("all") || allowedFor?.includes(userType as UserType)

  if (authLoading || permissionsLoading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to={notAuthNavigateTo} replace />
  }

  if (!hasPermissions) {
    return <Navigate to={notUserNavigateTo} replace />
  }

  return <>
    {children}
  </>
}
