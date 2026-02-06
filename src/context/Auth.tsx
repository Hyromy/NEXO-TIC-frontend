import { 
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react"

import { Navigate } from "react-router-dom"

type AuthContextType = {
  isAuthenticated: boolean
  isLoading: boolean
  logout: () => void
  checkAuth: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const checkAuth = () => {
    // TODO: implement authentication check logic
    setIsAuthenticated(true)
  }

  useEffect(() => {
    checkAuth()
    setIsLoading(false)
  }, [])

  const logout = () => {
    setIsAuthenticated(false)
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
