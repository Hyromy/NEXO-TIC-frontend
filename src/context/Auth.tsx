import { 
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react"

import { Navigate } from "react-router-dom"

import useApi from "../hooks/useApi"
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
  const { error, execute } = useApi<any>()

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
    const response = await execute(authService.logout(
      getRefreshToken()
    ))

    if (error) {
      const msg = "Error cerrando sesión: " + error
      console.error(msg)
      alert(msg)
    }

    if (response && response.ok) {
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
  navigateTo?: string,
}
export function ProtectedRoute({ 
  children,
  navigateTo = "/"
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to={navigateTo} replace />
  }

  return <>
    {children}
  </>
}
