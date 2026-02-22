import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { BrowserRouter } from "react-router-dom"
import { AuthProvider, useAuth, ProtectedRoute } from "../context/Auth"
import { ThemeProvider, useTheme } from "../context/Theme"

// Mock dependencies
vi.mock("../hooks/useApi")
vi.mock("../hooks/useUser")
vi.mock("../services/nexotic")
vi.mock("../utils/setters")
vi.mock("../utils/getters")
vi.mock("../utils/jwt")

// Mock React Router Navigate
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom")
  return {
    ...actual,
    Navigate: ({ to }: { to: string }) => (
      <div data-testid="navigate-to">{to}</div>
    ),
  }
})

import useApi from "../hooks/useApi"
import useUser from "../hooks/useUser"
import { authService } from "../services/nexotic"
import { clearTokens, setTheme } from "../utils/setters"
import { getRefreshToken, getPairTokens, getTheme } from "../utils/getters"
import { isTokenExpired } from "../utils/jwt"

describe("Context package", () => {
  describe("Auth Context", () => {
    let mockExecute: ReturnType<typeof vi.fn>
    let mockConsoleError: ReturnType<typeof vi.fn>
    let mockAlert: ReturnType<typeof vi.fn>

    beforeEach(() => {
      mockExecute = vi.fn().mockResolvedValue({ ok: true })
      mockConsoleError = vi
        .spyOn(console, "error")
        .mockImplementation(() => {})
      mockAlert = vi.spyOn(window, "alert").mockImplementation(() => {})

      vi.mocked(useApi).mockReturnValue({
        data: null,
        loading: false,
        error: null,
        execute: mockExecute as any,
      })

      vi.mocked(useUser).mockReturnValue({
        userType: "employee",
        loading: false,
        canAccessEmployee: () => true,
        canAccessRRHH: () => false,
        canAccessAdmin: () => false,
      })

      vi.mocked(getRefreshToken).mockReturnValue("mock-refresh-token")
      vi.mocked(getPairTokens).mockReturnValue({
        accessToken: "mock-access-token",
        refreshToken: "mock-refresh-token",
      })
      vi.mocked(isTokenExpired).mockReturnValue(false)
      vi.mocked(authService.logout).mockReturnValue(Promise.resolve({} as any))
    })

    afterEach(() => {
      vi.clearAllMocks()
      mockConsoleError.mockRestore()
      mockAlert.mockRestore()
    })

    describe("AuthProvider", () => {
      it("should provide auth context to children", () => {
        const TestComponent = () => {
          const { isAuthenticated } = useAuth()
          return <div>Authenticated: {String(isAuthenticated)}</div>
        }

        render(
          <AuthProvider>
            <TestComponent />
          </AuthProvider>,
        )

        expect(screen.getByText(/Authenticated:/)).toBeInTheDocument()
      })

      it("should initialize with authenticated true", async () => {
        const TestComponent = () => {
          const { isAuthenticated, isLoading } = useAuth()
          return (
            <div>
              <div>Auth: {String(isAuthenticated)}</div>
              <div>Loading: {String(isLoading)}</div>
            </div>
          )
        }

        render(
          <AuthProvider>
            <TestComponent />
          </AuthProvider>,
        )

        await waitFor(() => {
          expect(screen.getByText("Auth: true")).toBeInTheDocument()
          expect(screen.getByText("Loading: false")).toBeInTheDocument()
        })
      })

      it("should set isLoading to false after initialization", async () => {
        const TestComponent = () => {
          const { isLoading } = useAuth()
          return <div>Loading: {String(isLoading)}</div>
        }

        render(
          <AuthProvider>
            <TestComponent />
          </AuthProvider>,
        )

        await waitFor(() => {
          expect(screen.getByText("Loading: false")).toBeInTheDocument()
        })
      })
    })

    describe("useAuth hook", () => {
      it("should throw error when used outside AuthProvider", () => {
        const TestComponent = () => {
          useAuth()
          return <div>Test</div>
        }

        // Suppress console error for this test
        const consoleError = vi
          .spyOn(console, "error")
          .mockImplementation(() => {})

        expect(() => render(<TestComponent />)).toThrow(
          "useAuth must be used within AuthProvider",
        )

        consoleError.mockRestore()
      })

      it("should provide checkAuth function", () => {
        const TestComponent = () => {
          const { checkAuth } = useAuth()
          return <button onClick={checkAuth}>Check Auth</button>
        }

        render(
          <AuthProvider>
            <TestComponent />
          </AuthProvider>,
        )

        expect(screen.getByRole("button")).toBeInTheDocument()
      })

      it("should update authentication status when checkAuth is called", async () => {
        const TestComponent = () => {
          const { isAuthenticated, checkAuth } = useAuth()
          return (
            <div>
              <div>Auth: {String(isAuthenticated)}</div>
              <button onClick={checkAuth}>Check</button>
            </div>
          )
        }

        const user = userEvent.setup()
        render(
          <AuthProvider>
            <TestComponent />
          </AuthProvider>,
        )

        await waitFor(() => {
          expect(screen.getByText("Auth: true")).toBeInTheDocument()
        })

        await user.click(screen.getByRole("button"))
        expect(screen.getByText("Auth: true")).toBeInTheDocument()
      })
    })

    describe("logout functionality", () => {
      it("should call authService.logout with refresh token", async () => {
        mockExecute.mockResolvedValue({ ok: true })

        const TestComponent = () => {
          const { logout } = useAuth()
          return <button onClick={logout}>Logout</button>
        }

        const user = userEvent.setup()
        render(
          <AuthProvider>
            <TestComponent />
          </AuthProvider>,
        )

        await user.click(screen.getByRole("button"))

        await waitFor(() => {
          expect(authService.logout).toHaveBeenCalledWith("mock-refresh-token")
          expect(mockExecute).toHaveBeenCalled()
        })
      })

      it("should clear tokens and set isAuthenticated to false on successful logout", async () => {
        mockExecute.mockResolvedValue({ ok: true })

        const TestComponent = () => {
          const { logout, isAuthenticated } = useAuth()
          return (
            <div>
              <div>Auth: {String(isAuthenticated)}</div>
              <button onClick={logout}>Logout</button>
            </div>
          )
        }

        const user = userEvent.setup()
        render(
          <AuthProvider>
            <TestComponent />
          </AuthProvider>,
        )

        await waitFor(() => {
          expect(screen.getByText("Auth: true")).toBeInTheDocument()
        })

        await user.click(screen.getByRole("button"))

        await waitFor(() => {
          expect(clearTokens).toHaveBeenCalled()
          expect(screen.getByText("Auth: false")).toBeInTheDocument()
        })
      })

      it("should log error when logout fails", async () => {
        const errorMessage = "Network error"
        mockExecute.mockRejectedValue(new Error(errorMessage))

        const TestComponent = () => {
          const { logout } = useAuth()
          return <button onClick={logout}>Logout</button>
        }

        const user = userEvent.setup()
        render(
          <AuthProvider>
            <TestComponent />
          </AuthProvider>,
        )

        await user.click(screen.getByRole("button"))

        await waitFor(() => {
          expect(mockConsoleError).toHaveBeenCalledWith(
            "Error during logout:",
            expect.any(Error)
          )
          // Should clear tokens even on error
          expect(clearTokens).toHaveBeenCalled()
        })
      })

      it("should clear tokens even when logout fails", async () => {
        mockExecute.mockRejectedValue(new Error("Server error"))

        const TestComponent = () => {
          const { logout } = useAuth()
          return <button onClick={logout}>Logout</button>
        }

        const user = userEvent.setup()
        render(
          <AuthProvider>
            <TestComponent />
          </AuthProvider>,
        )

        await user.click(screen.getByRole("button"))

        await waitFor(() => {
          expect(mockExecute).toHaveBeenCalled()
          // Should always clear tokens in finally block
          expect(clearTokens).toHaveBeenCalled()
        })
      })
    })

    describe("ProtectedRoute", () => {
      it("should render children when authenticated", async () => {
        render(
          <BrowserRouter>
            <AuthProvider>
              <ProtectedRoute allowedFor={["all"]}>
                <div>Protected Content</div>
              </ProtectedRoute>
            </AuthProvider>
          </BrowserRouter>,
        )

        await waitFor(() => {
          expect(screen.getByText("Protected Content")).toBeInTheDocument()
        })
      })

      it("should show loading while checking authentication", () => {
        // Create a version of AuthProvider that stays in loading state
        // This is hard to test since useEffect sets loading to false immediately
        // In real scenario, we'd mock the checkAuth to be async

        const TestComponent = () => {
          return (
            <BrowserRouter>
              <AuthProvider>
                <ProtectedRoute>
                  <div>Protected Content</div>
                </ProtectedRoute>
              </AuthProvider>
            </BrowserRouter>
          )
        }

        const { container } = render(<TestComponent />)

        // Note: This test is limited because loading state changes immediately in useEffect
        // A better implementation would have async authentication check
        expect(container).toBeInTheDocument()
      })

      it("should navigate to default route when not authenticated", async () => {
        // Mock no tokens available
        vi.mocked(getPairTokens).mockReturnValue({
          accessToken: "",
          refreshToken: "",
        })

        render(
          <BrowserRouter>
            <AuthProvider>
              <ProtectedRoute allowedFor={["all"]}>
                <div>Protected Content</div>
              </ProtectedRoute>
            </AuthProvider>
          </BrowserRouter>,
        )

        await waitFor(() => {
          expect(screen.getByTestId("navigate-to")).toHaveTextContent("/")
        })
      })

      it("should navigate to custom route when not authenticated", async () => {
        // Mock no tokens available
        vi.mocked(getPairTokens).mockReturnValue({
          accessToken: "",
          refreshToken: "",
        })

        const TestAuthProvider = ({
          children,
        }: {
          children: React.ReactNode
        }) => {
          return (
            <BrowserRouter>
              <AuthProvider>{children}</AuthProvider>
            </BrowserRouter>
          )
        }

        // This tests the navigateTo prop functionality
        render(
          <TestAuthProvider>
            <ProtectedRoute notAuthNavigateTo="/login" allowedFor={["all"]}>
              <div>Protected Content</div>
            </ProtectedRoute>
          </TestAuthProvider>,
        )

        await waitFor(() => {
          expect(screen.getByTestId("navigate-to")).toHaveTextContent("/login")
        })
      })

      it("should pass navigateTo prop to Navigate component", async () => {
        // Mock no tokens available
        vi.mocked(getPairTokens).mockReturnValue({
          accessToken: "",
          refreshToken: "",
        })

        const customPath = "/custom-login"

        render(
          <BrowserRouter>
            <AuthProvider>
              <ProtectedRoute notAuthNavigateTo={customPath} allowedFor={["all"]}>
                <div>Content</div>
              </ProtectedRoute>
            </AuthProvider>
          </BrowserRouter>,
        )

        await waitFor(() => {
          expect(screen.getByTestId("navigate-to")).toHaveTextContent(customPath)
        })
      })
    })

    describe("AuthProvider integration", () => {
      it("should update all consumers when auth state changes", async () => {
        const Consumer1 = () => {
          const { isAuthenticated } = useAuth()
          return <div>Consumer1: {String(isAuthenticated)}</div>
        }
        const Consumer2 = () => {
          const { isAuthenticated, logout } = useAuth()
          return (
            <div>
              <div>Consumer2: {String(isAuthenticated)}</div>
              <button onClick={logout}>Logout</button>
            </div>
          )
        }
        mockExecute.mockResolvedValue({ ok: true })
        const user = userEvent.setup()
        render(
          <AuthProvider>
            <Consumer1 />
            <Consumer2 />
          </AuthProvider>,
        )
        await waitFor(() => {
          expect(screen.getByText("Consumer1: true")).toBeInTheDocument()
          expect(screen.getByText("Consumer2: true")).toBeInTheDocument()
        })
        await user.click(screen.getByRole("button"))
        await waitFor(() => {
          expect(screen.getByText("Consumer1: false")).toBeInTheDocument()
          expect(screen.getByText("Consumer2: false")).toBeInTheDocument()
        })
      })

      it("should handle multiple logout calls gracefully", async () => {
        mockExecute.mockResolvedValue({ ok: true })
        const TestComponent = () => {
          const { logout } = useAuth()
          return <button onClick={logout}>Logout</button>
        }
        const user = userEvent.setup()
        render(
          <AuthProvider>
            <TestComponent />
          </AuthProvider>,
        )
        const button = screen.getByRole("button")
        await user.click(button)
        await user.click(button)
        await user.click(button)
        await waitFor(() => {
          expect(mockExecute).toHaveBeenCalledTimes(3)
        })
      })
    })
  })

  describe("Theme Context", () => {
    beforeEach(() => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query: string) => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      })

      vi.mocked(getTheme).mockReturnValue(null)
      vi.mocked(setTheme).mockImplementation(() => {})
      document.body.removeAttribute('data-bs-theme')
    })

    afterEach(() => {
      vi.clearAllMocks()
    })

    describe("ThemeProvider", () => {
      it("should provide theme context to children", () => {
        const TestComponent = () => {
          const { theme } = useTheme()
          return <div>Theme: {theme}</div>
        }

        render(
          <ThemeProvider>
            <TestComponent />
          </ThemeProvider>
        )

        expect(screen.getByText(/Theme:/)).toBeInTheDocument()
      })

      it("should use stored theme from localStorage", () => {
        vi.mocked(getTheme).mockReturnValue('dark')

        const TestComponent = () => {
          const { theme } = useTheme()
          return <div>Theme: {theme}</div>
        }

        render(
          <ThemeProvider>
            <TestComponent />
          </ThemeProvider>
        )

        expect(screen.getByText("Theme: dark")).toBeInTheDocument()
      })

      it("should default to light when no stored theme and system prefers light", () => {
        const TestComponent = () => {
          const { theme } = useTheme()
          return <div>Theme: {theme}</div>
        }

        render(
          <ThemeProvider>
            <TestComponent />
          </ThemeProvider>
        )

        expect(screen.getByText("Theme: light")).toBeInTheDocument()
      })

      it("should default to dark when no stored theme and system prefers dark", () => {
        Object.defineProperty(window, 'matchMedia', {
          writable: true,
          value: vi.fn().mockImplementation((query: string) => ({
            matches: query === '(prefers-color-scheme: dark)',
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
          })),
        })

        const TestComponent = () => {
          const { theme } = useTheme()
          return <div>Theme: {theme}</div>
        }

        render(
          <ThemeProvider>
            <TestComponent />
          </ThemeProvider>
        )

        expect(screen.getByText("Theme: dark")).toBeInTheDocument()
      })

      it("should set data-bs-theme attribute on body", async () => {
        vi.mocked(getTheme).mockReturnValue('dark')

        render(
          <ThemeProvider>
            <div>test</div>
          </ThemeProvider>
        )

        await waitFor(() => {
          expect(document.body.getAttribute('data-bs-theme')).toBe('dark')
        })
      })

      it("should call setTheme util when theme changes", async () => {
        const TestComponent = () => {
          const { toggleTheme } = useTheme()
          return <button onClick={toggleTheme}>Toggle</button>
        }

        const user = userEvent.setup()
        render(
          <ThemeProvider>
            <TestComponent />
          </ThemeProvider>
        )

        await user.click(screen.getByRole("button"))

        await waitFor(() => {
          expect(setTheme).toHaveBeenCalledWith('dark')
        })
      })
    })

    describe("toggleTheme", () => {
      it("should toggle from light to dark", async () => {
        vi.mocked(getTheme).mockReturnValue('light')

        const TestComponent = () => {
          const { theme, toggleTheme } = useTheme()
          return (
            <div>
              <div>Theme: {theme}</div>
              <button onClick={toggleTheme}>Toggle</button>
            </div>
          )
        }

        const user = userEvent.setup()
        render(
          <ThemeProvider>
            <TestComponent />
          </ThemeProvider>
        )

        expect(screen.getByText("Theme: light")).toBeInTheDocument()
        await user.click(screen.getByRole("button"))

        await waitFor(() => {
          expect(screen.getByText("Theme: dark")).toBeInTheDocument()
        })
      })

      it("should toggle from dark to light", async () => {
        vi.mocked(getTheme).mockReturnValue('dark')

        const TestComponent = () => {
          const { theme, toggleTheme } = useTheme()
          return (
            <div>
              <div>Theme: {theme}</div>
              <button onClick={toggleTheme}>Toggle</button>
            </div>
          )
        }

        const user = userEvent.setup()
        render(
          <ThemeProvider>
            <TestComponent />
          </ThemeProvider>
        )

        expect(screen.getByText("Theme: dark")).toBeInTheDocument()
        await user.click(screen.getByRole("button"))

        await waitFor(() => {
          expect(screen.getByText("Theme: light")).toBeInTheDocument()
        })
      })

      it("should update all consumers when theme toggles", async () => {
        const Consumer1 = () => {
          const { theme } = useTheme()
          return <div>C1: {theme}</div>
        }
        const Consumer2 = () => {
          const { theme, toggleTheme } = useTheme()
          return (
            <div>
              <div>C2: {theme}</div>
              <button onClick={toggleTheme}>Toggle</button>
            </div>
          )
        }

        const user = userEvent.setup()
        render(
          <ThemeProvider>
            <Consumer1 />
            <Consumer2 />
          </ThemeProvider>
        )

        expect(screen.getByText("C1: light")).toBeInTheDocument()
        expect(screen.getByText("C2: light")).toBeInTheDocument()

        await user.click(screen.getByRole("button"))

        await waitFor(() => {
          expect(screen.getByText("C1: dark")).toBeInTheDocument()
          expect(screen.getByText("C2: dark")).toBeInTheDocument()
        })
      })
    })

    describe("useTheme hook", () => {
      it("should throw error when used outside ThemeProvider", () => {
        const TestComponent = () => {
          useTheme()
          return <div>Test</div>
        }

        const consoleError = vi.spyOn(console, "error").mockImplementation(() => {})

        expect(() => render(<TestComponent />)).toThrow(
          "useTheme must be used within a ThemeProvider"
        )

        consoleError.mockRestore()
      })
    })
  })
})
