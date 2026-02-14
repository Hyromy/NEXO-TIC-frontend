import { BrowserRouter, Routes, Route } from "react-router-dom"

import { 
  publicRoutes,
  protectedRoutes,
} from "./routes"
import { AuthProvider, ProtectedRoute } from "./context/Auth"

import NotFound from "./pages/common/NotFound"

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
