import { BrowserRouter, Routes, Route } from "react-router-dom"

import { 
  publicRoutes,
  protectedRoutes,
} from "./routes"
import { AuthProvider, ProtectedRoute } from "./context/Auth"

console.log("App is running...")

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {publicRoutes.map(({ path, element }, index) => (
            <Route key={index} path={path} element={element} />
          ))}
          {protectedRoutes.map(({ path, element, navigateTo }, index) => (
            <Route key={index} path={path} element={
              <ProtectedRoute navigateTo={navigateTo ?? undefined}>
                {element}
              </ProtectedRoute>
            } />
          ))}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
