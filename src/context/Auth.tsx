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
