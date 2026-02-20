import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import useApi from '../hooks/useApi'
import useUser from '../hooks/useUser'

describe("Hooks package", () => {
  describe('useApi Hook', () => {
    beforeEach(() => {
      // Reset any state between tests if needed
    })

    describe('Initial State', () => {
      it('should initialize with default values', () => {
        const { result } = renderHook(() => useApi())

        expect(result.current.data).toBeNull()
        expect(result.current.loading).toBe(false)
        expect(result.current.error).toBeNull()
        expect(typeof result.current.execute).toBe('function')
      })
    })

    describe('Successful API Calls', () => {
      it('should handle successful API call', async () => {
        const { result } = renderHook(() => useApi())
        const mockData = { id: 1, name: 'Test' }
        const mockApiCall = Promise.resolve(mockData)

        let response: any
        await act(async () => {
          response = await result.current.execute(mockApiCall)
        })

        expect(result.current.data).toEqual(mockData)
        expect(result.current.loading).toBe(false)
        expect(result.current.error).toBeNull()
        expect(response).toEqual(mockData)
      })

      it('should set loading to true during API call', async () => {
        const { result } = renderHook(() => useApi())
        let resolveApiCall: (value: any) => void
        const mockApiCall = new Promise((resolve) => {
          resolveApiCall = resolve
        })

        // Start the API call
        let executePromise: Promise<any>
        act(() => {
          executePromise = result.current.execute(mockApiCall)
        })

        // Wait for loading to become true
        await waitFor(() => {
          expect(result.current.loading).toBe(true)
        })

        // Resolve the promise
        await act(async () => {
          resolveApiCall!({ success: true })
          await executePromise
        })

        // Verify loading returns to false
        expect(result.current.loading).toBe(false)
      })

      it('should update data on successful response', async () => {
        const { result } = renderHook(() => useApi<{ message: string }>())
        const mockData = { message: 'Success' }
        const mockApiCall = Promise.resolve(mockData)

        await act(async () => {
          await result.current.execute(mockApiCall)
        })

        expect(result.current.data).toEqual(mockData)
      })

      it('should clear error on successful call after previous error', async () => {
        const { result } = renderHook(() => useApi())
        
        // First call with error
        const errorApiCall = Promise.resolve({
          error: true,
          originalError: { error: 'Previous error' }
        })
        await act(async () => {
          await result.current.execute(errorApiCall)
        })

        expect(result.current.error).toBe('Previous error')

        // Second call successful
        const successApiCall = Promise.resolve({ success: true })
        await act(async () => {
          await result.current.execute(successApiCall)
        })

        expect(result.current.error).toBeNull()
      })
    })

    describe('Failed API Calls', () => {
      it('should handle API call with error response (error field)', async () => {
        const { result } = renderHook(() => useApi())
        const errorMessage = 'Invalid credentials'
        const mockApiCall = Promise.resolve({
          error: true,
          originalError: { error: errorMessage }
        })

        let response: any
        await act(async () => {
          response = await result.current.execute(mockApiCall)
        })

        expect(result.current.error).toBe(errorMessage)
        expect(result.current.loading).toBe(false)
        expect(response).toBeNull()
      })

      it('should handle API call with error response (detail field)', async () => {
        const { result } = renderHook(() => useApi())
        const errorMessage = 'Resource not found'
        const mockApiCall = Promise.resolve({
          error: true,
          originalError: { detail: errorMessage }
        })

        let response: any
        await act(async () => {
          response = await result.current.execute(mockApiCall)
        })

        expect(result.current.error).toBe(errorMessage)
        expect(response).toBeNull()
      })

      it('should handle thrown errors', async () => {
        const { result } = renderHook(() => useApi())
        const errorMessage = 'Network error'
        const mockApiCall = Promise.reject(new Error(errorMessage))

        let response: any
        await act(async () => {
          response = await result.current.execute(mockApiCall)
        })

        expect(result.current.error).toBe(errorMessage)
        expect(result.current.loading).toBe(false)
        expect(response).toBeNull()
      })

      it('should handle errors without message', async () => {
        const { result } = renderHook(() => useApi())
        const mockApiCall = Promise.reject({})

        let response: any
        await act(async () => {
          response = await result.current.execute(mockApiCall)
        })

        expect(result.current.error).toBe('Ocurrió un error inesperado.')
        expect(response).toBeNull()
      })

      it('should set loading to false after error', async () => {
        const { result } = renderHook(() => useApi())
        const mockApiCall = Promise.reject(new Error('Test error'))

        await act(async () => {
          await result.current.execute(mockApiCall)
        })

        expect(result.current.loading).toBe(false)
      })
    })

    describe('Multiple API Calls', () => {
      it('should handle consecutive API calls', async () => {
        const { result } = renderHook(() => useApi<{ value: number }>())

        // First call
        const firstCall = Promise.resolve({ value: 1 })
        await act(async () => {
          await result.current.execute(firstCall)
        })

        expect(result.current.data).toEqual({ value: 1 })

        // Second call
        const secondCall = Promise.resolve({ value: 2 })
        await act(async () => {
          await result.current.execute(secondCall)
        })

        expect(result.current.data).toEqual({ value: 2 })
      })

      it('should reset error on new call', async () => {
        const { result } = renderHook(() => useApi())

        // First call with error
        const errorCall = Promise.reject(new Error('Error'))
        await act(async () => {
          await result.current.execute(errorCall)
        })

        expect(result.current.error).toBe('Error')

        // Second call successful
        const successCall = Promise.resolve({ success: true })
        await act(async () => {
          await result.current.execute(successCall)
        })

        expect(result.current.error).toBeNull()
      })

      it('should handle multiple execute calls independently', async () => {
      const { result } = renderHook(() => useApi())

      const [response1, response2] = await act(async () => {
        const call1 = result.current.execute(Promise.resolve({ id: 1 }))
        const call2 = result.current.execute(Promise.resolve({ id: 2 }))
        return await Promise.all([call1, call2])
      })

      // Due to race conditions, the last one wins
      expect(response1).toBeDefined()
      expect(response2).toBeDefined()
    })
  })

  describe('Type Safety', () => {
      it('should work with typed data', async () => {
        interface User {
          id: number
          name: string
          email: string
        }

        const { result } = renderHook(() => useApi<User>())
        const mockUser: User = {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com'
        }

        await act(async () => {
          await result.current.execute(Promise.resolve(mockUser))
        })

        expect(result.current.data).toEqual(mockUser)
        if (result.current.data) {
          expect(result.current.data.id).toBe(1)
          expect(result.current.data.name).toBe('John Doe')
          expect(result.current.data.email).toBe('john@example.com')
        }
      })

      it('should handle null data correctly', async () => {
        const { result } = renderHook(() => useApi<string | null>())

        expect(result.current.data).toBeNull()

        await act(async () => {
          await result.current.execute(Promise.resolve('test'))
        })

        expect(result.current.data).toBe('test')
      })
    })

    describe('Execute Function Memoization', () => {
      it('should maintain execute function reference', () => {
        const { result, rerender } = renderHook(() => useApi())

        const firstExecute = result.current.execute

        rerender()

        expect(result.current.execute).toBe(firstExecute)
      })
    })

    describe('Edge Cases', () => {
      it('should handle empty response', async () => {
        const { result } = renderHook(() => useApi())
        const mockApiCall = Promise.resolve({})

        let response: any
        await act(async () => {
          response = await result.current.execute(mockApiCall)
        })

        expect(result.current.data).toEqual({})
        expect(response).toEqual({})
      })

      it('should handle null response', async () => {
        const { result } = renderHook(() => useApi())
        const mockApiCall = Promise.resolve(null)

        let response: any
        await act(async () => {
          response = await result.current.execute(mockApiCall)
        })

        expect(result.current.data).toBeNull()
        expect(response).toBeNull()
      })

      it('should handle response with error flag but no originalError', async () => {
        const { result } = renderHook(() => useApi())
        const mockApiCall = Promise.resolve({
          error: true,
          originalError: {}
        })

        let response: any
        await act(async () => {
          response = await result.current.execute(mockApiCall)
        })

        expect(result.current.error).toBeDefined()
        expect(response).toBeNull()
      })

      it('should handle response with both error and detail fields', async () => {
        const { result } = renderHook(() => useApi())
        const mockApiCall = Promise.resolve({
          error: true,
          originalError: {
            error: 'Error message',
            detail: 'Detail message'
          }
        })

        let response: any
        await act(async () => {
          response = await result.current.execute(mockApiCall)
        })

        // Should prioritize 'error' over 'detail'
        expect(result.current.error).toBe('Error message')
        expect(response).toBeNull()
      })
    })
  })

  describe('useUser Hook', () => {
    beforeEach(() => {
      // Clear localStorage before each test
      localStorage.clear()
    })

    describe('Initial State', () => {
      it('should set loading to false and userType to null when no token exists', async () => {
        const { result } = renderHook(() => useUser())

        await waitFor(() => {
          expect(result.current.loading).toBe(false)
          expect(result.current.userType).toBeNull()
        })
      })
    })

    describe('User Type Detection', () => {
      it('should identify employee user type', async () => {
        // Create a mock JWT token for employee
        const mockPayload = {
          user_id: 1,
          username: 'employee',
          is_staff: false,
          is_superuser: false
        }
        const mockToken = createMockToken(mockPayload)
        localStorage.setItem('accessToken', mockToken)

        const { result } = renderHook(() => useUser())

        await waitFor(() => {
          expect(result.current.loading).toBe(false)
          expect(result.current.userType).toBe('employee')
        })
      })

      it('should identify admin user type when is_staff is true', async () => {
        const mockPayload = {
          user_id: 1,
          username: 'admin',
          is_staff: true,
          is_superuser: false
        }
        const mockToken = createMockToken(mockPayload)
        localStorage.setItem('accessToken', mockToken)

        const { result } = renderHook(() => useUser())

        await waitFor(() => {
          expect(result.current.loading).toBe(false)
          expect(result.current.userType).toBe('admin')
        })
      })

      it('should identify rrhh user type when is_superuser is true', async () => {
        const mockPayload = {
          user_id: 1,
          username: 'rrhh',
          is_staff: false,
          is_superuser: true
        }
        const mockToken = createMockToken(mockPayload)
        localStorage.setItem('accessToken', mockToken)

        const { result } = renderHook(() => useUser())

        await waitFor(() => {
          expect(result.current.loading).toBe(false)
          expect(result.current.userType).toBe('rrhh')
        })
      })

      it('should prioritize is_staff over is_superuser', async () => {
        const mockPayload = {
          user_id: 1,
          username: 'admin',
          is_staff: true,
          is_superuser: true
        }
        const mockToken = createMockToken(mockPayload)
        localStorage.setItem('accessToken', mockToken)

        const { result } = renderHook(() => useUser())

        await waitFor(() => {
          expect(result.current.loading).toBe(false)
          expect(result.current.userType).toBe('admin')
        })
      })
    })

    describe('Permission Functions', () => {
      it('employee should have employee access', async () => {
        const mockPayload = {
          user_id: 1,
          username: 'employee',
          is_staff: false,
          is_superuser: false
        }
        const mockToken = createMockToken(mockPayload)
        localStorage.setItem('accessToken', mockToken)

        const { result } = renderHook(() => useUser())

        await waitFor(() => {
          expect(result.current.loading).toBe(false)
        })

        expect(result.current.canAccessEmployee()).toBe(true)
        expect(result.current.canAccessRRHH()).toBe(false)
        expect(result.current.canAccessAdmin()).toBe(false)
      })

      it('rrhh should have rrhh access but not admin', async () => {
        const mockPayload = {
          user_id: 1,
          username: 'rrhh',
          is_staff: false,
          is_superuser: true
        }
        const mockToken = createMockToken(mockPayload)
        localStorage.setItem('accessToken', mockToken)

        const { result } = renderHook(() => useUser())

        await waitFor(() => {
          expect(result.current.loading).toBe(false)
        })

        expect(result.current.canAccessEmployee()).toBe(false)
        expect(result.current.canAccessRRHH()).toBe(true)
        expect(result.current.canAccessAdmin()).toBe(false)
      })

      it('admin should have access to all sections', async () => {
        const mockPayload = {
          user_id: 1,
          username: 'admin',
          is_staff: true,
          is_superuser: false
        }
        const mockToken = createMockToken(mockPayload)
        localStorage.setItem('accessToken', mockToken)

        const { result } = renderHook(() => useUser())

        await waitFor(() => {
          expect(result.current.loading).toBe(false)
        })

        expect(result.current.canAccessEmployee()).toBe(true)
        expect(result.current.canAccessRRHH()).toBe(true)
        expect(result.current.canAccessAdmin()).toBe(true)
      })
    })

    describe('Invalid Token Handling', () => {
      it('should handle invalid token gracefully', async () => {
        localStorage.setItem('accessToken', 'invalid.token.here')

        const { result } = renderHook(() => useUser())

        await waitFor(() => {
          expect(result.current.loading).toBe(false)
          expect(result.current.userType).toBeNull()
        })
      })
    })
  })
})

// Helper function to create mock JWT tokens
function createMockToken(payload: any): string {
  const header = { alg: 'HS256', typ: 'JWT' }
  const encodedHeader = btoa(JSON.stringify(header))
  const encodedPayload = btoa(JSON.stringify(payload))
  const signature = 'mock-signature'
  
  return `${encodedHeader}.${encodedPayload}.${signature}`
}
